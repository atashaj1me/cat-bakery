// red-hot-pan.js — emergency-access toggle + persistent banner.
//
// Mounts a floating 🔥 button in the bottom-right corner of every page that
// imports this module. Clicking the button:
//   - Toggles bakery.redHotPan
//   - Shows a persistent crimson banner at the top of the page while active
//   - Reloads the page so locks update and state-writes start being no-op'd
//
// While Red Hot Pan is on:
//   - Every locked campaign opens normally
//   - Every cheat in the Vault appears as unlocked
//   - Every state-writing method (applyDayResult, awardAchievement,
//     saveCheats, etc.) early-returns without persisting
// Player must toggle Pan off to resume earning progress.

import { State } from "./state.js";

function mount() {
  const isOn = State.isRedHotPan();

  // ---- Persistent banner ----
  if (isOn && !document.getElementById("red-hot-banner")) {
    const banner = document.createElement("div");
    banner.id = "red-hot-banner";
    banner.className = "red-hot-banner";
    banner.innerHTML = `
      <span class="rh-icon">🔥</span>
      <strong>Red Hot Pan — emergency access active.</strong>
      All campaigns, cheats, and locked content are open.
      <em>No progress, no achievements, no cheat-unlocks are saved while this is on.</em>
      <button id="rh-disable" class="rh-disable-btn">Turn off the Pan</button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
    document.getElementById("rh-disable").addEventListener("click", () => {
      State.setRedHotPan(false);
      location.reload();
    });
  }

  // ---- Floating toggle button ----
  if (!document.getElementById("red-hot-toggle")) {
    const btn = document.createElement("button");
    btn.id = "red-hot-toggle";
    btn.className = "red-hot-toggle" + (isOn ? " on" : "");
    btn.title = isOn
      ? "Red Hot Pan is ON. Click to turn off (and re-lock everything you haven't earned)."
      : "Red Hot Pan: emergency access to ALL locked content. No achievements or progress saved while on.";
    btn.innerHTML = `🔥<span class="rh-label">${isOn ? "Pan ON" : "Red Hot Pan"}</span>`;
    btn.addEventListener("click", () => {
      const turning = !isOn;
      const confirmMsg = turning
        ? "Activate Red Hot Pan?\n\n" +
          "• All locked campaigns become playable\n" +
          "• All cheats in the Vault reveal\n" +
          "• Standard glossary fully open\n\n" +
          "While the Pan is on, NOTHING you do saves — no day progress, no " +
          "achievements, no cheat-unlocks. Use it for emergency study only."
        : "Turn off the Red Hot Pan? Locked content will be re-locked.";
      if (confirm(confirmMsg)) {
        State.setRedHotPan(turning);
        location.reload();
      }
    });
    document.body.appendChild(btn);
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}
