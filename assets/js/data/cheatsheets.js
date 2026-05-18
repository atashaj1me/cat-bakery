// cheatsheets.js — the master registry of discoverable cheats.
//
// Each cheat has:
//   id              — stable identifier (used in localStorage)
//   title           — short headline, shown on the card
//   icon            — emoji shown on the card
//   category        — one of: consumer, producer, welfare, distortion, trade, externality, info, monopoly, meta
//   lockedHint      — vague clue shown when locked ("There's a trick about XYZ...")
//   content         — full markdown (KaTeX-aware) shown when unlocked
//   discoveryLine   — narrative line explaining how the player found it
//   unlock(ctx)     — predicate. ctx may contain: {trigger, chapterId, mcqIdx, correct,
//                     mode, day, phaseIdx, score, custom}
//   needs           — optional. number of times unlock(ctx) must return true before
//                     the cheat is revealed. Defaults to 1 (immediate).
//
// The unlock context is emitted by:
//   mcq.js                 → on each MCQ answer
//   chapter pages          → on sim score
//   days*.js phases        → on phase score  (via custom triggers)
//   essay walkthroughs     → on essay completion

const CONSUMER = "consumer", PRODUCER = "producer", WELFARE = "welfare",
      DISTORTION = "distortion", TRADE = "trade", EXTERNALITY = "externality",
      INFO = "info", MONOPOLY = "monopoly", META = "meta";

