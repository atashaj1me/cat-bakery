// econ.js — pure microeconomic formulas. No DOM. Test in console.
//
// Convention: linear demand  q = a − b·p   (so p_choke = a/b, slope dq/dp = −b)
//             linear supply  q = c + d·p   (slope dq/dp = +d)
//
// All formulas mirror the vault: PreMidterm Refresh, Ch14/15/19/20/21/22/23 concept notes,
// and the worked examples for tax incidence, DWL convexity, Pigouvian, Lerner, monopoly+tax.

// --- Competitive equilibrium ------------------------------------------------

export function equilibrium({ a, b, c = 0, d }) {
  // a − b·p = c + d·p  →  p* = (a − c)/(b + d)
  const p = (a - c) / (b + d);
  const q = a - b * p;
  return { p, q };
}

// Inverse demand: p = (a − q)/b
export function inverseDemand(q, { a, b }) {
  return (a - q) / b;
}

// Inverse supply: p = (q − c)/d
export function inverseSupply(q, { c = 0, d }) {
  return (q - c) / d;
}

// --- Consumer & producer surplus (CS, PS) ----------------------------------
//
// Triangle areas under linear demand/supply at price p over quantity q.

export function csLinear({ a, b, p }) {
  // CS = ½·(p_choke − p)·q   with q = a − b·p
  const q = Math.max(0, a - b * p);
  const pChoke = a / b;
  return 0.5 * Math.max(0, pChoke - p) * q;
}

export function psLinear({ c = 0, d, p }) {
  // PS = ½·(p − p_min)·q   with p_min = max(0, −c/d) and q = c + d·p
  const q = Math.max(0, c + d * p);
  const pMin = Math.max(0, -c / d);
  return 0.5 * Math.max(0, p - pMin) * q;
}

// --- Price ceiling DWL (Essay 1 archetype) ---------------------------------

export function priceCeiling({ a, b, c = 0, d, pmax }) {
  const eq = equilibrium({ a, b, c, d });
  const qd = a - b * pmax;            // quantity demanded at ceiling
  const qs = c + d * pmax;             // quantity supplied at ceiling
  const traded = Math.min(qd, qs);     // shortage means traded = qs
  const shortage = Math.max(0, qd - qs);
  // DWL triangle between qs and q* with height = D(qs) − S(qs)
  const pAtQs_d = inverseDemand(qs, { a, b });
  const pAtQs_s = inverseSupply(qs, { c, d });
  const dwl = 0.5 * Math.max(0, eq.q - qs) * Math.max(0, pAtQs_d - pAtQs_s);
  return { eq, qd, qs, traded, shortage, dwl, pAtQs_d, pAtQs_s };
}

// Subsidy that clears the shortage: find ps so qs(ps) = qd(pmax).
export function subsidyToClear({ a, b, c = 0, d, pmax }) {
  const qdAtCeiling = a - b * pmax;
  const ps = (qdAtCeiling - c) / d;
  const subsidy = ps - pmax;
  // The subsidy's own DWL: triangle between q* (eq) and qdAtCeiling
  const eq = equilibrium({ a, b, c, d });
  const heightAtTarget = inverseSupply(qdAtCeiling, { c, d }) - inverseDemand(qdAtCeiling, { a, b });
  const dwlSubsidy = 0.5 * Math.max(0, qdAtCeiling - eq.q) * Math.max(0, heightAtTarget);
  return { ps, subsidy, dwlSubsidy, qCleared: qdAtCeiling };
}

// Quasilinear waiting time: pmax + wage·h = WTP_marginal at q^s.
export function waitingHours({ a, b, c = 0, d, pmax, wage }) {
  const qs = c + d * pmax;
  const wtp = inverseDemand(qs, { a, b });
  return (wtp - pmax) / wage;
}

// --- Taxes ------------------------------------------------------------------
// Per-unit tax t. With linear D and S, the tax shifts S up by t.
//   New equilibrium: a − b·p_c = c + d·(p_c − t)
//   p_c − p_s = t.

export function perUnitTax({ a, b, c = 0, d, t }) {
  const noTax = equilibrium({ a, b, c, d });
  // a − b·pc = c + d·(pc − t)  →  pc·(b + d) = a − c + d·t  →  pc = (a − c + d·t)/(b + d)
  const pc = (a - c + d * t) / (b + d);
  const ps = pc - t;
  const q = a - b * pc;
  const consumerBurden = pc - noTax.p;
  const producerBurden = noTax.p - ps;
  const revenue = t * q;
  // DWL = ½·t·(q* − q)
  const dwl = 0.5 * t * Math.max(0, noTax.q - q);
  // Tax incidence shares (consumer fraction = d/(b+d))
  const consumerShare = d / (b + d);
  const producerShare = b / (b + d);
  return { pc, ps, q, q0: noTax.q, p0: noTax.p, consumerBurden, producerBurden,
           revenue, dwl, consumerShare, producerShare };
}

