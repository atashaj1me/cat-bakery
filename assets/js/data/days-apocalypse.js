// days-apocalypse.js — Beyond Hell: Apocalypse, the 16-day complete-exam-guide campaign.
//
// Tighter tolerances than Hell: full credit only within ±tol/3.
// Each phase has an optional timeSec budget for the soft countdown.
// arcScroll: true on Day 1, 5, 9, 13 → daily.html renders the arc opener.

import {
  equilibrium, csLinear, psLinear,
  priceCeiling, subsidyToClear, waitingHours,
  perUnitTax, tariffSurplus,
  externalityDriving, monopolyLinear, monopolyWithTax,
  lernerPrice, thirdDegreePD,
  cobbDouglasDemand,
  ceMonopoly,
} from "../econ.js";
import {
  cournotDuopoly, stackelbergLeader, laffer, externalityMonopolyTax,
} from "../econ-hell.js";
import {
  intertemporalBudget, presentValue,
  slutskyDecompose, twoMarketEq,
  samuelsonCondition, lindahlShares,
  coaseBargain, retaliatingTariff,
  separatingMenu, returnsToScale, cobbCostMin,
} from "../econ-apocalypse.js";

// ---- scoring (STRICTEST tier) ---------------------------------------------
function score(your, target, tol) {
  if (!isFinite(your)) return 0;
  const d = Math.abs(your - target);
  if (d <= tol / 3) return 100;
  if (d <= tol / 2) return 80;
  if (d <= tol)     return 50;
  if (d <= tol * 2) return 20;
  return 0;
}
const avg = a => a.reduce((s, x) => s + x, 0) / a.length;

// Multiple-choice strategy phases use strict equality
function scoreChoice(your, target) { return your === target ? 100 : 0; }

