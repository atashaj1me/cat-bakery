// cheats.js — discovery engine for the cheatsheet vault.
//
// Anyone can emit an event via tryUnlockCheats(ctx). The engine walks the
// CHEATS registry, evaluates each cheat's `unlock(ctx)` predicate, and unlocks
// any cheat whose predicate returns true (and that isn't already unlocked).
//
// For "needs N triggers" cheats, we increment a per-cheat counter in
// State.bakery.cheatProgress and only unlock when it reaches `needs`.
//
// Newly unlocked cheats trigger a toast notification via window.cheatsToast
// (set up by daily.html / chapter pages on init).

import { State } from "./state.js";
import { CHEATS, CHEAT_BY_ID } from "./data/cheatsheets.js";

/** Emit an event and unlock any matching cheats. */
export function tryUnlockCheats(ctx) {
  if (!ctx) return [];
  const s = State.get();
  const unlocked = new Set(s.bakery.cheatsheets || []);
  const progress = { ...(s.bakery.cheatProgress || {}) };
  const newlyUnlocked = [];

  for (const cheat of CHEATS) {
    if (unlocked.has(cheat.id)) continue;
    let predicateTrue = false;
    try {
      predicateTrue = !!cheat.unlock(ctx);
    } catch (_) {
      predicateTrue = false;
    }
    if (!predicateTrue) continue;

    const needs = cheat.needs ?? 1;
    progress[cheat.id] = (progress[cheat.id] || 0) + 1;
    if (progress[cheat.id] >= needs) {
      unlocked.add(cheat.id);
      newlyUnlocked.push(cheat);
    }
  }

  if (newlyUnlocked.length || Object.keys(progress).length !== Object.keys(s.bakery.cheatProgress || {}).length) {
    State.saveCheats({ unlocked: [...unlocked], progress });
  }

  // Surface a toast for each new discovery
  if (typeof window !== "undefined" && window.cheatsToast) {
    newlyUnlocked.forEach(c => window.cheatsToast(c));
  }

  return newlyUnlocked;
}

/** Read helpers. */
export function getUnlockedCheats() {
  const ids = State.get().bakery.cheatsheets || [];
  return ids.map(id => CHEAT_BY_ID[id]).filter(Boolean);
}

export function isCheatUnlocked(id) {
  return (State.get().bakery.cheatsheets || []).includes(id);
}

export function getCheatProgress(id) {
  return (State.get().bakery.cheatProgress || {})[id] || 0;
}

export function totalCheats() { return CHEATS.length; }

export function unlockedCount() {
  return (State.get().bakery.cheatsheets || []).length;
}

if (typeof window !== "undefined") {
  window.Cheats = { tryUnlockCheats, getUnlockedCheats, isCheatUnlocked, unlockedCount, totalCheats };
}
