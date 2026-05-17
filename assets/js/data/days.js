// days.js — the 10-day Master Baker campaign script.
//
// Each entry is one playable day. The "letter" tells a business story; the
// "fields" are what the player must compute. Behind the scenes, each problem
// uses formulas already in econ.js — but the player is NEVER shown the formula
// in the letter. The chapterRef link lets them consult the matching reference
// notebook in a new tab if they're stuck.

import {
  profitOneInput, cobbDouglasDemand, equilibrium, csLinear, psLinear,
  priceCeiling, subsidyToClear, perUnitTax, tariffSurplus,
  externalityDriving, monopolyLinear, monopolyWithTax,
} from "../econ.js";

// helpers for grading
function scoreNumeric(your, target, tol) {
  if (!isFinite(your)) return 0;
  const diff = Math.abs(your - target);
  if (diff <= tol) return 100;
  if (diff <= tol * 4) return Math.max(40, 100 - Math.round(60 * (diff - tol) / (tol * 3)));
  if (diff <= tol * 8) return Math.max(10, 40 - Math.round(30 * (diff - tol * 4) / (tol * 4)));
  return 0;
}
function avg(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

export const DAYS = [
  // --- DAY 1 — single-input profit max -----------------------------------
  {
    day: 1,
    title: "Your father's last letter",
    chapterRef: { id: 0, label: "Ch 0 — Bakery Preparation" },
    letter: () => {
      const a = 4, w = 2, p = 5;
      return {
        from: "📜 The will of Old Baker Tomcat",
        emoji: "🐈‍⬛",
        body: `My dear cub,
        <br><br>
        The bakery is yours. Cats love bread; bread loves bakers. Each baker you hire pulls <strong>${a}·√L</strong> loaves out of the oven per day. I pay them <strong>${w}</strong> coins each. The market will pay you <strong>${p}</strong> coins per loaf — no haggling.
        <br><br>
        How many bakers, L, should you hire tomorrow to maximize the bakery's profit?`,
        params: { a, w, p },
      };
    },
    fields: [
      { id: "L", label: "Number of bakers L =", tol: 1 },
    ],
    grade(letter, answers) {
      const { a, w, p } = letter.params;
      const opt = profitOneInput({ a, w, p });
      const yourL = answers.L;
      const yourProfit = p * a * Math.sqrt(Math.max(0, yourL)) - w * yourL;
      const score = scoreNumeric(yourL, opt.L, 1);
      return {
        targets: { L: opt.L },
        score,
        cashDelta: Math.round(yourProfit * 1.0),  // 1:1 conversion
        repDelta: score >= 90 ? 0.3 : score >= 60 ? 0.1 : -0.1,
        summary: `You hired ${yourL.toFixed(0)} bakers. Father's optimum: <strong>${opt.L.toFixed(1)}</strong> (profit ${opt.profit.toFixed(1)} coins). Your profit: ${yourProfit.toFixed(1)} coins.`,
      };
    },
  },

  // --- DAY 2 — Cobb-Douglas consumer demand ------------------------------
  {
    day: 2,
    title: "Penny Whiskers wants a quote",
    chapterRef: { id: 0, label: "Ch 0 — Consumer choice" },
    letter: () => {
      const alpha = 1, beta = 1, I = 12, px = 2, py = 3;
      return {
        from: "🐱 Penny Whiskers",
        emoji: "🐱",
        body: `Dear baker,
        <br><br>
        I have <strong>${I}</strong> coins this week. I want to split my spending evenly between your loaves and your pastries — I value them equally. Tell me, if loaves cost <strong>${px}</strong> coins and pastries cost <strong>${py}</strong> coins, how many of each will I buy?
        <br><br>
        I need the exact numbers — I plan my pantry.
        <br><br>
        — Penny`,
        params: { alpha, beta, I, px, py },
      };
    },
    fields: [
      { id: "x", label: "Loaves she'll buy =", tol: 0.3 },
      { id: "y", label: "Pastries she'll buy =", tol: 0.3 },
    ],
    grade(letter, answers) {
      const { alpha, beta, I, px, py } = letter.params;
      const opt = cobbDouglasDemand({ alpha, beta, I, px, py });
      const sx = scoreNumeric(answers.x, opt.x, 0.3);
      const sy = scoreNumeric(answers.y, opt.y, 0.3);
      const score = (sx + sy) / 2;
      // Penny pays for the bundle she actually predicted — if you guessed wrong, she walks out.
      const yourRevenue = score >= 60 ? opt.x * px + opt.y * py : 0;
      return {
        targets: { x: opt.x, y: opt.y },
        score,
        cashDelta: Math.round(yourRevenue),
        repDelta: score >= 90 ? 0.2 : score >= 60 ? 0 : -0.2,
        summary: `Penny buys exactly <strong>${opt.x.toFixed(2)} loaves</strong> and <strong>${opt.y.toFixed(2)} pastries</strong> (constant expenditure shares: half of 12 coins on each, divided by price). ${score >= 60 ? `She paid you ${(opt.x * px + opt.y * py).toFixed(2)} coins.` : "She walked out; you didn't know your own customer."}`,
      };
    },
  },

  // --- DAY 3 — market equilibrium ----------------------------------------
  {
    day: 3,
    title: "Market day in the square",
    chapterRef: { id: 1, label: "Ch 1 — Market Day" },
    letter: () => {
      const a = 24, b = 1, c = 0, d = 0.5;
      return {
        from: "🏛️ Mayor Mittens",
        emoji: "🐈‍⬛",
        body: `It's market day! Whiskerton Square is full of bakers and cats.
        <br><br>
        The town crier shouts the day's numbers: cats together will buy <strong>${a} − p</strong> loaves at price p. All the bakers together will sell <strong>${d}·p</strong> loaves.
        <br><br>
        What is the price at which the market clears?
        <br><br>
        (You'll get profit proportional to the surplus you generate — guess close and the day's a good one.)`,
        params: { a, b, c, d },
      };
    },
    fields: [
      { id: "p", label: "Clearing price p* =", tol: 0.5 },
    ],
    grade(letter, answers) {
      const { a, b, c, d } = letter.params;
      const opt = equilibrium(letter.params);
      const score = scoreNumeric(answers.p, opt.p, 0.5);
      const cs = csLinear({ a, b, p: opt.p });
      const ps = psLinear({ c, d, p: opt.p });
      const yourSurplus = score >= 60 ? cs + ps : 0;
      return {
        targets: { p: opt.p, q: opt.q },
        score,
        cashDelta: Math.round(yourSurplus * 0.3),
        repDelta: score >= 90 ? 0.2 : score >= 60 ? 0.05 : -0.15,
        summary: `Clearing price: <strong>${opt.p.toFixed(2)}</strong>, quantity ${opt.q.toFixed(2)}. ${score >= 60 ? `Total surplus generated: ${(cs + ps).toFixed(2)} coins — you take a 30% cut.` : "You missed the clearing price; cats and bakers went home."}`,
      };
    },
  },

  // --- DAY 4 — price ceiling (Essay 1 archetype) -------------------------
  {
    day: 4,
    title: "The mayor's price ceiling",
    chapterRef: { id: 2, label: "Ch 2 — Sugar Tax (Essay 1)" },
    letter: () => {
      const a = 26, b = 1, c = 0, d = 0.3, pmax = 10;
      return {
        from: "🏛️ Mayor Mittens — Emergency Decree",
        emoji: "📜",
        body: `Bread prices have angered the working cats. By order of the council, no bakery may charge above <strong>${pmax} cents/loaf</strong>.
        <br><br>
        I need three numbers from you by sundown:
        <ol>
          <li>How many loaves cats will <em>want</em> at this price (q_d), and how many loaves bakers will <em>make</em> (q_s)?</li>
          <li>The size of the resulting shortage.</li>
          <li>The deadweight loss this control creates (the lost surplus from un-baked loaves).</li>
        </ol>
        (Demand: <strong>q = ${a} − p</strong>. Supply: <strong>q = ${d}·p</strong>.)`,
        params: { a, b, c, d, pmax },
      };
    },
    fields: [
      { id: "qd", label: "Loaves wanted q_d =", tol: 0.5 },
      { id: "qs", label: "Loaves made q_s =", tol: 0.5 },
      { id: "shortage", label: "Shortage =", tol: 0.5 },
      { id: "dwl", label: "Deadweight loss =", tol: 1 },
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
      // Pay = bakery survives the day if it served loyal cats well.
      return {
        targets: { qd: r.qd, qs: r.qs, shortage: r.shortage, dwl: r.dwl },
        score,
        cashDelta: Math.round((score - 50) * 0.5),   // -25..+25
        repDelta: score >= 80 ? 0.3 : score >= 50 ? 0 : -0.2,
        summary: `q_d = ${r.qd.toFixed(2)}, q_s = ${r.qs.toFixed(2)}, shortage = <strong>${r.shortage.toFixed(2)}</strong>, DWL = <strong>${r.dwl.toFixed(2)}</strong>. The cats who queued and didn't get bread will remember this — set up a freshness reputation tomorrow.`,
      };
    },
  },

  // --- DAY 5 — per-unit tax ----------------------------------------------
  {
    day: 5,
    title: "By royal decree: sugar tax",
    chapterRef: { id: 2, label: "Ch 2 — Sugar Tax" },
    letter: () => {
      const a = 24, b = 1, c = 0, d = 0.4, t = 4;
      return {
        from: "👑 Cat Queen Reginald III",
        emoji: "📜",
        body: `By royal decree, I impose a <strong>${t}-coin tax</strong> on every sugar bun sold within Whiskerton.
        <br><br>
        My census shows my subjects will buy <strong>${a} − p</strong> sugar buns at any price p. Your kitchen produces <strong>${d}·p</strong> buns when sold at price p.
        <br><br>
        Tell me the price you will charge tomorrow (consumers pay you <em>this</em> price), and how many buns you will sell. My revenue collectors need the numbers.`,
        params: { a, b, c, d, t },
      };
    },
    fields: [
      { id: "pc", label: "Price you charge p_c =", tol: 0.6 },
      { id: "q", label: "Buns sold q =", tol: 0.4 },
    ],
    grade(letter, answers) {
      const r = perUnitTax(letter.params);
      const sP = scoreNumeric(answers.pc, r.pc, 0.6);
      const sQ = scoreNumeric(answers.q, r.q, 0.4);
      const score = (sP + sQ) / 2;
      // Net profit = (pc - mc)·q - tax already netted; here we use revenue net of producer-side burden.
      const cashDelta = score >= 60
        ? Math.round((r.pc - letter.params.t) * r.q)   // your net per bun × buns sold
        : -Math.round(r.dwl);                          // mis-priced → eat the DWL
      return {
        targets: { pc: r.pc, q: r.q },
        score,
        cashDelta,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? 0 : -0.2,
        summary: `Correct price p_c = <strong>${r.pc.toFixed(2)}</strong>, q = <strong>${r.q.toFixed(2)}</strong>. Tax revenue to the Queen: ${r.revenue.toFixed(2)}. DWL: ${r.dwl.toFixed(2)}. Consumer-side burden: ${(r.consumerShare * 100).toFixed(0)}%; producer-side: ${(r.producerShare * 100).toFixed(0)}%.`,
      };
    },
  },

  // --- DAY 6 — tariff decision -------------------------------------------
  {
    day: 6,
    title: "Felinia trade treaty",
    chapterRef: { id: 3, label: "Ch 3 — Tariffs (Essay 2)" },
    letter: () => {
      const A = { a: 20, b: 1, c: 0, d: 0.5 };
      const B = { a: 26, b: 1, c: 0, d: 0.4 };
      const pStar = 16;
      const t = 3;
      return {
        from: "🤝 Trade Minister Tabby",
        emoji: "🌾",
        body: `Felinia (the exporter) wants to sell flour to Whiskerton (you). The world price would be <strong>p* = ${pStar}</strong>.
        <br><br>
        Your domestic flour market: q_d = <strong>${B.a} − p</strong>, q_s = <strong>${B.d}·p</strong>. The Queen is considering a <strong>${t}-coin tariff</strong> on imports.
        <br><br>
        Compute, under the tariff regime in your own market (B):
        <ol>
          <li>Domestic consumer surplus (CS)</li>
          <li>Domestic producer surplus (PS)</li>
          <li>Tariff revenue collected</li>
        </ol>`,
        params: { A, B, pStar, t },
      };
    },
    fields: [
      { id: "cs", label: "CS under tariff =", tol: 1 },
      { id: "ps", label: "PS under tariff =", tol: 1 },
      { id: "rev", label: "Tariff revenue =", tol: 1 },
    ],
    grade(letter, answers) {
      const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
      const ssCS = scoreNumeric(answers.cs, r.B.tariff.CS, 1);
      const ssPS = scoreNumeric(answers.ps, r.B.tariff.PS, 1);
      const ssR = scoreNumeric(answers.rev, r.B.tariff.Rev, 1);
      const score = (ssCS + ssPS + ssR) / 3;
      const cashDelta = score >= 60 ? Math.round((ssCS + ssPS + ssR) / 3 / 5) : -10;
      return {
        targets: { cs: r.B.tariff.CS, ps: r.B.tariff.PS, rev: r.B.tariff.Rev },
        score,
        cashDelta,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? 0 : -0.15,
        summary: `Under the tariff: CS = <strong>${r.B.tariff.CS.toFixed(2)}</strong>, PS = <strong>${r.B.tariff.PS.toFixed(2)}</strong>, Rev = <strong>${r.B.tariff.Rev.toFixed(2)}</strong>. Free trade would yield total surplus ${r.B.freeTrade.Total.toFixed(2)} (vs tariff ${r.B.tariff.Total.toFixed(2)}). Two DWL triangles cost ~${(r.B.freeTrade.Total - r.B.tariff.Total).toFixed(2)}.`,
      };
    },
  },

  // --- DAY 7 — Pigouvian tax ---------------------------------------------
  {
    day: 7,
    title: "Whiskerton Air Board complaint",
    chapterRef: { id: 4, label: "Ch 4 — Externalities" },
    letter: () => {
      const alpha = 8, gamma = 2;
      return {
        from: "🚒 Whiskerton Air Board",
        emoji: "🏭",
        body: `Citizens are coughing. Our measurements:
        <br><br>
        Your private utility from baking d batches is <strong>${alpha}·d − d²</strong>. The smoke causes <strong>${gamma}·d</strong> of harm to neighbours (you ignore this in your private decision).
        <br><br>
        We're asking you to set a voluntary per-batch tax that internalises the harm. What rate t?`,
        params: { alpha, gamma },
      };
    },
    fields: [
      { id: "t", label: "Pigouvian tax t =", tol: 0.3 },
      { id: "dN", label: "Your private choice d (Nash) =", tol: 0.3 },
      { id: "dS", label: "Socially optimal d =", tol: 0.3 },
    ],
    grade(letter, answers) {
      const r = externalityDriving(letter.params);
      const sT = scoreNumeric(answers.t, r.pigouvianTax, 0.3);
      const sN = scoreNumeric(answers.dN, r.nash, 0.3);
      const sS = scoreNumeric(answers.dS, r.social, 0.3);
      const score = (sT + sN + sS) / 3;
      return {
        targets: { t: r.pigouvianTax, dN: r.nash, dS: r.social },
        score,
        cashDelta: score >= 80 ? 15 : score >= 50 ? 0 : -25,   // court fine if you fail
        repDelta: score >= 80 ? 0.3 : score >= 50 ? 0 : -0.3,
        summary: `Pigouvian tax should be γ = <strong>${r.pigouvianTax}</strong>. Nash d = ${r.nash}; social d = ${r.social}. ${score < 50 ? "The Health Authority sent inspectors — fined." : "Air Board calls you a responsible operator."}`,
      };
    },
  },

  // --- DAY 8 — adverse selection / freshness ------------------------------
  {
    day: 8,
    title: "Stale croissant scandal",
    chapterRef: { id: 5, label: "Ch 5 — Asymmetric Info" },
    letter: () => {
      const fresh_v = 12;        // fresh croissant reservation price
      const stale_v = 4;         // stale ones still edible
      const markup = 1.0;        // buyer's offer = average value
      // 60% of inventory is fresh
      return {
        from: "📰 The Whiskerton Tail",
        emoji: "📰",
        body: `Scandal: Inspector Mittens bought a "fresh" croissant that was a day old. You sell both fresh (<strong>${fresh_v}</strong>-coin reservation) and stale (<strong>${stale_v}</strong>-coin reservation) at the same average price.
        <br><br>
        If <strong>θ</strong> is the fraction of fresh stock in your basket, buyers offer the average value: <strong>θ·${fresh_v} + (1−θ)·${stale_v}</strong> coins.
        <br><br>
        Question: at what <strong>minimum θ</strong> will fresh-loving cats stay (i.e. the offer ≥ their reservation <strong>${fresh_v}</strong>)?
        <br><br>
        And what happens at θ below that?`,
        params: { fresh_v, stale_v, markup },
      };
    },
    fields: [
      { id: "theta_star", label: "Threshold θ* =", tol: 0.05 },
    ],
    grade(letter, answers) {
      // Solve: θ·12 + (1−θ)·4 ≥ 12 → 8θ + 4 ≥ 12 → θ ≥ 1. With markup=1 this is θ=1 — a fully fresh pool. (Pure lemons argument.)
      const target = (letter.params.fresh_v - letter.params.stale_v) > 0
        ? (letter.params.fresh_v - letter.params.stale_v * letter.params.markup) / ((letter.params.fresh_v - letter.params.stale_v) * letter.params.markup)
        : 1;
      const tStar = Math.min(1, Math.max(0, target));
      const score = scoreNumeric(answers.theta_star, tStar, 0.05);
      return {
        targets: { theta_star: tStar },
        score,
        cashDelta: score >= 80 ? 20 : score >= 50 ? 0 : -20,
        repDelta: score >= 80 ? 0.2 : score >= 50 ? -0.05 : -0.3,
        summary: `Threshold θ* = <strong>${tStar.toFixed(2)}</strong>. Below this, fresh-only cats exit, the pool gets staler, you must drop the price, and even more fresh-buyers exit. That's the unraveling.`,
      };
    },
  },

  // --- DAY 9 — monopoly ---------------------------------------------------
  {
    day: 9,
    title: "The rival has retired",
    chapterRef: { id: 6, label: "Ch 6 — Monopoly" },
    letter: () => {
      const alpha = 30, beta = 1, mc = 6;
      return {
        from: "🎩 Baron Whiskerton",
        emoji: "🎩",
        body: `I am retiring to the countryside. The bakery trade is yours — alone. You are now the only baker in Whiskerton.
        <br><br>
        The town's demand for loaves: <strong>p = ${alpha} − q</strong>. Your marginal cost: <strong>${mc}</strong> coins per loaf.
        <br><br>
        Decide your daily output q and price p. Do not behave like a price-taker — you set the price now.`,
        params: { alpha, beta, mc },
      };
    },
    fields: [
      { id: "q", label: "Output q =", tol: 0.5 },
      { id: "p", label: "Price p =", tol: 0.5 },
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
        summary: `Monopoly q = <strong>${opt.q.toFixed(2)}</strong>, p = <strong>${opt.p.toFixed(2)}</strong>, profit = ${opt.profit.toFixed(2)}. Set MR = MC: ${letter.params.alpha} − 2q = ${letter.params.mc}.`,
      };
    },
  },

  // --- DAY 10 — monopoly + per-unit tax ---------------------------------
  {
    day: 10,
    title: "Royal sugar-bun tax — monopoly edition",
    chapterRef: { id: 6, label: "Ch 6 — Monopoly + tax" },
    letter: () => {
      const alpha = 40, beta = 1, mc = 9, t = 8;
      return {
        from: "👑 Cat Queen Reginald III",
        emoji: "📜",
        body: `Now that you are the only baker, I tax you specifically: <strong>${t} coins per loaf</strong>.
        <br><br>
        Your demand: <strong>p = ${alpha} − q</strong>. Your MC was <strong>${mc}</strong>. What price will you charge after the tax?
        <br><br>
        Be careful — your instinct will be to pass the whole tax to customers. With linear demand, that is wrong.`,
        params: { alpha, beta, mc, t },
      };
    },
    fields: [
      { id: "p_new", label: "New price p =", tol: 0.5 },
      { id: "dp", label: "Price increase Δp =", tol: 0.5 },
    ],
    grade(letter, answers) {
      const r = monopolyWithTax(letter.params);
      const sP = scoreNumeric(answers.p_new, r.post.p, 0.5);
      const sD = scoreNumeric(answers.dp, r.dP, 0.5);
      const score = (sP + sD) / 2;
      return {
        targets: { p_new: r.post.p, dp: r.dP },
        score,
        cashDelta: score >= 80 ? 40 : score >= 50 ? 0 : -20,
        repDelta: score >= 80 ? 0.3 : score >= 50 ? 0 : -0.2,
        summary: `Pre-tax: q = ${r.pre.q.toFixed(2)}, p = ${r.pre.p.toFixed(2)}. Post-tax: q = ${r.post.q.toFixed(2)}, p = <strong>${r.post.p.toFixed(2)}</strong>. Pass-through = Δp = <strong>${r.dP.toFixed(2)}</strong> = t/2. Linear demand splits tax half-and-half — this is the half-pass-through rule.`,
      };
    },
  },
];

export function getDay(n) { return DAYS.find(d => d.day === n); }