export const APOCALYPSE_DAYS = [
  // ============================================ DAY 1 — Three customers
  {
    day: 1, arcScroll: true,
    title: "Three customers, three tastes",
    chapterRef: { id: 0, label: "Ch 4–5 — utility classes" },
    weather: { emoji: "🌅", line: "Three cats wait in the queue. Each thinks differently." },
    letter: () => ({
      from: "👩‍🍳 Apprentice Biscuit",
      body: `<p>Three regulars arrive on opening day. Compute exactly what each will buy at your prices $p_x = 2$ (loaves), $p_y = 3$ (pastries).</p>`,
      params: {
        penny: { alpha: 1, beta: 1, I: 12, px: 2, py: 3 }, // Cobb-Douglas
        pawley: { a: 6, reservation: 18, focus: "y", px: 2, py: 3 }, // quasilinear over y (pastry)
        engineer: { calPerX: 4, calPerY: 5, budget: 8, px: 2, py: 3 }, // perfect substitutes
      },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Penny (Cobb-Douglas)", timeSec: 90,
        fields: [
          { id: "px", label: "Penny's $x^*$ (loaves) =", tol: 0.2 },
          { id: "py", label: "Penny's $y^*$ (pastries) =", tol: 0.2 },
        ],
        grade(letter, a) {
          const opt = cobbDouglasDemand(letter.params.penny);
          return { targets: { px: opt.x, py: opt.y },
            scoreEach: (ans) => avg([score(ans.px, opt.x, 0.2), score(ans.py, opt.y, 0.2)]),
            summary: `Cobb-Douglas: $x^* = \\frac{\\alpha}{\\alpha+\\beta} \\cdot \\frac{I}{p_x} = ${opt.x.toFixed(2)}$, $y^* = ${opt.y.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Sir Pawley (quasilinear over pastry)", timeSec: 90,
        fields: [
          { id: "qy", label: "Pawley's pastry $y^*$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          // u = v(y) + x, v(y) = a·√y. FOC: v'(y) = p_y ⇒ a/(2√y) = p_y ⇒ y* = (a/(2p_y))²
          const { a: A, py } = letter.params.pawley;
          const opt = Math.pow(A / (2 * py), 2);
          return { targets: { qy: opt },
            scoreEach: (ans) => score(ans.qy, opt, 0.3),
            summary: `Quasilinear: $v'(y) = p_y \\Rightarrow y^* = (a/2p_y)^2 = ${opt.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Mittens the Engineer (perfect subs)", timeSec: 60,
        fields: [
          { id: "buys", label: "Item Mittens picks (type 1 for loaves, 2 for pastries):", tol: 0.5 },
          { id: "qty", label: "Quantity bought:", tol: 0.3 },
        ],
        grade(letter, a) {
          const { calPerX, calPerY, budget, px, py } = letter.params.engineer;
          const ratioX = calPerX / px;  // calories per coin on loaves
          const ratioY = calPerY / py;  // calories per coin on pastries
          const buys = ratioX >= ratioY ? 1 : 2;
          const qty = budget / (buys === 1 ? px : py);
          return { targets: { buys, qty },
            scoreEach: (ans) => avg([score(ans.buys, buys, 0.5), score(ans.qty, qty, 0.3)]),
            summary: `Mittens picks whichever has higher cal-per-coin: loaves ${ratioX.toFixed(2)} vs pastries ${ratioY.toFixed(2)}. ⇒ buys ${buys === 1 ? "loaves" : "pastries"}, qty $= ${qty.toFixed(2)}$.` };
        },
      },
      {
        key: "iv", title: "Phase iv — Identify the utility class", timeSec: 60,
        type: "choice",
        fields: [
          { id: "pick", label: "Which utility class would yield CORNER solutions when one good's cal/coin dominates?",
            options: [
              "Cobb-Douglas $u = x^{\\alpha} y^{\\beta}$",
              "Quasilinear $u = v(x) + y$",
              "Perfect substitutes $u = ax + by$",
              "Perfect complements $u = \\min(ax, by)$",
            ], correct: 2 },
        ],
        grade(letter, a) {
          return { targets: { pick: 2 },
            scoreEach: (ans) => scoreChoice(ans.pick, 2),
            summary: `Perfect substitutes give bang-bang corner solutions: spend ALL budget on the highest cal-per-coin item. Cobb-Douglas always interior; quasilinear has zero income effect on $x$; perfect complements lock to a ray.` };
        },
      },
    ],
  },

  // ============================================ DAY 2 — Slutsky's revenge
  {
    day: 2,
    title: "Slutsky's revenge",
    chapterRef: { id: 0, label: "Ch 7 — Slutsky decomposition" },
    weather: { emoji: "📉", line: "Loaf price doubles overnight. Decompose Penny's response." },
    letter: () => ({
      from: "🐱 Penny Whiskers",
      body: `
        <p>Loaf prices just doubled — from $p_x^0 = 1$ to $p_x^1 = 2$. My income is still $I = 12$, pastry price $p_y = 1$. I have $u(x, y) = x \\cdot y$.</p>
        <p>Decompose my response: how much of the drop in loaves is the SUBSTITUTION effect and how much is the INCOME effect?</p>
      `,
      params: { alpha: 1, beta: 1, I: 12, px0: 1, px1: 2, py: 1 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Marshallian demands at both prices", timeSec: 90,
        fields: [
          { id: "x0", label: "Penny's $x_0$ at $p_x = 1$ =", tol: 0.2 },
          { id: "x1", label: "Penny's $x_1$ at $p_x = 2$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = slutskyDecompose(letter.params);
          return { targets: { x0: r.x0, x1: r.x1 },
            scoreEach: (ans) => avg([score(ans.x0, r.x0, 0.2), score(ans.x1, r.x1, 0.2)]),
            summary: `$x_0 = ${r.x0.toFixed(2)}$, $x_1 = ${r.x1.toFixed(2)}$. Cobb-Douglas: $x^* = (\\alpha/(\\alpha+\\beta)) \\cdot I/p_x$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Hicksian demand at the new price", timeSec: 90,
        fields: [
          { id: "h", label: "Hicksian $h_x$ at $p_x = 2$, $u = u_0$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = slutskyDecompose(letter.params);
          return { targets: { h: r.hicks1 },
            scoreEach: (ans) => score(ans.h, r.hicks1, 0.2),
            summary: `Hicksian at new price holds utility constant at $u_0$. For Cobb-Douglas: $h_x = u_0^{1/(\\alpha+\\beta)} \\cdot (\\alpha p_y / \\beta p_x)^{\\beta/(\\alpha+\\beta)} = ${r.hicks1.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — SE and IE", timeSec: 90,
        fields: [
          { id: "SE", label: "Substitution effect (signed) =", tol: 0.3 },
          { id: "IE", label: "Income effect (signed) =", tol: 0.3 },
        ],
        grade(letter, a) {
          const r = slutskyDecompose(letter.params);
          return { targets: { SE: r.SE, IE: r.IE },
            scoreEach: (ans) => avg([score(ans.SE, r.SE, 0.3), score(ans.IE, r.IE, 0.3)]),
            summary: `$SE = h_x(p_x^1) - x_0 = ${r.SE.toFixed(2)}$. $IE = \\Delta x - SE = ${r.IE.toFixed(2)}$. Both negative for a normal good when price rises.` };
        },
      },
      {
        key: "iv", title: "Phase iv — Sign check (Giffen?)", timeSec: 45,
        type: "choice",
        fields: [
          { id: "giffen", label: "Is loaf a Giffen good for Penny?",
            options: ["Yes — SE and IE both positive at higher $p$", "No — both effects negative; loaf is a normal good"],
            correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { giffen: 1 },
            scoreEach: (ans) => scoreChoice(ans.giffen, 1),
            summary: `Cobb-Douglas always yields normal goods: SE < 0 and IE < 0 when own price rises. Giffen requires SE swamped by a strongly negative IE on an INFERIOR good — not Cobb-Douglas.` };
        },
      },
    ],
  },

  // ============================================ DAY 3 — Two inputs, isoquant
  {
    day: 3,
    title: "Two inputs and the isoquant",
    chapterRef: { id: 0, label: "Ch 11–12 — multi-input production" },
    weather: { emoji: "🌾🧈", line: "Flour and butter. The Apprentice wants the cost function." },
    letter: () => ({
      from: "👩‍🍳 Apprentice Biscuit",
      body: `<p>Production $y = x_1^{0.5} \\cdot x_2^{0.5}$ (Cobb-Douglas, constant returns). Input prices $w_1 = 1,\\ w_2 = 4$. Required output $y = 10$.</p>`,
      params: { alpha: 0.5, beta: 0.5, w1: 1, w2: 4, y: 10 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Cost-minimising inputs", timeSec: 120,
        fields: [
          { id: "x1", label: "$x_1^*$ =", tol: 0.5 },
          { id: "x2", label: "$x_2^*$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          const r = cobbCostMin(letter.params);
          return { targets: { x1: r.x1, x2: r.x2 },
            scoreEach: (ans) => avg([score(ans.x1, r.x1, 0.5), score(ans.x2, r.x2, 0.3)]),
            summary: `Tangency $\\frac{\\alpha/x_1}{\\beta/x_2} = \\frac{w_1}{w_2}$. $x_1^* = y^{1/(\\alpha+\\beta)} \\cdot (\\alpha w_2 / \\beta w_1)^{\\beta/(\\alpha+\\beta)} = ${r.x1.toFixed(2)}$, $x_2^* = ${r.x2.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Minimum cost $C(y)$", timeSec: 60,
        fields: [
          { id: "C", label: "$C(y = 10)$ =", tol: 1 },
        ],
        grade(letter, a) {
          const r = cobbCostMin(letter.params);
          return { targets: { C: r.cost },
            scoreEach: (ans) => score(ans.C, r.cost, 1),
            summary: `$C = w_1 x_1^* + w_2 x_2^* = ${r.cost.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Returns to scale", timeSec: 45,
        type: "choice",
        fields: [
          { id: "rts", label: "$y = x_1^{0.5} x_2^{0.5}$ exhibits:",
            options: ["increasing RTS", "constant RTS", "decreasing RTS"], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { rts: 1 },
            scoreEach: (ans) => scoreChoice(ans.rts, 1),
            summary: `Sum of exponents $\\alpha + \\beta = 0.5 + 0.5 = 1 \\Rightarrow$ constant returns to scale.` };
        },
      },
      {
        key: "iv", title: "Phase iv — SR vs LR", timeSec: 60,
        type: "choice",
        fields: [
          { id: "srlr", label: "In the SHORT run with $x_2$ fixed, average cost is:",
            options: [
              "Always equal to LR average cost",
              "Always greater than or equal to LR average cost",
              "Sometimes less than LR average cost",
              "Constant in $y$",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { srlr: 1 },
            scoreEach: (ans) => scoreChoice(ans.srlr, 1),
            summary: `SR AC ≥ LR AC always: in the long run you can re-optimise ALL inputs, in the short run only some. LR AC is the lower envelope of SR AC curves.` };
        },
      },
    ],
  },

  // ============================================ DAY 4 — Intertemporal trade
  {
    day: 4,
    title: "Time, interest, and bread",
    chapterRef: { id: 0, label: "Ch 3 — intertemporal choice" },
    weather: { emoji: "⏳", line: "Baroness Cream wants a loan." },
    letter: () => ({
      from: "🐈 Baroness Cream",
      body: `<p>I earn $m_1 = 8$ coins today and $m_2 = 12$ coins tomorrow. The interest rate (both borrowing and saving) is $r = 0.25$.</p>`,
      params: { m1: 8, m2: 12, r: 0.25 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Lifetime income (PV)", timeSec: 60,
        fields: [
          { id: "Y", label: "Lifetime income $Y$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = intertemporalBudget(letter.params);
          return { targets: { Y: r.Y_lifetime },
            scoreEach: (ans) => score(ans.Y, r.Y_lifetime, 0.2),
            summary: `$Y = m_1 + m_2/(1+r) = 8 + 12/1.25 = ${r.Y_lifetime.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Budget line slope and intercepts", timeSec: 90,
        fields: [
          { id: "slope", label: "Slope of budget (negative number) =", tol: 0.1 },
          { id: "c2max", label: "Max $c_2$ if she saves everything =", tol: 0.3 },
        ],
        grade(letter, a) {
          const r = intertemporalBudget(letter.params);
          return { targets: { slope: r.slope, c2max: r.intercept_c2 },
            scoreEach: (ans) => avg([score(ans.slope, r.slope, 0.1), score(ans.c2max, r.intercept_c2, 0.3)]),
            summary: `Slope $= -(1+r) = ${r.slope}$. Max $c_2 = Y(1+r) = ${r.intercept_c2.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Saver or borrower?", timeSec: 45,
        type: "choice",
        fields: [
          { id: "role", label: "If Cream picks $c_1 = 5,\\ c_2 = ?$ on her budget, is she a saver or borrower?",
            options: ["Saver (lent at rate $r$)", "Borrower (borrowed at rate $r$)", "Neither"], correct: 0 },
        ],
        grade(letter, a) {
          // c_1 = 5 < m_1 = 8 means she saves 3 today → c_2 = 12 + 3·1.25 = 15.75
          return { targets: { role: 0 },
            scoreEach: (ans) => scoreChoice(ans.role, 0),
            summary: `She consumes $c_1 = 5 < m_1 = 8$, so she saves $3$ coins today. Tomorrow she'll have $c_2 = m_2 + 3(1+r) = 12 + 3.75 = 15.75$.` };
        },
      },
    ],
  },

  // ============================================ DAY 5 — Two markets
  {
    day: 5, arcScroll: true,
    title: "Whiskerton vs Cattington",
    chapterRef: { id: 1, label: "Ch 14–15 — multi-market equilibrium" },
    weather: { emoji: "🗺️", line: "Two towns, cross-effects in demand." },
    letter: () => ({
      from: "🏛️ Mayor Mittens",
      body: `<p>Whiskerton's bread market: $q_d^W = 24 - 2 p_W$, $q_s^W = 0.5 p_W$. Cattington's market: $q_d^C = 18 - p_C$, $q_s^C = 0.5 p_C$. There's a cross-effect — if Cattington's bread is cheap, some Whiskerton cats commute there: $q_d^W$ also depends on $-0.5 p_C$ (i.e. $q_d^W = 24 - 2 p_W - 0.5 p_C$).</p>`,
      params: {
        m1: { a: 24, b: 2, c: 0, d: 0.5 },
        m2: { a: 18, b: 1, c: 0, d: 0.5 },
        cross12: -0.5, cross21: 0,
      },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Joint equilibrium prices", timeSec: 120,
        fields: [
          { id: "pW", label: "Whiskerton price $p_W$ =", tol: 0.2 },
          { id: "pC", label: "Cattington price $p_C$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = twoMarketEq(letter.params);
          return { targets: { pW: r.p1, pC: r.p2 },
            scoreEach: (ans) => avg([score(ans.pW, r.p1, 0.2), score(ans.pC, r.p2, 0.2)]),
            summary: `Solve the 2x2 linear system: $p_W = ${r.p1.toFixed(2)}$, $p_C = ${r.p2.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Equilibrium quantities", timeSec: 60,
        fields: [
          { id: "qW", label: "$q_W$ =", tol: 0.2 },
          { id: "qC", label: "$q_C$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = twoMarketEq(letter.params);
          return { targets: { qW: r.q1, qC: r.q2 },
            scoreEach: (ans) => avg([score(ans.qW, r.q1, 0.2), score(ans.qC, r.q2, 0.2)]),
            summary: `$q_W = ${r.q1.toFixed(2)}$, $q_C = ${r.q2.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Total surplus", timeSec: 90,
        fields: [
          { id: "TS", label: "Total surplus across BOTH markets =", tol: 4 },
        ],
        grade(letter, a) {
          const r = twoMarketEq(letter.params);
          const { m1, m2 } = letter.params;
          // For each market, use surplus as triangle (D-only since linear)
          const TS1 = 0.5 * (m1.a / m1.b - r.p1) * r.q1 + 0.5 * r.p1 * r.q1;
          const TS2 = 0.5 * (m2.a / m2.b - r.p2) * r.q2 + 0.5 * r.p2 * r.q2;
          const TS = TS1 + TS2;
          return { targets: { TS },
            scoreEach: (ans) => score(ans.TS, TS, 4),
            summary: `$TS = ${TS.toFixed(2)}$ (sum of CS+PS triangles in both markets).` };
        },
      },
      {
        key: "iv", title: "Phase iv — 1st Welfare verdict", timeSec: 45,
        type: "choice",
        fields: [
          { id: "v", label: "Is this Pareto efficient?",
            options: [
              "Yes — both markets clear, no externality named",
              "No — the cross-effect implies an externality",
              "Maybe — depends on income distribution",
            ], correct: 0 },
        ],
        grade(letter, a) {
          return { targets: { v: 0 },
            scoreEach: (ans) => scoreChoice(ans.v, 0),
            summary: `Cross-price effects in DEMAND are not externalities (no third party). Both markets clear competitively; First Welfare Theorem applies.` };
        },
      },
    ],
  },

  // ============================================ DAY 6 — Stacked controls
  {
    day: 6,
    title: "Stacked controls",
    chapterRef: { id: 2, label: "Ch 18–19 — ceiling + tax + subsidy" },
    weather: { emoji: "📜", line: "Inflation Daemon stacks three wedges." },
    letter: () => ({
      from: "👹 The Inflation Daemon (with Mayor Mittens looking on)",
      body: `
        <p>Bread market: $q_d = 26 - p$, $q_s = 0.4 p$. I shall stack distortions:</p>
        <ol>
          <li>A price ceiling at $p_{\\max} = 10$.</li>
          <li>Atop that, a per-unit tax $t = 2$ on producers.</li>
          <li>Atop THAT, a per-unit subsidy of $s = 1$ on consumers.</li>
        </ol>
        <p>Report each wedge's contribution to DWL.</p>
      `,
      params: { a: 26, b: 1, c: 0, d: 0.4, pmax: 10, t: 2, s: 1 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Free-market equilibrium", timeSec: 60,
        fields: [
          { id: "p_eq", label: "$p^*$ =", tol: 0.2 },
          { id: "q_eq", label: "$q^*$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const eq = equilibrium(letter.params);
          return { targets: { p_eq: eq.p, q_eq: eq.q },
            scoreEach: (ans) => avg([score(ans.p_eq, eq.p, 0.2), score(ans.q_eq, eq.q, 0.2)]),
            summary: `Eq: $p^* = ${eq.p.toFixed(2)}$, $q^* = ${eq.q.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — DWL of ceiling alone", timeSec: 90,
        fields: [
          { id: "dwl1", label: "DWL with only ceiling at $p_{\\max} = 10$ =", tol: 0.5 },
        ],
        grade(letter, a) {
          const r = priceCeiling(letter.params);
          return { targets: { dwl1: r.dwl },
            scoreEach: (ans) => score(ans.dwl1, r.dwl, 0.5),
            summary: `Ceiling DWL $= \\frac{1}{2}(q^* - q_s)(D(q_s) - p_{\\max}) = ${r.dwl.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — DWL of tax alone", timeSec: 90,
        fields: [
          { id: "dwl2", label: "DWL with only tax $t = 2$ (no ceiling) =", tol: 0.3 },
        ],
        grade(letter, a) {
          const r = perUnitTax({ ...letter.params, t: letter.params.t });
          return { targets: { dwl2: r.dwl },
            scoreEach: (ans) => score(ans.dwl2, r.dwl, 0.3),
            summary: `Tax-only DWL $= ${r.dwl.toFixed(2)}$.` };
        },
      },
      {
        key: "iv", title: "Phase iv — DWL of subsidy alone (sign matters!)", timeSec: 90,
        fields: [
          { id: "dwl3", label: "DWL of subsidy $s = 1$ alone =", tol: 0.3 },
        ],
        grade(letter, a) {
          // Subsidy of s to consumers: shifts D upward by s. New consumer price p_c = p_s + s,
          // where producer receives p_s. Quantity expands. DWL = ½·s·Δq.
          // Equivalent calculation: treat as negative tax t = -s.
          const r = perUnitTax({ ...letter.params, t: -letter.params.s });
          // dwl is naturally negative if t<0; take abs
          const dwl3 = Math.abs(r.dwl);
          return { targets: { dwl3 },
            scoreEach: (ans) => score(ans.dwl3, dwl3, 0.3),
            summary: `Subsidy DWL $= ${dwl3.toFixed(2)}$. Subsidies OVER-produce relative to $q^*$, creating their own triangle.` };
        },
      },
      {
        key: "v", title: "Phase v — Net DWL when all three stacked", timeSec: 90,
        type: "choice",
        fields: [
          { id: "additive", label: "Do the three DWLs simply add up?",
            options: [
              "Yes — DWL is linear in wedges",
              "No — the wedges interact; the net DWL is generally different from the sum",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { additive: 1 },
            scoreEach: (ans) => scoreChoice(ans.additive, 1),
            summary: `Distortions stack non-additively. A binding ceiling already limits trade to $q_s$; adding a tax on top may not increase DWL much if the ceiling was already binding. Sign-flipping subsidies can partially offset taxes. The general principle: compute the FINAL traded quantity and compare to $q^*$ once.` };
        },
      },
    ],
  },

  // ============================================ DAY 7 — Retaliating tariffs
  {
    day: 7,
    title: "The retaliating empire",
    chapterRef: { id: 3, label: "Ch 20 — tariff games" },
    weather: { emoji: "⚔️🌾", line: "Felinia retaliates." },
    letter: () => ({
      from: "🐅 Trade Minister Tabby",
      body: `
        <p>We import flour from Felinia at world price $p^* = 16$. Whiskerton's market: $q_d = 26 - p$, $q_s = 0.4 p$. Felinia's market for our exported butter: $q_d = 20 - p$, $q_s = 0.5 p$ (also at $p^* = 16$).</p>
        <p>Whiskerton sets tariff $t_W = 3$ on flour. Felinia retaliates with $t_F = 2$ on our butter.</p>
      `,
      params: {
        A: { a: 26, b: 1, c: 0, d: 0.4 },
        B: { a: 20, b: 1, c: 0, d: 0.5 },
        pStar: 16, tA: 3, tB: 2,
      },
    }),
    phases: [
      {
        key: "i", title: "Phase i — DWL from Whiskerton's own tariff", timeSec: 90,
        fields: [
          { id: "dwlW", label: "DWL in Whiskerton from $t_W$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          const r = retaliatingTariff(letter.params);
          return { targets: { dwlW: r.dwlA },
            scoreEach: (ans) => score(ans.dwlW, r.dwlA, 0.3),
            summary: `Whiskerton's own tariff $t_W$ creates two DWL triangles in Whiskerton's flour market totalling $${r.dwlA.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — DWL from Felinia's retaliation", timeSec: 90,
        fields: [
          { id: "dwlF", label: "DWL in Felinia from $t_F$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          const r = retaliatingTariff(letter.params);
          return { targets: { dwlF: r.dwlB },
            scoreEach: (ans) => score(ans.dwlF, r.dwlB, 0.3),
            summary: `Felinia's retaliation costs them $${r.dwlB.toFixed(2)}$ in their own butter market. (Each country's tariff hurts itself most.)` };
        },
      },
      {
        key: "iii", title: "Phase iii — Tariff revenue collected", timeSec: 60,
        fields: [
          { id: "revW", label: "Whiskerton tariff revenue =", tol: 0.5 },
          { id: "revF", label: "Felinia tariff revenue =", tol: 0.5 },
        ],
        grade(letter, a) {
          const r = retaliatingTariff(letter.params);
          return { targets: { revW: r.revA, revF: r.revB },
            scoreEach: (ans) => avg([score(ans.revW, r.revA, 0.5), score(ans.revF, r.revB, 0.5)]),
            summary: `Revenue: Whiskerton $${r.revA.toFixed(2)}$, Felinia $${r.revB.toFixed(2)}$. Pure transfers from the OTHER country's consumers and own consumers.` };
        },
      },
      {
        key: "iv", title: "Phase iv — Should Whiskerton retaliate to retaliation?", timeSec: 45,
        type: "choice",
        fields: [
          { id: "next", label: "Strategy choice:",
            options: [
              "Raise $t_W$ further — punish Felinia",
              "Cut $t_W$ to zero — free trade strictly Pareto-improves",
              "Match Felinia's $t_F$ exactly — symmetry",
              "Form a tariff alliance — collude",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { next: 1 },
            scoreEach: (ans) => scoreChoice(ans.next, 1),
            summary: `Tariff escalation hurts both. Mutual disarmament (free trade) maximises joint welfare. This is the textbook trade-war Pareto-improvement argument.` };
        },
      },
    ],
  },

  // ============================================ DAY 8 — Choke and quota
  {
    day: 8,
    title: "Choke and quota",
    chapterRef: { id: 3, label: "Ch 19+20 — wedges and rents" },
    weather: { emoji: "🚫📦", line: "Mayor weighs a choke tax against a quota." },
    letter: () => ({
      from: "🏛️ Mayor Mittens",
      body: `<p>Bread: $q_d = 30 - 3p$, $q_s = 6p$. World price (if open to trade) $p^* = 2$. The Queen considers: (a) a per-unit tax large enough to kill all trade, or (b) a quota of size $Q = 4$.</p>`,
      params: { a: 30, b: 3, c: 0, d: 6, pStar: 2, quota: 4 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Choke-price tax", timeSec: 60,
        fields: [
          { id: "tKill", label: "Smallest $t$ killing trade entirely =", tol: 0.3 },
        ],
        grade(letter, a) {
          // Choke price = a/b. Min supply price = -c/d.
          const pChoke = letter.params.a / letter.params.b;
          const pMin = -letter.params.c / letter.params.d;
          const tKill = pChoke - pMin;
          return { targets: { tKill },
            scoreEach: (ans) => score(ans.tKill, tKill, 0.3),
            summary: `$t^{\\text{kill}} = p^{\\text{choke}} - p^{\\text{min}}_{\\text{supply}} = ${pChoke.toFixed(2)} - ${pMin.toFixed(2)} = ${tKill.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Quota domestic price", timeSec: 90,
        fields: [
          { id: "pQ", label: "Domestic price under quota $Q = 4$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          // With quota of size 4 imported at p*, domestic supply + quota = domestic demand
          // Q_imports = 4 = q_d(p) - q_s(p) ⇒ 30 - 3p - 6p = 4 ⇒ 30 - 9p = 4 ⇒ p = 26/9 ≈ 2.89
          const p = (letter.params.a - letter.params.quota) / (letter.params.b + letter.params.d);
          return { targets: { pQ: p },
            scoreEach: (ans) => score(ans.pQ, p, 0.3),
            summary: `Find $p$ with $Q = q_d - q_s = a - (b+d)\\,p \\Rightarrow p = ${p.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Quota rent", timeSec: 60,
        fields: [
          { id: "rent", label: "Quota rent (per unit × quantity) =", tol: 0.5 },
        ],
        grade(letter, a) {
          const p = (letter.params.a - letter.params.quota) / (letter.params.b + letter.params.d);
          const rent = (p - letter.params.pStar) * letter.params.quota;
          return { targets: { rent },
            scoreEach: (ans) => score(ans.rent, rent, 0.5),
            summary: `Rent $= (p^{\\text{dom}} - p^*) \\cdot Q = (${p.toFixed(2)} - 2) \\cdot 4 = ${rent.toFixed(2)}$.` };
        },
      },
      {
        key: "iv", title: "Phase iv — Who captures the rent?", timeSec: 45,
        type: "choice",
        fields: [
          { id: "capture", label: "If licences are auctioned to domestic firms:",
            options: [
              "Foreign exporters keep the rent",
              "Domestic licence-holders (or government if auctioned) capture the rent",
              "Consumers capture the rent",
              "Rent is destroyed",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { capture: 1 },
            scoreEach: (ans) => scoreChoice(ans.capture, 1),
            summary: `Quota rent goes to whoever holds the import licence. Auctioned to domestic firms ⇒ government collects the auction revenue (equivalent to a tariff). Granted to foreigners ⇒ rent leaves the country.` };
        },
      },
    ],
  },

  // ============================================ DAY 9 — Coase
  {
    day: 9, arcScroll: true,
    title: "Coase and the corner cats",
    chapterRef: { id: 4, label: "Ch 21 — externalities" },
    weather: { emoji: "🏭🐈", line: "Oven smoke hits Penny's flat." },
    letter: () => ({
      from: "🚒 Whiskerton Air Board",
      body: `<p>Your bakery's smoke harms Penny next door. Your marginal benefit of polluting: $MB(q) = 12 - q$. Penny's marginal external cost: $MEC(q) = 2q$.</p>`,
      params: { MB_intercept: 12, MB_slope: 1, MEC_intercept: 0, MEC_slope: 2 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Unregulated $q$ vs efficient $q^*$", timeSec: 90,
        fields: [
          { id: "qUnreg", label: "Unregulated $q$ =", tol: 0.3 },
          { id: "qStar", label: "Efficient $q^*$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = coaseBargain({ ...letter.params, rightHolder: "victim" });
          return { targets: { qUnreg: r.qUnreg, qStar: r.qStar },
            scoreEach: (ans) => avg([score(ans.qUnreg, r.qUnreg, 0.3), score(ans.qStar, r.qStar, 0.2)]),
            summary: `Unregulated: $MB = 0 \\Rightarrow q = ${r.qUnreg}$. Efficient: $MB = MEC \\Rightarrow q^* = ${r.qStar.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Transfer when Penny holds the right", timeSec: 90,
        fields: [
          { id: "tVictim", label: "Polluter pays Penny =", tol: 1 },
        ],
        grade(letter, a) {
          const r = coaseBargain({ ...letter.params, rightHolder: "victim" });
          return { targets: { tVictim: r.transfer },
            scoreEach: (ans) => score(ans.tVictim, r.transfer, 1),
            summary: `Polluter compensates damage at $q^* \\approx ${r.qStar.toFixed(2)}$: transfer $= ${r.transfer.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Transfer when polluter holds the right", timeSec: 90,
        fields: [
          { id: "tPolluter", label: "Penny pays polluter to abate =", tol: 1 },
        ],
        grade(letter, a) {
          const r = coaseBargain({ ...letter.params, rightHolder: "polluter" });
          return { targets: { tPolluter: r.transfer },
            scoreEach: (ans) => score(ans.tPolluter, r.transfer, 1),
            summary: `Victim pays for the abatement (reduction from $q^{\\text{unreg}}$ to $q^*$): transfer $= ${r.transfer.toFixed(2)}$.` };
        },
      },
      {
        key: "iv", title: "Phase iv — Coase invariance", timeSec: 45,
        type: "choice",
        fields: [
          { id: "inv", label: "The efficient quantity $q^*$ is:",
            options: [
              "Higher when polluter holds the right",
              "Higher when victim holds the right",
              "Identical in both regimes",
              "Cannot be determined without more info",
            ], correct: 2 },
        ],
        grade(letter, a) {
          return { targets: { inv: 2 },
            scoreEach: (ans) => scoreChoice(ans.inv, 2),
            summary: `Coase invariance: with zero transaction costs and well-defined property rights, the efficient $q^*$ is the SAME under either rights regime. Only the TRANSFER (who pays whom) differs.` };
        },
      },
    ],
  },

  // ============================================ DAY 10 — Screening menu
  {
    day: 10,
    title: "The screening menu",
    chapterRef: { id: 5, label: "Ch 22 — separating contracts" },
    weather: { emoji: "🩺📋", line: "Insurance market unraveling." },
    letter: () => ({
      from: "🏥 Whiskerton Mutual",
      body: `<p>Two cat-types: $\\pi_L = 0.1$, $\\pi_H = 0.4$, loss $L = 100$. Design a separating contract menu (full coverage for H, partial for L).</p>`,
      params: { piL: 0.1, piH: 0.4, loss: 100 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Fair premiums", timeSec: 60,
        fields: [
          { id: "premL", label: "Fair premium for L =", tol: 0.5 },
          { id: "premH", label: "Fair premium for H =", tol: 0.5 },
        ],
        grade(letter, a) {
          const r = separatingMenu(letter.params);
          return { targets: { premL: r.contracts[0].premium, premH: r.contracts[1].premium },
            // For separation, L gets PARTIAL coverage so premL < πL·loss (which would be full coverage at L's fair price)
            // Use exact targets from the helper
            scoreEach: (ans) => avg([score(ans.premL, r.contracts[0].premium, 0.5), score(ans.premH, r.contracts[1].premium, 0.5)]),
            summary: `H gets full coverage at $\\pi_H L = ${r.contracts[1].premium.toFixed(2)}$. L gets PARTIAL coverage $k_L^* = ${r.contracts[0].coverage.toFixed(2)}$ at $\\pi_L k_L = ${r.contracts[0].premium.toFixed(2)}$ — designed so H is indifferent (IC binds).` };
        },
      },
      {
        key: "ii", title: "Phase ii — L's partial coverage", timeSec: 90,
        fields: [
          { id: "kL", label: "L's coverage $k_L^*$ =", tol: 3 },
        ],
        grade(letter, a) {
          const r = separatingMenu(letter.params);
          return { targets: { kL: r.contracts[0].coverage },
            scoreEach: (ans) => score(ans.kL, r.contracts[0].coverage, 3),
            summary: `$k_L^* = \\frac{\\pi_H - \\pi_L}{1 - \\pi_L} \\cdot L = \\frac{0.3}{0.9} \\cdot 100 \\approx ${r.contracts[0].coverage.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Why must L's coverage be partial?", timeSec: 60,
        type: "choice",
        fields: [
          { id: "why", label: "Why?",
            options: [
              "L can't afford full coverage",
              "Full coverage at $\\pi_L L$ would attract H to mimic L (IC violation)",
              "Government regulation forbids full L coverage",
              "There's no actuarial difference between L and H",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { why: 1 },
            scoreEach: (ans) => scoreChoice(ans.why, 1),
            summary: `If L got full coverage at the L-fair premium $\\pi_L L = 10$, H would prefer that contract over the H-fair $\\pi_H L = 40$. The IC constraint binds: partial coverage for L makes H indifferent and prevents mimicking.` };
        },
      },
      {
        key: "iv", title: "Phase iv — Second-best welfare vs first-best", timeSec: 45,
        type: "choice",
        fields: [
          { id: "wel", label: "Compared to first-best (each type gets full coverage at its own fair premium):",
            options: [
              "Second-best is identical",
              "Second-best is strictly worse (L is under-insured)",
              "Second-best is strictly better (no information asymmetry to fix)",
              "Second-best has more L insurance",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { wel: 1 },
            scoreEach: (ans) => scoreChoice(ans.wel, 1),
            summary: `Asymmetric info imposes a welfare cost: L is rationed below their first-best coverage. This is the "second-best" outcome — the best achievable given the screening constraint.` };
        },
      },
    ],
  },

  // ============================================ DAY 11 — Monopoly regulation
  {
    day: 11,
    title: "Regulating the only baker",
    chapterRef: { id: 6, label: "Ch 23 — monopoly regulation" },
    weather: { emoji: "👑📐", line: "Baron Whiskerton awaits the Mayor's verdict." },
    letter: () => ({
      from: "🎩 Baron Whiskerton",
      body: `<p>Demand $p = 20 - q$. Cost $C(q) = 2q + 0.5 q^2$ so $MC = 2 + q$ and $AC = 2 + 0.5 q$. The Mayor offers three regulatory regimes.</p>`,
      params: { alpha: 20, beta: 1, mcConst: 2, mcSlope: 1, fc: 0 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Unregulated monopoly", timeSec: 90,
        fields: [
          { id: "qM", label: "Monopoly $q^M$ =", tol: 0.3 },
          { id: "pM", label: "Monopoly $p^M$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          // MR = 20 - 2q. MC = 2 + q. MR = MC: 20 - 2q = 2 + q ⇒ q = 6, p = 14.
          const q = (letter.params.alpha - letter.params.mcConst) / (2 * letter.params.beta + letter.params.mcSlope);
          const p = letter.params.alpha - letter.params.beta * q;
          return { targets: { qM: q, pM: p },
            scoreEach: (ans) => avg([score(ans.qM, q, 0.3), score(ans.pM, p, 0.3)]),
            summary: `$MR = MC$: $20 - 2q = 2 + q \\Rightarrow q^M = ${q.toFixed(2)}$, $p^M = ${p.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Marginal-cost regulation", timeSec: 90,
        fields: [
          { id: "qMC", label: "$q$ at $P = MC$ =", tol: 0.3 },
          { id: "pMC", label: "$P$ at $P = MC$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          // P = MC: 20 - q = 2 + q ⇒ q = 9, p = 11.
          const q = (letter.params.alpha - letter.params.mcConst) / (letter.params.beta + letter.params.mcSlope);
          const p = letter.params.alpha - letter.params.beta * q;
          return { targets: { qMC: q, pMC: p },
            scoreEach: (ans) => avg([score(ans.qMC, q, 0.3), score(ans.pMC, p, 0.3)]),
            summary: `Demand = supply: $20 - q = 2 + q \\Rightarrow q = ${q.toFixed(2)}$, $P = ${p.toFixed(2)}$. Note: with rising MC, $MC > AC$, so monopolist EARNS profit here.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Average-cost regulation", timeSec: 90,
        fields: [
          { id: "qAC", label: "$q$ at $P = AC$ =", tol: 0.5 },
        ],
        grade(letter, a) {
          // P = AC: 20 - q = 2 + 0.5q ⇒ 18 = 1.5q ⇒ q = 12.
          const q = (letter.params.alpha - letter.params.mcConst) / (letter.params.beta + 0.5 * letter.params.mcSlope);
          return { targets: { qAC: q },
            scoreEach: (ans) => score(ans.qAC, q, 0.5),
            summary: `$P = AC$: $20 - q = 2 + 0.5 q \\Rightarrow q = ${q.toFixed(2)}$. Firm breaks even (zero economic profit).` };
        },
      },
      {
        key: "iv", title: "Phase iv — Welfare ranking", timeSec: 60,
        type: "choice",
        fields: [
          { id: "rank", label: "Order regimes by total surplus (highest → lowest):",
            options: [
              "$P = MC$ > $P = AC$ > unregulated monopoly",
              "Unregulated > $P = AC$ > $P = MC$",
              "$P = AC$ > $P = MC$ > unregulated",
              "All three are equal",
            ], correct: 0 },
        ],
        grade(letter, a) {
          return { targets: { rank: 0 },
            scoreEach: (ans) => scoreChoice(ans.rank, 0),
            summary: `$P = MC$ is first-best (maximises total surplus). $P = AC$ is second-best (firm breaks even, slight DWL). Unregulated monopoly has the largest DWL.` };
        },
      },
      {
        key: "v", title: "Phase v — Natural monopoly twist", timeSec: 45,
        type: "choice",
        fields: [
          { id: "natural", label: "If AC were DECREASING (natural monopoly), $P = MC$ would imply:",
            options: [
              "Firm earns positive profit",
              "Firm breaks even",
              "Firm LOSES money (P < AC); requires subsidy",
              "$P = MC$ is impossible",
            ], correct: 2 },
        ],
        grade(letter, a) {
          return { targets: { natural: 2 },
            scoreEach: (ans) => scoreChoice(ans.natural, 2),
            summary: `Natural monopoly = decreasing AC ⇒ $MC < AC$ everywhere. $P = MC$ ⇒ $P < AC$ ⇒ losses. Regulators face the trade-off: subsidise efficient pricing, or accept second-best $P = AC$.` };
        },
      },
    ],
  },

  // ============================================ DAY 12 — Public ovens
  {
    day: 12,
    title: "Public ovens",
    chapterRef: { id: 6, label: "Ch 27 — public goods" },
    weather: { emoji: "🍞🏛️", line: "Three cats, one community oven." },
    letter: () => ({
      from: "🐱 Penny + 🤵 Pawley + 🐈‍⬛ Mittens",
      body: `<p>The community oven (a public good) costs $MC = 9$ per loaf produced. Each citizen's marginal willingness to pay: Penny $MWTP_P = 5 - 0.5 q$, Pawley $MWTP_S = 7 - q$, Mittens $MWTP_M = 4 - 0.5 q$.</p>`,
      params: { },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Samuelson efficient $q$", timeSec: 120,
        fields: [
          { id: "qStar", label: "Efficient $q$ where $\\sum MWTP = MC$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          // Σ MWTP(q) = (5 - 0.5q) + (7 - q) + (4 - 0.5q) = 16 - 2q. Set = 9 ⇒ q = 3.5.
          const q = (5 + 7 + 4 - 9) / (0.5 + 1 + 0.5);
          return { targets: { qStar: q },
            scoreEach: (ans) => score(ans.qStar, q, 0.2),
            summary: `$\\sum MWTP_i(q) = 16 - 2q$. Set $= MC = 9 \\Rightarrow q = ${q.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Free-rider quantity", timeSec: 90,
        fields: [
          { id: "qFree", label: "If only Pawley pays (highest WTP), his private $q$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          // Pawley sets MWTP_P = MC: 7 - q = 9 ⇒ q = -2 (would buy 0). Use max with 0.
          // Try: 7 - q = 9 has no positive solution. Pawley's private q = 0.
          // Use a simpler interp: Pawley's q ignoring others = where his MWTP=MC, only if positive.
          // If 7 < 9, Pawley doesn't buy any. Public good is under-provided when free-riders.
          return { targets: { qFree: 0 },
            scoreEach: (ans) => score(ans.qFree, 0, 0.2),
            summary: `Even Pawley (highest WTP) has $MWTP < MC$, so alone he buys 0 loaves. Free-riding ⇒ massive under-provision.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Lindahl prices", timeSec: 90,
        fields: [
          { id: "pPenny", label: "Penny's Lindahl price (share of MC) =", tol: 0.3 },
          { id: "pPawley", label: "Pawley's Lindahl price =", tol: 0.3 },
          { id: "pMittens", label: "Mittens' Lindahl price =", tol: 0.3 },
        ],
        grade(letter, a) {
          // At q = 3.5: MWTP_P = 5 - 1.75 = 3.25. MWTP_S = 7 - 3.5 = 3.5. MWTP_M = 4 - 1.75 = 2.25. Sum = 9 ✓.
          const q = 3.5;
          const mP = 5 - 0.5 * q;
          const mS = 7 - q;
          const mM = 4 - 0.5 * q;
          return { targets: { pPenny: mP, pPawley: mS, pMittens: mM },
            scoreEach: (ans) => avg([score(ans.pPenny, mP, 0.3), score(ans.pPawley, mS, 0.3), score(ans.pMittens, mM, 0.3)]),
            summary: `Lindahl prices = each citizen's $MWTP$ at the efficient $q$. Sum to $MC$: $${mP.toFixed(2)} + ${mS.toFixed(2)} + ${mM.toFixed(2)} = 9$.` };
        },
      },
    ],
  },

  // ============================================ DAY 13 — Essay 1 boss
  {
    day: 13, arcScroll: true,
    title: "Essay 1 boss — welfare under control",
    chapterRef: { id: 2, label: "Ch 18 essay archetype" },
    weather: { emoji: "📝", line: "Examiner Whiskertine takes the chair. No hints." },
    letter: () => ({
      from: "🐯 Examiner Whiskertine",
      body: `<p>Demand $q_d = 26 - p$, supply $q_s = 0.3 p$. Quasilinear consumers. Ceiling $p_{\\max} = 10$, opportunity cost of waiting $w_h = 4$ cents/hour. Eight parts.</p>`,
      params: { a: 26, b: 1, c: 0, d: 0.3, pmax: 10, wage: 4 },
    }),
    phases: [
      {
        key: "a", title: "(a) Equilibrium", timeSec: 90,
        fields: [
          { id: "p_eq", label: "$p^*$ =", tol: 0.2 },
          { id: "q_eq", label: "$q^*$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const eq = equilibrium(letter.params);
          return { targets: { p_eq: eq.p, q_eq: eq.q },
            scoreEach: (ans) => avg([score(ans.p_eq, eq.p, 0.2), score(ans.q_eq, eq.q, 0.2)]),
            summary: `$p^* = 20$, $q^* = 6$.` };
        },
      },
      {
        key: "b", title: "(b) Shortage at ceiling", timeSec: 90,
        fields: [
          { id: "qd", label: "$q_d$ at $p_{\\max}$ =", tol: 0.2 },
          { id: "qs", label: "$q_s$ at $p_{\\max}$ =", tol: 0.2 },
          { id: "short", label: "Shortage =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = priceCeiling(letter.params);
          return { targets: { qd: r.qd, qs: r.qs, short: r.shortage },
            scoreEach: (ans) => avg([score(ans.qd, r.qd, 0.2), score(ans.qs, r.qs, 0.2), score(ans.short, r.shortage, 0.2)]),
            summary: `$q_d = 16$, $q_s = 3$, shortage $= 13$.` };
        },
      },
      {
        key: "c", title: "(c) DWL of ceiling", timeSec: 90,
        fields: [{ id: "dwl", label: "$DWL$ =", tol: 0.3 }],
        grade(letter, a) {
          const r = priceCeiling(letter.params);
          return { targets: { dwl: r.dwl },
            scoreEach: (ans) => score(ans.dwl, r.dwl, 0.3),
            summary: `$DWL = ${r.dwl.toFixed(2)}$.` };
        },
      },
      {
        key: "d", title: "(d) Per-unit subsidy to clear", timeSec: 90,
        fields: [
          { id: "ps", label: "Producer price $p_s$ =", tol: 0.4 },
          { id: "sub", label: "Subsidy size =", tol: 0.4 },
        ],
        grade(letter, a) {
          const r = subsidyToClear(letter.params);
          return { targets: { ps: r.ps, sub: r.subsidy },
            scoreEach: (ans) => avg([score(ans.ps, r.ps, 0.4), score(ans.sub, r.subsidy, 0.4)]),
            summary: `$p_s = ${r.ps.toFixed(2)}$, subsidy $= ${r.subsidy.toFixed(2)}$.` };
        },
      },
      {
        key: "e", title: "(e) DWL of subsidy", timeSec: 120,
        fields: [{ id: "dwlSub", label: "Subsidy DWL =", tol: 1.5 }],
        grade(letter, a) {
          const r = subsidyToClear(letter.params);
          return { targets: { dwlSub: r.dwlSubsidy },
            scoreEach: (ans) => score(ans.dwlSub, r.dwlSubsidy, 1.5),
            summary: `Subsidy DWL $= ${r.dwlSubsidy.toFixed(2)}$ — vastly larger than the ceiling alone.` };
        },
      },
      {
        key: "f", title: "(f) Efficiency verdict", timeSec: 45,
        type: "choice",
        fields: [
          { id: "v", label: "Should the prince approve the subsidy?",
            options: [
              "Yes — it clears the shortage",
              "No — subsidy DWL >> ceiling DWL; remove the ceiling instead",
              "Yes — government revenue offsets the cost",
              "Maybe — depends on distributional weights",
            ], correct: 1 },
        ],
        grade(letter, a) {
          return { targets: { v: 1 },
            scoreEach: (ans) => scoreChoice(ans.v, 1),
            summary: `Subsidy creates a bigger triangle than the ceiling. Pure-efficiency answer: remove the ceiling. Distributional concerns require a separate transfer mechanism (lump-sum), not market distortion.` };
        },
      },
      {
        key: "g", title: "(g) Waiting time", timeSec: 60,
        fields: [{ id: "h", label: "Waiting hours $h$ =", tol: 0.1 }],
        grade(letter, a) {
          const h = waitingHours(letter.params);
          return { targets: { h },
            scoreEach: (ans) => score(ans.h, h, 0.1),
            summary: `Marginal cat indifferent: $h = (D(q_s) - p_{\\max})/w_h = (23 - 10)/4 = ${h.toFixed(2)}$ hours.` };
        },
      },
      {
        key: "h", title: "(h) DWL-triangle vertices", timeSec: 90,
        fields: [
          { id: "vq1", label: "Left vertex $q$ =", tol: 0.2 },
          { id: "vp1", label: "Left vertex $p$ =", tol: 0.4 },
          { id: "vq2", label: "Right vertex $q$ (= $q^*$) =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = priceCeiling(letter.params);
          return { targets: { vq1: r.qs, vp1: r.pAtQs_d, vq2: r.eq.q },
            scoreEach: (ans) => avg([score(ans.vq1, r.qs, 0.2), score(ans.vp1, r.pAtQs_d, 0.4), score(ans.vq2, r.eq.q, 0.2)]),
            summary: `DWL triangle: vertices at $(q_s, p_{\\max}) = (3, 10)$, $(q_s, D(q_s)) = (3, 23)$, and $(q^*, p^*) = (6, 20)$.` };
        },
      },
    ],
  },

  // ============================================ DAY 14 — Essay 2 boss
  {
    day: 14,
    title: "Essay 2 boss — the 24-cell table",
    chapterRef: { id: 3, label: "Ch 20 essay archetype" },
    weather: { emoji: "📊", line: "All 24 cells, ±0.3 tolerance, no hints." },
    letter: () => ({
      from: "🐯 Examiner Whiskertine",
      body: `<p>Market A (exporter): $q_d = 20 - p$, $q_s = 0.5 p$. Market B (importer): $q_d = 26 - p$, $q_s = 0.4 p$. World price $p^* = 16$, tariff $t = 2$.</p>`,
      params: {
        A: { a: 20, b: 1, c: 0, d: 0.5 },
        B: { a: 26, b: 1, c: 0, d: 0.4 },
        pStar: 16, t: 2,
      },
    }),
    phases: [
      {
        key: "A_nt", title: "Phase i — Market A, autarky (4 cells)", timeSec: 180,
        fields: [
          { id: "cs", label: "CS =", tol: 1 },
          { id: "ps", label: "PS =", tol: 1 },
          { id: "rev", label: "Tariff revenue =", tol: 0.3 },
          { id: "tot", label: "Total =", tol: 1.5 },
        ],
        grade(letter, a) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { cs: r.A.noTrade.CS, ps: r.A.noTrade.PS, rev: 0, tot: r.A.noTrade.Total },
            scoreEach: (ans) => avg([score(ans.cs, r.A.noTrade.CS, 1), score(ans.ps, r.A.noTrade.PS, 1), score(ans.rev, 0, 0.3), score(ans.tot, r.A.noTrade.Total, 1.5)]),
            summary: `A no-trade: autarky price $${r.autarkyA.p.toFixed(2)}$.` };
        },
      },
      {
        key: "A_ft", title: "Phase ii — Market A, free trade (4 cells)", timeSec: 180,
        fields: [
          { id: "cs", label: "CS =", tol: 1 },
          { id: "ps", label: "PS =", tol: 1 },
          { id: "rev", label: "Tariff revenue =", tol: 0.3 },
          { id: "tot", label: "Total =", tol: 1.5 },
        ],
        grade(letter, a) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { cs: r.A.freeTrade.CS, ps: r.A.freeTrade.PS, rev: 0, tot: r.A.freeTrade.Total },
            scoreEach: (ans) => avg([score(ans.cs, r.A.freeTrade.CS, 1), score(ans.ps, r.A.freeTrade.PS, 1), score(ans.rev, 0, 0.3), score(ans.tot, r.A.freeTrade.Total, 1.5)]),
            summary: `A free trade: domestic price $= p^* = ${letter.params.pStar}$.` };
        },
      },
      {
        key: "B_ft", title: "Phase iii — Market B, free trade (4 cells)", timeSec: 180,
        fields: [
          { id: "cs", label: "CS =", tol: 1 },
          { id: "ps", label: "PS =", tol: 1 },
          { id: "rev", label: "Tariff revenue =", tol: 0.3 },
          { id: "tot", label: "Total =", tol: 1.5 },
        ],
        grade(letter, a) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { cs: r.B.freeTrade.CS, ps: r.B.freeTrade.PS, rev: 0, tot: r.B.freeTrade.Total },
            scoreEach: (ans) => avg([score(ans.cs, r.B.freeTrade.CS, 1), score(ans.ps, r.B.freeTrade.PS, 1), score(ans.rev, 0, 0.3), score(ans.tot, r.B.freeTrade.Total, 1.5)]),
            summary: `B free trade: domestic price $= p^* = ${letter.params.pStar}$.` };
        },
      },
      {
        key: "B_t", title: "Phase iv — Market B, tariff (4 cells)", timeSec: 180,
        fields: [
          { id: "cs", label: "CS =", tol: 1 },
          { id: "ps", label: "PS =", tol: 1 },
          { id: "rev", label: "Tariff revenue =", tol: 0.5 },
          { id: "tot", label: "Total =", tol: 1.5 },
        ],
        grade(letter, a) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { cs: r.B.tariff.CS, ps: r.B.tariff.PS, rev: r.B.tariff.Rev, tot: r.B.tariff.Total },
            scoreEach: (ans) => avg([score(ans.cs, r.B.tariff.CS, 1), score(ans.ps, r.B.tariff.PS, 1), score(ans.rev, r.B.tariff.Rev, 0.5), score(ans.tot, r.B.tariff.Total, 1.5)]),
            summary: `B under tariff: $p = p^* + t = ${letter.params.pStar + letter.params.t}$.` };
        },
      },
    ],
  },

  // ============================================ DAY 15 — MCQ blitz
  {
    day: 15,
    title: "MCQ blitz — 30 min, 15 questions",
    chapterRef: { id: "mock", label: "Final Mock format" },
    weather: { emoji: "⏱️", line: "The Royal Panel begins the timer." },
    isBlitz: true,    // signals daily.html to render the MCQ blitz UI
    timeSec: 30 * 60, // 30 minutes total
    letter: () => ({
      from: "🐯 Royal Panel",
      body: `<p>Fifteen multiple-choice questions. Thirty minutes. Two minutes per question, the pace of half the real exam. Begin when ready.</p>`,
      params: {},
    }),
    phases: [
      {
        key: "blitz", title: "Phase — 15 MCQs against the clock", timeSec: 30 * 60,
        // Special phase consumed by the blitz renderer in daily.html
        fields: [],
        grade(letter, a) {
          // Score comes from blitz state — daily.html handles it
          return { targets: {}, scoreEach: () => 0, summary: "" };
        },
      },
    ],
  },

  // ============================================ DAY 16 — Graduation synthesis
  {
    day: 16,
    title: "Graduation: synthesis problem",
    chapterRef: { id: "mock", label: "Cross-topic capstone" },
    weather: { emoji: "🔮", line: "All topics. One mega-problem. The Examiners watch." },
    letter: () => ({
      from: "🐯 Royal Examination Bureau (with 🎩 Baron Whiskerton)",
      body: `
        <p>Baron Whiskerton has won a monopoly licence for the bread market. Linear demand $p = 30 - q$, $MC = 4$. His ovens emit smoke with $MEC = 2$ per loaf.</p>
        <p>The Queen wants to: (i) compute the unregulated monopoly outcome, (ii) compute the socially optimal $q$ accounting for the externality, (iii) design a corrective tax, (iv) compare welfare under unregulated vs corrective regimes, (v) extend to 3rd-deg price discrimination in two markets to identify the optimal split.</p>
      `,
      params: {
        alpha: 30, beta: 1, mc: 4, mec: 2,
        marketX: { alpha: 18, beta: 1 },
        marketY: { alpha: 24, beta: 1 },
      },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Unregulated monopoly", timeSec: 90,
        fields: [
          { id: "qM", label: "$q^M$ =", tol: 0.2 },
          { id: "pM", label: "$p^M$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = monopolyLinear(letter.params);
          return { targets: { qM: r.q, pM: r.p },
            scoreEach: (ans) => avg([score(ans.qM, r.q, 0.2), score(ans.pM, r.p, 0.2)]),
            summary: `$q^M = ${r.q.toFixed(2)}$, $p^M = ${r.p.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Social optimum (with externality)", timeSec: 90,
        fields: [
          { id: "qS", label: "$q^S$ =", tol: 0.2 },
        ],
        grade(letter, a) {
          const r = externalityMonopolyTax(letter.params);
          return { targets: { qS: r.qSocial },
            scoreEach: (ans) => score(ans.qS, r.qSocial, 0.2),
            summary: `Social: $P = MC + MEC$ ⇒ $30 - q = 4 + 2 \\Rightarrow q^S = ${r.qSocial.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Corrective tax", timeSec: 90,
        fields: [
          { id: "tau", label: "Corrective unit tax $\\tau$ =", tol: 0.5 },
        ],
        grade(letter, a) {
          const r = externalityMonopolyTax(letter.params);
          return { targets: { tau: r.correctiveTax },
            scoreEach: (ans) => score(ans.tau, r.correctiveTax, 0.5),
            summary: `$\\tau = MR(q^S) - MC = ${r.correctiveTax.toFixed(2)}$. ${r.correctiveTax < 0 ? "NEGATIVE (subsidy) — monopolist already under-produces!" : "Positive — additional tax beyond Pigouvian needed to align monopolist's MR with social MC."}` };
        },
      },
      {
        key: "iv", title: "Phase iv — 3rd-deg PD across two markets", timeSec: 120,
        fields: [
          { id: "qX", label: "$q_X$ in Market X =", tol: 0.3 },
          { id: "qY", label: "$q_Y$ in Market Y =", tol: 0.3 },
          { id: "pX", label: "$p_X$ =", tol: 0.3 },
          { id: "pY", label: "$p_Y$ =", tol: 0.3 },
        ],
        grade(letter, a) {
          // Each market: q_i = (α_i - MC)/(2β_i). Use raw MC (ignore externality for PD problem)
          const r = thirdDegreePD({
            markets: [
              { name: "X", alpha: letter.params.marketX.alpha, beta: letter.params.marketX.beta },
              { name: "Y", alpha: letter.params.marketY.alpha, beta: letter.params.marketY.beta },
            ],
            mc: letter.params.mc,
          });
          return { targets: { qX: r[0].q, qY: r[1].q, pX: r[0].p, pY: r[1].p },
            scoreEach: (ans) => avg([
              score(ans.qX, r[0].q, 0.3), score(ans.qY, r[1].q, 0.3),
              score(ans.pX, r[0].p, 0.3), score(ans.pY, r[1].p, 0.3),
            ]),
            summary: `$q_X^* = ${r[0].q.toFixed(2)},\\ p_X = ${r[0].p.toFixed(2)}$; $q_Y^* = ${r[1].q.toFixed(2)},\\ p_Y = ${r[1].p.toFixed(2)}$. Less elastic market gets higher price.` };
        },
      },
      {
        key: "v", title: "Phase v — Welfare summary", timeSec: 60,
        type: "choice",
        fields: [
          { id: "best", label: "Which combination MAXIMISES total welfare across all settings?",
            options: [
              "Unregulated monopoly, no PD",
              "Marginal-cost regulation, full PD",
              "Marginal-cost pricing of the original good (single market, $P = MC + MEC$ with corrective tax)",
              "Monopoly with Pigouvian tax exactly at $MEC$",
            ], correct: 2 },
        ],
        grade(letter, a) {
          return { targets: { best: 2 },
            scoreEach: (ans) => scoreChoice(ans.best, 2),
            summary: `First-best is $P = SMC$ (i.e. $P = MC + MEC$) in a competitive market. PD by a monopolist captures more producer surplus but is generally welfare-ambiguous. Pigouvian on a monopolist alone leaves the monopoly markup intact.` };
        },
      },
    ],
  },
];

export function getApocalypseDay(n) { return APOCALYPSE_DAYS.find(d => d.day === n); }
