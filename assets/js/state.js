// state.js — localStorage-backed progress tracker.
//
// Two layers of state in one localStorage key:
//   1) Reference-mode (chapters/MCQs/mock) — original v1 shape.
//   2) Campaign-mode (the Master Baker daily run) — added in v2.

const KEY = "catBakery.v2";
const LEGACY_KEY = "catBakery.v1";

const DEFAULT_BAKERY = {
  cash: 100,
  reputation: 3.0,         // 0..5 stars
  day: 1,                  // 1..10
  daysCompleted: [],       // [day numbers]
  log: [],                 // [{day, title, yourAnswer, correctAnswer, cashDelta, repDelta, summary}]
  achievements: [],        // [achievement ids]
  loansTaken: 0,
  graduated: false,
};

const DEFAULT_STATE = {
  unlocked: { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, mock: false },
  chapterScore: {},
  essayBest: {},
  mockHistory: [],
  trapsSeen: [],
  bakery: structuredClone(DEFAULT_BAKERY),
};

function read() {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) {
      // Migrate v1 → v2 if present.
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const v1 = JSON.parse(legacy);
        const migrated = { ...structuredClone(DEFAULT_STATE), ...v1 };
        migrated.bakery = structuredClone(DEFAULT_BAKERY);
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
      return structuredClone(DEFAULT_STATE);
    }
    const parsed = JSON.parse(raw);
    // Make sure the bakery slice exists for older v2 saves.
    return { ...structuredClone(DEFAULT_STATE), ...parsed,
      bakery: { ...structuredClone(DEFAULT_BAKERY), ...(parsed.bakery || {}) } };
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

  // ----- bakery slice -----
  bakery() { return read().bakery; },

  saveBakery(b) {
    const s = read();
    s.bakery = { ...s.bakery, ...b };
    write(s);
  },

  // Apply a daily outcome to bakery state.
  applyDayResult({ day, title, yourAnswer, correctAnswer, cashDelta, repDelta, summary }) {
    const s = read();
    s.bakery.cash = Math.round((s.bakery.cash + cashDelta) * 100) / 100;
    s.bakery.reputation = Math.max(0, Math.min(5, Math.round((s.bakery.reputation + repDelta) * 10) / 10));
    if (!s.bakery.daysCompleted.includes(day)) s.bakery.daysCompleted.push(day);
    s.bakery.log.unshift({ day, title, yourAnswer, correctAnswer, cashDelta, repDelta, summary, when: new Date().toISOString().slice(0, 16).replace("T", " ") });
    s.bakery.log = s.bakery.log.slice(0, 30);
    if (s.bakery.day < day + 1 && day < 10) s.bakery.day = day + 1;
    if (day === 10) {
      s.bakery.graduated = true;
      s.unlocked.mock = true;   // graduating campaigns unlock the mock exam
    }
    write(s);
    return s.bakery;
  },

  awardAchievement(id) {
    const s = read();
    if (!s.bakery.achievements.includes(id)) {
      s.bakery.achievements.push(id);
      write(s);
      return true;
    }
    return false;
  },

  takeLoan(amount = 50) {
    const s = read();
    s.bakery.cash += amount;
    s.bakery.loansTaken += 1;
    write(s);
  },

  resetBakery() {
    const s = read();
    s.bakery = structuredClone(DEFAULT_BAKERY);
    write(s);
  },

  reset() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
  },
};

// expose for debugging in console
if (typeof window !== "undefined") window.CatBakeryState = State;