// Choke-price tax: smallest t at which trade collapses (q = 0).
// At t such that pc = a/b (choke). Solve a/b − ps = t and qs(ps) = 0 ⇒ ps = −c/d.
export function chokeTax({ a, b, c = 0, d }) {
  const pChoke = a / b;
  const pSupMin = -c / d;     // price at which supply hits 0
  return pChoke - pSupMin;    // wedge that kills trade
}

// --- Tariffs (Essay 2 archetype) -------------------------------------------
//
// Two markets A (exporter, low autarky price) and B (importer, high autarky price).
// Free trade → world price p* clears net exports = net imports.
// Tariff t imposed by B on imports; world price stays p*, B's domestic price rises to p*+t,
// A's domestic price stays at p* (small-country assumption — we use this simplification
// for the surplus table, matching the Ch20 lecture model in Nechyba where the exporter
// is on the world market). The vault essay also handles a two-large-market version; for
// the game we use the standard pedagogical small-country version: ONLY B's price moves.
//
// CS_B at price p uses B's demand a_B − b_B·p (choke a_B/b_B).
// PS_B at price p uses B's supply c_B + d_B·p (min 0).
// Tariff revenue = t · (imports under tariff) = t · (qd_B(p*+t) − qs_B(p*+t)).

export function tariffSurplus({ marketA, marketB, pStar, t }) {
  // marketA: { a, b, c, d }, marketB likewise
  const A = marketA, B = marketB;

  const autarkyA = equilibrium(A);
  const autarkyB = equilibrium(B);

  // free-trade prices = pStar in both (small-country world price)
  const csA_ft = csLinear({ a: A.a, b: A.b, p: pStar });
  const psA_ft = psLinear({ c: A.c ?? 0, d: A.d, p: pStar });
  const csB_ft = csLinear({ a: B.a, b: B.b, p: pStar });
  const psB_ft = psLinear({ c: B.c ?? 0, d: B.d, p: pStar });
  const importsB_ft = (B.a - B.b * pStar) - ((B.c ?? 0) + B.d * pStar);
  const exportsA_ft = ((A.c ?? 0) + A.d * pStar) - (A.a - A.b * pStar);

  // tariff: B's domestic price = pStar + t
  const pB_t = pStar + t;
  const csA_tar = csLinear({ a: A.a, b: A.b, p: pStar });          // A unchanged in small-country model
  const psA_tar = psLinear({ c: A.c ?? 0, d: A.d, p: pStar });
  const csB_tar = csLinear({ a: B.a, b: B.b, p: pB_t });
  const psB_tar = psLinear({ c: B.c ?? 0, d: B.d, p: pB_t });
  const importsB_tar = Math.max(0, (B.a - B.b * pB_t) - ((B.c ?? 0) + B.d * pB_t));
  const tariffRev = t * importsB_tar;

  // No-trade (autarky) surplus
  const csA_nt = csLinear({ a: A.a, b: A.b, p: autarkyA.p });
  const psA_nt = psLinear({ c: A.c ?? 0, d: A.d, p: autarkyA.p });
  const csB_nt = csLinear({ a: B.a, b: B.b, p: autarkyB.p });
  const psB_nt = psLinear({ c: B.c ?? 0, d: B.d, p: autarkyB.p });

  return {
    autarkyA, autarkyB,
    A: {
      noTrade:  { CS: csA_nt,  PS: psA_nt,  Rev: 0, Total: csA_nt + psA_nt },
      freeTrade:{ CS: csA_ft,  PS: psA_ft,  Rev: 0, Total: csA_ft + psA_ft },
      tariff:   { CS: csA_tar, PS: psA_tar, Rev: 0, Total: csA_tar + psA_tar },
    },
    B: {
      noTrade:  { CS: csB_nt,  PS: psB_nt,  Rev: 0,         Total: csB_nt + psB_nt },
      freeTrade:{ CS: csB_ft,  PS: psB_ft,  Rev: 0,         Total: csB_ft + psB_ft },
      tariff:   { CS: csB_tar, PS: psB_tar, Rev: tariffRev, Total: csB_tar + psB_tar + tariffRev },
    },
    importsB_ft, importsB_tar, exportsA_ft,
  };
}

