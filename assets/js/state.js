// state.js — localStorage-backed progress tracker.
//
// Three slices share one key:
//   1) Reference-mode (chapters/MCQs/mock) — original v1 shape.
//   2) Vanilla campaign — added in v2 (bakery.*).
//   3) Hell Market campaign — added in v3 (bakery.hell*).

const KEY = "catBakery.v4";
const V3_KEY = "catBakery.v3";
const V2_KEY = "catBakery.v2";
const V1_KEY = "catBakery.v1";

const DEFAULT_BAKERY = {
  // ---- Vanilla ----
  cash: 100,
  reputation: 3.0,
  day: 1,
  daysCompleted: [],
  log: [],
  achievements: [],
  loansTaken: 0,
  graduated: false,
  tech: null,            // technology id from data/technologies.js — null until slot machine roll
  // ---- Mode flag ----
  mode: "vanilla",
  // ---- Hell ----
  hellCash: 200,
  hellReputation: 3.0,
  hellDay: 1,
  hellDaysCompleted: [],
  hellLog: [],
  hellGraduated: false,
  hellInProgress: null,    // {day, phaseIdx, phaseResults: [{score, summary}]}
  hellLoansTaken: 0,
  hellTech: null,          // separate tech roll for Hell campaign
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
      // Cascading migration: v3 → v4 → v2 → v1 fallbacks
      const v3raw = localStorage.getItem(V3_KEY);
      if (v3raw) {
        const v3 = JSON.parse(v3raw);
        const migrated = { ...structuredClone(DEFAULT_STATE), ...v3,
          bakery: { ...structuredClone(DEFAULT_BAKERY), ...(v3.bakery || {}) } };
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
      const v2raw = localStorage.getItem(V2_KEY);
      if (v2raw) {
        const v2 = JSON.parse(v2raw);
        const migrated = { ...structuredClone(DEFAULT_STATE), ...v2,
          bakery: { ...structuredClone(DEFAULT_BAKERY), ...(v2.bakery || {}) } };
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
      const v1raw = localStorage.getItem(V1_KEY);
      if (v1raw) {
        const v1 = JSON.parse(v1raw);
        const migrated = { ...structuredClone(DEFAULT_STATE), ...v1 };
        migrated.bakery = structuredClone(DEFAULT_BAKERY);
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
      return structuredClone(DEFAULT_STATE);
    }
    const parsed = JSON.parse(raw);
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

  isUnlocked(id) { return !!read().unlocked[id]; },

  unlock(id) {
    const s = read();
    s.unlocked[id] = true;
    write(s);
  },

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

  // ----- bakery: shared -----
  bakery() { return read().bakery; },

  saveBakery(b) {
    const s = read();
    s.bakery = { ...s.bakery, ...b };
    write(s);
  },

  setMode(mode) {
    const s = read();
    s.bakery.mode = mode;
    write(s);
  },

  // Persist chosen technology for current mode.
  setTech(mode, techId) {
    const s = read();
    if (mode === "hell") s.bakery.hellTech = techId;
    else s.bakery.tech = techId;
    write(s);
  },

  // ----- bakery: Vanilla -----
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
      s.unlocked.mock = true;
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
    // Reset Vanilla only — keep Hell state and mode flag.
    const base = structuredClone(DEFAULT_BAKERY);
    s.bakery = {
      ...base,
      mode: s.bakery.mode,
      hellCash: s.bakery.hellCash, hellReputation: s.bakery.hellReputation,
      hellDay: s.bakery.hellDay, hellDaysCompleted: s.bakery.hellDaysCompleted,
      hellLog: s.bakery.hellLog, hellGraduated: s.bakery.hellGraduated,
      hellInProgress: s.bakery.hellInProgress, hellLoansTaken: s.bakery.hellLoansTaken,
      hellTech: s.bakery.hellTech,
      achievements: s.bakery.achievements,
    };
    write(s);
  },

  // ----- bakery: Hell Market -----
  saveHellProgress(progress) {
    // progress = { day, phaseIdx, phaseResults }
    const s = read();
    s.bakery.hellInProgress = progress;
    write(s);
  },

  clearHellProgress() {
    const s = read();
    s.bakery.hellInProgress = null;
    write(s);
  },

  applyHellDayResult({ day, title, cashDelta, repDelta, summary, phaseScores }) {
    const s = read();
    s.bakery.hellCash = Math.round((s.bakery.hellCash + cashDelta) * 100) / 100;
    s.bakery.hellReputation = Math.max(0, Math.min(5, Math.round((s.bakery.hellReputation + repDelta) * 10) / 10));
    if (!s.bakery.hellDaysCompleted.includes(day)) s.bakery.hellDaysCompleted.push(day);
    s.bakery.hellLog.unshift({ day, title, cashDelta, repDelta, summary, phaseScores, when: new Date().toISOString().slice(0, 16).replace("T", " ") });
    s.bakery.hellLog = s.bakery.hellLog.slice(0, 30);
    if (s.bakery.hellDay < day + 1 && day < 14) s.bakery.hellDay = day + 1;
    if (day === 14) {
      s.bakery.hellGraduated = true;
    }
    s.bakery.hellInProgress = null;
    write(s);
    return s.bakery;
  },

  takeHellLoan(amount = 100) {
    const s = read();
    s.bakery.hellCash += amount;
    s.bakery.hellLoansTaken += 1;
    write(s);
  },

  resetHell() {
    const s = read();
    const baseHell = structuredClone(DEFAULT_BAKERY);
    s.bakery.hellCash = baseHell.hellCash;
    s.bakery.hellReputation = baseHell.hellReputation;
    s.bakery.hellDay = baseHell.hellDay;
    s.bakery.hellDaysCompleted = [];
    s.bakery.hellLog = [];
    s.bakery.hellGraduated = false;
    s.bakery.hellInProgress = null;
    s.bakery.hellLoansTaken = 0;
    s.bakery.hellTech = null;   // re-roll the slot machine on next entry
    write(s);
  },

  reset() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(V2_KEY);
    localStorage.removeItem(V1_KEY);
  },
};

if (typeof window !== "undefined") window.CatBakeryState = State;
