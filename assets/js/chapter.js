// chapter.js — shared utilities for chapter pages: header, story panel,
// readout row, completion banner.

import { State } from "./state.js";

export function header({ num, title }) {
  const root = document.querySelector("header.topbar");
  if (!root) return;
  root.innerHTML = `
    <div>
      <h1>${title}</h1>
      <div class="crumbs">Chapter ${num} · Cat Society Bakery</div>
    </div>
    <a class="home" href="../index.html">← Map</a>
  `;
}

export function cat({ name, line, emoji = "🐱" }) {
  return `
    <div class="card story">
      <div class="cat-line">
        <span class="emoji">${emoji}</span>
        <div class="speech"><span class="name">${name}:</span> ${line}</div>
      </div>
    </div>
  `;
}

export function readout(items) {
  return `<div class="readout">
    ${items.map(it => `
      <div class="item">
        <span class="label">${it.label}</span>
        <span class="value ${it.cls ?? ""}" id="${it.id}">${it.value ?? "—"}</span>
      </div>
    `).join("")}
  </div>`;
}

export function setReadout(id, value, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  if (cls) {
    el.classList.remove("good", "bad");
    el.classList.add(cls);
  }
}

// Render mastery card with formulas and trap-warnings, then a "back to map" CTA.
export function mastery({ chapterId, simPct, mcqPct, formulas = [], traps = [] }) {
  const result = State.recordChapter(chapterId, simPct, mcqPct);
  const pct = result.best;
  const passed = (0.5 * simPct + 0.5 * mcqPct) >= 60;

  const root = document.getElementById("mastery");
  if (!root) return;
  root.innerHTML = `
    <div class="result-banner ${passed ? "win" : "fail"}">
      ${passed ? "🎉 Chapter complete!" : "Keep practicing — score below 60%."}
      <br><strong>Sim ${Math.round(simPct)}% · MCQs ${Math.round(mcqPct)}% · Best total ${pct}%</strong>
    </div>
    ${formulas.length ? `
      <div class="card">
        <h3>Mastery card — formulas to memorize</h3>
        <ul>${formulas.map(f => `<li>${f}</li>`).join("")}</ul>
      </div>` : ""}
    ${traps.length ? `
      <div class="card">
        <h3>Universal traps for this chapter</h3>
        <ul class="trap-list">${traps.map(t => `<li>${t}</li>`).join("")}</ul>
      </div>` : ""}
    <p style="text-align:center; margin-top:18px;">
      <a class="home" href="../index.html" style="padding:10px 18px;">Back to the Map →</a>
    </p>
  `;
  root.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Score utility: how close is `value` to `target`? Returns 0..100.
export function pctOfOptimum(value, target, tolerance = 0.05) {
  if (!isFinite(target) || target === 0) return value === 0 ? 100 : 0;
  const diff = Math.abs(value - target) / Math.abs(target);
  if (diff <= tolerance) return 100;
  if (diff >= 1) return 0;
  return Math.round((1 - diff) * 100);
}

// Number-tolerant check.
export function near(value, target, tol = 0.5) {
  return Math.abs(value - target) <= tol;
}
