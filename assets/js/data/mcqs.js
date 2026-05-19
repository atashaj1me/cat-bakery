// mcqs.js — exam-question bank with LaTeX-typeset math (KaTeX renders $...$).
//   Source: Vault/Mock Exams/Final Practice — MCQ keys & explanations.md
// Each entry: { prompt, options, answer (0-based), explanation }.
//
// Chapter MCQs are the per-chapter quizzes; FINAL_MOCK is the 15-question final.

export const CHAPTER_MCQS = {
  0: [ // Warm-up: pre-midterm (Ch 2–13)
    {
      prompt: "A cat with Cobb-Douglas utility $u(x, y) = x^{\\alpha} \\cdot y^{\\beta}$ has income $I$. Which fraction of income does she spend on $x$?",
      options: [
        "$\\dfrac{\\alpha}{\\beta}$",
        "$\\dfrac{\\alpha}{\\alpha + \\beta}$",
        "$\\dfrac{\\beta}{\\alpha + \\beta}$",
        "depends on prices",
        "$\\dfrac{1}{2}$",
      ],
      answer: 1,
      explanation: "Cobb-Douglas yields constant expenditure shares: $x^* = \\frac{\\alpha}{\\alpha+\\beta} \\cdot \\frac{I}{p_x}$. The share spent on $x$ is $\\alpha/(\\alpha+\\beta)$, independent of prices.",
    },
    {
      prompt: "Linear demand $q = a - b\\,p$ has...",
      options: [
        "constant elasticity along the curve",
        "constant slope and varying elasticity",
        "constant slope and constant elasticity",
        "infinite elasticity at the midpoint",
      ],
      answer: 1,
      explanation: "Linear demand has constant slope $-b$ but varying elasticity $\\varepsilon = -b \\cdot p/q$. $\\varepsilon$ runs from $0$ at $p = 0$ to $-\\infty$ at the choke price. Midpoint is unit-elastic. A top-3 exam trap.",
    },
    {
      prompt: "Bakery production $y = a\\sqrt{L}$; output sells at $p$, wage is $w$. Optimal labor $L^*$ equals:",
      options: [
        "$\\left(\\dfrac{a p}{w}\\right)^2$",
        "$\\left(\\dfrac{a p}{2w}\\right)^2$",
        "$\\dfrac{a^2 p}{2w}$",
        "$\\dfrac{a p}{w}$",
      ],
      answer: 1,
      explanation: "FOC $p \\cdot MP_L = w \\Rightarrow p \\cdot \\frac{a}{2\\sqrt{L}} = w \\Rightarrow \\sqrt{L} = \\frac{a p}{2 w} \\Rightarrow L^* = \\left(\\frac{a p}{2 w}\\right)^2$.",
    },
    {
      prompt: "Production $y = a L^{1/3}$. The profit-max FOC sets $MP_L = w/p$. What is $L^*$?",
      options: [
        "$\\left(\\dfrac{ap}{3w}\\right)^{3/2}$",
        "$\\left(\\dfrac{ap}{2w}\\right)^2$",
        "$\\dfrac{ap}{3w}$",
        "$\\dfrac{ap}{w} - 1$",
      ],
      answer: 0,
      explanation: "$MP_L = \\frac{a}{3 L^{2/3}}$. Setting $p \\cdot \\frac{a}{3 L^{2/3}} = w$ gives $L^{2/3} = \\frac{a p}{3 w}$, so $L^* = \\left(\\frac{a p}{3 w}\\right)^{3/2}$.",
    },
    {
      prompt: "Production $y = a \\ln(1 + L)$. Optimal $L^*$ equals:",
      options: [
        "$\\dfrac{ap}{w}$",
        "$\\dfrac{ap}{w} - 1$",
        "$\\left(\\dfrac{ap}{w}\\right)^2$",
        "$\\ln(ap/w)$",
      ],
      answer: 1,
      explanation: "$MP_L = \\frac{a}{1+L}$. FOC: $p \\cdot \\frac{a}{1+L} = w \\Rightarrow 1 + L = \\frac{ap}{w} \\Rightarrow L^* = \\frac{ap}{w} - 1$.",
    },
    {
      prompt: "Demand $q = A p^{-\\varepsilon}$ with $\\varepsilon = 2$. What is the marginal revenue?",
      options: [
        "$MR = p$",
        "$MR = p \\cdot (1 - 1/\\varepsilon) = p/2$",
        "$MR = 2 p$",
        "$MR = -p$",
      ],
      answer: 1,
      explanation: "Constant-elasticity demand: $MR = p(1 - 1/\\varepsilon) = p(1 - 1/2) = p/2$. This is the Amoroso–Robinson relation.",
    },
    {
      prompt: "A cost-minimizing firm with two inputs $x_1, x_2$ at prices $w_1, w_2$ chooses inputs so that:",
      options: [
        "$MP_1 = MP_2$",
        "$MP_1/w_1 = MP_2/w_2$ (equal bang per buck)",
        "$w_1 \\cdot x_1 = w_2 \\cdot x_2$",
        "$x_1 = x_2$",
      ],
      answer: 1,
      explanation: "Tangency between isoquant and isocost: $\\frac{MP_1}{MP_2} = \\frac{w_1}{w_2}$, equivalently $\\frac{MP_1}{w_1} = \\frac{MP_2}{w_2}$.",
    },
  ],

  1: [ // Ch 14/15 — Competitive equilibrium & First Welfare
    {
      prompt: "Which statement best describes long-run competitive equilibrium?",
      options: [
        "Firms earn positive economic profits",
        "$P = \\min AC$",
        "$P = \\min AVC$",
        "Demand is perfectly elastic",
        "Firms operate at $\\min MC$",
      ],
      answer: 1,
      explanation: "Free entry/exit drives $\\pi_{\\text{econ}} = 0$, so $P = AC$. The firm's FOC $P = MC$ always holds. $MC$ pierces $AC$ at $\\min AC$. Hence $P = MC = \\min AC$.",
    },
    {
      prompt: "The First Welfare Theorem requires which of the following?",
      options: [
        "Externalities are present",
        "All consumers have the same income",
        "Competitive markets and no externalities or asymmetric info",
        "Government intervenes to set efficient prices",
        "Goods are perfectly complementary",
      ],
      answer: 2,
      explanation: "1st Welfare Theorem: competitive equilibrium is Pareto efficient IF markets are complete, prices are taken as given, and there are no externalities or asymmetric info. Any failure of these breaks the theorem.",
    },
    {
      prompt: "In long-run competitive equilibrium, firms produce at the quantity where:",
      options: [
        "$MR = MC$ only",
        "$AC$ is at its minimum",
        "$MC$ is at its minimum",
        "Demand crosses supply only",
      ],
      answer: 1,
      explanation: "In LR, $P = \\min AC$, and the firm produces at the quantity where $AC$ is minimized. $MC = AC$ at that point.",
    },
    {
      prompt: "Demand $q = A p^{-\\varepsilon}$ with $A = 100, \\varepsilon = 1$. Supply $q = B p^{\\eta}$ with $B = 1, \\eta = 1$. The equilibrium price is:",
      options: ["$p^* = 4$", "$p^* = 10$", "$p^* = 25$", "$p^* = 100$"],
      answer: 1,
      explanation: "Set $A p^{-\\varepsilon} = B p^{\\eta} \\Rightarrow p^{\\varepsilon + \\eta} = A/B \\Rightarrow p^* = (A/B)^{1/(\\varepsilon+\\eta)} = 100^{1/2} = 10$. Equilibrium quantity: $q^* = 100/10 = 10$.",
    },
    {
      prompt: "Which of the following is NOT required for the First Welfare Theorem?",
      options: [
        "Price-taking behaviour by all agents",
        "Equal incomes across consumers",
        "No externalities in production or consumption",
        "Complete markets",
      ],
      answer: 1,
      explanation: "1st Welfare Theorem makes no assumption about income distribution — it says competitive eq is Pareto efficient, NOT equitable. Inequality is consistent with Pareto efficiency.",
    },
    {
      prompt: "Total surplus is maximized at the competitive equilibrium because:",
      options: [
        "Firms earn maximum profit",
        "Consumer surplus is maximized",
        "Marginal willingness-to-pay equals marginal cost for every unit traded",
        "Government revenue is maximized",
      ],
      answer: 2,
      explanation: "At $q^*$, demand $=$ supply, i.e. the WTP of the last buyer equals the MC of the last seller. Any additional or fewer trade strictly reduces total surplus.",
    },
  ],

  2: [ // Ch 19 — Taxes & Subsidies
    {
      prompt: "Statutory incidence of a tax means:",
      options: [
        "Who actually bears the burden of the tax",
        "The share borne by consumers vs producers",
        "Who is legally responsible for remitting the tax",
        "The deadweight loss generated by the tax",
        "Tax revenue collected by the government",
      ],
      answer: 2,
      explanation: "Statutory $\\neq$ economic incidence. Statutory $=$ who writes the check. Economic $=$ who bears the burden, determined by relative elasticities.",
    },
    {
      prompt: "Doubling a per-unit tax on a market with linear demand and supply produces a DWL that is:",
      options: [
        "roughly double",
        "more than twice (about $4\\times$)",
        "unchanged",
        "halved",
      ],
      answer: 1,
      explanation: "$DWL = \\frac{1}{2} \\cdot t \\cdot \\Delta q$, where $\\Delta q$ is itself proportional to $t$ (linear curves). So $DWL \\propto t^2$. Doubling $t$ roughly quadruples DWL.",
    },
    {
      prompt: "Demand $q = 20 - p$, supply $q = p$. A $\\$4$ tax on producers. Consumer price $p_c$ and producer price $p_s$ are:",
      options: [
        "$p_c = 12,\\ p_s = 8$",
        "$p_c = 14,\\ p_s = 10$",
        "$p_c = 10,\\ p_s = 6$",
        "$p_c = 16,\\ p_s = 12$",
      ],
      answer: 0,
      explanation: "Pre-tax: $20 - p = p \\Rightarrow p^* = 10,\\ q^* = 10$. After tax $t = 4$: $p_c = \\frac{a + d t}{b + d} = \\frac{20 + 4}{2} = 12$. $p_s = p_c - t = 8$. Equal slopes $\\Rightarrow$ 50-50 split.",
    },
    {
      prompt: "A government wants to maximize revenue from a per-unit tax with $D, S$ linear and equal slopes. The optimal tax $t^*$ equals:",
      options: [
        "Choke price minus minimum supply price",
        "Half of (choke price minus minimum supply price)",
        "Zero",
        "The full choke price",
      ],
      answer: 1,
      explanation: "Laffer for linear curves: $R(t) = t \\cdot q(t)$ is a quadratic in $t$. Maximum is at $t^* = (a - c)/(2b)$ — exactly half the wedge that would kill trade.",
    },
    {
      prompt: "A small per-unit subsidy in a competitive market with linear D and S:",
      options: [
        "Increases total surplus",
        "Creates a DWL triangle (subsidy moves $q$ past $q^*$)",
        "Has no effect on quantity",
        "Helps consumers without hurting producers",
      ],
      answer: 1,
      explanation: "A subsidy distorts in the opposite direction of a tax: it over-produces relative to $q^*$. The DWL is between $q^*$ and $q^{\\text{sub}}$, height $=$ subsidy.",
    },
    {
      prompt: "The DWL of a per-unit tax in a linear market depends on:",
      options: [
        "Only the tax rate $t$",
        "$t$ and the elasticities of supply and demand",
        "Only the elasticity of demand",
        "The amount of revenue collected",
      ],
      answer: 1,
      explanation: "$DWL = \\frac{1}{2} \\cdot t \\cdot \\Delta q$. $\\Delta q$ scales with $t$ AND with how elastic D and S are. More elastic curves $\\Rightarrow$ bigger $\\Delta q$ at the same $t$ $\\Rightarrow$ bigger DWL.",
    },
  ],

  3: [ // Ch 20 — Tariffs/Quotas
    {
      prompt: "Under a tariff imposed by an importing country, government tariff revenue equals:",
      options: [
        "$t \\times$ domestic production",
        "$t \\times$ imports under the tariff",
        "$t \\times$ consumption under free trade",
        "$t \\times (\\text{consumption} - \\text{production at world price})$",
      ],
      answer: 1,
      explanation: "Tariff revenue $= t \\times Q_{\\text{imports under tariff}}$ — the rectangle in the importer's diagram between world price and tariff-distorted domestic price, over the imported quantity.",
    },
    {
      prompt: "Compared to free trade, a tariff in the importing country results in:",
      options: [
        "Higher CS, lower PS",
        "Lower CS, higher PS, government revenue, net loss to country",
        "Higher total surplus due to government revenue",
        "No change to deadweight loss",
      ],
      answer: 1,
      explanation: "Tariff raises domestic price in importer: consumers lose, domestic producers gain, government collects revenue, but net is a loss (two DWL triangles: production distortion + consumption distortion).",
    },
    {
      prompt: "In the standard two-country tariff diagram (importer levies tariff), the exporter:",
      options: [
        "Also collects tariff revenue",
        "Sees its consumers gain unambiguously",
        "Sees its producers worse off than free trade (but not full autarky)",
        "Is unaffected by the tariff",
      ],
      answer: 2,
      explanation: "Importer collects tariff revenue, NOT exporter. Exporter's domestic price falls (or its exports shrink), so its producers lose vs free trade. They are still better off than autarky as long as some trade continues.",
    },
    {
      prompt: "A tariff and a quota of equivalent size cause the same domestic price increase. The KEY difference is:",
      options: [
        "Quotas have larger DWL than tariffs",
        "Who captures the rent (government with tariff; quota-holder with quota)",
        "Quotas reduce consumer surplus more than tariffs",
        "Tariffs cause foreign retaliation more often",
      ],
      answer: 1,
      explanation: "The price wedge is the same, so CS and PS changes are identical. The difference is the rectangle $t \\times M$: a tariff routes it to the importing government, a quota to whoever holds the licence (domestic auctioneer OR foreign exporter).",
    },
    {
      prompt: "Under a tariff, the deadweight loss to the importing country consists of:",
      options: [
        "One triangle (the consumption distortion)",
        "Two triangles (production distortion + consumption distortion)",
        "A rectangle (the tariff revenue)",
        "Zero — tariff revenue offsets all losses",
      ],
      answer: 1,
      explanation: "Two DWL triangles. The left one (production distortion) — domestic firms expand inefficiently because they now face $p^* + t$. The right one (consumption distortion) — consumers buy fewer units. The rectangle is a transfer, not DWL.",
    },
    {
      prompt: "Free trade increases TOTAL world surplus relative to autarky because:",
      options: [
        "Each country produces at lower cost",
        "Each country specializes where it has comparative advantage",
        "Both consumers and producers in both countries gain",
        "It is required by treaty",
      ],
      answer: 1,
      explanation: "Comparative advantage: each country produces what it makes most cheaply (lowest opportunity cost), then trades. Losers in each country can theoretically be compensated by winners.",
    },
  ],

  4: [ // Ch 21 — Externalities
    {
      prompt: "A negative externality in production means private equilibrium:",
      options: [
        "Produces too little relative to the social optimum",
        "Produces too much relative to the social optimum",
        "Already internalizes the externality",
        "Maximizes social surplus",
      ],
      answer: 1,
      explanation: "When $PMC < SMC$ (production imposes uncompensated cost on others), the private market overproduces relative to the socially efficient quantity.",
    },
    {
      prompt: "A Pigouvian tax is designed to:",
      options: [
        "Raise government revenue to fund enforcement",
        "Equal the marginal external cost so private cost $=$ social cost",
        "Eliminate the externality completely",
        "Punish polluters with a fine",
      ],
      answer: 1,
      explanation: "Pigouvian tax $t^* = MEC$ (marginal external cost) at the social optimum. It internalizes the externality. Revenue is a side-effect, not the goal.",
    },
    {
      prompt: "Consider $u(d) = 8d - d^2 - 2h$ with $h = d$ (driving causes one-for-one harm). Nash and social driving levels are:",
      options: [
        "$d_N = 4,\\ d_S = 3$",
        "$d_N = 3,\\ d_S = 4$",
        "$d_N = 4,\\ d_S = 4$",
        "$d_N = 2,\\ d_S = 1$",
      ],
      answer: 0,
      explanation: "Nash (treats $h$ as constant): $8 - 2d = 0 \\Rightarrow d_N = 4$. Social ($h = d$): $u = 6d - d^2,\\ 6 - 2d = 0 \\Rightarrow d_S = 3$. Pigouvian tax $= 2$ closes the gap.",
    },
    {
      prompt: "Coase Theorem says: with zero transaction costs and well-defined property rights, the externality:",
      options: [
        "Is eliminated by Pigouvian tax only",
        "Reaches the efficient outcome regardless of who holds the right",
        "Always favours the polluter",
        "Always favours the victim",
      ],
      answer: 1,
      explanation: "Coase: efficient bargaining occurs in either direction; the INITIAL property-rights assignment changes WHO PAYS but not the efficient quantity.",
    },
    {
      prompt: "A positive externality in consumption (e.g. vaccines) implies the free market:",
      options: [
        "Consumes too much (above social optimum)",
        "Consumes too little (below social optimum)",
        "Consumes exactly the social optimum",
        "Has no welfare implication",
      ],
      answer: 1,
      explanation: "Private MB does not include the external benefit to others. So at private equilibrium, MSB > MPB and SOCIETY wants more consumption. The corrective wedge is a SUBSIDY.",
    },
    {
      prompt: "The optimal Pigouvian tax in a market with negative externality $MEC$ is:",
      options: [
        "Zero (let the market clear)",
        "$MEC$ at the social optimum quantity",
        "$MEC$ at the private equilibrium quantity",
        "Half of $MEC$",
      ],
      answer: 1,
      explanation: "Pigouvian: $t^* = MEC(q_S)$. Evaluated at the SOCIAL OPTIMUM, not at the distorted private equilibrium. The tax aligns private MB with social MC at that quantity.",
    },
  ],

  5: [ // Ch 22 — Asymmetric Information
    {
      prompt: "Adverse selection in insurance markets arises because:",
      options: [
        "Insurers know more than buyers",
        "High-risk buyers exit the market",
        "All risk types pay the same premium",
        "Low-risk individuals exit the market when faced with the pooling premium",
        "Government regulates premiums",
      ],
      answer: 3,
      explanation: "The pooling premium is set at the population average. Low-risk types find it overpriced and exit. Pool concentrates in high-risk $\\Rightarrow$ premium rises $\\Rightarrow$ more low-risk exit $\\Rightarrow$ unraveling.",
    },
    {
      prompt: "In Akerlof's lemons market, equilibrium tends to feature:",
      options: [
        "Only high-quality goods traded",
        "Only low-quality goods traded ('lemons drive out peaches')",
        "Equal proportions of all quality levels",
        "No trade at all",
      ],
      answer: 1,
      explanation: "Buyers, unable to distinguish quality, offer only the average price. Sellers of high-quality goods withdraw, lowering the average — driving more quality out. Bad drives out good.",
    },
    {
      prompt: "A 'signal' in the labor market (e.g. a college degree) works to mitigate asymmetric info only if:",
      options: [
        "It is cheap for everyone",
        "It is cheaper for high-productivity types than low-productivity types",
        "It is mandatory for all workers",
        "Employers can directly observe productivity",
      ],
      answer: 1,
      explanation: "A Spence separating equilibrium requires signal cost to differ across types — specifically cheaper for the high-type. Otherwise low-types mimic the signal and it conveys no information.",
    },
    {
      prompt: "Moral hazard differs from adverse selection because:",
      options: [
        "Moral hazard concerns hidden information; adverse selection concerns hidden actions",
        "Moral hazard concerns hidden ACTIONS after contracting; adverse selection concerns hidden TYPES before contracting",
        "They are the same thing",
        "Adverse selection only happens in insurance",
      ],
      answer: 1,
      explanation: "Adverse selection $=$ pre-contract; insurer cannot see whether you are high-risk or low-risk. Moral hazard $=$ post-contract; insurer cannot see whether you drive carelessly after being insured.",
    },
    {
      prompt: "Two risk-types: $\\pi_L = 0.1$, $\\pi_H = 0.6$, loss $L = 100$. Fraction high $\\theta_H = 0.5$. The pooling premium is:",
      options: ["$10$", "$35$", "$60$", "$50$"],
      answer: 1,
      explanation: "Pool $= [\\theta_H \\pi_H + (1 - \\theta_H) \\pi_L] L = [0.5 \\cdot 0.6 + 0.5 \\cdot 0.1] \\cdot 100 = 35$.",
    },
    {
      prompt: "Screening contracts (insurer offers a menu) work when:",
      options: [
        "Insurer can see the buyer's type",
        "Buyers self-reveal their type by choosing different contracts",
        "All buyers want the same contract",
        "Government regulates premiums",
      ],
      answer: 1,
      explanation: "Screening (Rothschild-Stiglitz): insurer designs a menu so each type prefers a different contract. High-risk buyers prefer full coverage; low-risk prefer partial. The CHOICE reveals the type.",
    },
  ],

  6: [ // Ch 23 — Monopoly
    {
      prompt: "A monopolist faces constant elasticity $\\varepsilon = -3$ and $MC = \\$1$. The profit-maximizing price is:",
      options: [
        "$\\$1.50$",
        "$\\$3$",
        "$\\$1.33$",
        "$\\$2$",
      ],
      answer: 0,
      explanation: "$p = \\dfrac{MC}{1 - 1/|\\varepsilon|} = \\dfrac{1}{1 - 1/3} = \\dfrac{1}{2/3} = \\$1.50$. Lerner index $L = 1/|\\varepsilon|$.",
    },
    {
      prompt: "A monopolist with linear demand $p = 40 - q$ and $MC = 9$ faces a per-unit tax of $\\$8$. How much does the monopoly price increase?",
      options: [
        "By $\\$8$ (full pass-through)",
        "By $\\$4$ (half pass-through)",
        "By $\\$2$",
        "It falls",
      ],
      answer: 1,
      explanation: "Pre-tax: $MR = 40 - 2q = 9 \\Rightarrow q = 15.5,\\ p = 24.5$. Post-tax $MC = 17$: $q = 11.5,\\ p = 28.5$. $\\Delta p = 4 = t/2$. Linear demand $\\Rightarrow$ half pass-through.",
    },
    {
      prompt: "Under 3rd-degree price discrimination across two markets with constant $MC$, the monopolist sets:",
      options: [
        "Equal prices in both markets",
        "Equal $MR$ in both markets (higher price where demand is less elastic)",
        "Equal quantities in both markets",
        "$p = MC$ in each market",
      ],
      answer: 1,
      explanation: "Optimal PD: equate $MR$ across markets to $MC$. The less elastic market gets a higher price (Lerner intuition).",
    },
    {
      prompt: "Cournot duopoly with $p = 30 - q$ (where $q = q_A + q_B$) and $MC = 6$ for both firms. Each firm's equilibrium output is:",
      options: ["$q_i = 12$", "$q_i = 8$", "$q_i = 6$", "$q_i = 4$"],
      answer: 1,
      explanation: "Symmetric Cournot: $q_i = (\\alpha - MC)/(3 \\beta) = 24/3 = 8$. Total $Q = 16$, price $p = 30 - 16 = 14$. Compare to monopoly $q = 12$ and competition $q = 24$.",
    },
    {
      prompt: "Stackelberg leader chooses first, follower observes and best-responds. Compared to Cournot, the LEADER's profit is:",
      options: [
        "Higher than Cournot",
        "Lower than Cournot",
        "Equal to Cournot",
        "Equal to monopoly",
      ],
      answer: 0,
      explanation: "First-mover advantage: leader can commit to higher $q_L$, forcing follower to retreat. Leader profit > Cournot symmetric profit; follower profit < Cournot.",
    },
    {
      prompt: "A natural monopoly has decreasing AC over the relevant range. Setting $P = MC$ (efficient pricing) implies:",
      options: [
        "Firm earns positive economic profit",
        "Firm earns zero economic profit (breaks even)",
        "Firm earns NEGATIVE economic profit (loses money)",
        "$AC = MC$",
      ],
      answer: 2,
      explanation: "If AC is decreasing, then $MC < AC$. So $P = MC$ means $P < AC$, hence losses. Regulators face the natural-monopoly dilemma: efficient pricing requires a subsidy.",
    },
    {
      prompt: "Lerner index $L = (P - MC)/P$ for a monopolist with constant-elasticity demand $|\\varepsilon| = 4$ equals:",
      options: ["$0$", "$0.25$", "$0.50$", "$4$"],
      answer: 1,
      explanation: "$L = 1/|\\varepsilon| = 1/4 = 0.25$. So $P = MC / (1 - 0.25) = MC/0.75$.",
    },
  ],
};

