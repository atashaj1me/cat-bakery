// notebook-extras.js — pedagogical extras for each chapter.
//
// Schema:
//   {
//     recipe:  { title, steps: [string], note? }
//     pitfalls: [{ headline, body }]
//     workedExamples: [{ title, prompt, solution }]
//   }
//
// All strings may contain KaTeX delimiters $...$ and $$...$$.

export const NOTEBOOK_EXTRAS = {
  0: {  // Bakery Preparation — pre-midterm foundations
    recipe: {
      title: "How to solve any consumer-choice problem in 60 seconds",
      steps: [
        "Identify the utility class: Cobb-Douglas ($x^{\\alpha} y^{\\beta}$), quasilinear ($v(x) + y$), perfect substitutes ($ax + by$), perfect complements ($\\min(ax, by)$).",
        "For Cobb-Douglas: $x^* = \\frac{\\alpha}{\\alpha+\\beta} \\cdot \\frac{I}{p_x}$. Done.",
        "For quasilinear: set $v'(x) = p_x/p_y$. Income lands in $y$.",
        "For perfect substitutes: compare $a/p_x$ vs $b/p_y$. Spend all on the winner (corner).",
        "For perfect complements: set $ax = by$ and combine with the budget.",
      ],
      note: "On the exam: identify the class FIRST. Each has a closed form — don't waste time on Lagrangians.",
    },
    pitfalls: [
      { headline: "Cobb-Douglas does NOT have constant elasticity of demand.", body: "It has CONSTANT EXPENDITURE SHARES. The quantity $x^*$ still varies with $p_x$." },
      { headline: "Linear demand $q = a - bp$ has CONSTANT SLOPE, VARYING ELASTICITY.", body: "Elasticity $= -bp/q$ runs from 0 at $p=0$ to $-\\infty$ at the choke price. Midpoint is unit-elastic. A top-3 exam distractor." },
      { headline: "For single-input √-production: $L^* = (ap/2w)^2$, NOT $(ap/w)^2$.", body: "Forgetting the 2 in the denominator costs you the question. Always derive it from $p \\cdot MP_L = w$ rather than memorising." },
    ],
    workedExamples: [
      {
        title: "Cobb-Douglas Cobb-of-the-grass",
        prompt: "$u = x^{0.4} y^{0.6}$, $I = 30$, $p_x = 2$, $p_y = 3$. Find $x^*$ and $y^*$.",
        solution: `
          Constant-share formula:
          <p>$x^* = \\frac{0.4}{1.0} \\cdot \\frac{30}{2} = 0.4 \\cdot 15 = 6$.</p>
          <p>$y^* = \\frac{0.6}{1.0} \\cdot \\frac{30}{3} = 0.6 \\cdot 10 = 6$.</p>
          Sanity check: total spending $= 2(6) + 3(6) = 12 + 18 = 30$ ✓ (equals income).
        `,
      },
      {
        title: "Single-input √-production",
        prompt: "$y = 3\\sqrt{L}$, output price $p = 4$, wage $w = 2$. Find $L^*$, $y^*$, $\\pi^*$.",
        solution: `
          $MP_L = \\frac{3}{2\\sqrt{L}}$. Set $p \\cdot MP_L = w$:
          <p>$4 \\cdot \\frac{3}{2\\sqrt{L}} = 2 \\Rightarrow \\frac{6}{\\sqrt{L}} = 2 \\Rightarrow \\sqrt{L} = 3 \\Rightarrow L^* = 9$.</p>
          <p>$y^* = 3\\sqrt{9} = 9$. $\\pi^* = 4(9) - 2(9) = 36 - 18 = 18$.</p>
          Or use the closed form: $L^* = (ap/2w)^2 = (3 \\cdot 4 / 4)^2 = 9$ ✓.
        `,
      },
    ],
  },

  1: {  // Market Day
    recipe: {
      title: "Recipe — clearing-price problems in 30 seconds",
      steps: [
        "Linear D, S? Write $a - bp = c + dp$ and solve $p^* = (a-c)/(b+d)$.",
        "Substitute back to find $q^* = a - bp^*$.",
        "If asked for CS/PS at the clearing price: $CS = \\tfrac{1}{2}(p_{\\text{choke}} - p^*) q^*$, $PS = \\tfrac{1}{2}(p^* - p_{\\min}) q^*$.",
        "Constant elasticity $q = Ap^{-\\varepsilon}$ and $q = Bp^{\\eta}$? Solve $p^* = (A/B)^{1/(\\varepsilon + \\eta)}$.",
      ],
    },
    pitfalls: [
      { headline: "LR competitive equilibrium is $P = MC = \\min AC$.", body: "NOT $P = \\min MC$. The minimum of MC is meaningless — what matters is $\\min AC$, where $MC$ pierces $AC$." },
      { headline: "1st Welfare Theorem says NOTHING about income distribution.", body: "Pareto efficiency does not imply equity. A market with vast inequality can still be efficient. The 1st theorem requires only competitive markets, no externalities, no asymmetric info." },
      { headline: "CS at a non-clearing price uses the TRADED quantity, not both $q_d$ and $q_s$.", body: "Under a binding ceiling, $q_s < q_d$. CS is computed at $q = q_s$ (the actual quantity exchanged), not at $q_d$." },
    ],
    workedExamples: [
      {
        title: "Linear clearing price",
        prompt: "$q_d = 40 - 2p$, $q_s = 0.5p$. Find $p^*$, $q^*$, CS, PS.",
        solution: `
          $40 - 2p = 0.5p \\Rightarrow 40 = 2.5p \\Rightarrow p^* = 16$.<br>
          $q^* = 40 - 32 = 8$.<br>
          Choke price $= 40/2 = 20$; supply min price $= 0$.<br>
          $CS = \\tfrac{1}{2}(20 - 16)(8) = 16$. $PS = \\tfrac{1}{2}(16)(8) = 64$. Total $= 80$.
        `,
      },
    ],
  },

  2: {  // Sugar Tax (welfare under controls/taxes)
    recipe: {
      title: "Recipe — any welfare-essay archetype",
      steps: [
        "Find the eq without intervention: $p^*$, $q^*$.",
        "Apply the distortion. Compute $q_d, q_s$ at the new price wedge. Find the shortage/surplus.",
        "Draw the diagram. Mark vertices of the DWL triangle: $(q_{\\text{traded}}, p_{\\text{traded}})$, $(q_{\\text{traded}}, D(q_{\\text{traded}}))$, $(q^*, p^*)$.",
        "DWL $= \\tfrac{1}{2} \\cdot$ (base) $\\cdot$ (height). Base $= q^* - q_{\\text{traded}}$. Height $=$ vertical gap at $q_{\\text{traded}}$.",
        "If asked about a subsidy alternative: $p_s = q_d(p_{\\max})/d$; subsidy size $= p_s - p_{\\max}$. Compute the subsidy's own DWL (usually 10× larger).",
        "Verdict: pure efficiency says lift the ceiling, NOT subsidise.",
        "Quasilinear waiting time: $h = (D(q_s) - p_{\\max}) / w_h$.",
      ],
    },
    pitfalls: [
      { headline: "Statutory $\\neq$ economic incidence.", body: "Who LEGALLY remits the tax (statutory) has zero effect on who BEARS the burden (economic). Economic incidence is determined by relative elasticities only." },
      { headline: "$DWL \\propto t^2$ — doubling $t$ quadruples DWL.", body: "Because both the base and the height of the DWL triangle scale with $t$, the area scales with $t^2$." },
      { headline: "A subsidy has its OWN DWL.", body: "Subsidies over-produce relative to $q^*$. Net subsidy DWL is the triangle between $q^*$ and the subsidised quantity $q^{\\text{sub}}$." },
      { headline: "Price-ceiling DWL height is $D(q_s) - p_{\\max}$, not $p^* - p_{\\max}$.", body: "The marginal willingness-to-pay at the supply-restricted quantity is what matters, not the equilibrium price." },
    ],
    workedExamples: [
      {
        title: "Tax incidence with asymmetric slopes",
        prompt: "$q_d = 24 - p$ ($b = 1$), $q_s = 0.4p$ ($d = 0.4$). Tax $t = 3$ on producers. Compute $p_c$, $p_s$, and DWL.",
        solution: `
          No-tax eq: $24 - p = 0.4p \\Rightarrow p^* = 24/1.4 \\approx 17.14$, $q^* \\approx 6.86$.<br>
          $p_c = (24 + 0.4 \\cdot 3)/1.4 = 25.2/1.4 = 18$. $p_s = 18 - 3 = 15$. $q = 24 - 18 = 6$.<br>
          Consumer Δp $= 18 - 17.14 \\approx 0.86$. Producer Δp $\\approx 2.14$. The less-elastic supply bears more.<br>
          DWL $= \\tfrac{1}{2} \\cdot 3 \\cdot (6.86 - 6) \\approx 1.29$.
        `,
      },
    ],
  },

  3: {  // Tariffs (essay 2 archetype)
    recipe: {
      title: "Recipe — the tariff surplus table",
      steps: [
        "Identify exporter (lower autarky price) and importer (higher autarky price).",
        "Find autarky $(p^A, q^A)$ in each country independently.",
        "Free trade: both face $p^* =$ world price. Compute new $CS, PS$ in each market.",
        "Tariff $t$ raises importer's domestic price to $p^* + t$. Recompute $CS_B$, $PS_B$.",
        "Tariff revenue rectangle: $t \\times$ (imports under tariff). Goes to IMPORTER's government only.",
        "Two DWL triangles in importer: production-distortion (left) + consumption-distortion (right).",
      ],
      note: "Always: importer collects tariff revenue. Always: exporter loses some PS vs free trade.",
    },
    pitfalls: [
      { headline: "Tariff revenue belongs to the importing government, NOT the exporter.", body: "Common confusion. The diagram's revenue rectangle sits inside the IMPORTER's market." },
      { headline: "A tariff and a quota are economically equivalent — EXCEPT for the rent.", body: "Same domestic price wedge, same CS and PS changes. The rectangle ($t \\times$ imports) goes to government (tariff) OR licence-holder (quota). If foreign exporters hold the quota, the rent leaves the country." },
      { headline: "Tariff DWL in the importer is TWO triangles.", body: "Production distortion: domestic firms over-produce inefficiently because they face $p^* + t$. Consumption distortion: consumers buy fewer units. Both are real DWL." },
    ],
    workedExamples: [
      {
        title: "Small-country tariff",
        prompt: "Domestic $q_d = 30 - p$, $q_s = 0.5p$. World price $p^* = 12$. Tariff $t = 4$.",
        solution: `
          Under tariff, domestic price $= p^* + t = 16$.<br>
          $q_d = 30 - 16 = 14$. $q_s = 8$. Imports $= 6$.<br>
          Tariff revenue $= 4 \\cdot 6 = 24$.<br>
          $CS = \\tfrac{1}{2}(30 - 16)(14) = 98$. $PS = \\tfrac{1}{2}(16)(8) = 64$.<br>
          Compare free trade ($p = 12$): $CS = \\tfrac{1}{2}(18)(18) = 162$, $PS = \\tfrac{1}{2}(12)(6) = 36$.<br>
          DWL from tariff $= (162 + 36) - (98 + 64 + 24) = 198 - 186 = 12$.
        `,
      },
    ],
  },

  4: {  // Externalities
    recipe: {
      title: "Recipe — externality problems",
      steps: [
        "Identify the externality direction: negative (pollution → over-production) or positive (vaccines → under-consumption).",
        "Compute private Nash $q$: maximise WITHOUT the external term.",
        "Compute social optimum $q^S$: maximise WITH the external term.",
        "Pigouvian wedge $t^* = MEC(q^S)$. Tax for negative, SUBSIDY for positive.",
        "Coase: with zero transaction costs, bargaining reaches $q^S$ regardless of who holds the right.",
      ],
    },
    pitfalls: [
      { headline: "Positive externality $\\Rightarrow$ under-consumption, NOT over.", body: "Private agents ignore the external benefit to others. They consume up to where $MPB = MC$, but $MSB > MPB$, so society wants MORE. Corrective wedge is a SUBSIDY." },
      { headline: "Pigouvian tax is evaluated at the SOCIAL optimum quantity.", body: "Not at the private. For constant MEC the distinction vanishes; for $MEC(q)$ rising in $q$, evaluating at private would over-tax." },
      { headline: "Coase fails when transaction costs are high.", body: "Theorem assumes negligible bargaining cost. With many small victims (air pollution), bargaining is infeasible — you need Pigouvian." },
    ],
    workedExamples: [
      {
        title: "Driving externality (the canonical $u = 8d - d^2 - 2h$ problem)",
        prompt: "$u(d) = 8d - d^2 - 2h$ with $h = d$. Find Nash $d_N$, social $d_S$, and Pigouvian $t^*$.",
        solution: `
          Nash (treats $h$ as exogenous): $\\partial u/\\partial d = 8 - 2d = 0 \\Rightarrow d_N = 4$.<br>
          Social (internalises $h = d$): $u = 6d - d^2$, $\\partial u/\\partial d = 6 - 2d = 0 \\Rightarrow d_S = 3$.<br>
          Pigouvian: $t^* = 2$ (the gap closes if private agent faces $8d - d^2 - 2d$ instead).
        `,
      },
    ],
  },

  5: {  // Asymmetric Info
    recipe: {
      title: "Recipe — adverse selection / screening problems",
      steps: [
        "Identify the asymmetric variable: type (pre-contract) or action (post-contract = moral hazard).",
        "Compute the pooling premium: $\\sum_i \\theta_i \\pi_i \\cdot L$.",
        "Check whether low-type's expected utility under pool $\\geq$ no-insurance utility — if not, they exit.",
        "For separating contracts: bind the IC for high-type — they should be indifferent between full coverage at fair $\\pi_H L$ and mimicking the low-type's partial coverage.",
        "Low-type's partial coverage: $k_L^* = \\frac{\\pi_H - \\pi_L}{1 - \\pi_L} L$.",
      ],
    },
    pitfalls: [
      { headline: "Adverse selection $=$ hidden TYPES. Moral hazard $=$ hidden ACTIONS.", body: "Pre-contract vs post-contract. A common exam-distractor question." },
      { headline: "In the Akerlof equilibrium, BAD drives out GOOD.", body: "Low-quality goods stay in the market; high-quality exit. Insurance variant: low-risk types exit, high-risk stay. NEVER the other way round." },
      { headline: "Signalling requires the signal cost to differ across types.", body: "Specifically: cheaper for high-type. If everyone faces the same cost, the signal carries no information." },
    ],
    workedExamples: [
      {
        title: "Pooling premium with two types",
        prompt: "$\\pi_L = 0.2$, $\\pi_H = 0.6$, $L = 200$, $\\theta_H = 0.3$. Compute pooling premium.",
        solution: `
          Pool $= (\\theta_H \\pi_H + (1-\\theta_H) \\pi_L) \\cdot L$<br>
          $= (0.3 \\cdot 0.6 + 0.7 \\cdot 0.2) \\cdot 200$<br>
          $= (0.18 + 0.14) \\cdot 200 = 0.32 \\cdot 200 = 64$.<br>
          Low-type's fair premium $= 0.2 \\cdot 200 = 40 < 64$, so low-type rejects the pool. Unraveling begins.
        `,
      },
    ],
  },

  6: {  // Monopoly
    recipe: {
      title: "Recipe — monopoly pricing",
      steps: [
        "Linear demand $p = \\alpha - \\beta q$ ⇒ $MR = \\alpha - 2\\beta q$.",
        "Set $MR = MC$ ⇒ $q^* = (\\alpha - MC) / (2\\beta)$.",
        "$p^* = \\alpha - \\beta q^*$.",
        "Constant-elasticity demand ⇒ $p^* = MC / (1 - 1/|\\varepsilon|)$. Requires $|\\varepsilon| > 1$.",
        "Per-unit tax $t$ on linear demand: $\\Delta p = t/2$ (HALF pass-through). On constant-elasticity: full pass-through times $1/(1 - 1/|\\varepsilon|)$.",
        "3rd-degree PD: equate $MR$ across markets to $MC$. Less elastic market gets higher price.",
      ],
    },
    pitfalls: [
      { headline: "Monopoly $\\Delta p = t$ is WRONG with linear demand.", body: "Half pass-through: $\\Delta p = t/2$. Because MR has twice the slope of demand." },
      { headline: "Lerner index $= 1/|\\varepsilon|$ — only valid for constant elasticity.", body: "For linear demand, elasticity varies along the curve, so Lerner varies too. Apply only at the relevant $q^*$." },
      { headline: "Natural monopoly ($MC < AC$): $P = MC$ generates LOSSES.", body: "Regulating at MC requires a subsidy. $P = AC$ breaks the firm even but has DWL." },
    ],
    workedExamples: [
      {
        title: "Monopoly with linear tax pass-through",
        prompt: "$p = 40 - q$, $MC = 9$, tax $t = 8$. Find pre- and post-tax $p$ and confirm $\\Delta p = t/2$.",
        solution: `
          Pre-tax: $MR = 40 - 2q = 9 \\Rightarrow q = 15.5$. $p = 40 - 15.5 = 24.5$.<br>
          Post-tax $MC' = 9 + 8 = 17$. $40 - 2q = 17 \\Rightarrow q = 11.5$. $p = 28.5$.<br>
          $\\Delta p = 28.5 - 24.5 = 4 = 8/2 = t/2$ ✓.
        `,
      },
      {
        title: "3rd-degree price discrimination",
        prompt: "$MC = 2$. Two markets: $p_1 = 12 - q_1/700$, $p_2 = 10 - q_2/500$. Find $q_i, p_i$.",
        solution: `
          Market 1: $MR_1 = 12 - 2q_1/700 = 12 - q_1/350$. Set $= 2$: $q_1 = 3500$. $p_1 = 12 - 5 = 7$.<br>
          Market 2: $MR_2 = 10 - q_2/250 = 2$. $q_2 = 2000$. $p_2 = 10 - 4 = 6$.<br>
          Less elastic Market 1 gets the higher price.
        `,
      },
    ],
  },
};
