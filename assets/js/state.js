// state.js — localStorage-backed progress tracker.

const KEY = "catBakery.v1";

const DEFAULT_STATE = {
  unlocked: { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, mock: false },
  chapterScore: {},      // chapterId -> { sim: 0-100, mcq: pct, best: pct }
  essayBest: {},         // "essay1" | "essay2" -> pct
  mockHistory: [],       // [{ date, mcq, essay, total, durationSec }]
  trapsSeen: [],         // indices into traps.json
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_STATE), ...parsed };
  } catch (_) {
    return structuredClone(DEFAULT_STATE);
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export const State = {
  get: () => read(),

  isUnlocked(id) {
    return !!read().unlocked[id];
  },

  unlock(id) {
    const s = read();
    s.unlocked[id] = true;
    write(s);
  },

  /**
   * Record a chapter completion. Unlocks the next chapter on pass (>= 60%).
   * For chapter 6, unlocks the mock exam.
   */
  recordChapter(chapterId, simPct, mcqPct) {
    const s = read();
    const total = Math.round(0.5 * simPct + 0.5 * mcqPct);
    const prevBest = s.chapterScore[chapterId]?.best ?? 0;
    s.chapterScore[chapterId] = {
      sim: Math.round(simPct),
      mcq: Math.round(mcqPct),
      best: Math.max(prevBest, total),
    };
    if (total >= 60) {
      if (typeof chapterId === "number" && chapterId < 6) {
        s.unlocked[chapterId + 1] = true;
      } else if (chapterId === 6) {
        s.unlocked.mock = true;
      }
    }
    write(s);
    return s.chapterScore[chapterId];
  },

  recordEssay(essayId, pct) {
    const s = read();
    s.essayBest[essayId] = Math.max(s.essayBest[essayId] ?? 0, Math.round(pct));
    write(s);
  },

  recordMock({ mcq, essay, total, durationSec }) {
    const s = read();
    s.mockHistory.unshift({
      date: new Date().toISOString().slice(0, 10),
      mcq, essay, total, durationSec,
    });
    s.mockHistory = s.mockHistory.slice(0, 20);
    write(s);
  },

  markTrap(idx) {
    const s = read();
    if (!s.trapsSeen.includes(idx)) {
      s.trapsSeen.push(idx);
      write(s);
    }
  },

  reset() {
    localStorage.removeItem(KEY);
  },
};

// expose for debugging in console
if (typeof window !== "undefined") window.CatBakeryState = State;
