// chapter.js — shared utilities for chapter pages: header, story panel,
// readout row, completion banner.

import { State } from "./state.js";

/**
 * Typeset KaTeX math anywhere in the document or in a target element.
 * Safe to call before KaTeX has loaded (no-op) or multiple times.
 * Uses $...$ for inline math and $$...$$ for display.
 */
export function typesetMath(target = document.body) {
  if (typeof window === "undefined" || !window.renderMathInElement) return;
  try {
    window.renderMathInElement(target, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
      errorColor: "#e08c6e",
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    });
  } catch (e) {
    console.warn("KaTeX render error:", e);
  }
}

// Schedule a typeset pass when KaTeX finishes loading.
if (typeof window !== "undefined") {
  const waitForKatex = () => {
    if (window.renderMathInElement) typesetMath();
    else setTimeout(waitForKatex, 100);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForKatex);
  } else {
    waitForKatex();
  }
}

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
  typesetMath(root);
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

/**
 * Render the chapter's pedagogical extras (recipe, pitfalls, worked examples)
 * into a host element. Each section is rendered as collapsible <details>.
 */
export async function renderNotebookExtras(hostId, chapterId) {
  const host = document.getElementById(hostId);
  if (!host) return;
  let extras;
  try {
    const mod = await import("./data/notebook-extras.js");
    extras = mod.NOTEBOOK_EXTRAS[chapterId];
  } catch (_) { return; }
  if (!extras) return;

  let html = "";
  if (extras.recipe) {
    html += `
      <details class="extra-section recipe" open>
        <summary><span class="extra-icon">📋</span> ${extras.recipe.title}</summary>
        <ol class="recipe-steps">
          ${extras.recipe.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
        ${extras.recipe.note ? `<p class="recipe-note">💡 ${extras.recipe.note}</p>` : ""}
      </details>
    `;
  }
  if (extras.pitfalls?.length) {
    html += `
      <details class="extra-section pitfalls">
        <summary><span class="extra-icon">⚠️</span> Common pitfalls (${extras.pitfalls.length})</summary>
        <div class="pitfall-list">
          ${extras.pitfalls.map(p => `
            <div class="pitfall">
              <div class="pitfall-headline">⚠️ ${p.headline}</div>
              <div class="pitfall-body">${p.body}</div>
            </div>
          `).join("")}
        </div>
      </details>
    `;
  }
  if (extras.workedExamples?.length) {
    html += `
      <details class="extra-section worked">
        <summary><span class="extra-icon">📖</span> Worked examples (${extras.workedExamples.length})</summary>
        ${extras.workedExamples.map(w => `
          <div class="worked-example">
            <h4>${w.title}</h4>
            <p class="worked-prompt"><strong>Q.</strong> ${w.prompt}</p>
            <div class="worked-solution"><strong>Solution:</strong> ${w.solution}</div>
          </div>
        `).join("")}
      </details>
    `;
  }
  host.innerHTML = html;
  typesetMath(host);
}
