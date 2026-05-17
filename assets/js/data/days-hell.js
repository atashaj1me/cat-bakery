// days-hell.js — Surviving Hell Market, the 14-day extended campaign.
//
// Each day has PHASES — 2-4 sequential sub-problems. The player solves each
// in turn; previous-phase numbers carry forward into later phases.
// Tighter tolerances than Vanilla: full credit only within ±tol/2.

import {
  equilibrium, csLinear, psLinear,
  priceCeiling, subsidyToClear, waitingHours,
  perUnitTax, tariffSurplus,
  externalityDriving, monopolyLinear, monopolyWithTax,
  lernerPrice, thirdDegreePD,
  inverseDemand, inverseSupply,
} from "../econ.js";
import {
  cournotDuopoly, stackelbergLeader, quotaTariffEquivalence,
  laffer, externalityMonopolyTax, poolingPremium,
} from "../econ-hell.js";

// ---- scoring (HARDER than Vanilla) ----------------------------------------
function score(your, target, tol) {
  if (!isFinite(your)) return 0;
  const d = Math.abs(your - target);
  if (d <= tol * 0.5) return 100;
  if (d <= tol)       return 80;
  if (d <= 2 * tol)   return 50;
  if (d <= 4 * tol)   return 20;
  return 0;
}
const avg = a => a.reduce((s, x) => s + x, 0) / a.length;

// ---- 14 Hell days ---------------------------------------------------------