// --- Monopoly ---------------------------------------------------------------
// Linear demand p = α − β·q (i.e. q = (α − p)/β). MR = α − 2β·q. MC constant.

export function monopolyLinear({ alpha, beta, mc }) {
  // α − 2β·q = mc  →  q = (α − mc)/(2β),  p = α − β·q
  const q = (alpha - mc) / (2 * beta);
  const p = alpha - beta * q;
  const profit = (p - mc) * q;
  return { q, p, profit };
}

export function monopolyWithTax({ alpha, beta, mc, t }) {
  const pre = monopolyLinear({ alpha, beta, mc });
  const post = monopolyLinear({ alpha, beta, mc: mc + t });
  return { pre, post, dP: post.p - pre.p, dQ: post.q - pre.q };
}

// Constant-elasticity monopoly markup: p = MC / (1 − 1/|ε|)
// ε is the (negative) own-price elasticity; we pass |ε|.
export function lernerPrice({ mc, elasticityAbs }) {
  return mc / (1 - 1 / elasticityAbs);
}

// 3rd-degree price discrimination across markets with linear demands p = α − β·q,
// constant MC. In each market: MR = MC → q_i = (α_i − mc)/(2β_i), p_i = α_i − β_i·q_i.
export function thirdDegreePD({ markets, mc }) {
  return markets.map(m => {
    const q = (m.alpha - mc) / (2 * m.beta);
    const p = m.alpha - m.beta * q;
    return { name: m.name, q, p };
  });
}

// --- Externalities ----------------------------------------------------------
// Private FOC vs social FOC for utility u(d, h) = α·d − d² − γ·h, h = d.
// Nash (treats h as constant): du/dd = α − 2d → d_N = α/2.
// Social (h = d): du/dd = α − 2d − γ → d_S = (α − γ)/2.

export function externalityDriving({ alpha, gamma }) {
  const dN = alpha / 2;
  const dS = (alpha - gamma) / 2;
  return { nash: dN, social: dS, pigouvianTax: gamma };
}

// Generic Pigouvian tax = marginal external cost at social optimum.
export function pigouvianTax(mec) { return mec; }

// --- Production / profit max (warm-up chapter) -----------------------------

export function profitOneInput({ a, w, p }) {
  // f(L) = a·√L; π = p·a·√L − w·L; FOC: p·a/(2√L) = w  →  √L = a·p/(2w)
  const L = Math.pow((a * p) / (2 * w), 2);
  const y = a * Math.sqrt(L);
  const profit = p * y - w * L;
  return { L, y, profit };
}

export function profitTwoInput({ a, b, w1, w2, p }) {
  const x1 = Math.pow((a * p) / (2 * w1), 2);
  const x2 = Math.pow((b * p) / (2 * w2), 2);
  const y = a * Math.sqrt(x1) + b * Math.sqrt(x2);
  const profit = p * y - w1 * x1 - w2 * x2;
  return { x1, x2, y, profit };
}

// Cobb-Douglas demand: x* = (α/(α+β))·I/p_x ; y* = (β/(α+β))·I/p_y
export function cobbDouglasDemand({ alpha, beta, I, px, py }) {
  const x = (alpha / (alpha + beta)) * (I / px);
  const y = (beta / (alpha + beta)) * (I / py);
  return { x, y, spend: I };
}

// Linear-demand elasticity at price p: ε = −b·(p/q)
export function linearElasticity({ a, b, p }) {
  const q = a - b * p;
  if (q <= 0) return -Infinity;
  return -b * (p / q);
}

// --- Helpers ----------------------------------------------------------------

export function round(x, n = 2) {
  const k = Math.pow(10, n);
  return Math.round(x * k) / k;
}

export function fmt(x, n = 2) {
  if (!isFinite(x)) return "∞";
  return round(x, n).toLocaleString();
}

if (typeof window !== "undefined") {
  // expose for sanity-testing in browser console
  window.Econ = {
    equilibrium, priceCeiling, subsidyToClear, waitingHours,
    perUnitTax, chokeTax, tariffSurplus,
    monopolyLinear, monopolyWithTax, lernerPrice, thirdDegreePD,
    externalityDriving, pigouvianTax,
    profitOneInput, profitTwoInput, cobbDouglasDemand, linearElasticity,
    csLinear, psLinear, inverseDemand, inverseSupply,
    round, fmt,
  };
}