export const CHEATS = [
  // ============== CONSUMER (5) ==============
  {
    id: "cd-expenditure",
    icon: "🍰",
    title: "Cobb-Douglas constant expenditure shares",
    category: CONSUMER,
    lockedHint: "There's a pattern in how Cobb-Douglas cats spend. Find it.",
    content: `
      For utility $u = x^{\\alpha} y^{\\beta}$ and income $I$, the consumer spends EXACTLY
      the fraction $\\alpha/(\\alpha+\\beta)$ of income on $x$, regardless of prices.
      <p>$$x^* = \\frac{\\alpha}{\\alpha+\\beta} \\cdot \\frac{I}{p_x}$$</p>
      <strong>Why it matters:</strong> lets you skip the Lagrangian — answer in 5 seconds.<br>
      <strong>The trap:</strong> the SHARE is independent of prices; the QUANTITY scales with $1/p_x$.
    `,
    discoveryLine: "Discovered by answering the Cobb-Douglas expenditure-share MCQ correctly.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 0 && ctx.mcqIdx === 0 && ctx.correct,
  },
  {
    id: "mrs-equals-price-ratio",
    icon: "📐",
    title: "MRS = price ratio at interior optimum",
    category: CONSUMER,
    lockedHint: "At an interior tangent point, two ratios converge.",
    content: `
      At an interior consumer optimum: $\\dfrac{MU_x}{MU_y} = \\dfrac{p_x}{p_y}$ (MRS equals the price ratio).
      <br><br>
      <strong>Why it matters:</strong> reduces tangency problems to a single equation $+$ the budget line.<br>
      <strong>The trap:</strong> at a CORNER solution this fails — only the comparison of marginal-utility-per-coin matters.
    `,
    discoveryLine: "Discovered after correctly solving Penny Whiskers' Cobb-Douglas problem on Day 2 of Vanilla.",
    unlock: (ctx) => ctx.trigger === "day" && ctx.mode === "vanilla" && ctx.day === 2 && ctx.score >= 80,
  },
  {
    id: "quasi-zero-income-effect",
    icon: "💸",
    title: "Quasilinear → zero income effect on x",
    category: CONSUMER,
    lockedHint: "One utility class makes income changes irrelevant for one good.",
    content: `
      For $u(x, y) = v(x) + y$, the optimum $x^*$ depends ONLY on prices, never on income.
      All income shocks land entirely in the $y$ residual.
      <br><br>
      <strong>FOC:</strong> $v'(x) = p_x/p_y$.<br>
      <strong>Why it matters:</strong> for quasilinear preferences, CS exactly equals EV and CV — the welfare essay's saviour.
    `,
    discoveryLine: "Discovered by completing the quasilinear Sir Pawley phase in Apocalypse Day 1.",
    unlock: (ctx) => ctx.trigger === "apoc-phase" && ctx.day === 1 && ctx.phaseIdx === 1 && ctx.score >= 80,
  },
  {
    id: "ps-bang-bang",
    icon: "🎯",
    title: "Perfect substitutes → corner via bang-per-buck",
    category: CONSUMER,
    lockedHint: "Mittens the Engineer always picks one item only.",
    content: `
      For $u = ax + by$ (linear / perfect substitutes), spend ENTIRE budget on the good with higher
      utility-per-coin:
      <br>
      $\\quad$ If $a/p_x > b/p_y$ → buy only $x$.<br>
      $\\quad$ If $a/p_x < b/p_y$ → buy only $y$.<br>
      $\\quad$ If equal → indifferent across the budget line.
      <br><br>
      <strong>The trap:</strong> never an interior solution unless tangency happens to land exactly on the budget line.
    `,
    discoveryLine: "Discovered by correctly identifying Mittens the Engineer's purchase pattern.",
    unlock: (ctx) => ctx.trigger === "apoc-phase" && ctx.day === 1 && ctx.phaseIdx === 2 && ctx.score >= 80,
  },
  {
    id: "slutsky-signs",
    icon: "🔀",
    title: "Slutsky: SE always negative for own-price",
    category: CONSUMER,
    lockedHint: "Decompose a price change into two pieces. One always has a known sign.",
    content: `
      Slutsky decomposition: $\\Delta x = \\underbrace{SE}_{\\text{always } \\leq 0 \\text{ for } \\Delta p_x > 0} + \\underbrace{IE}_{\\text{sign depends on normality}}$
      <br><br>
      $\\quad$ Substitution Effect (Hicksian): $\\leq 0$ when own price rises. ALWAYS.<br>
      $\\quad$ Income Effect: $\\leq 0$ for normal goods, $> 0$ for inferior. Giffen needs |IE| > |SE| on a strongly inferior good.<br><br>
      <strong>The trap:</strong> sign-of-IE depends on whether the good is normal or inferior. Cobb-Douglas → both effects always negative for own-price rise.
    `,
    discoveryLine: "Discovered by acing all four Slutsky phases on Apocalypse Day 2.",
    unlock: (ctx) => ctx.trigger === "apoc-day-complete" && ctx.day === 2 && ctx.avgScore >= 85,
  },

  // ============== PRODUCER (4) ==============
  {
    id: "sqrt-foc",
    icon: "√",
    title: "√-production FOC: L* = (ap/2w)²",
    category: PRODUCER,
    lockedHint: "Old Tomcat's √-tech has a single closed form. Memorise it.",
    content: `
      For $y = a\\sqrt{L}$:
      <p>$$L^* = \\left(\\frac{a p}{2 w}\\right)^2, \\qquad y^* = \\frac{a^2 p}{2 w}, \\qquad \\pi^* = \\frac{a^2 p^2}{4 w}$$</p>
      <strong>Where it appears:</strong> Final practice MCQ 6 (two-input version), Vanilla Day 1, almost every √-tech roll.<br>
      <strong>The trap:</strong> if your tech is $L^{1/3}$ or $\\ln(1+L)$, the FOC is different. Always start from $p \\cdot MP_L = w$.
    `,
    discoveryLine: "Discovered by correctly setting L* in the √-tech production MCQ.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 0 && ctx.mcqIdx === 2 && ctx.correct,
  },
  {
    id: "cost-min-tangency",
    icon: "✂️",
    title: "Cost-min: equal bang-per-buck across inputs",
    category: PRODUCER,
    lockedHint: "Two inputs. One tangency condition.",
    content: `
      Cost minimisation at fixed output: $\\dfrac{MP_1}{w_1} = \\dfrac{MP_2}{w_2}$ — equivalently $\\dfrac{MP_1}{MP_2} = \\dfrac{w_1}{w_2}$.
      <br><br>
      <strong>Why it matters:</strong> the producer mirror of MRS = price ratio. Reduces multi-input problems to one equation $+$ the production constraint.<br>
      <strong>The trap:</strong> for Cobb-Douglas $y = x_1^{\\alpha} x_2^{\\beta}$, this gives $\\dfrac{\\alpha/x_1}{\\beta/x_2} = \\dfrac{w_1}{w_2}$.
    `,
    discoveryLine: "Discovered by acing the cost-minimization MCQ.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 0 && ctx.mcqIdx === 6 && ctx.correct,
  },
  {
    id: "rts-from-exponents",
    icon: "📈",
    title: "Returns to scale from Cobb-Douglas exponents",
    category: PRODUCER,
    lockedHint: "For $y = x_1^{\\alpha} x_2^{\\beta}$, the sum tells you a story.",
    content: `
      For Cobb-Douglas production $y = x_1^{\\alpha} x_2^{\\beta}$:
      <br>
      $\\quad \\alpha + \\beta = 1$ → constant returns to scale<br>
      $\\quad \\alpha + \\beta > 1$ → increasing returns<br>
      $\\quad \\alpha + \\beta < 1$ → decreasing returns
      <br><br>
      <strong>The trap:</strong> returns to SCALE (all inputs scale together) is DIFFERENT from marginal returns to a single input.
      A Cobb-Douglas function can have diminishing $MP_L$ AND constant returns to scale simultaneously.
    `,
    discoveryLine: "Discovered by correctly classifying $y = x_1^{0.5} x_2^{0.5}$ as constant RTS.",
    unlock: (ctx) => ctx.trigger === "apoc-phase" && ctx.day === 3 && ctx.phaseIdx === 2 && ctx.score >= 80,
  },
  {
    id: "sr-ac-envelope",
    icon: "🪣",
    title: "LR AC is the lower envelope of SR AC curves",
    category: PRODUCER,
    lockedHint: "Why does the long run never cost MORE than the short run?",
    content: `
      Long-run AC always $\\leq$ short-run AC. In the long run you can re-optimise ALL inputs;
      in the short run only some. So LR AC is the LOWER ENVELOPE of all SR AC curves.
      <br><br>
      <strong>Corollary:</strong> LR supply is more elastic than SR supply.<br>
      <strong>The trap:</strong> SR AC equals LR AC only at the SR's optimal output for the fixed input level.
    `,
    discoveryLine: "Discovered by correctly comparing SR vs LR AC in Apocalypse Day 3.",
    unlock: (ctx) => ctx.trigger === "apoc-phase" && ctx.day === 3 && ctx.phaseIdx === 3 && ctx.score >= 80,
  },

  // ============== WELFARE / EQUILIBRIUM (4) ==============
  {
    id: "lin-eq-formula",
    icon: "⚖️",
    title: "Linear equilibrium: p* = (a − c)/(b + d)",
    category: WELFARE,
    lockedHint: "Linear demand, linear supply, one formula for clearing.",
    content: `
      For $q_d = a - b p$ and $q_s = c + d p$, the market-clearing price is
      <p>$$p^* = \\frac{a - c}{b + d}, \\qquad q^* = a - b p^*$$</p>
      <strong>Why it matters:</strong> one of the half-dozen formulas that solve 80% of welfare problems.<br>
      <strong>The trap:</strong> $b$ is the COEFFICIENT in $q_d = a - bp$, not the slope of inverse demand.
    `,
    discoveryLine: "Discovered after correctly finding the clearing price in Market Day.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 1 && ctx.correct,
    needs: 2,
  },
  {
    id: "cs-ps-triangles",
    icon: "△",
    title: "CS and PS are triangles for linear D/S",
    category: WELFARE,
    lockedHint: "Two triangles meet at equilibrium.",
    content: `
      For linear demand and supply at price $p$:
      <p>$$CS = \\tfrac{1}{2}(p_{\\text{choke}} - p) \\cdot q_d, \\quad PS = \\tfrac{1}{2}(p - p_{\\min}) \\cdot q_s$$</p>
      where $p_{\\text{choke}} = a/b$ and $p_{\\min} = -c/d$ (where supply hits 0).
      <br><br>
      <strong>The trap:</strong> at a non-clearing price (e.g. under a ceiling), use the TRADED quantity $\\min(q_d, q_s)$, not both separately.
    `,
    discoveryLine: "Discovered by computing CS and PS at the clearing price multiple times.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 1 && ctx.correct,
    needs: 3,
  },
  {
    id: "choke-wedge-kills-trade",
    icon: "🚫",
    title: "Choke-wedge tax kills trade entirely",
    category: WELFARE,
    lockedHint: "There's a tax rate at which the market collapses to zero. Find its formula.",
    content: `
      The smallest tax $t$ that drives quantity traded to zero is
      <p>$$t^{\\text{kill}} = p_{\\text{choke}} - p_{\\min}^{\\text{supply}} = \\frac{a}{b} - \\frac{-c}{d}$$</p>
      <strong>Why it matters:</strong> Final-practice MCQ 15 asked exactly this. The "$30/3 = 10$" answer.<br>
      <strong>The trap:</strong> if $c > 0$ the supply has $p_{\\min} > 0$, so the wedge is shorter than naïve $a/b$.
    `,
    discoveryLine: "Discovered by acing the choke-wedge tax problem.",
    unlock: (ctx) => (ctx.trigger === "hell-phase" && ctx.day === 4 && ctx.score >= 80)
                  || (ctx.trigger === "apoc-phase" && ctx.day === 8 && ctx.phaseIdx === 0 && ctx.score >= 80),
  },
  {
    id: "lr-comp-eq",
    icon: "🏛️",
    title: "LR competitive eq: P = MC = min AC",
    category: WELFARE,
    lockedHint: "Long-run competition pins three curves to a single point.",
    content: `
      In long-run competitive equilibrium with free entry/exit:
      <p>$$P = MC = \\min AC, \\qquad \\pi_{\\text{econ}} = 0$$</p>
      $MC$ intersects $AC$ at $\\min AC$ — the firm produces at that quantity.
      <br><br>
      <strong>The trap:</strong> NOT $P = \\min MC$ (a common distractor). NOT $P = \\min AVC$ (that's the SR shutdown condition).
    `,
    discoveryLine: "Discovered by answering the long-run equilibrium MCQ correctly.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 1 && ctx.mcqIdx === 0 && ctx.correct,
  },

  // ============== DISTORTIONS (5) ==============
  {
    id: "incidence-elasticity",
    icon: "⚓",
    title: "Tax burden: less elastic side bears more",
    category: DISTORTION,
    lockedHint: "Burden splits inversely with elasticity.",
    content: `
      For $q_d = a - bp$, $q_s = c + dp$, tax $t$:
      <p>$$\\Delta p_c = \\frac{d}{b + d} \\cdot t, \\qquad \\Delta p_s = -\\frac{b}{b + d} \\cdot t$$</p>
      The LESS elastic side (smaller $|dq/dp|$) bears MORE of the burden.
      <br><br>
      <strong>The trap:</strong> statutory incidence (who legally pays) ≠ economic incidence (who bears the burden). The split depends on elasticities, not the law.
    `,
    discoveryLine: "Discovered by answering the tax-incidence MCQ correctly twice.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 2 && ctx.mcqIdx === 2 && ctx.correct,
  },
  {
    id: "dwl-t-squared",
    icon: "📐²",
    title: "DWL grows as t² (the doubling rule)",
    category: DISTORTION,
    lockedHint: "Quadruple-not-double. Watch what happens when tax doubles.",
    content: `
      For linear $D$ and $S$ with tax $t$: $\\quad DWL = \\dfrac{1}{2} \\cdot t \\cdot \\Delta q$, where $\\Delta q \\propto t$.
      <br>
      Therefore: $DWL \\propto t^2$. <strong>Doubling $t$ quadruples DWL.</strong>
      <br><br>
      <strong>Why it matters:</strong> a top-3 exam trap. The intuition is "DWL is the area of a triangle whose base AND height both scale with $t$".<br>
      <strong>The corollary:</strong> small taxes have negligible DWL; large taxes have catastrophic DWL.
    `,
    discoveryLine: "Discovered by acing the doubling-the-tax DWL problem.",
    unlock: (ctx) => (ctx.trigger === "mcq" && ctx.chapterId === 2 && ctx.mcqIdx === 1 && ctx.correct)
                  || (ctx.trigger === "hell-phase" && ctx.day === 2 && ctx.phaseIdx === 2 && ctx.score >= 80),
  },
  {
    id: "laffer-peak",
    icon: "🗻",
    title: "Laffer peak: t* = (a − c) / (2b)",
    category: DISTORTION,
    lockedHint: "Revenue is concave in t. There's a peak.",
    content: `
      For linear $D$ and $S$, tax revenue $R(t) = t \\cdot q(t)$ is concave in $t$. The revenue-maximising rate is
      <p>$$t^* = \\frac{a - c}{2 b}$$</p>
      With equal slopes through the origin, $t^*$ is HALF the choke-wedge.
      <br><br>
      <strong>The trap:</strong> $R_{\\max}$ does NOT imply zero DWL — the triangle is still there at the peak.
    `,
    discoveryLine: "Discovered by finding the optimal Laffer tax on Hell Day 3.",
    unlock: (ctx) => ctx.trigger === "hell-phase" && ctx.day === 3 && ctx.phaseIdx === 0 && ctx.score >= 80,
  },
  {
    id: "subsidy-over-produces",
    icon: "💝",
    title: "Subsidies over-produce → their own DWL",
    category: DISTORTION,
    lockedHint: "Subsidies are taxes-in-reverse. The triangle still exists.",
    content: `
      A per-unit subsidy of $s$ shifts the supply curve DOWN by $s$. Quantity expands past $q^*$. DWL emerges between $q^*$ and $q^{\\text{sub}}$:
      <p>$$DWL_{\\text{sub}} = \\tfrac{1}{2} \\cdot s \\cdot (q^{\\text{sub}} - q^*)$$</p>
      <strong>Why it matters:</strong> the Essay 1 punch-line — Prince's subsidy to clear the shortage creates a DWL ~10× larger than the ceiling alone.<br>
      <strong>The trap:</strong> "subsidies have no DWL because everyone wins" — wrong. They distort in the opposite direction.
    `,
    discoveryLine: "Discovered by completing Essay 1 part (e) — subsidy DWL.",
    unlock: (ctx) => ctx.trigger === "essay1" && ctx.score >= 70,
  },
  {
    id: "ceiling-dwl-formula",
    icon: "🏚️",
    title: "Price-ceiling DWL formula",
    category: DISTORTION,
    lockedHint: "A binding ceiling creates a triangle. There's a single formula.",
    content: `
      With binding ceiling $p_{\\max}$ on linear $D, S$:
      <p>$$DWL = \\tfrac{1}{2}(q^* - q_s) \\cdot (D(q_s) - p_{\\max})$$</p>
      Vertices of the triangle: $(q_s, p_{\\max})$, $(q_s, D(q_s))$, $(q^*, p^*)$.
      <br><br>
      <strong>The trap:</strong> the height of the triangle is NOT $p^* - p_{\\max}$. It's $D(q_s) - p_{\\max}$ — the marginal willingness-to-pay at the supply-restricted quantity.
    `,
    discoveryLine: "Discovered by completing Essay 1 part (c).",
    unlock: (ctx) => ctx.trigger === "essay1" && ctx.score >= 50,
  },

  // ============== TRADE (3) ==============
  {
    id: "tariff-equals-quota",
    icon: "📦",
    title: "Tariff = quota economically; rent goes elsewhere",
    category: TRADE,
    lockedHint: "Two policies, same price wedge, different beneficiary.",
    content: `
      A tariff $t$ and a quota of equivalent size $Q^* = M(t)$ produce the SAME domestic price and quantity. CS and PS changes are IDENTICAL.
      <br><br>
      <strong>Difference:</strong> the rectangle $t \\times Q^*$ goes to
      <br>
      $\\quad$ Government with a tariff (collected as revenue).<br>
      $\\quad$ Domestic licence-holders OR foreign exporters with a quota (depends on who has the licence).
      <br><br>
      <strong>The trap:</strong> if licences are granted free to FOREIGN exporters, the rent leaves the country — strictly worse than a tariff.
    `,
    discoveryLine: "Discovered by completing the quota-vs-tariff problem on Hell Day 5.",
    unlock: (ctx) => ctx.trigger === "hell-phase" && ctx.day === 5 && ctx.score >= 80,
  },
  {
    id: "tariff-two-triangles",
    icon: "△△",
    title: "Tariff DWL = production triangle + consumption triangle",
    category: TRADE,
    lockedHint: "The tariff diagram has FOUR shaded regions. Two are transfers, two are DWL.",
    content: `
      A tariff in the importing country creates FOUR shaded areas:
      <br>
      $\\quad$ <strong>Transfer to producers</strong> (rectangle on the left)<br>
      $\\quad$ <strong>Production-distortion DWL</strong> (left triangle — domestic firms over-produce)<br>
      $\\quad$ <strong>Government revenue</strong> (rectangle in the middle)<br>
      $\\quad$ <strong>Consumption-distortion DWL</strong> (right triangle — consumers under-consume)
      <br><br>
      Net DWL to the country = left triangle + right triangle. The rectangles are transfers, not losses.
    `,
    discoveryLine: "Discovered after the tariff essay was completed with at least 75/100.",
    unlock: (ctx) => ctx.trigger === "essay2" && ctx.score >= 75,
  },
  {
    id: "comparative-advantage",
    icon: "🌍",
    title: "Free trade gains via comparative advantage",
    category: TRADE,
    lockedHint: "Why does trade make BOTH countries better off, even one with no absolute advantage?",
    content: `
      Comparative advantage: even a country with WORSE absolute productivity at everything still gains
      from trade by specialising in what has the LOWEST opportunity cost.
      <br><br>
      Both countries' total output rises with specialisation; gains are redistributed via the world price.
      Losers within each country can theoretically be compensated by winners.
      <br><br>
      <strong>The trap:</strong> "we should make everything ourselves to avoid trade dependency" misunderstands comparative advantage. Self-sufficiency is strictly inefficient.
    `,
    discoveryLine: "Discovered by answering the comparative-advantage MCQ correctly.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 3 && ctx.mcqIdx === 5 && ctx.correct,
  },

  // ============== EXTERNALITIES (3) ==============
  {
    id: "pigouvian-at-social",
    icon: "🚭",
    title: "Pigouvian: t* = MEC at the social optimum quantity",
    category: EXTERNALITY,
    lockedHint: "Where do you evaluate MEC — at the private q or the social q?",
    content: `
      Optimal Pigouvian tax is the marginal external cost, evaluated at the SOCIAL OPTIMUM quantity $q^S$ (not the private $q^N$):
      <p>$$t^* = MEC(q^S)$$</p>
      With constant $MEC$ (no $q$-dependence), this distinction vanishes. With convex $MEC$, evaluate at $q^S$.
      <br><br>
      <strong>The trap:</strong> "Pigouvian raises revenue for enforcement" — wrong. Revenue is a by-product; the goal is to ALIGN private and social MC at the efficient quantity.
    `,
    discoveryLine: "Discovered by answering the optimal-Pigouvian MCQ correctly.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 4 && ctx.mcqIdx === 5 && ctx.correct,
  },
  {
    id: "coase-invariance",
    icon: "🤝",
    title: "Coase invariance: efficient q is independent of who holds the right",
    category: EXTERNALITY,
    lockedHint: "Property rights determine WHO PAYS, but not the efficient outcome.",
    content: `
      With zero transaction costs and well-defined property rights, the bargained-to outcome reaches the SAME efficient $q^*$ regardless of whether the polluter or the victim holds the right.
      <br><br>
      $\\quad$ Victim holds right → polluter pays victim to pollute up to $q^*$.<br>
      $\\quad$ Polluter holds right → victim pays polluter to abate down to $q^*$.<br><br>
      <strong>The trap:</strong> non-zero transaction costs break Coase. With many small victims (air pollution), bargaining is infeasible; you need a Pigouvian wedge.
    `,
    discoveryLine: "Discovered by acing the Coase invariance check on Apocalypse Day 9.",
    unlock: (ctx) => ctx.trigger === "apoc-phase" && ctx.day === 9 && ctx.phaseIdx === 3 && ctx.score >= 80,
  },
  {
    id: "positive-ext-underconsumes",
    icon: "💉",
    title: "Positive externality → market UNDER-consumes",
    category: EXTERNALITY,
    lockedHint: "Vaccines, education, lighthouses. What does the unregulated market do?",
    content: `
      Positive externality in consumption (e.g. vaccines):
      $\\quad MSB > MPB$ at every $q$.<br>
      $\\quad$ Private market consumes only up to where $MPB = MC$.<br>
      $\\quad$ Social optimum: $MSB = MC$, which is MORE consumption.<br>
      $\\quad$ Corrective wedge: a SUBSIDY equal to the marginal external BENEFIT.
      <br><br>
      <strong>The trap:</strong> "positive externality means consuming too MUCH" — backwards. Positive externality means others benefit from your consumption, but you ignore that, so you consume LESS than is socially optimal.
    `,
    discoveryLine: "Discovered by correctly identifying the under-consumption direction.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 4 && ctx.mcqIdx === 4 && ctx.correct,
  },

  // ============== ASYMMETRIC INFO (2) ==============
  {
    id: "akerlof-lemons",
    icon: "🍋",
    title: "Lemons drive out peaches",
    category: INFO,
    lockedHint: "Bad quality wins when buyers can't tell.",
    content: `
      Akerlof (1970): when quality is hidden, buyers offer the AVERAGE expected value. Sellers of high-quality items
      refuse to sell at the average → average drops → more high-quality exit → unraveling.
      <br><br>
      In the limit: <strong>only low-quality goods are traded</strong>. Insurance version: only high-risk types buy at the pooled premium.
      <br><br>
      <strong>The trap:</strong> "high quality drives out low" — backwards. <em>Bad money drives out good (Gresham's law)</em>, and lemons drive out peaches.
    `,
    discoveryLine: "Discovered by correctly identifying the Akerlof equilibrium.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 5 && ctx.mcqIdx === 1 && ctx.correct,
  },
  {
    id: "screening-ic-binds",
    icon: "📋",
    title: "Screening: high-type's IC constraint binds tightly",
    category: INFO,
    lockedHint: "Two contracts. One person's incentive constraint determines everything.",
    content: `
      In a separating insurance/contract menu, the LOW-type's coverage is set so that the HIGH-type is indifferent
      between their own (full) contract and mimicking the low-type's contract. This IC binds at the optimum.
      <br><br>
      For two risk types $\\pi_L, \\pi_H$, loss $L$: high gets full coverage at $\\pi_H L$; low gets coverage
      $k_L^* = \\frac{\\pi_H - \\pi_L}{1 - \\pi_L} L$ at fair price $\\pi_L k_L^*$.
      <br><br>
      <strong>The trap:</strong> first-best (full coverage for both) is unattainable under asymmetric info. The "second best" is the screening menu — strictly less efficient than first-best but still better than pooling.
    `,
    discoveryLine: "Discovered by acing the screening menu phase on Apocalypse Day 10.",
    unlock: (ctx) => ctx.trigger === "apoc-phase" && ctx.day === 10 && ctx.phaseIdx === 2 && ctx.score >= 80,
  },

  // ============== MONOPOLY (4) ==============
  {
    id: "lerner-index",
    icon: "📊",
    title: "Lerner index = 1/|ε|",
    category: MONOPOLY,
    lockedHint: "Monopoly markup is inversely related to ONE thing.",
    content: `
      Lerner index: $L = \\dfrac{P - MC}{P}$. For a profit-max monopolist with constant-elasticity demand:
      <p>$$L = \\frac{1}{|\\varepsilon|}, \\qquad P = \\frac{MC}{1 - 1/|\\varepsilon|}$$</p>
      <strong>Why it matters:</strong> the single most exam-able monopoly formula. $\\varepsilon = -3,\\ MC = 1 \\Rightarrow P = 1.5$.<br>
      <strong>The trap:</strong> only valid for constant-elasticity demand. For linear demand, elasticity varies along the curve.
    `,
    discoveryLine: "Discovered by acing the constant-elasticity monopoly price MCQ.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 6 && ctx.mcqIdx === 0 && ctx.correct,
  },
  {
    id: "half-pass-through",
    icon: "½",
    title: "Monopoly + linear demand + tax → Δp = t/2",
    category: MONOPOLY,
    lockedHint: "Common intuition says the monopolist passes the full tax. Common intuition is wrong here.",
    content: `
      For a monopolist with LINEAR demand $p = \\alpha - \\beta q$ and per-unit tax $t$:
      <p>$$\\Delta p = \\frac{t}{2}$$</p>
      Only HALF the tax is passed to consumers. The monopolist absorbs the other half (its MR slope is twice the demand slope).
      <br><br>
      <strong>The trap:</strong> with constant-elasticity demand the pass-through is full (or more). Half-pass-through is specific to LINEAR demand.
    `,
    discoveryLine: "Discovered by correctly computing Δp = 4 in the monopoly-plus-tax problem.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 6 && ctx.mcqIdx === 1 && ctx.correct,
  },
  {
    id: "third-deg-pd-rule",
    icon: "🌐",
    title: "Third-degree PD: equate MR across markets",
    category: MONOPOLY,
    lockedHint: "Multiple markets, one monopolist, one optimisation rule.",
    content: `
      A monopolist selling in multiple separated markets with constant $MC$ sets:
      <p>$$MR_1 = MR_2 = \\cdots = MC$$</p>
      Less elastic market $\\Rightarrow$ higher price. By Lerner: $\\dfrac{p_i - MC}{p_i} = \\dfrac{1}{|\\varepsilon_i|}$ in each market.
      <br><br>
      <strong>The trap:</strong> NOT equate prices. NOT equate quantities. ALWAYS equate marginal revenues.
    `,
    discoveryLine: "Discovered by answering the 3rd-degree PD MCQ correctly.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 6 && ctx.mcqIdx === 2 && ctx.correct,
  },
  {
    id: "natural-monopoly-loss",
    icon: "💸",
    title: "Natural monopoly: P = MC ⇒ losses",
    category: MONOPOLY,
    lockedHint: "Regulating efficiently in a natural monopoly has a cost.",
    content: `
      Natural monopoly = decreasing $AC$ over the relevant range ⇒ $MC < AC$ everywhere.
      <br>
      Setting $P = MC$ (the efficient first-best) ⇒ $P < AC$ ⇒ <strong>firm loses money</strong> and exits unless subsidised.
      <br><br>
      Regulators face the dilemma: <br>
      $\\quad$ $P = MC$ → efficient, but needs subsidy.<br>
      $\\quad$ $P = AC$ → second-best, firm breaks even but DWL > 0.
      <br><br>
      <strong>Where it appears:</strong> utility regulation (water, electricity, broadband).
    `,
    discoveryLine: "Discovered by answering the natural-monopoly MCQ correctly.",
    unlock: (ctx) => ctx.trigger === "mcq" && ctx.chapterId === 6 && ctx.mcqIdx === 5 && ctx.correct,
  },

  // ============== META (2) ==============
  {
    id: "essay-recipe",
    icon: "📋",
    title: "The welfare-essay recipe (Essay 1 archetype)",
    category: META,
    lockedHint: "Seven steps. They go in this order, always.",
    content: `
      The full sequence for a welfare-essay (price ceiling, tax, subsidy variants):
      <ol>
        <li>Solve eq without intervention → $p^*, q^*$.</li>
        <li>Apply the distortion. Compute $q_d, q_s$, shortage or surplus.</li>
        <li>Draw the diagram: vertices, dashed lines, shaded regions.</li>
        <li>Compute the DWL triangle: $\\frac{1}{2} \\cdot$ base $\\cdot$ height.</li>
        <li>Compute the policy alternative (subsidy to clear, equivalent tariff, etc.).</li>
        <li>Compare DWLs across alternatives. Verdict on efficiency grounds.</li>
        <li>If quasilinear: compute waiting-time or other quasi-cash penalty.</li>
      </ol>
      <strong>The trap:</strong> doing the steps OUT OF ORDER. The diagram is step 3 because you need the eq numbers from step 1 to label it.
    `,
    discoveryLine: "Discovered by completing the full Essay 1 walkthrough at any difficulty.",
    unlock: (ctx) => ctx.trigger === "essay1",
  },
  {
    id: "unit-check",
    icon: "🧮",
    title: "Always sanity-check units",
    category: META,
    lockedHint: "Cents per loaf is not the same as cents per pastry.",
    content: `
      Exam questions sometimes mix units mid-prompt: $p$ in cents/loaf, wage in coins/hour, hours of waiting cost.
      <br><br>
      Sanity-check rules:<br>
      $\\quad$ Multiply prices by quantities only if both are in the same unit of currency.<br>
      $\\quad$ DWL is in coin-units; if your number is too large or too small by a factor of 60 or 100, you've mixed cents and coins.<br>
      $\\quad$ Waiting time $h = (WTP - p_{\\max})/w_h$ where $w_h$ is currency-per-hour.
      <br><br>
      <strong>The trap:</strong> 30-second exam questions are designed to test whether you catch unit mismatches. ALWAYS check.
    `,
    discoveryLine: "Discovered by spending 5+ minutes in the same chapter — you've learned to slow down and check.",
    unlock: (ctx) => ctx.trigger === "any" && ctx.persistMinutes >= 5,
    // simpler — unlock when any 3 cheats are already unlocked
  },
];

// Convenience lookups
export const CHEAT_BY_ID = Object.fromEntries(CHEATS.map(c => [c.id, c]));

export const CHEAT_CATEGORIES = {
  consumer:    { label: "Consumer theory", color: "#a8d6f0" },
  producer:    { label: "Producer theory", color: "#d6a8f0" },
  welfare:     { label: "Welfare & eq", color: "#d4a574" },
  distortion:  { label: "Distortions", color: "#e08c6e" },
  trade:       { label: "Trade", color: "#9bc476" },
  externality: { label: "Externalities", color: "#7ab8d8" },
  info:        { label: "Asym. info", color: "#e3b758" },
  monopoly:    { label: "Monopoly", color: "#c896ff" },
  meta:        { label: "Meta-tricks", color: "#f0c0ff" },
};