export const HELL_DAYS = [
  // ============================================================ DAY 1
  {
    day: 1,
    title: "Two ceilings in one week",
    chapterRef: { id: 2, label: "Ch 18 — price ceilings" },
    weather: { emoji: "🌡️", line: "Bread riots brewing. Mayor experiments." },
    letter: () => ({
      from: "🏛️ Mayor Mittens — Two Decrees",
      body: `
        <p>Bread market: demand $q_d = 30 - p$, supply $q_s = 0.5\\,p$. I shall impose two successive ceilings — first $p_{\\max}^1 = 12$, then a tighter $p_{\\max}^2 = 8$. Report the numbers under each regime.</p>
      `,
      params: { a: 30, b: 1, c: 0, d: 0.5, p1: 12, p2: 8 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Free-market baseline",
        narrative: "Before any ceilings, find the equilibrium.",
        fields: [
          { id: "p_eq", label: "$p^*$ =", tol: 0.4 },
          { id: "q_eq", label: "$q^*$ =", tol: 0.4 },
        ],
        grade(letter) {
          const eq = equilibrium(letter.params);
          return { targets: { p_eq: eq.p, q_eq: eq.q },
            scoreEach: (a) => avg([score(a.p_eq, eq.p, 0.4), score(a.q_eq, eq.q, 0.4)]),
            summary: `$p^* = ${eq.p.toFixed(2)},\\ q^* = ${eq.q.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — First ceiling $p_{\\max} = 12$",
        narrative: "Apply the loose ceiling. Compute shortage and DWL.",
        fields: [
          { id: "short1", label: "Shortage at $p_{\\max}^1$ =", tol: 0.4 },
          { id: "dwl1",   label: "DWL at $p_{\\max}^1$ =", tol: 0.6 },
        ],
        grade(letter) {
          const r = priceCeiling({ ...letter.params, pmax: letter.params.p1 });
          return { targets: { short1: r.shortage, dwl1: r.dwl },
            scoreEach: (a) => avg([score(a.short1, r.shortage, 0.4), score(a.dwl1, r.dwl, 0.6)]),
            summary: `Shortage $= ${r.shortage.toFixed(2)}$, $DWL_1 = ${r.dwl.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Tighter ceiling $p_{\\max} = 8$",
        narrative: "Now the tighter ceiling. DWL grows non-linearly — show me how much.",
        fields: [
          { id: "short2", label: "Shortage at $p_{\\max}^2$ =", tol: 0.4 },
          { id: "dwl2",   label: "DWL at $p_{\\max}^2$ =", tol: 1.0 },
          { id: "ratio",  label: "$DWL_2 / DWL_1$ =", tol: 0.3 },
        ],
        grade(letter, _, prior) {
          const r1 = priceCeiling({ ...letter.params, pmax: letter.params.p1 });
          const r2 = priceCeiling({ ...letter.params, pmax: letter.params.p2 });
          const ratio = r1.dwl > 0 ? r2.dwl / r1.dwl : 0;
          return { targets: { short2: r2.shortage, dwl2: r2.dwl, ratio },
            scoreEach: (a) => avg([
              score(a.short2, r2.shortage, 0.4),
              score(a.dwl2, r2.dwl, 1.0),
              score(a.ratio, ratio, 0.3),
            ]),
            summary: `At $p_{\\max} = 8$: shortage $= ${r2.shortage.toFixed(2)}$, $DWL_2 = ${r2.dwl.toFixed(2)}$. Ratio $= ${ratio.toFixed(2)}\\times$ — tighter ceilings hurt geometrically, not linearly.` };
        },
      },
    ],
  },

  // ============================================================ DAY 2
  {
    day: 2,
    title: "The Queen tightens the screw",
    chapterRef: { id: 2, label: "Ch 19 — tax incidence" },
    weather: { emoji: "👑", line: "A new royal seal in the morning post." },
    letter: () => ({
      from: "👑 Cat Queen Reginald III",
      body: `<p>Bread market: $q_d = 24 - 2p$, $q_s = 4p$. I impose $t = 3$ per loaf. Compute the incidence and the DWL. Then I shall quadruple the tax — report the new DWL.</p>`,
      params: { a: 24, b: 2, c: 0, d: 4, t1: 3, t2: 12 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Incidence at $t = 3$",
        narrative: "Find consumer and producer prices, and each side's burden share.",
        fields: [
          { id: "pc", label: "$p_c$ =", tol: 0.2 },
          { id: "ps", label: "$p_s$ =", tol: 0.2 },
          { id: "share_c", label: "Consumer share (%) =", tol: 2 },
        ],
        grade(letter) {
          const r = perUnitTax({ ...letter.params, t: letter.params.t1 });
          // Consumer share of burden = b/(b+d) since |slope_demand_inverted| matters
          const shareC = (letter.params.b / (letter.params.b + letter.params.d)) * 100;
          return { targets: { pc: r.pc, ps: r.ps, share_c: shareC },
            scoreEach: (a) => avg([score(a.pc, r.pc, 0.2), score(a.ps, r.ps, 0.2), score(a.share_c, shareC, 2)]),
            summary: `$p_c = ${r.pc.toFixed(2)},\\ p_s = ${r.ps.toFixed(2)}$. Consumer share $= b/(b+d) = ${shareC.toFixed(1)}\\%$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — DWL at $t = 3$",
        narrative: "Compute the deadweight loss triangle.",
        fields: [
          { id: "dwl1", label: "$DWL(t=3)$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = perUnitTax({ ...letter.params, t: letter.params.t1 });
          return { targets: { dwl1: r.dwl },
            scoreEach: (a) => score(a.dwl1, r.dwl, 0.3),
            summary: `$DWL(3) = ${r.dwl.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Quadruple the tax",
        narrative: "Now $t = 12$. DWL grows as $t^2$. Predict the new DWL and verify the ratio.",
        fields: [
          { id: "dwl2",  label: "$DWL(t=12)$ =", tol: 1.0 },
          { id: "ratio", label: "$DWL(12)/DWL(3)$ =", tol: 1.0 },
        ],
        grade(letter) {
          const r1 = perUnitTax({ ...letter.params, t: letter.params.t1 });
          const r2 = perUnitTax({ ...letter.params, t: letter.params.t2 });
          const ratio = r2.dwl / r1.dwl;
          return { targets: { dwl2: r2.dwl, ratio },
            scoreEach: (a) => avg([score(a.dwl2, r2.dwl, 1.0), score(a.ratio, ratio, 1.0)]),
            summary: `$DWL(12) = ${r2.dwl.toFixed(2)}$, ratio $= ${ratio.toFixed(1)}\\times$. Quadrupling $t$ $\\Rightarrow$ $16\\times$ DWL (the $t^2$ rule).` };
        },
      },
    ],
  },

  // ============================================================ DAY 3
  {
    day: 3,
    title: "The Laffer curve experiment",
    chapterRef: { id: 2, label: "Ch 19 — optimal revenue tax" },
    weather: { emoji: "📈", line: "The Queen wants more revenue but less protest." },
    letter: () => ({
      from: "👑 Royal Treasury",
      body: `<p>Bread: $q_d = 20 - p$, $q_s = p$ (equal slopes). Find the tax rate that maximises revenue, the revenue at that rate, and the DWL at the peak.</p>`,
      params: { a: 20, b: 1, c: 0, d: 1 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Revenue-maximising tax",
        narrative: "Differentiate $R(t)$. Set to zero.",
        fields: [
          { id: "tStar", label: "$t^*$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = laffer(letter.params);
          return { targets: { tStar: r.tStar },
            scoreEach: (a) => score(a.tStar, r.tStar, 0.3),
            summary: `$t^* = (a - c)/(2b) = ${r.tStar.toFixed(2)}$ for equal slopes (half the no-tax choke wedge).` };
        },
      },
      {
        key: "ii", title: "Phase ii — Revenue at the peak",
        narrative: "Plug $t^*$ back in.",
        fields: [
          { id: "Rmax", label: "$R_{\\max}$ =", tol: 0.6 },
          { id: "q",    label: "Quantity sold at $t^*$ =", tol: 0.4 },
        ],
        grade(letter) {
          const r = laffer(letter.params);
          return { targets: { Rmax: r.revenueMax, q: r.q },
            scoreEach: (a) => avg([score(a.Rmax, r.revenueMax, 0.6), score(a.q, r.q, 0.4)]),
            summary: `$R_{\\max} = ${r.revenueMax.toFixed(2)}$ at $q = ${r.q.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — DWL at the peak",
        narrative: "Maximising revenue is NOT free — there is still a triangle.",
        fields: [
          { id: "dwl", label: "$DWL(t^*)$ =", tol: 0.5 },
        ],
        grade(letter) {
          const r = laffer(letter.params);
          return { targets: { dwl: r.dwlAtPeak },
            scoreEach: (a) => score(a.dwl, r.dwlAtPeak, 0.5),
            summary: `$DWL(t^*) = ${r.dwlAtPeak.toFixed(2)}$. Even at peak revenue, society still loses surplus.` };
        },
      },
    ],
  },

  // ============================================================ DAY 4
  {
    day: 4,
    title: "The choke-price tax",
    chapterRef: { id: 2, label: "Ch 19 — choke wedge" },
    weather: { emoji: "🚫", line: "How much can the Queen tax before trade dies?" },
    letter: () => ({
      from: "👑 Royal Census",
      body: `<p>Bread: $q_d = 30 - 3p$, $q_s = 6p$. What is the smallest $t$ that kills trade entirely? Walk us through it.</p>`,
      params: { a: 30, b: 3, c: 0, d: 6 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Choke and floor prices",
        narrative: "Find the demand choke price (at which $q_d = 0$) and the supply minimum (at which $q_s = 0$).",
        fields: [
          { id: "pChoke", label: "Demand choke $p^c$ =", tol: 0.3 },
          { id: "pMin",   label: "Supply min $p^s$ =", tol: 0.3 },
        ],
        grade(letter) {
          const pc = letter.params.a / letter.params.b;
          const ps = -letter.params.c / letter.params.d;
          return { targets: { pChoke: pc, pMin: ps },
            scoreEach: (a) => avg([score(a.pChoke, pc, 0.3), score(a.pMin, ps, 0.3)]),
            summary: `$p^c = a/b = ${pc.toFixed(2)},\\ p^s = -c/d = ${ps.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Wedge that kills trade",
        narrative: "The tax wedge that drives $q$ to zero.",
        fields: [
          { id: "tKill", label: "Smallest $t$ killing trade =", tol: 0.3 },
        ],
        grade(letter) {
          const tKill = letter.params.a / letter.params.b - (-letter.params.c / letter.params.d);
          return { targets: { tKill },
            scoreEach: (a) => score(a.tKill, tKill, 0.3),
            summary: `$t^{\\text{kill}} = p^c - p^s = ${tKill.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — DWL at the kill point",
        narrative: "When trade vanishes, ALL gains from trade are lost. Compute that triangle.",
        fields: [
          { id: "dwlMax", label: "$DWL$ at $t = t^{\\text{kill}}$ =", tol: 1.0 },
        ],
        grade(letter) {
          // DWL_max = total no-tax surplus = ½ × q* × (p_choke − p_min)
          const eq = equilibrium(letter.params);
          const pc = letter.params.a / letter.params.b;
          const ps = -letter.params.c / letter.params.d;
          const dwlMax = 0.5 * eq.q * (pc - ps);
          return { targets: { dwlMax },
            scoreEach: (a) => score(a.dwlMax, dwlMax, 1.0),
            summary: `$DWL^{\\max} = \\frac{1}{2} q^* (p^c - p^s) = ${dwlMax.toFixed(2)}$ — the entire surplus.` };
        },
      },
    ],
  },

  // ============================================================ DAY 5
  {
    day: 5,
    title: "Quota or tariff?",
    chapterRef: { id: 3, label: "Ch 20 — quota vs tariff" },
    weather: { emoji: "📦", line: "The Queen weighs two trade policies." },
    letter: () => ({
      from: "🐅 Trade Minister Tabby",
      body: `<p>Domestic: $q_d = 26 - p$, $q_s = 0.4\\,p$. World price $p^* = 16$. The Queen considers a tariff $t = 3$ vs an equivalent quota. Show the equivalence and identify who captures the rent.</p>`,
      params: { a: 26, b: 1, c: 0, d: 0.4, pStar: 16, t: 3 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Tariff outcome",
        narrative: "Domestic price + imports.",
        fields: [
          { id: "pT", label: "Domestic price under tariff $p_t$ =", tol: 0.2 },
          { id: "M",  label: "Imports under tariff $M$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = quotaTariffEquivalence(letter.params);
          return { targets: { pT: r.pT, M: r.imports },
            scoreEach: (a) => avg([score(a.pT, r.pT, 0.2), score(a.M, r.imports, 0.3)]),
            summary: `$p_t = p^* + t = ${r.pT.toFixed(2)},\\ M = ${r.imports.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Equivalent quota size",
        narrative: "What quota would produce the same imported quantity?",
        fields: [
          { id: "Q", label: "Quota $Q$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = quotaTariffEquivalence(letter.params);
          return { targets: { Q: r.quotaSize },
            scoreEach: (a) => score(a.Q, r.quotaSize, 0.3),
            summary: `Quota $Q^* = M = ${r.quotaSize.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Quota rent",
        narrative: "The rectangle $t \\cdot Q$ goes to government under a tariff. Under a quota, it goes to whoever holds the licence.",
        fields: [
          { id: "rentDomestic", label: "Rent if Queen auctions licences =", tol: 0.3 },
          { id: "rentForeign",  label: "Rent if foreign exporters granted licences =", tol: 0.3 },
        ],
        grade(letter) {
          const r = quotaTariffEquivalence(letter.params);
          return { targets: { rentDomestic: r.quotaRentDomestic, rentForeign: r.quotaRentForeign },
            scoreEach: (a) => avg([score(a.rentDomestic, r.quotaRentDomestic, 0.3),
                                    score(a.rentForeign, r.quotaRentForeign, 0.3)]),
            summary: `Both rents $= t \\cdot Q = ${r.quotaRentDomestic.toFixed(2)}$. The difference is WHO collects it.` };
        },
      },
    ],
  },

  // ============================================================ DAY 6
  {
    day: 6,
    title: "Felinia's terms of trade",
    chapterRef: { id: 3, label: "Ch 20 — tariff welfare" },
    weather: { emoji: "🌍", line: "Cross-border ledger arrives by carrier-cat." },
    letter: () => ({
      from: "🐅 Trade Minister Tabby",
      body: `<p>Importer Whiskerton: $q_d = 26 - p$, $q_s = 0.4\\,p$. World price $p^* = 16$. Tariff $t = 4$. Compute the two DWL triangles separately.</p>`,
      params: { B: { a: 26, b: 1, c: 0, d: 0.4 }, pStar: 16, t: 4 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Free-trade imports",
        narrative: "At world price.",
        fields: [
          { id: "M_ft", label: "Imports under free trade =", tol: 0.4 },
        ],
        grade(letter) {
          const { B, pStar } = letter.params;
          const M = (B.a - B.b * pStar) - (B.c + B.d * pStar);
          return { targets: { M_ft: M },
            scoreEach: (a) => score(a.M_ft, M, 0.4),
            summary: `$M_{ft} = q_d(p^*) - q_s(p^*) = ${M.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Under tariff: CS, PS, revenue",
        narrative: "Domestic price rises to $p^* + t$.",
        fields: [
          { id: "cs",  label: "CS =", tol: 1 },
          { id: "ps",  label: "PS =", tol: 1 },
          { id: "rev", label: "Revenue =", tol: 1 },
        ],
        grade(letter) {
          const r = tariffSurplus({ marketA: { a: 20, b: 1, c: 0, d: 0.5 }, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { cs: r.B.tariff.CS, ps: r.B.tariff.PS, rev: r.B.tariff.Rev },
            scoreEach: (a) => avg([
              score(a.cs, r.B.tariff.CS, 1),
              score(a.ps, r.B.tariff.PS, 1),
              score(a.rev, r.B.tariff.Rev, 1),
            ]),
            summary: `Tariff: $CS = ${r.B.tariff.CS.toFixed(2)},\\ PS = ${r.B.tariff.PS.toFixed(2)},\\ Rev = ${r.B.tariff.Rev.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Two DWL triangles",
        narrative: "Production distortion (between $q_s^{ft}$ and $q_s^{t}$) and consumption distortion (between $q_d^{ft}$ and $q_d^{t}$). Compute each.",
        fields: [
          { id: "dwl_prod", label: "Production-side DWL =", tol: 0.6 },
          { id: "dwl_cons", label: "Consumption-side DWL =", tol: 0.6 },
        ],
        grade(letter) {
          const { B, pStar, t } = letter.params;
          const qd_ft = B.a - B.b * pStar;
          const qd_t  = B.a - B.b * (pStar + t);
          const qs_ft = B.c + B.d * pStar;
          const qs_t  = B.c + B.d * (pStar + t);
          const dwlProd = 0.5 * (qs_t - qs_ft) * t;
          const dwlCons = 0.5 * (qd_ft - qd_t) * t;
          return { targets: { dwl_prod: dwlProd, dwl_cons: dwlCons },
            scoreEach: (a) => avg([score(a.dwl_prod, dwlProd, 0.6), score(a.dwl_cons, dwlCons, 0.6)]),
            summary: `Production DWL $= ${dwlProd.toFixed(2)}$, Consumption DWL $= ${dwlCons.toFixed(2)}$. Sum is the total tariff loss.` };
        },
      },
    ],
  },

  // ============================================================ DAY 7
  {
    day: 7,
    title: "Driving and smoking",
    chapterRef: { id: 4, label: "Ch 21 — Pigouvian" },
    weather: { emoji: "🚗💨", line: "Two pollutants, one bakery." },
    letter: () => ({
      from: "🚒 Whiskerton Air Board",
      body: `<p>Your utility: $u(d) = 10 d - d^2 - \\gamma_1 h_1 - \\gamma_2 h_2$ with $h_1 = h_2 = d$, $\\gamma_1 = 1.5,\\ \\gamma_2 = 0.5$. Find Nash, social, and the Pigouvian tax.</p>`,
      params: { alpha: 10, gamma1: 1.5, gamma2: 0.5 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Nash and social",
        fields: [
          { id: "dN", label: "$d_N$ (Nash) =", tol: 0.2 },
          { id: "dS", label: "$d_S$ (social) =", tol: 0.2 },
        ],
        grade(letter) {
          const { alpha, gamma1, gamma2 } = letter.params;
          const gamma = gamma1 + gamma2;
          const dN = alpha / 2;
          const dS = (alpha - gamma) / 2;
          return { targets: { dN, dS },
            scoreEach: (a) => avg([score(a.dN, dN, 0.2), score(a.dS, dS, 0.2)]),
            summary: `$d_N = \\alpha/2 = ${dN}$, $d_S = (\\alpha - \\gamma_1 - \\gamma_2)/2 = ${dS}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Pigouvian tax",
        fields: [
          { id: "tStar", label: "$t^*$ =", tol: 0.2 },
        ],
        grade(letter) {
          const { gamma1, gamma2 } = letter.params;
          const t = gamma1 + gamma2;
          return { targets: { tStar: t },
            scoreEach: (a) => score(a.tStar, t, 0.2),
            summary: `$t^* = \\gamma_1 + \\gamma_2 = ${t}$. Add up the externalities.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Verify MSC = MSB",
        narrative: "At $d_S$, check that MSC equals MSB.",
        fields: [
          { id: "msc", label: "MSC at $d_S$ =", tol: 0.2 },
          { id: "msb", label: "MSB at $d_S$ =", tol: 0.2 },
        ],
        grade(letter) {
          const { alpha, gamma1, gamma2 } = letter.params;
          const gamma = gamma1 + gamma2;
          const dS = (alpha - gamma) / 2;
          const msc = 2 * dS + gamma;
          const msb = alpha;
          return { targets: { msc, msb },
            scoreEach: (a) => avg([score(a.msc, msc, 0.2), score(a.msb, msb, 0.2)]),
            summary: `At $d_S$: MSC $= 2 d_S + \\gamma = ${msc}$, MSB $= \\alpha = ${msb}$. Both equal ⇒ social optimum.` };
        },
      },
    ],
  },

  // ============================================================ DAY 8
  {
    day: 8,
    title: "Two market failures collide",
    chapterRef: { id: 6, label: "Ch 21 + 23" },
    weather: { emoji: "⚡", line: "A monopolist who pollutes. Subsidy or tax?" },
    letter: () => ({
      from: "🎩 Baron's smoking oven",
      body: `<p>Demand $p = 30 - q$, monopoly $MC = 4$, marginal external cost $MEC = 3$. Find monopoly $q$, social optimum $q$, and the corrective tax.</p>`,
      params: { alpha: 30, beta: 1, mc: 4, mec: 3 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Monopoly $q_M$",
        fields: [
          { id: "qM", label: "$q_M$ =", tol: 0.3 },
          { id: "pM", label: "$p_M$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = monopolyLinear(letter.params);
          return { targets: { qM: r.q, pM: r.p },
            scoreEach: (a) => avg([score(a.qM, r.q, 0.3), score(a.pM, r.p, 0.3)]),
            summary: `Monopoly: $q_M = (\\alpha - MC)/(2\\beta) = ${r.q.toFixed(2)},\\ p_M = ${r.p.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Social optimum $q_S$",
        narrative: "Social planner sets $p = MC + MEC$.",
        fields: [
          { id: "qS", label: "$q_S$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = externalityMonopolyTax(letter.params);
          return { targets: { qS: r.qSocial },
            scoreEach: (a) => score(a.qS, r.qSocial, 0.3),
            summary: `$q_S = (\\alpha - MC - MEC)/\\beta = ${r.qSocial.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Corrective tax (or subsidy!)",
        narrative: "If $q_M < q_S$, the corrective wedge is NEGATIVE.",
        fields: [
          { id: "tau", label: "$\\tau$ (positive = tax, negative = subsidy) =", tol: 0.5 },
        ],
        grade(letter) {
          const r = externalityMonopolyTax(letter.params);
          return { targets: { tau: r.correctiveTax },
            scoreEach: (a) => score(a.tau, r.correctiveTax, 0.5),
            summary: `$\\tau = MR(q_S) - MC = ${r.correctiveTax.toFixed(2)}$. ${r.correctiveTax < 0 ? "Monopoly underproduces socially ⇒ SUBSIDY." : "Monopoly overproduces socially ⇒ tax."}` };
        },
      },
    ],
  },

  // ============================================================ DAY 9
  {
    day: 9,
    title: "Akerlof's pool, two types",
    chapterRef: { id: 5, label: "Ch 22 — adverse selection" },
    weather: { emoji: "🩺", line: "An insurance pamphlet arrives." },
    letter: () => ({
      from: "🏥 Whiskerton Mutual",
      body: `<p>Two cat-types: low risk $\\pi_L = 0.1$, high risk $\\pi_H = 0.5$, loss $L = 100$. Fraction high-risk $\\theta_H = 0.4$. Analyse the pool.</p>`,
      params: { piL: 0.1, piH: 0.5, loss: 100, thetaH: 0.4 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Fair premiums",
        fields: [
          { id: "fairL", label: "Fair premium low-risk =", tol: 1 },
          { id: "fairH", label: "Fair premium high-risk =", tol: 1 },
        ],
        grade(letter) {
          const r = poolingPremium(letter.params);
          return { targets: { fairL: r.fairL, fairH: r.fairH },
            scoreEach: (a) => avg([score(a.fairL, r.fairL, 1), score(a.fairH, r.fairH, 1)]),
            summary: `Fair: low $= \\pi_L L = ${r.fairL}$, high $= \\pi_H L = ${r.fairH}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Pooling premium",
        fields: [
          { id: "pool", label: "Pool premium =", tol: 1.5 },
        ],
        grade(letter) {
          const r = poolingPremium(letter.params);
          return { targets: { pool: r.pool },
            scoreEach: (a) => score(a.pool, r.pool, 1.5),
            summary: `Pool $= [\\theta_H \\pi_H + (1-\\theta_H) \\pi_L] L = ${r.pool}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Unraveling threshold",
        narrative: "Above what $\\theta_H$ does the pool price exceed the low-risk fair premium MULTIPLE — i.e. exit threshold?",
        fields: [
          { id: "thetaCrit", label: "Critical $\\theta_H$ for low-risk exit (assume they exit if pool > $\\pi_L \\cdot L \\cdot 1.5$) =", tol: 0.05 },
        ],
        grade(letter) {
          const { piL, piH } = letter.params;
          // pool > 1.5 · piL · L  ⇒  θ·πH + (1−θ)·πL > 1.5·πL  ⇒  θ(πH − πL) > 0.5·πL
          //   ⇒  θ > 0.5·πL / (πH − πL)
          const thetaCrit = (0.5 * piL) / (piH - piL);
          return { targets: { thetaCrit },
            scoreEach: (a) => score(a.thetaCrit, thetaCrit, 0.05),
            summary: `$\\theta_H^{\\text{crit}} = \\frac{0.5 \\pi_L}{\\pi_H - \\pi_L} = ${thetaCrit.toFixed(3)}$. Above this, low-risk exit.` };
        },
      },
    ],
  },

  // ============================================================ DAY 10
  {
    day: 10,
    title: "Cournot night",
    chapterRef: { id: 6, label: "Ch 23 — duopoly" },
    weather: { emoji: "🐈‍⬛🎩", line: "You and Baron, two ovens, one demand curve." },
    letter: () => ({
      from: "🎩 Baron Whiskerton — Duel Invitation",
      body: `<p>Demand $p = 30 - q$ where $q = q_A + q_B$. We each have $MC = 6$. Find your reaction function, Baron's reaction, and the Cournot Nash equilibrium.</p>`,
      params: { alpha: 30, beta: 1, mcA: 6, mcB: 6 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Your reaction $q_A(q_B)$ at $q_B = 6$",
        narrative: "Compute YOUR best response when Baron is producing 6.",
        fields: [
          { id: "qA_resp", label: "$q_A^{BR}(6)$ =", tol: 0.3 },
        ],
        grade(letter) {
          const { alpha, beta, mcA } = letter.params;
          const qA = (alpha - mcA - beta * 6) / (2 * beta);
          return { targets: { qA_resp: qA },
            scoreEach: (a) => score(a.qA_resp, qA, 0.3),
            summary: `$q_A^{BR}(q_B) = \\frac{\\alpha - mc_A - \\beta q_B}{2\\beta} = ${qA.toFixed(2)}$ when $q_B = 6$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Cournot Nash",
        narrative: "Solve the system of reactions.",
        fields: [
          { id: "qA", label: "$q_A^*$ =", tol: 0.3 },
          { id: "qB", label: "$q_B^*$ =", tol: 0.3 },
          { id: "p",  label: "$p^*$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = cournotDuopoly(letter.params);
          return { targets: { qA: r.qA, qB: r.qB, p: r.p },
            scoreEach: (a) => avg([score(a.qA, r.qA, 0.3), score(a.qB, r.qB, 0.3), score(a.p, r.p, 0.3)]),
            summary: `Cournot: $q_A^* = q_B^* = \\frac{\\alpha - mc}{3\\beta} = ${r.qA.toFixed(2)}$, $p = ${r.p.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Compare to monopoly and competition",
        narrative: "Compute monopoly $q$ and competitive $q$ (where $p = MC$) for context.",
        fields: [
          { id: "qMono", label: "Monopoly $q$ =", tol: 0.3 },
          { id: "qComp", label: "Competitive $q$ (at $p = MC$) =", tol: 0.3 },
          { id: "qCournotTotal", label: "Cournot total $Q$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = cournotDuopoly(letter.params);
          const m = monopolyLinear({ alpha: letter.params.alpha, beta: letter.params.beta, mc: letter.params.mcA });
          const qComp = (letter.params.alpha - letter.params.mcA) / letter.params.beta;
          const QCournot = r.qA + r.qB;
          return { targets: { qMono: m.q, qComp, qCournotTotal: QCournot },
            scoreEach: (a) => avg([score(a.qMono, m.q, 0.3), score(a.qComp, qComp, 0.3), score(a.qCournotTotal, QCournot, 0.3)]),
            summary: `Monopoly $q = ${m.q.toFixed(2)}$ &lt; Cournot total $${QCournot.toFixed(2)}$ &lt; Competition $${qComp.toFixed(2)}$. Cournot is intermediate.` };
        },
      },
    ],
  },

  // ============================================================ DAY 11
  {
    day: 11,
    title: "Stackelberg morning",
    chapterRef: { id: 6, label: "Ch 23 — Stackelberg" },
    weather: { emoji: "♟️", line: "You move first. Baron observes, then chooses." },
    letter: () => ({
      from: "🐈‍⬛ Strategic Advisor",
      body: `<p>Same demand $p = 30 - q$, same $MC = 6$ for both. Today YOU commit to $q_L$ first; Baron then plays best response. Backward-induct.</p>`,
      params: { alpha: 30, beta: 1, mcL: 6, mcF: 6 },
    }),
    phases: [
      {
        key: "i", title: "Phase i — Baron's reaction $q_F(q_L)$ at $q_L = 8$",
        fields: [
          { id: "qF_at_8", label: "$q_F(8)$ =", tol: 0.3 },
        ],
        grade(letter) {
          const { alpha, beta, mcF } = letter.params;
          const qF = (alpha - mcF - beta * 8) / (2 * beta);
          return { targets: { qF_at_8: qF },
            scoreEach: (a) => score(a.qF_at_8, qF, 0.3),
            summary: `$q_F(8) = \\frac{\\alpha - mc_F - \\beta \\cdot 8}{2\\beta} = ${qF.toFixed(2)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Leader's optimal $q_L^*$",
        narrative: "Substitute $q_F(q_L)$ into your profit and maximise.",
        fields: [
          { id: "qL", label: "$q_L^*$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = stackelbergLeader(letter.params);
          return { targets: { qL: r.qL },
            scoreEach: (a) => score(a.qL, r.qL, 0.3),
            summary: `$q_L^* = \\frac{\\alpha - 2mc_L + mc_F}{2\\beta} = ${r.qL.toFixed(2)}$. (Half the monopoly quantity, twice Cournot.)` };
        },
      },
      {
        key: "iii", title: "Phase iii — Profits and Stackelberg vs Cournot",
        fields: [
          { id: "qF",       label: "$q_F^*$ =", tol: 0.3 },
          { id: "p_stack",  label: "$p^*$ =", tol: 0.3 },
          { id: "profitL",  label: "Leader profit =", tol: 1 },
          { id: "profitF",  label: "Follower profit =", tol: 1 },
        ],
        grade(letter) {
          const r = stackelbergLeader(letter.params);
          return { targets: { qF: r.qF, p_stack: r.p, profitL: r.profitL, profitF: r.profitF },
            scoreEach: (a) => avg([
              score(a.qF, r.qF, 0.3), score(a.p_stack, r.p, 0.3),
              score(a.profitL, r.profitL, 1), score(a.profitF, r.profitF, 1),
            ]),
            summary: `$q_F = ${r.qF.toFixed(2)},\\ p = ${r.p.toFixed(2)},\\ \\pi_L = ${r.profitL.toFixed(2)} > \\pi_F = ${r.profitF.toFixed(2)}$. Moving first pays.` };
        },
      },
    ],
  },

  // ============================================================ DAY 12
  {
    day: 12,
    title: "Three markets, three prices",
    chapterRef: { id: 6, label: "Ch 23 — 3rd-deg PD" },
    weather: { emoji: "🌐", line: "You ship to three cat colonies." },
    letter: () => ({
      from: "📦 Export desk",
      body: `<p>$MC = 2$. Three markets: $p_1 = 12 - 0.01\\,q_1$, $p_2 = 10 - 0.02\\,q_2$, $p_3 = 16 - 0.04\\,q_3$. Set the profit-maximising quantity in each.</p>`,
      params: { mc: 2, markets: [
        { name: "M1", alpha: 12, beta: 0.01 },
        { name: "M2", alpha: 10, beta: 0.02 },
        { name: "M3", alpha: 16, beta: 0.04 },
      ]},
    }),
    phases: [
      {
        key: "i", title: "Phase i — Quantities",
        fields: [
          { id: "q1", label: "$q_1$ =", tol: 5 },
          { id: "q2", label: "$q_2$ =", tol: 3 },
          { id: "q3", label: "$q_3$ =", tol: 2 },
        ],
        grade(letter) {
          const r = thirdDegreePD({ markets: letter.params.markets, mc: letter.params.mc });
          return { targets: { q1: r[0].q, q2: r[1].q, q3: r[2].q },
            scoreEach: (a) => avg([score(a.q1, r[0].q, 5), score(a.q2, r[1].q, 3), score(a.q3, r[2].q, 2)]),
            summary: `$q_i^* = \\frac{\\alpha_i - MC}{2\\beta_i}$: $q_1 = ${r[0].q.toFixed(0)},\\ q_2 = ${r[1].q.toFixed(0)},\\ q_3 = ${r[2].q.toFixed(0)}$.` };
        },
      },
      {
        key: "ii", title: "Phase ii — Prices",
        fields: [
          { id: "p1", label: "$p_1$ =", tol: 0.3 },
          { id: "p2", label: "$p_2$ =", tol: 0.3 },
          { id: "p3", label: "$p_3$ =", tol: 0.3 },
        ],
        grade(letter) {
          const r = thirdDegreePD({ markets: letter.params.markets, mc: letter.params.mc });
          return { targets: { p1: r[0].p, p2: r[1].p, p3: r[2].p },
            scoreEach: (a) => avg([score(a.p1, r[0].p, 0.3), score(a.p2, r[1].p, 0.3), score(a.p3, r[2].p, 0.3)]),
            summary: `$p_1 = ${r[0].p.toFixed(2)},\\ p_2 = ${r[1].p.toFixed(2)},\\ p_3 = ${r[2].p.toFixed(2)}$.` };
        },
      },
      {
        key: "iii", title: "Phase iii — Verify Lerner in each market",
        narrative: "$\\frac{p_i - MC}{p_i}$ should equal $1/|\\varepsilon_i|$ in each market.",
        fields: [
          { id: "lerner1", label: "Lerner in M1 =", tol: 0.05 },
          { id: "lerner2", label: "Lerner in M2 =", tol: 0.05 },
          { id: "lerner3", label: "Lerner in M3 =", tol: 0.05 },
        ],
        grade(letter) {
          const r = thirdDegreePD({ markets: letter.params.markets, mc: letter.params.mc });
          const ls = r.map(m => (m.p - letter.params.mc) / m.p);
          return { targets: { lerner1: ls[0], lerner2: ls[1], lerner3: ls[2] },
            scoreEach: (a) => avg([score(a.lerner1, ls[0], 0.05), score(a.lerner2, ls[1], 0.05), score(a.lerner3, ls[2], 0.05)]),
            summary: `Lerners: ${ls.map(x => x.toFixed(3)).join(", ")}. Higher Lerner ⇒ less elastic market.` };
        },
      },
    ],
  },

  // ============================================================ DAY 13 — Essay 1 rehearsal
  {
    day: 13,
    title: "Essay 1 rehearsal — price ceiling welfare",
    chapterRef: { id: 2, label: "Ch 18 essay archetype" },
    weather: { emoji: "📝", line: "The Royal Examiners hand you Essay 1. No hints." },
    letter: () => ({
      from: "🏛️ Royal Examination Bureau",
      body: `<p>Bread market: $q_d = 26 - p$, $q_s = 0.3 p$. Quasilinear consumers. Ceiling $p_{\\max} = 10$. Opportunity cost of waiting $w_h = 4$ cents/hour. Solve all seven parts.</p>`,
      params: { a: 26, b: 1, c: 0, d: 0.3, pmax: 10, wage: 4 },
    }),
    phases: [
      {
        key: "a", title: "Part (a) — Equilibrium",
        fields: [
          { id: "p_eq", label: "$p^*$ =", tol: 0.2 },
          { id: "q_eq", label: "$q^*$ =", tol: 0.2 },
        ],
        grade(letter) {
          const eq = equilibrium(letter.params);
          return { targets: { p_eq: eq.p, q_eq: eq.q },
            scoreEach: (a) => avg([score(a.p_eq, eq.p, 0.2), score(a.q_eq, eq.q, 0.2)]),
            summary: `$p^* = 20,\\ q^* = 6$.` };
        },
      },
      {
        key: "b", title: "Part (b) — Shortage",
        fields: [
          { id: "qd", label: "$q_d$ at $p_{\\max}$ =", tol: 0.2 },
          { id: "qs", label: "$q_s$ at $p_{\\max}$ =", tol: 0.2 },
          { id: "shortage", label: "Shortage =", tol: 0.2 },
        ],
        grade(letter) {
          const r = priceCeiling(letter.params);
          return { targets: { qd: r.qd, qs: r.qs, shortage: r.shortage },
            scoreEach: (a) => avg([score(a.qd, r.qd, 0.2), score(a.qs, r.qs, 0.2), score(a.shortage, r.shortage, 0.2)]),
            summary: `$q_d = 16,\\ q_s = 3$, shortage $= 13$.` };
        },
      },
      {
        key: "c", title: "Part (c) — DWL of ceiling",
        fields: [
          { id: "dwl", label: "$DWL$ =", tol: 0.4 },
        ],
        grade(letter) {
          const r = priceCeiling(letter.params);
          return { targets: { dwl: r.dwl },
            scoreEach: (a) => score(a.dwl, r.dwl, 0.4),
            summary: `$DWL = \\frac{1}{2}(q^* - q_s)(D(q_s) - p_{\\max}) = ${r.dwl.toFixed(2)}$.` };
        },
      },
      {
        key: "d", title: "Part (d) — Per-unit subsidy to clear shortage",
        fields: [
          { id: "ps", label: "Producer price $p_s$ needed =", tol: 0.4 },
          { id: "sub", label: "Subsidy size =", tol: 0.4 },
        ],
        grade(letter) {
          const r = subsidyToClear(letter.params);
          return { targets: { ps: r.ps, sub: r.subsidy },
            scoreEach: (a) => avg([score(a.ps, r.ps, 0.4), score(a.sub, r.subsidy, 0.4)]),
            summary: `$p_s = q_d(p_{\\max})/d = ${r.ps.toFixed(2)}$, subsidy $= ${r.subsidy.toFixed(2)}$.` };
        },
      },
      {
        key: "e", title: "Part (e) — DWL of the subsidy itself",
        narrative: "The subsidy overproduces. Compute its own DWL.",
        fields: [
          { id: "dwlSub", label: "Subsidy DWL =", tol: 2 },
        ],
        grade(letter) {
          const r = subsidyToClear(letter.params);
          return { targets: { dwlSub: r.dwlSubsidy },
            scoreEach: (a) => score(a.dwlSub, r.dwlSubsidy, 2),
            summary: `Subsidy DWL $= ${r.dwlSubsidy.toFixed(2)}$ — an order of magnitude worse than the ceiling alone.` };
        },
      },
      {
        key: "f", title: "Part (f) — Efficiency verdict",
        narrative: "Should the prince subsidise?",
        fields: [
          { id: "dwlGap", label: "Subsidy DWL − Ceiling DWL =", tol: 2 },
        ],
        grade(letter) {
          const r1 = priceCeiling(letter.params);
          const r2 = subsidyToClear(letter.params);
          const gap = r2.dwlSubsidy - r1.dwl;
          return { targets: { dwlGap: gap },
            scoreEach: (a) => score(a.dwlGap, gap, 2),
            summary: `Gap $= ${gap.toFixed(2)}$ — subsidising is strictly worse on efficiency grounds.` };
        },
      },
      {
        key: "g", title: "Part (g) — Quasilinear waiting time",
        fields: [
          { id: "h", label: "Waiting hours $h$ =", tol: 0.15 },
        ],
        grade(letter) {
          const h = waitingHours(letter.params);
          return { targets: { h },
            scoreEach: (a) => score(a.h, h, 0.15),
            summary: `Marginal consumer indifferent: $p_{\\max} + w_h \\cdot h = WTP$ at $q_s$, giving $h = ${h.toFixed(2)}$ hours.` };
        },
      },
    ],
  },

  // ============================================================ DAY 14 — Essay 2 rehearsal
  {
    day: 14,
    title: "Essay 2 rehearsal — tariff surplus table",
    chapterRef: { id: 3, label: "Ch 20 essay archetype" },
    weather: { emoji: "📊", line: "The 24-cell table. No hints." },
    letter: () => ({
      from: "🏛️ Royal Examination Bureau",
      body: `<p>Two markets. A (exporter): $q_d = 20 - p$, $q_s = 0.5 p$. B (importer): $q_d = 26 - p$, $q_s = 0.4 p$. World price $p^* = 16$. Tariff $t = 2$. Fill the table.</p>`,
      params: {
        A: { a: 20, b: 1, c: 0, d: 0.5 },
        B: { a: 26, b: 1, c: 0, d: 0.4 },
        pStar: 16, t: 2,
      },
    }),
    phases: [
      {
        key: "A_nt", title: "A — autarky",
        fields: [
          { id: "csA_nt", label: "$CS_A^{nt}$ =", tol: 1.5 },
          { id: "psA_nt", label: "$PS_A^{nt}$ =", tol: 1.5 },
          { id: "totA_nt", label: "Total$_A^{nt}$ =", tol: 2 },
        ],
        grade(letter) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { csA_nt: r.A.noTrade.CS, psA_nt: r.A.noTrade.PS, totA_nt: r.A.noTrade.Total },
            scoreEach: (a) => avg([
              score(a.csA_nt, r.A.noTrade.CS, 1.5),
              score(a.psA_nt, r.A.noTrade.PS, 1.5),
              score(a.totA_nt, r.A.noTrade.Total, 2),
            ]),
            summary: `A autarky: CS$=${r.A.noTrade.CS.toFixed(2)}$, PS$=${r.A.noTrade.PS.toFixed(2)}$, Total$=${r.A.noTrade.Total.toFixed(2)}$.` };
        },
      },
      {
        key: "A_ft", title: "A — free trade",
        fields: [
          { id: "csA_ft", label: "$CS_A^{ft}$ =", tol: 1 },
          { id: "psA_ft", label: "$PS_A^{ft}$ =", tol: 1 },
          { id: "totA_ft", label: "Total$_A^{ft}$ =", tol: 2 },
        ],
        grade(letter) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: { csA_ft: r.A.freeTrade.CS, psA_ft: r.A.freeTrade.PS, totA_ft: r.A.freeTrade.Total },
            scoreEach: (a) => avg([
              score(a.csA_ft, r.A.freeTrade.CS, 1),
              score(a.psA_ft, r.A.freeTrade.PS, 1),
              score(a.totA_ft, r.A.freeTrade.Total, 2),
            ]),
            summary: `A free trade: CS$=${r.A.freeTrade.CS.toFixed(2)}$, PS$=${r.A.freeTrade.PS.toFixed(2)}$, Total$=${r.A.freeTrade.Total.toFixed(2)}$.` };
        },
      },
      {
        key: "B_all", title: "B — three regimes (12 cells)",
        narrative: "Importer side, all regimes at once.",
        fields: [
          { id: "csB_nt",   label: "$CS_B^{nt}$ =", tol: 1.5 },
          { id: "psB_nt",   label: "$PS_B^{nt}$ =", tol: 1.5 },
          { id: "csB_ft",   label: "$CS_B^{ft}$ =", tol: 1 },
          { id: "psB_ft",   label: "$PS_B^{ft}$ =", tol: 1 },
          { id: "csB_t",    label: "$CS_B^{t}$ =", tol: 1 },
          { id: "psB_t",    label: "$PS_B^{t}$ =", tol: 1 },
          { id: "revB_t",   label: "Revenue$_B^{t}$ =", tol: 0.5 },
        ],
        grade(letter) {
          const r = tariffSurplus({ marketA: letter.params.A, marketB: letter.params.B, pStar: letter.params.pStar, t: letter.params.t });
          return { targets: {
              csB_nt: r.B.noTrade.CS, psB_nt: r.B.noTrade.PS,
              csB_ft: r.B.freeTrade.CS, psB_ft: r.B.freeTrade.PS,
              csB_t: r.B.tariff.CS, psB_t: r.B.tariff.PS, revB_t: r.B.tariff.Rev,
            },
            scoreEach: (a) => avg([
              score(a.csB_nt, r.B.noTrade.CS, 1.5), score(a.psB_nt, r.B.noTrade.PS, 1.5),
              score(a.csB_ft, r.B.freeTrade.CS, 1), score(a.psB_ft, r.B.freeTrade.PS, 1),
              score(a.csB_t, r.B.tariff.CS, 1), score(a.psB_t, r.B.tariff.PS, 1),
              score(a.revB_t, r.B.tariff.Rev, 0.5),
            ]),
            summary: `B all three regimes graded.` };
        },
      },
    ],
  },
];

export function getHellDay(n) { return HELL_DAYS.find(d => d.day === n); }
