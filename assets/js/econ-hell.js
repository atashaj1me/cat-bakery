// econ-hell.js — pure formulas for the Hell Market campaign.
//
// New techniques beyond econ.js:
//   - Cournot duopoly with general linear demand
//   - Stackelberg leader–follower
//   - Tariff / quota equivalence and rent attribution
//   - Laffer-peak revenue-maximising tax
//   - Combined externality + monopoly corrective tax
//   - Separating insurance contract menu

// Linear inverse demand p = α − β·Q where Q = q_A + q_B.
// Best response: q_i = (α − mc_i − β·q_{-i}) / (2β).
// Cournot Nash: q_i = (α − 2·mc_i + mc_{-i}) / (3β).
export function cournotDuopoly({ alpha, beta, mcA, mcB }) {
  const qA = (alpha - 2 * mcA + mcB) / (3 * beta);
  const qB = (alpha - 2 * mcB + mcA) / (3 * beta);
  const Q = qA + qB;
  const p = alpha - beta * Q;
  const profitA = (p - mcA) * qA;
  const profitB = (p - mcB) * qB;
  return { qA, qB, p, Q, profitA, profitB };
}

// Stackelberg with leader L. Follower plays best response qF = (α − mcF − β·qL)/(2β).
// Substituted into leader profit: maximise → qL = (α − 2·mcL + mcF) / (2β).
export function stackelbergLeader({ alpha, beta, mcL, mcF }) {
  const qL = (alpha - 2 * mcL + mcF) / (2 * beta);
  const qF = (alpha - mcF - beta * qL) / (2 * beta);
  const Q = qL + qF;
  const p = alpha - beta * Q;
  const profitL = (p - mcL) * qL;
  const profitF = (p - mcF) * qF;
  return { qL, qF, p, Q, profitL, profitF };
}

// For a small importing country with linear demand q_d = a − b·p, supply q_s = c + d·p,
// world price p*. A tariff t raises domestic price to p_t = p* + t.
// Imports under tariff: M(t) = q_d(p_t) − q_s(p_t).
// An equivalent QUOTA gives the same imported quantity M*. The quota holder captures
// the rectangle t · M* IF licences are auctioned. If granted free to foreign exporters,
// they capture the rent and the importer collects nothing.
export function quotaTariffEquivalence({ a, b, c = 0, d, pStar, t }) {
  const pT = pStar + t;
  const qd = a - b * pT;
  const qs = c + d * pT;
  const imports = Math.max(0, qd - qs);
  const tariffRevenue = t * imports;
  const quotaSize = imports;            // equivalent quota
  const quotaRentDomestic = tariffRevenue;  // if importing govt auctions licences
  const quotaRentForeign = tariffRevenue;   // if foreign exporters granted licences
  return { pT, qd, qs, imports, tariffRevenue, quotaSize,
           quotaRentDomestic, quotaRentForeign };
}

// Tax revenue R(t) = t · q(t) where q(t) is the post-tax equilibrium quantity.
// For linear q_d = a − b·p, q_s = c + d·p:
//   p_c(t) = (a − c + d·t)/(b + d), q(t) = a − b·p_c(t).
// Revenue is R(t) = t·[a − b·(a − c + d·t)/(b + d)] = t·[d·(a − c) − b·d·t]/(b + d).
// dR/dt = [d·(a − c) − 2·b·d·t]/(b + d) = 0 → t* = (a − c)/(2·b).
// Equivalently t* equals half the choke-supply wedge a/b − (−c/d).
export function laffer({ a, b, c = 0, d }) {
  const tStar = (a - c) / (2 * b);
  const pc = (a - c + d * tStar) / (b + d);
  const q = a - b * pc;
  const revenueMax = tStar * q;
  // Eq quantity without tax
  const q0 = (a - c) / (1 + b * c / a + b / d) ;  // not used directly; we just compute via standard eq
  const eqP = (a - c) / (b + d);
  const eqQ = a - b * eqP;
  // DWL at peak = 0.5 · t · (q0 − q)
  const dwlAtPeak = 0.5 * tStar * (eqQ - q);
  return { tStar, q, revenueMax, dwlAtPeak, eqP, eqQ };
}

// Monopoly with negative production externality of MEC per unit.
// Monopolist solves α − 2β·q = mc → q_M = (α − mc)/(2β).
// Social planner internalises: MSC = mc + MEC. Marginal social benefit at this q is p(q) = α − β·q.
// Social optimum: α − β·q = mc + MEC → q_S = (α − mc − MEC)/β (perfect-competition rule, since social planner ignores monopoly markup).
// If we ALSO restrict the firm to monopolistic behaviour but want to bring it to q_S,
// the corrective unit tax τ solves MR(q_S) − mc − τ = 0  i.e. τ = (α − 2·β·q_S) − mc.
// τ can be NEGATIVE (subsidy) if monopoly under-produces socially.
export function externalityMonopolyTax({ alpha, beta, mc, mec }) {
  const qMono = (alpha - mc) / (2 * beta);
  const qSocial = (alpha - mc - mec) / beta;
  const mrAtSocial = alpha - 2 * beta * qSocial;
  const correctiveTax = mrAtSocial - mc;  // monopolist's MR minus its MC; positive => tax, negative => subsidy
  return { qMono, qSocial, correctiveTax };
}

// Adverse-selection insurance: two risk types with loss probabilities π_L, π_H,
// loss size L. Each is risk-averse over wealth W with utility u(W) (we just use the
// fair-premium pricing rule). A pooling premium equals the average loss probability
// times L. The fraction of high-risk types in the pool that makes the pool unravel
// is anything above the level where low-risk types' expected utility under the pool
// exceeds their no-insurance utility — for our purposes we report the textbook
// fair premiums and the average pool premium at a given mix θ_H.
export function poolingPremium({ piL, piH, loss, thetaH }) {
  const fairL = piL * loss;
  const fairH = piH * loss;
  const pool = (thetaH * piH + (1 - thetaH) * piL) * loss;
  return { fairL, fairH, pool };
}

// Slutsky decomposition (placeholder for completeness; Hell campaign doesn't strictly
// need it but keeps the helpers grouped). For Cobb-Douglas u = x^α y^β, demand
// x*(p,I) is Marshallian. The Hicksian is recoverable via expenditure function.
// Δ in price p_x: total = SE + IE.
export function slutskyCobb({ alpha, beta, I, px0, px1, py }) {
  // Marshallian at both prices
  const x0 = (alpha / (alpha + beta)) * (I / px0);
  const x1 = (alpha / (alpha + beta)) * (I / px1);
  // Hold utility constant: at (p_x0, p_y), Cobb-Douglas u0 = x0^α y0^β.
  const y0 = (beta / (alpha + beta)) * (I / py);
  const u0 = Math.pow(x0, alpha) * Math.pow(y0, beta);
  // Hicksian demand: minimise expenditure subject to u = u0.
  // For Cobb-Douglas h_x = u0^(1/(α+β)) · (α py / β px)^(β/(α+β))
  const k = 1 / (alpha + beta);
  const hicksAt1 = Math.pow(u0, k) * Math.pow((alpha * py) / (beta * px1), beta * k);
  const totalChange = x1 - x0;
  const substitutionEffect = hicksAt1 - x0;
  const incomeEffect = totalChange - substitutionEffect;
  return { x0, x1, hicksAt1, totalChange, substitutionEffect, incomeEffect };
}

if (typeof window !== "undefined") {
  window.EconHell = {
    cournotDuopoly, stackelbergLeader, quotaTariffEquivalence,
    laffer, externalityMonopolyTax, poolingPremium, slutskyCobb,
  };
}
