// days.js — the 10-day Master Baker campaign script.
//
// Letters use LaTeX-style $...$ inline and $$...$$ display math which KaTeX
// renders client-side. The player is NEVER told the formula in plain English
// — only the situation and the variables. They must recognise the structure
// (consumer demand, market clearing, tax incidence, monopoly, Pigouvian …).

import {
  profitOneInput, cobbDouglasDemand, equilibrium, csLinear, psLinear,
  priceCeiling, subsidyToClear, perUnitTax, tariffSurplus,
  externalityDriving, monopolyLinear, monopolyWithTax,
} from "../econ.js";
import { getTech } from "./technologies.js";

// ---- helpers ---------------------------------------------------------------
function scoreNumeric(your, target, tol) {
  if (!isFinite(your)) return 0;
  const diff = Math.abs(your - target);
  if (diff <= tol) return 100;
  if (diff <= tol * 4) return Math.max(40, 100 - Math.round(60 * (diff - tol) / (tol * 3)));
  if (diff <= tol * 8) return Math.max(10, 40 - Math.round(30 * (diff - tol * 4) / (tol * 4)));
  return 0;
}
const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

// Random one-liners cats might mutter in the queue
const FLAVOR_LINES = {
  happy: [
    "Purrfect, just the right price.",
    "Mmm, fresh from the oven.",
    "Worth every coin.",
    "I'll be back tomorrow.",
    "Tell Cat Queen I approve.",
  ],
  sad: [
    "Too dear, I'm leaving.",
    "Outrageous! Day-old, even.",
    "I shall write to the Mayor.",
    "Hmph. Stale and overpriced.",
    "Find me when prices drop.",
  ],
};
function flavorLine(satisfied) {
  const pool = satisfied ? FLAVOR_LINES.happy : FLAVOR_LINES.sad;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---- The 10 days ----------------------------------------------------------
//
// Schema for each day:
//   day, title, chapterRef, weather (emoji + line), letter() → {from, body}
//   fields: [{ id, label, tol, hint? }]
//   grade(letter, answers) → { targets, score, cashDelta, repDelta, summary }

export const DAYS = [
  // ============================================================ DAY 1 (tech-aware)
  {
    day: 1,
    title: "Your father's last letter",
    chapterRef: { id: 0, label: "Ch 0 — Bakery Preparation" },
    weather: { emoji: "🌅", line: "Dawn on opening day. Frost on the croissant trays." },
    letter: (techId = "tomcat") => {
      const tech = getTech(techId);
      const params = { ...tech.defaultParams, w: 2, p: 5 };
      const pretty = Object.entries(tech.defaultParams).map(([k, v]) => `$${k} = ${v}$`).join(", ");
      return {
        from: `${tech.emoji} ${tech.name} — Last Will & Testament`,
        body: `
          <p>My dear cub,</p>
          <p>The bakery is yours. ${tech.fatherStory}</p>
          <p>Each baker contributes according to <strong>your inherited technology</strong>:</p>
          <p style="text-align:center;">$$${tech.formula}$$</p>
          <p>Parameters: ${pretty}, wage $w = ${params.w}$, output price $p = ${params.p}$ (Guild-set, no haggling).</p>
          <p>Choose $L^*$ to maximise $\\pi(L) = p \\cdot y(L) - w \\cdot L$.</p>
        `,
        params, techId,
      };
    },
    fields: [
      { id: "L", label: "Bakers to hire, $L^*$ =", tol: 1.5, hint: "Different inherited tech → different FOC → different optimum." },
    ],
    grade(letter, answers) {
      const tech = getTech(letter.techId);
      const { w, p } = letter.params;
      const techParams = Object.fromEntries(Object.entries(letter.params).filter(([k]) => k !== "w" && k !== "p"));
      const optL = tech.optimumL(techParams, p, w);
      const optProfit = tech.optimumProfit(techParams, p, w);
      const yourL = answers.L;
      const yourProfit = tech.profit(yourL, techParams, p, w);
      const tol = Math.max(1.5, optL * 0.08);
      const score = scoreNumeric(yourL, optL, tol);
      return {
        targets: { L: optL },
        score,
        cashDelta: Math.round(yourProfit),
        repDelta: score >= 90 ? 0.3 : score >= 60 ? 0.1 : -0.1,
        summary: `You hired <strong>${yourL.toFixed(1)}</strong> bakers. Optimum for ${tech.name}'s tech: $L^* = ${optL.toFixed(1)}$ (profit ${optProfit.toFixed(1)} coins). Your profit: <strong>${yourProfit.toFixed(1)}</strong>. The FOC was $${tech.foc}$.`,
      };
    },
  },

  // ============================================================ DAY 2
  {
    day: 2,
    title: "Penny Whiskers wants a quote",
    chapterRef: { id: 0, label: "Ch 0 — Consumer choice" },
    weather: { emoji: "☀️", line: "Penny tail-flicks at the counter, waiting for her quote." },
    letter: () => {
      const alpha = 1, beta = 1, I = 12, px = 2, py = 3;
      return {
        from: "🐱 Penny Whiskers — Saturday Customer",
        body: `
          <p>Dear baker,</p>
          <p>I have $I = ${I}$ coins this week. My taste for loaves $x$ and pastries $y$ is symmetric — I value them equally:</p>
          <p>$$u(x, y) = x^{${alpha}} \\cdot y^{${beta}}$$</p>
          <p>If loaves cost $p_x = ${px}$ coins and pastries cost $p_y = ${py}$ coins, how many of each will I buy from you?</p>
          <p>I plan my pantry — give me exact numbers.</p>
        `,
        params: { alpha, beta, I, px, py },
      };
    },
    fields: [
      { id: "x", label: "Loaves Penny buys, x* =", tol: 0.3, hint: "Cobb-Douglas: constant expenditure shares." },
      { id: "y", label: "Pastries Penny buys, y* =", tol: 0.3 },
    ],
    grade(letter, answers) {
      const { alpha, beta, I, px, py } = letter.params;
      const opt = cobbDouglasDemand({ alpha, beta, I, px, py });
      const sx = scoreNumeric(answers.x, opt.x, 0.3);
      const sy = scoreNumeric(answers.y, opt.y, 0.3);
      const score = (sx + sy) / 2;
      const yourRevenue = score >= 60 ? opt.x * px + opt.y * py : 0;
      return {
        targets: { x: opt.x, y: opt.y },
        score,
        cashDelta: Math.round(yourRevenue),
        repDelta: score >= 90 ? 0.25 : score >= 60 ? 0 : -0.2,
        summary: `Constant expenditure shares: $x^* = \\frac{\\alpha}{\\alpha + \\beta} \\cdot \\frac{I}{p_x} = ${opt.x.toFixed(2)}$ and $y^* = ${opt.y.toFixed(2)}$. ${score >= 60 ? `Penny paid you <strong>${(opt.x * px + opt.y * py).toFixed(2)} coins</strong>.` : "Penny walked out — you didn't know your own customer."}`,
      };
    },
  },

  // ============================================================ DAY 3
  {
    day: 3,
    title: "Market day in Whiskerton Square",
    chapterRef: { id: 1, label: "Ch 1 — Market Day" },
    weather: { emoji: "🏛️", line: "The square fills with bakers, kittens, and the smell of yeast." },
    letter: () => {
      const a = 24, b = 1, c = 0, d = 0.5;
      return {
        from: "🐈‍⬛ Mayor Mittens — Market Day Announcement",
        body: `
          <p>It's market day, dear baker. Whiskerton Square is full.</p>
          <p>The town crier announces today's numbers:</p>
          <p>$$q_d = ${a} - p \\qquad q_s = ${d}\\,p$$</p>
          <p>What is the price at which the market clears? Find $p^*$, and the quantity traded $q^*$.</p>
          <p>Your profit today scales with the surplus you help create.</p>
        `,
        params: { a, b, c, d },
      };
    },
    fields: [
      { id: "p", label: "Clearing price p* =", tol: 0.5 },
      { id: "q", label: "Clearing quantity q* =", tol: 0.5 },
    ],
    grade(letter, answers) {
      const opt = equilibrium(letter.params);
      const sP = scoreNumeric(answers.p, opt.p, 0.5);
      const sQ = scoreNumeric(answers.q, opt.q, 0.5);
      const score = (sP + sQ) / 2;
      const cs = csLinear({ a: letter.params.a, b: letter.params.b, p: opt.p });
      const ps = psLinear({ c: letter.params.c, d: letter.params.d, p: opt.p });
      const yourSurplus = score >= 60 ? cs + ps : 0;
      return {
        targets: { p: opt.p, q: opt.q },
        score,
        cashDelta: Math.round(yourSurplus * 0.3),
        repDelta: score >= 90 ? 0.2 : score >= 60 ? 0.05 : -0.15,
        summary: `Setting $q_d = q_s$: $${letter.params.a} - p = ${letter.params.d}\\,p \\Rightarrow p^* = ${opt.p.toFixed(2)},\\ q^* = ${opt.q.toFixed(2)}$. Total surplus: ${(cs + ps).toFixed(2)}. ${score >= 60 ? "You took your 30% cut." : "You missed the clearing price."}`,
      };
    },
  },

  // ============================================================ DAY 4
  {
    day: 4,
    title: "The mayor's price ceiling",
    chapterRef: { id: 2, label: "Ch 2 — Essay 1 walkthrough" },
    weather: { emoji: "📜", line: "An emergency decree is nailed to your door." },
    letter: () => {
      const a = 26, b = 1, c = 0, d = 0.3, pmax = 10;
      return {
        from: "🏛️ Mayor Mittens — Emergency Bread Decree",
        body: `
          <p>The working cats are angry. By council order, no bakery may charge more than $p_{\\max} = ${pmax}$ cents per loaf.</p>
          <p>Demand $q_d = ${a} - p$. Supply $q_s = ${d}\\,p$.</p>
          <p>Tell me four numbers by sundown:</p>
          <ol>
            <li>The quantity cats <em>want</em> at the ceiling, $q_d(p_{\\max})$.</li>
            <li>The quantity bakers <em>make</em>, $q_s(p_{\\max})$.</li>
            <li>The shortage.</li>
            <li>The deadweight loss — the triangle of lost surplus.</li>
          </ol>
        `,
        params: { a, b, c, d, pmax },
      };
    },
    fields: [
      { id: "qd", label: "q_d at ceiling =", tol: 0.5 },
      { id: "qs", label: "q_s at ceiling =", tol: 0.5 },
      { id: "shortage", label: "Shortage =", tol: 0.5 },
      { id: "dwl", label: "Deadweight loss =", tol: 1, hint: "½ · base · height, where height = D(q_s) − p_max." },
    ],
    grade(letter, answers) {
      const r = priceCeiling(letter.params);
      const scores = [
        scoreNumeric(answers.qd, r.qd, 0.5),
        scoreNumeric(answers.qs, r.qs, 0.5),
        scoreNumeric(answers.shortage, r.shortage, 0.5),
        scoreNumeric(answers.dwl, r.dwl, 1),
      ];
      const score = avg(scores);
      return {
        targets: { qd: r.qd, qs: r.qs, shortage: r.shortage, dwl: r.dwl },
        score,
        cashDelta: Math.round((score - 50) * 0.5),
        repDelta: score >= 80 ? 0.3 : score >= 50 ? 0 : -0.2,
        summary: `$q_d = ${r.qd.toFixed(2)}$, $q_s = ${r.qs.toFixed(2)}$, shortage = $${r.shortage.toFixed(2)}$, DWL = $\\frac{1}{2} \\cdot (${r.eq.q.toFixed(1)} - ${r.qs.toFixed(1)}) \\cdot (${r.pAtQs_d.toFixed(1)} - ${letter.params.pmax}) = ${r.dwl.toFixed(2)}$.`,
      };
    },
  },

  // ============================================================ DAY 5
  {
    day: 5,
    title: "By royal decree — sugar tax",
    chapterRef: { id: 2, label: "Ch 2 — Sugar Tax" },
    weather: { emoji: "👑", line: "A royal courier hands you a wax-sealed scroll." },
    letter: () => {
      const a = 24, b = 1, c = 0, d = 0.4, t = 4;
      return {
        from: "👑 Cat Queen Reginald III",
        body: `
          <p>By my royal hand, I impose a per-bun tax of $t = ${t}$ coins on every sugar bun sold in Whiskerton.</p>
          <p>Demand from my subjects: $q_d = ${a} - p$. Your supply: $q_s = ${d}\\,p$.</p>
          <p>Tell me:</p>
          <ol>
            <li>The new price consumers pay, $p_c$.</li>
            <li>The number of buns sold, $q$.</li>
            <li>The tax revenue I shall collect.</li>
          </ol>
          <p style="margin-top:8px;"><em>Reminder: the equilibrium with a tax solves $a - b\\,p_c = c + d\\,(p_c - t)$.</em></p>
        `,
        params: { a, b, c, d, t },
      };
    },
    fields: [
      { id: "pc", label: "Consumer price p_c =", tol: 0.6 },
      { id: "q",  label: "Quantity sold q =", tol: 0.4 },
      { id: "rev", label: "Tax revenue R =", tol: 1 },
    ],
    grade(letter, answers) {
      const r = perUnitTax(letter.params);
      const sP = scoreNumeric(answers.pc, r.pc, 0.6);
      const sQ = scoreNumeric(answers.q, r.q, 0.4);
      const sR = scoreNumeric(answers.rev, r.revenue, 1);
      const score = (sP + sQ + sR) / 3;
      const cashDelta = score >= 60
        ? Math.round((r.pc - letter.params.t) * r.q)
        : -Math.round(r.dwl);
      return {
        targets: { pc: r.pc, q: r.q, rev: r.revenue },
        score,
        cashDelta,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? 0 : -0.2,
        summary: `$p_c = ${r.pc.toFixed(2)}$, $q = ${r.q.toFixed(2)}$, revenue $= t \\cdot q = ${r.revenue.toFixed(2)}$. Consumer-side burden: ${(r.consumerShare * 100).toFixed(0)}% (less elastic side pays more). DWL = ${r.dwl.toFixed(2)}.`,
      };
    },
  },

  // ============================================================ DAY 6
  {
    day: 6,
    title: "Felinia trade treaty",
    chapterRef: { id: 3, label: "Ch 3 — Tariffs (Essay 2)" },
    weather: { emoji: "🌾", line: "A flour caravan arrives from Felinia, paperwork in tow." },
    letter: () => {
      const A = { a: 20, b: 1, c: 0, d: 0.5 };
      const B = { a: 26, b: 1, c: 0, d: 0.4 };
      const pStar = 16;
      const t = 3;
      return {
        from: "🐅 Trade Minister Tabby",
        body: `
          <p>Felinia (exporter) and Whiskerton (you, importer). Free-trade world price $p^* = ${pStar}$.</p>
          <p>Your home market: $q_d = ${B.a} - p$, $q_s = ${B.d}\\,p$.</p>
          <p>The Queen levies a tariff $t = ${t}$ on every imported sack of flour. Under the tariff, give me:</p>
          <ol>
            <li>Domestic consumer surplus (the area under demand, above $p^* + t$).</li>
            <li>Domestic producer surplus.</li>
            <li>Tariff revenue collected by the Queen, $t \\cdot Q_{\\text{imports}}$.</li>
          </ol>
        `,
        params: { A, B, pStar, t },
      };
    },
    fields: [
      { id: "cs",  label: "CS under tariff =",  tol: 1, hint: "CS = ½ · (p_choke − p) · q_d at p = p* + t." },
      { id: "ps",  label: "PS under tariff =",  tol: 1 },
      { id: "rev", label: "Tariff revenue =",   tol: 1, hint: "Rectangle: t × imports under tariff." },
    ],
    grade(letter, answers) {
      const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
      const sCS = scoreNumeric(answers.cs,  r.B.tariff.CS,  1);
      const sPS = scoreNumeric(answers.ps,  r.B.tariff.PS,  1);
      const sR  = scoreNumeric(answers.rev, r.B.tariff.Rev, 1);
      const score = (sCS + sPS + sR) / 3;
      return {
        targets: { cs: r.B.tariff.CS, ps: r.B.tariff.PS, rev: r.B.tariff.Rev },
        score,
        cashDelta: score >= 60 ? Math.round(score / 5) : -10,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? 0 : -0.15,
        summary: `CS $= ${r.B.tariff.CS.toFixed(2)}$, PS $= ${r.B.tariff.PS.toFixed(2)}$, Rev $= ${r.B.tariff.Rev.toFixed(2)}$. Free trade would yield total ${r.B.freeTrade.Total.toFixed(2)}; tariff yields ${r.B.tariff.Total.toFixed(2)}. The two DWL triangles cost ~${(r.B.freeTrade.Total - r.B.tariff.Total).toFixed(2)}.`,
      };
    },
  },

  // ============================================================ DAY 7
  {
    day: 7,
    title: "Whiskerton Air Board complaint",
    chapterRef: { id: 4, label: "Ch 4 — Externalities" },
    weather: { emoji: "🏭", line: "Smoke from your ovens has drifted across the alley." },
    letter: () => {
      const alpha = 8, gamma = 2;
      return {
        from: "🚒 Whiskerton Air Board",
        body: `
          <p>Citizens are coughing. We have measured the harm.</p>
          <p>Your private utility from baking $d$ batches:</p>
          <p>$$u(d) = ${alpha}\\,d - d^2 - ${gamma}\\,h, \\quad h = d$$</p>
          <p>Privately you ignore the $-\\gamma h$ term and choose $d_{\\text{Nash}}$. The social planner cares about both terms and chooses $d_{\\text{Social}}$.</p>
          <p>Give us the Pigouvian tax $t^*$ that would lead your private FOC to the social optimum.</p>
        `,
        params: { alpha, gamma },
      };
    },
    fields: [
      { id: "dN", label: "Private choice d (Nash) =", tol: 0.3 },
      { id: "dS", label: "Social optimum d =", tol: 0.3 },
      { id: "t",  label: "Pigouvian tax t* =", tol: 0.3 },
    ],
    grade(letter, answers) {
      const r = externalityDriving(letter.params);
      const sN = scoreNumeric(answers.dN, r.nash, 0.3);
      const sS = scoreNumeric(answers.dS, r.social, 0.3);
      const sT = scoreNumeric(answers.t,  r.pigouvianTax, 0.3);
      const score = (sN + sS + sT) / 3;
      return {
        targets: { dN: r.nash, dS: r.social, t: r.pigouvianTax },
        score,
        cashDelta: score >= 80 ? 25 : score >= 50 ? 0 : -30,
        repDelta: score >= 80 ? 0.3 : score >= 50 ? 0 : -0.3,
        summary: `Nash FOC: $\\alpha - 2d = 0 \\Rightarrow d = ${r.nash}$. Social FOC (with $h = d$): $\\alpha - 2d - \\gamma = 0 \\Rightarrow d = ${r.social}$. Pigouvian $t^* = \\gamma = ${r.pigouvianTax}$. ${score < 50 ? "The Air Board fined you 30 coins." : "The Board commends you."}`,
      };
    },
  },

  // ============================================================ DAY 8
  {
    day: 8,
    title: "The stale croissant scandal",
    chapterRef: { id: 5, label: "Ch 5 — Asymmetric Info" },
    weather: { emoji: "🍋", line: "The Whiskerton Tail's morning edition runs your name in bold." },
    letter: () => {
      const vH = 12, vL = 4;
      return {
        from: "📰 The Whiskerton Tail — front page",
        body: `
          <p>Inspector Mittens bought a fresh-priced croissant — but it was a day old.</p>
          <p>You sell from one display: fresh croissants ($v_H = ${vH}$) and stale ones ($v_L = ${vL}$) at the same average price. Let $\\theta$ be the fraction fresh. Cats offer the average value:</p>
          <p>$$p = \\theta \\cdot ${vH} + (1 - \\theta) \\cdot ${vL}$$</p>
          <p>Fresh-loving cats only stay if $p \\geq v_H$.</p>
          <p>What is the threshold $\\theta^*$ above which they stay? And what fraction of value is lost if you sell at $\\theta = 0.5$?</p>
        `,
        params: { vH, vL },
      };
    },
    fields: [
      { id: "theta_star", label: "Threshold θ* =", tol: 0.05, hint: "Solve p ≥ v_H exactly: θ ≥ ?" },
      { id: "loss_at_half", label: "Avg value at θ = 0.5 =", tol: 0.3 },
    ],
    grade(letter, answers) {
      // Solve θ·vH + (1−θ)·vL = vH: only θ = 1 works (pure-lemons). So θ* = 1.
      const tStar = 1;
      const avgAtHalf = 0.5 * letter.params.vH + 0.5 * letter.params.vL;
      const s1 = scoreNumeric(answers.theta_star, tStar, 0.05);
      const s2 = scoreNumeric(answers.loss_at_half, avgAtHalf, 0.3);
      const score = (s1 + s2) / 2;
      return {
        targets: { theta_star: tStar, loss_at_half: avgAtHalf },
        score,
        cashDelta: score >= 80 ? 20 : score >= 50 ? -5 : -25,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? -0.1 : -0.4,
        summary: `Threshold $\\theta^* = 1$ (only a fully-fresh pool keeps fresh-only cats; this is the Akerlof unraveling). Avg value at $\\theta = 0.5$ is $\\frac{${letter.params.vH} + ${letter.params.vL}}{2} = ${avgAtHalf.toFixed(1)}$. ${score >= 80 ? "You signal freshness next time." : "Inspector Mittens spreads the word."}`,
      };
    },
  },

  // ============================================================ DAY 9
  {
    day: 9,
    title: "The rival baker retires",
    chapterRef: { id: 6, label: "Ch 6 — Monopoly" },
    weather: { emoji: "🎩", line: "Baron Whiskerton hangs his apron — you are the only baker left." },
    letter: () => {
      const alpha = 30, beta = 1, mc = 6;
      return {
        from: "🎩 Baron Whiskerton — Retirement Notice",
        body: `
          <p>I retire to the countryside. The town is yours.</p>
          <p>Town demand: $p = ${alpha} - q$. Your marginal cost: $MC = ${mc}$.</p>
          <p>You are no longer a price-taker. Set $q$ and $p$ to maximize profit. Recall:</p>
          <p>$$MR = ${alpha} - 2q, \\qquad MR = MC$$</p>
          <p>What $q$ and $p$ will you set?</p>
        `,
        params: { alpha, beta, mc },
      };
    },
    fields: [
      { id: "q", label: "Monopoly output q =", tol: 0.5 },
      { id: "p", label: "Monopoly price p =",  tol: 0.5 },
    ],
    grade(letter, answers) {
      const opt = monopolyLinear(letter.params);
      const sQ = scoreNumeric(answers.q, opt.q, 0.5);
      const sP = scoreNumeric(answers.p, opt.p, 0.5);
      const score = (sQ + sP) / 2;
      const profit = (answers.p - letter.params.mc) * answers.q;
      return {
        targets: { q: opt.q, p: opt.p },
        score,
        cashDelta: score >= 60 ? Math.round(Math.max(0, profit)) : -10,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? -0.1 : -0.3,
        summary: `$MR = MC \\Rightarrow ${letter.params.alpha} - 2q = ${letter.params.mc} \\Rightarrow q^* = ${opt.q.toFixed(2)}$, $p^* = ${opt.p.toFixed(2)}$, profit = ${opt.profit.toFixed(2)}. The Lerner index $L = \\frac{p - MC}{p} = ${((opt.p - letter.params.mc)/opt.p).toFixed(3)}$.`,
      };
    },
  },

  // ============================================================ DAY 10
  {
    day: 10,
    title: "Monopoly tax — the half pass-through",
    chapterRef: { id: 6, label: "Ch 6 — Monopoly + tax" },
    weather: { emoji: "📜", line: "A second royal scroll. The Queen now taxes you specifically." },
    letter: () => {
      const alpha = 40, beta = 1, mc = 9, t = 8;
      return {
        from: "👑 Cat Queen Reginald III — Per-Unit Tax",
        body: `
          <p>Now that you are the only baker, I impose $t = ${t}$ coins per loaf.</p>
          <p>Demand: $p = ${alpha} - q$. Your effective marginal cost rises from $${mc}$ to $${mc + t}$.</p>
          <p>Common intuition says you'll raise the price by the full $t$. Common intuition is wrong on linear demand.</p>
          <p>Tell me your new price, and the change $\\Delta p$.</p>
        `,
        params: { alpha, beta, mc, t },
      };
    },
    fields: [
      { id: "p_new", label: "New price p =", tol: 0.5 },
      { id: "dp",    label: "Price increase Δp =", tol: 0.5, hint: "Less than t. Half, in fact." },
    ],
    grade(letter, answers) {
      const r = monopolyWithTax(letter.params);
      const sP = scoreNumeric(answers.p_new, r.post.p, 0.5);
      const sD = scoreNumeric(answers.dp,    r.dP,    0.5);
      const score = (sP + sD) / 2;
      return {
        targets: { p_new: r.post.p, dp: r.dP },
        score,
        cashDelta: score >= 80 ? 50 : score >= 50 ? 5 : -20,
        repDelta: score >= 80 ? 0.4 : score >= 50 ? 0 : -0.2,
        summary: `Pre-tax: $q^* = ${r.pre.q.toFixed(2)}$, $p^* = ${r.pre.p.toFixed(2)}$. With tax, effective $MC = ${letter.params.mc + letter.params.t}$, so $q = \\frac{\\alpha - (MC + t)}{2\\beta} = ${r.post.q.toFixed(2)}$, $p = ${r.post.p.toFixed(2)}$. $\\Delta p = t/2 = ${r.dP.toFixed(2)}$ — the half-pass-through rule for linear demand.`,
      };
    },
  },
];

export function getDay(n) { return DAYS.find(d => d.day === n); }
export { flavorLine };