// The 15-question final practice exam, in order.
export const FINAL_MOCK = [
  {
    prompt: "In long-run competitive equilibrium, profit-maximizing firms produce where:",
    options: [
      "$MR = MC$ only",
      "$P = \\min AC$",
      "$P = \\min AVC$",
      "Demand is perfectly elastic",
      "Firms operate at $\\min MC$",
    ],
    answer: 1,
    explanation: "$P = MC = \\min AC$. Zero economic profit, free entry/exit.",
    tag: "Ch13",
  },
  {
    prompt: "Which statement about tastes is TRUE?",
    options: [
      "Linear demand has constant elasticity",
      "Quasilinear goods are usually non-essential",
      "Perfect complements are quasilinear",
      "Cobb-Douglas yields zero income effect on each good",
      "Perfect substitutes always have interior solutions",
    ],
    answer: 1,
    explanation: "Quasilinear $u(x,y) = v(x) + y \\Rightarrow$ zero income elasticity on $x$. Standard model for non-essential, small-share goods.",
    tag: "Ch4-5",
  },
  {
    prompt: "Which of the following is TRUE?",
    options: [
      "Pigouvian taxes raise revenue to fund enforcement",
      "1st Welfare Theorem holds even with externalities",
      "A trade between two people is an externality",
      "Positive externality in consumption means consuming too much",
      "None of the above",
    ],
    answer: 4,
    explanation: "All four named statements are false. Pigouvian taxes internalize cost; 1st Welfare requires no externalities; trades are not externalities; positive externality $\\Rightarrow$ underconsumption.",
    tag: "Ch21",
  },
  {
    prompt: "A binding price ceiling persists in democratic politics because it:",
    options: [
      "Generates efficiency gains",
      "Reduces total surplus",
      "Creates concentrated benefits and diffuse costs",
      "Increases producer surplus",
      "Eliminates the shortage",
    ],
    answer: 2,
    explanation: "Classic logic of collective action: a small group of beneficiaries organizes; a large group of losers each loses a tiny amount and does not.",
    tag: "Ch18",
  },
  {
    prompt: "Utility from driving $u(d, h) = 8d - d^2 - 2h$, with $h = d$. Nash and social planner choices are:",
    options: [
      "$D_1 = 4,\\ D_2 = 3$",
      "$D_1 = 3,\\ D_2 = 4$",
      "$D_1 = 4,\\ D_2 = 4$",
      "$D_1 = 8,\\ D_2 = 6$",
    ],
    answer: 0,
    explanation: "Nash holds $h$ fixed: $8 - 2d = 0,\\ d = 4$. Social internalizes $h = d$: $u = 6d - d^2,\\ 6 - 2d = 0,\\ d = 3$.",
    tag: "Ch21",
  },
  {
    prompt: "Production $f(x_1, x_2) = 4\\sqrt{x_1} + 6\\sqrt{x_2}$, prices $w_1 = 1,\\ w_2 = 2,\\ p = 4$. Optimal output $y^*$ equals:",
    options: ["$68$", "$60$", "$72$", "$48$"],
    answer: 0,
    explanation: "$x_1^* = \\left(\\frac{4 \\cdot 4}{2 \\cdot 1}\\right)^2 = 64,\\ x_2^* = \\left(\\frac{4 \\cdot 6}{2 \\cdot 2}\\right)^2 = 36.\\ y = 4 \\cdot 8 + 6 \\cdot 6 = 68$.",
    tag: "Ch12",
  },
  {
    prompt: "Linear demand $p = 40 - q$, monopolist $MC = 9$. With $\\$8$ per-unit tax, by how much does monopoly price increase?",
    options: ["$\\$8$", "$\\$2$", "$\\$4$", "$\\$0$", "$\\$6$"],
    answer: 2,
    explanation: "Pre-tax $q = 15.5,\\ p = 24.5$. Post-tax $MC = 17,\\ q = 11.5,\\ p = 28.5$. $\\Delta p = 4$.",
    tag: "Ch23",
  },
  {
    prompt: "Monopolist with constant $MC = 2$ sells in two markets: US ($p = 12 - Q/700$), England ($p = 10 - Q/500$). Optimal prices satisfy:",
    options: [
      "$p_{US} > p_{Eng}$ by $\\$1$",
      "$p_{US} < p_{Eng}$ by $\\$1$",
      "$p_{US} = p_{Eng}$",
      "$p_{US} > p_{Eng}$ by $\\$2$",
    ],
    answer: 0,
    explanation: "US: $MR = 12 - Q/350 = 2 \\Rightarrow Q = 3500,\\ p = 7$. England: $MR = 10 - Q/250 = 2 \\Rightarrow Q = 2000,\\ p = 6$. $p_{US} - p_{Eng} = +\\$1$.",
    tag: "Ch23",
  },
  {
    prompt: "Statutory incidence of a tax means:",
    options: [
      "Who bears the burden",
      "The consumer share of burden",
      "Who is legally responsible for remitting the tax",
      "The DWL of the tax",
      "Tax revenue",
    ],
    answer: 2,
    explanation: "Statutory $=$ legal assignment. Economic $=$ actual burden, determined by elasticities. They are not the same.",
    tag: "Ch19",
  },
  {
    prompt: "Intertemporal trade allows households to:",
    options: [
      "Eliminate opportunity costs",
      "Eliminate trade-offs",
      "Lock in future prices",
      "Exchange consumption across time using interest rates",
      "Avoid all uncertainty",
    ],
    answer: 3,
    explanation: "Intertemporal budget: $c_1 + \\frac{c_2}{1 + r} = m_1 + \\frac{m_2}{1 + r}$. Saving and borrowing smooth consumption.",
    tag: "Ch3",
  },
  {
    prompt: "Demand $q = a - p$ ($|dq/dp| = 1$, relatively inelastic). Supply $q = c + 2p$ ($|dq/dp| = 2$, more elastic). A $\\$4$ per-unit tax. By how much does the consumer price rise?",
    options: [
      "About $\\$2.67$ (consumer up $> \\$2$)",
      "$\\$2$",
      "$\\$4$",
      "Stays the same",
      "About $\\$1.33$",
    ],
    answer: 0,
    explanation: "Consumer-price change $= \\frac{d}{b+d} \\cdot t$ where $b$ is the demand slope and $d$ the supply slope (both in $|dq/dp|$). Here $b = 1,\\ d = 2$: $\\Delta p_c = \\frac{2}{1+2} \\cdot 4 = \\frac{8}{3} \\approx \\$2.67$. The less elastic side (demand) bears more of the tax.",
    tag: "Ch19",
  },
  {
    prompt: "Doubling a tax on a market with linear $D$ and $S$ generates:",
    options: [
      "Twice the DWL",
      "More than twice the DWL ($\\sim 4\\times$)",
      "Half the DWL",
      "The same DWL",
    ],
    answer: 1,
    explanation: "$DWL \\propto t^2$. Doubling $t$ quadruples DWL.",
    tag: "Ch19",
  },
  {
    prompt: "Adverse selection in insurance is BEST described as:",
    options: [
      "Government regulation distorts premiums",
      "Sellers know more than buyers in all markets",
      "High-quality goods drive out low-quality goods",
      "Low-risk individuals exit the market when premiums reflect averages",
      "Adverse selection creates efficient market clearing",
    ],
    answer: 3,
    explanation: "Pooling premium is too high for low-risk; they exit. Pool gets riskier; price rises; more low-risk exit. This is the unraveling.",
    tag: "Ch22",
  },
  {
    prompt: "Constant elasticity demand with $|\\varepsilon| = 3$ and $MC = \\$1$: the profit-max monopoly price is:",
    options: ["$\\$1.50$", "$\\$3$", "$\\$0.67$", "$\\$2$"],
    answer: 0,
    explanation: "$p = \\dfrac{MC}{1 - 1/|\\varepsilon|} = \\dfrac{1}{1 - 1/3} = \\$1.50$.",
    tag: "Ch23",
  },
  {
    prompt: "Demand $q = 30 - 3p$, supply $q = 6p$. What is the smallest per-unit tax that completely eliminates trade?",
    options: ["$t = 10$", "$t = 3.33$", "$t = 3.67$", "$t = 11.50$", "$t = 13$"],
    answer: 0,
    explanation: "Choke price $= 30/3 = 10$; minimum supply price $= 0$. Wedge that kills trade $= 10 - 0 = \\$10$.",
    tag: "Ch19",
  },
];

// Map: which chapter does each mock-MCQ remediation point to?
export const MOCK_REMEDIATION = {
  0: 1, 1: 0, 2: 4, 3: 1, 4: 4,
  5: 0, 6: 6, 7: 6, 8: 2, 9: 0,
  10: 2, 11: 2, 12: 5, 13: 6, 14: 2,
};

// MOCK_POOL — 15 slots, each with multiple alternates matching the practice
// test's topical distribution. generateFinalMock() draws one question per
// slot, so every attempt is a fresh exam covering the SAME topics in the
// SAME order but with different numerical setups and conceptual framings.
//
// Index 0 of each slot is the question already in FINAL_MOCK above; the
// additional entries are new alternates verified independently.

export const MOCK_POOL = [
  // ============== SLOT 1 — Ch13 long-run competitive equilibrium ==============
  [
    FINAL_MOCK[0],
    {
      prompt: "A competitive firm has cost $C(q) = 4 + q^2$. In long-run equilibrium with free entry, the market price equals:",
      options: ["$\\$2$", "$\\$4$", "$\\$6$", "$\\$8$"],
      answer: 1,
      explanation: "LR eq: $P = \\min AC$. $AC(q) = 4/q + q$. $\\frac{d}{dq}AC = -4/q^2 + 1 = 0 \\Rightarrow q = 2$, $AC(2) = 2 + 2 = 4$. So $P = 4$.",
      tag: "Ch13",
    },
    {
      prompt: "In a competitive industry, firms currently earn positive economic profit. In the long run, what happens?",
      options: [
        "Government taxes their profits away",
        "Entry occurs until $P = \\min AC$ and economic profit returns to zero",
        "Profits remain positive forever",
        "Firms collude into a monopoly",
      ],
      answer: 1,
      explanation: "Free entry/exit drives the long-run economic profit to zero. New firms enter until $P$ falls to $\\min AC$ — at which point no new entry is profitable.",
      tag: "Ch13",
    },
  ],

  // ============== SLOT 2 — Ch4-5 tastes / utility classes ==============
  [
    FINAL_MOCK[1],
    {
      prompt: "Cobb-Douglas utility $u(x, y) = x^{0.4} y^{0.6}$ implies the consumer spends what fraction of income on $x$?",
      options: ["$0.4$", "$0.6$", "$0.5$", "Depends on prices"],
      answer: 0,
      explanation: "Cobb-Douglas constant expenditure shares: $\\frac{\\alpha}{\\alpha + \\beta} = \\frac{0.4}{1.0} = 0.4$. Independent of prices.",
      tag: "Ch4-5",
    },
    {
      prompt: "Which utility class implies that demand for $x$ is INDEPENDENT of income (zero income effect on $x$)?",
      options: [
        "Cobb-Douglas",
        "Quasilinear $u(x, y) = v(x) + y$",
        "Perfect substitutes",
        "Perfect complements",
      ],
      answer: 1,
      explanation: "Quasilinear: $v'(x^*) = p_x / p_y$ determines $x^*$ from prices alone. Income variation lands entirely in the residual $y$.",
      tag: "Ch4-5",
    },
  ],

  // ============== SLOT 3 — Ch21 externalities / 1st Welfare ==============
  [
    FINAL_MOCK[2],
    {
      prompt: "The Coase Theorem says the efficient outcome is reached when:",
      options: [
        "The government sets a Pigouvian tax equal to MEC",
        "Transaction costs are zero AND property rights are well-defined",
        "Property rights are assigned to the polluter only",
        "Property rights are assigned to the victim only",
      ],
      answer: 1,
      explanation: "Coase: zero transaction costs + well-defined property rights → bargaining reaches the efficient $q^*$ REGARDLESS of who holds the right. The rights assignment changes who pays whom, not the efficient quantity.",
      tag: "Ch21",
    },
    {
      prompt: "A negative externality in production implies that, in private equilibrium:",
      options: [
        "Private marginal cost equals social marginal cost",
        "Private marginal cost is LESS than social marginal cost",
        "Private marginal cost is GREATER than social marginal cost",
        "The market under-produces",
      ],
      answer: 1,
      explanation: "Negative externality means producers ignore the external harm. $PMC < SMC$. The private market OVER-produces relative to the social optimum.",
      tag: "Ch21",
    },
  ],

  // ============== SLOT 4 — Ch18 price ceiling political economy ==============
  [
    FINAL_MOCK[3],
    {
      prompt: "Under a binding price ceiling on rent, the actual quantity traded is determined by:",
      options: [
        "The demand side (the shorter side)",
        "The supply side (the shorter side)",
        "The midpoint of demand and supply",
        "Government quota",
      ],
      answer: 1,
      explanation: "Binding ceiling $\\Rightarrow$ $q_s < q_d$. The market is rationed by the SHORT side — supply. Even though more consumers want to buy, only $q_s$ units exist.",
      tag: "Ch18",
    },
    {
      prompt: "A binding price floor on agricultural goods (e.g. minimum dairy prices) typically creates:",
      options: [
        "A shortage of dairy",
        "A surplus of dairy (over-production)",
        "Efficient allocation",
        "Zero DWL because farmers are happier",
      ],
      answer: 1,
      explanation: "Binding floor $\\Rightarrow$ price above $p^*$. $q_s$ exceeds $q_d$. Surplus that the government often buys, stores, or destroys — each option has its own DWL.",
      tag: "Ch18",
    },
  ],

  // ============== SLOT 5 — Ch21 numerical externality ==============
  [
    FINAL_MOCK[4],
    {
      prompt: "Utility from driving $u(d, h) = 12d - d^2 - 4h$ with $h = d$. The Nash and social-planner choices are:",
      options: [
        "$d_N = 6, d_S = 4$",
        "$d_N = 4, d_S = 6$",
        "$d_N = 8, d_S = 4$",
        "$d_N = 6, d_S = 6$",
      ],
      answer: 0,
      explanation: "Nash (holds $h$ constant): $12 - 2d = 0 \\Rightarrow d_N = 6$. Social ($h = d$): $u = 8d - d^2$, $8 - 2d = 0 \\Rightarrow d_S = 4$. Gap = 2 = $\\gamma/?$... actually $\\gamma = 4$, gap = 2, Pigouvian = $\\gamma = 4$.",
      tag: "Ch21",
    },
    {
      prompt: "$u(d, h) = 10d - d^2 - 3h$ with $h = d$. The Pigouvian tax that aligns Nash with social optimum is:",
      options: ["$1.5$", "$3$", "$5$", "$10$"],
      answer: 1,
      explanation: "$\\gamma = 3$ is the marginal external cost. The Pigouvian tax equals $\\gamma = 3$, closing the gap between Nash $d_N = 5$ and social $d_S = 3.5$.",
      tag: "Ch21",
    },
  ],

  // ============== SLOT 6 — Ch12 production ==============
  [
    FINAL_MOCK[5],
    {
      prompt: "Production $f(x_1, x_2) = 6\\sqrt{x_1} + 4\\sqrt{x_2}$, $w_1 = 2, w_2 = 1, p = 2$. Optimal $x_1^*$ equals:",
      options: ["$9$", "$16$", "$4$", "$36$"],
      answer: 0,
      explanation: "Separable production. $x_1^* = (a_1 p / (2 w_1))^2 = (6 \\cdot 2 / (2 \\cdot 2))^2 = 3^2 = 9$.",
      tag: "Ch12",
    },
    {
      prompt: "Single-input production $y = a\\sqrt{L}$ with $a = 6, w = 3, p = 1$. Optimum profit equals:",
      options: ["$3$", "$6$", "$9$", "$12$"],
      answer: 0,
      explanation: "Closed form: $\\pi^* = a^2 p^2 / (4 w) = 36 \\cdot 1 / 12 = 3$. (Check: $L^* = (6/6)^2 = 1$, $y^* = 6$, profit $= 6 - 3 = 3$.)",
      tag: "Ch12",
    },
  ],

  // ============== SLOT 7 — Ch23 monopoly + tax ==============
  [
    FINAL_MOCK[6],
    {
      prompt: "Monopolist faces linear demand $p = 30 - q$ and $MC = 6$. A per-unit tax $t = 6$ is imposed. The new monopoly price equals:",
      options: ["$\\$18$", "$\\$21$", "$\\$24$", "$\\$30$"],
      answer: 1,
      explanation: "Pre-tax: $MR = 30 - 2q = 6 \\Rightarrow q = 12, p = 18$. Post-tax $MC = 12$: $MR = 12 \\Rightarrow q = 9, p = 21$. $\\Delta p = 3 = t/2$.",
      tag: "Ch23",
    },
    {
      prompt: "A monopolist with constant-elasticity demand $|\\varepsilon| = 2$ and $MC = 1$ faces a $\\$1$ per-unit tax. The post-tax price becomes:",
      options: ["$\\$3$", "$\\$4$", "$\\$2$", "$\\$5$"],
      answer: 1,
      explanation: "Effective $MC = 1 + 1 = 2$. $p = MC/(1 - 1/|\\varepsilon|) = 2/(1 - 1/2) = 4$. Pre-tax price was $1/(1/2) = 2$, so $\\Delta p = 2$ — FULL pass-through, distinct from the linear-demand half-rule.",
      tag: "Ch23",
    },
  ],

  // ============== SLOT 8 — Ch23 3rd-degree PD ==============
  [
    FINAL_MOCK[7],
    {
      prompt: "Monopolist with $MC = 3$ practices 3rd-degree PD in two markets: M1 $p = 15 - q/100$, M2 $p = 12 - q/200$. Which market gets the HIGHER price?",
      options: ["M1", "M2", "Equal prices", "Cannot determine"],
      answer: 0,
      explanation: "M1: $MR = 15 - q/50 = 3 \\Rightarrow q = 600, p = 9$. M2: $MR = 12 - q/100 = 3 \\Rightarrow q = 900, p = 7.5$. M1 has the less elastic demand at the optimum and the higher price.",
      tag: "Ch23",
    },
    {
      prompt: "Under 3rd-degree price discrimination, the monopolist charges a higher price in the market with:",
      options: [
        "More elastic demand",
        "Less elastic demand",
        "Lower marginal cost",
        "Smaller population",
      ],
      answer: 1,
      explanation: "By Lerner: $\\frac{p_i - MC}{p_i} = \\frac{1}{|\\varepsilon_i|}$. Smaller $|\\varepsilon_i|$ (less elastic) ⇒ higher markup ⇒ higher price.",
      tag: "Ch23",
    },
  ],

  // ============== SLOT 9 — Ch19 statutory incidence ==============
  [
    FINAL_MOCK[8],
    {
      prompt: "A $\\$2$ tax is legally remitted by producers. Demand is perfectly INELASTIC. Who bears the burden?",
      options: [
        "Producers fully",
        "Consumers fully",
        "50-50 split",
        "Cannot determine without supply elasticity",
      ],
      answer: 1,
      explanation: "Burden goes to the less elastic side. Perfectly inelastic demand ⇒ consumer share = 100%. Producers pass the entire tax through. (Statutory side is irrelevant.)",
      tag: "Ch19",
    },
    {
      prompt: "Government tax revenue from a per-unit tax $t$ in a competitive market equals:",
      options: [
        "$t$ multiplied by the no-tax quantity",
        "$t$ multiplied by the post-tax quantity actually traded",
        "$t$ multiplied by the consumer-side burden",
        "$t$ multiplied by the deadweight loss",
      ],
      answer: 1,
      explanation: "Revenue $= t \\times q_{\\text{post-tax}}$ — the actual quantity transacted, NOT the no-tax quantity (some trades disappear) and NOT any burden component.",
      tag: "Ch19",
    },
  ],

  // ============== SLOT 10 — Ch3 intertemporal ==============
  [
    FINAL_MOCK[9],
    {
      prompt: "A cat earns $m_1 = 10$ today and $m_2 = 21$ tomorrow. Interest rate $r = 0.05$ for both saving and borrowing. Maximum consumption today (if she borrows to the max) is:",
      options: ["$\\$30$", "$\\$31$", "$\\$20$", "$\\$10$"],
      answer: 0,
      explanation: "Lifetime budget: $c_1 \\leq m_1 + m_2/(1+r) = 10 + 21/1.05 = 10 + 20 = 30$. She can borrow up to $20$ today against tomorrow's $21$.",
      tag: "Ch3",
    },
    {
      prompt: "A consumer is a SAVER (net lender) in a two-period model if her chosen $c_1$ satisfies:",
      options: [
        "$c_1 > m_1$",
        "$c_1 < m_1$",
        "$c_1 = m_1$",
        "$c_1 < m_2$",
      ],
      answer: 1,
      explanation: "Saver = consumes less than current income, lends the difference. $c_1 < m_1$.",
      tag: "Ch3",
    },
  ],

  // ============== SLOT 11 — Ch19 numerical tax incidence ==============
  [
    FINAL_MOCK[10],
    {
      prompt: "Demand $q_d = 18 - p$, supply $q_s = 0.5p$. A $\\$3$ per-unit tax. Consumer-paid price $p_c$ equals:",
      options: ["$\\$12$", "$\\$13$", "$\\$14$", "$\\$15$"],
      answer: 1,
      explanation: "$p_c = (a + d t)/(b + d) = (18 + 0.5 \\cdot 3)/(1 + 0.5) = 19.5/1.5 = 13$. Consumer share $= d/(b+d) = 1/3$, so $\\Delta p_c = 1$ from $p^* = 12$.",
      tag: "Ch19",
    },
    {
      prompt: "Supply is perfectly elastic at a fixed marginal cost. A $\\$5$ per-unit tax causes the consumer price to rise by:",
      options: ["$\\$0$", "$\\$2.50$", "$\\$5$", "$\\$10$"],
      answer: 2,
      explanation: "Perfectly elastic supply ($d \\to \\infty$): consumer share $= d/(b+d) \\to 1$. Full pass-through: $\\Delta p_c = t = \\$5$. Producers bear nothing.",
      tag: "Ch19",
    },
  ],

  // ============== SLOT 12 — Ch19 DWL convexity ==============
  [
    FINAL_MOCK[11],
    {
      prompt: "Tripling a per-unit tax on a market with linear $D$ and $S$ generates a DWL that is:",
      options: [
        "Three times the original",
        "Nine times the original",
        "Six times the original",
        "Unchanged",
      ],
      answer: 1,
      explanation: "$DWL \\propto t^2$ for linear $D$ and $S$. Tripling $t$ multiplies DWL by $3^2 = 9$.",
      tag: "Ch19",
    },
    {
      prompt: "For linear demand and supply, the DWL of a per-unit tax grows with the tax rate as:",
      options: [
        "Linearly (proportional to $t$)",
        "Quadratically (proportional to $t^2$)",
        "Exponentially",
        "Logarithmically",
      ],
      answer: 1,
      explanation: "$DWL = \\tfrac{1}{2} t \\cdot \\Delta q$ and $\\Delta q$ itself is proportional to $t$. Thus $DWL \\propto t^2$.",
      tag: "Ch19",
    },
  ],

  // ============== SLOT 13 — Ch22 adverse selection ==============
  [
    FINAL_MOCK[12],
    {
      prompt: "The key distinction between adverse selection and moral hazard is:",
      options: [
        "Both are forms of the same problem",
        "Adverse selection = hidden TYPE before contracting; moral hazard = hidden ACTION after contracting",
        "Adverse selection only occurs in insurance",
        "Moral hazard only occurs in labour markets",
      ],
      answer: 1,
      explanation: "Adverse selection is PRE-contract (insurer can't see whether you're high-risk or low-risk). Moral hazard is POST-contract (insurer can't see whether you drive carelessly because you're insured).",
      tag: "Ch22",
    },
    {
      prompt: "Spence signalling achieves a separating equilibrium when:",
      options: [
        "The signal is free for everyone",
        "The signal is cheaper for high-productivity types than low-productivity types",
        "The signal is required by law",
        "Employers can directly observe productivity",
      ],
      answer: 1,
      explanation: "Spence: signal cost must differ across types. Cheaper for high-types ⇒ they signal, low-types don't mimic. Equal-cost signals carry no information.",
      tag: "Ch22",
    },
  ],

  // ============== SLOT 14 — Ch23 constant-elasticity Lerner ==============
  [
    FINAL_MOCK[13],
    {
      prompt: "Constant-elasticity demand with $|\\varepsilon| = 4$ and $MC = 3$. Profit-maximising monopoly price equals:",
      options: ["$\\$4$", "$\\$3.75$", "$\\$3$", "$\\$12$"],
      answer: 0,
      explanation: "$p = MC / (1 - 1/|\\varepsilon|) = 3 / (1 - 0.25) = 3 / 0.75 = 4$.",
      tag: "Ch23",
    },
    {
      prompt: "A monopolist's Lerner index $L = (p - MC)/p$ is observed to equal $1/3$. The implied (absolute) demand elasticity is:",
      options: ["$1/3$", "$3$", "$0.5$", "Cannot determine"],
      answer: 1,
      explanation: "$L = 1/|\\varepsilon| \\Rightarrow |\\varepsilon| = 1/L = 3$.",
      tag: "Ch23",
    },
  ],

  // ============== SLOT 15 — Ch19 choke-price tax ==============
  [
    FINAL_MOCK[14],
    {
      prompt: "Demand $q_d = 60 - 2p$, supply $q_s = 4p$. The smallest per-unit tax that eliminates trade is:",
      options: ["$10$", "$20$", "$30$", "$60$"],
      answer: 2,
      explanation: "Choke price $= 60/2 = 30$ (where $q_d = 0$). Supply minimum price $= 0$. Wedge that kills trade $= 30 - 0 = \\$30$.",
      tag: "Ch19",
    },
    {
      prompt: "$q_d = 20 - 4p$, $q_s = 2p$. The choke-price tax equals:",
      options: ["$5$", "$10$", "$15$", "$20$"],
      answer: 0,
      explanation: "Choke price $= 20/4 = 5$. $p_{\\min}^{\\text{supply}} = 0$. Wedge $= 5$.",
      tag: "Ch19",
    },
  ],
];

/**
 * Draw 15 questions for a Final Mock attempt — one from each MOCK_POOL slot.
 * Preserves the practice-test topical distribution (Ch13 ×1, Ch4-5 ×1,
 * Ch21 ×2, Ch18 ×1, Ch12 ×1, Ch23 ×3, Ch19 ×4, Ch3 ×1, Ch22 ×1) but each
 * attempt picks a different combination. ~3^15 ≈ 14 million distinct exams.
 *
 * If `seed` is omitted, uses Math.random(). With a seed, deterministic.
 */
export function generateFinalMock(seed) {
  const rng = seed == null ? Math.random : seededRandom(seed);
  return MOCK_POOL.map(slot => slot[Math.floor(rng() * slot.length)]);
}

/** Tiny mulberry32-style PRNG so seeded draws are stable across reloads. */
function seededRandom(seed) {
  let a = (seed | 0) || 1;
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
