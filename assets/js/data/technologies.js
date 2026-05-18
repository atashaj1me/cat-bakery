// technologies.js — Inheritable production technologies.
//
// Each cat baker chooses (or rolls) a father, inheriting that bakery's
// production technology. Single-input (labor L) short-run, with output
// price p and wage w. All four have closed-form profit-max optima.
//
// Each tech entry returns:
//   y(L)         — production function
//   profit(L)    — π = p·y(L) - w·L
//   optimumL(p,w)— argmax_L profit
//   optimumY(p,w)— y at optimum
//   optimumProfit(p,w)
//   foc          — LaTeX string of the first-order condition

export const TECHS = {
  // Father #1 — the classic √L
  tomcat: {
    id: "tomcat",
    name: "Old Tomcat",
    emoji: "🐈‍⬛",
    fatherStory: "Tail-flicking traditionalist. Sells <strong>concave</strong> diminishing-returns bakeries.",
    formula: "y = a\\sqrt{L}",
    paramHint: "a controls how fast the first bakers turn flour into loaves",
    defaultParams: { a: 4 },
    y:        (L, { a }) => a * Math.sqrt(Math.max(0, L)),
    profit:   (L, { a }, p, w) => p * a * Math.sqrt(Math.max(0, L)) - w * L,
    optimumL: ({ a }, p, w) => Math.pow((a * p) / (2 * w), 2),
    optimumY: ({ a }, p, w) => a * Math.sqrt(Math.pow((a * p) / (2 * w), 2)),
    optimumProfit: ({ a }, p, w) => (a * a * p * p) / (4 * w),
    foc: "p \\cdot \\frac{a}{2\\sqrt{L}} = w \\;\\Rightarrow\\; L^* = \\left(\\frac{a p}{2 w}\\right)^2",
  },

  // Father #2 — cube root, milder concavity
  cubist: {
    id: "cubist",
    name: "Cubist Carl",
    emoji: "🐈",
    fatherStory: "Avant-garde, splashy. Tries to push more output by hiring deeper, but the curve is flatter near zero.",
    formula: "y = a \\, L^{1/3}",
    paramHint: "marginal product is a/(3L^{2/3}) — falls more slowly than √",
    defaultParams: { a: 5 },
    y:        (L, { a }) => a * Math.cbrt(Math.max(0, L)),
    profit:   (L, { a }, p, w) => p * a * Math.cbrt(Math.max(0, L)) - w * L,
    optimumL: ({ a }, p, w) => Math.pow((a * p) / (3 * w), 1.5),
    optimumY: ({ a }, p, w) => a * Math.cbrt(Math.pow((a * p) / (3 * w), 1.5)),
    optimumProfit: ({ a }, p, w) => {
      const L = Math.pow((a * p) / (3 * w), 1.5);
      return p * a * Math.cbrt(L) - w * L;
    },
    foc: "p \\cdot \\frac{a}{3 L^{2/3}} = w \\;\\Rightarrow\\; L^* = \\left(\\frac{a p}{3 w}\\right)^{3/2}",
  },

  // Father #3 — quadratic, smooth peak
  quigley: {
    id: "quigley",
    name: "Quad Quigley",
    emoji: "🐅",
    fatherStory: "Engineer. Output peaks then DECLINES (over-crowding the oven).",
    formula: "y = a L - b L^2",
    paramHint: "max output at L = a/(2b); declines past that",
    defaultParams: { a: 8, b: 0.25 },
    y:        (L, { a, b }) => Math.max(0, a * L - b * L * L),
    profit:   (L, { a, b }, p, w) => p * (a * L - b * L * L) - w * L,
    optimumL: ({ a, b }, p, w) => Math.max(0, (a * p - w) / (2 * b * p)),
    optimumY: ({ a, b }, p, w) => {
      const L = Math.max(0, (a * p - w) / (2 * b * p));
      return a * L - b * L * L;
    },
    optimumProfit: ({ a, b }, p, w) => {
      const L = Math.max(0, (a * p - w) / (2 * b * p));
      return p * (a * L - b * L * L) - w * L;
    },
    foc: "p(a - 2bL) = w \\;\\Rightarrow\\; L^* = \\frac{a p - w}{2 b p}",
  },

  // Father #4 — logarithmic, gentle never-ending growth
  loggia: {
    id: "loggia",
    name: "Logarithmic Lou",
    emoji: "🐈",
    fatherStory: "Philosopher. Believes in <em>slow, steady growth</em>. Output rises forever but ever more slowly.",
    formula: "y = a \\ln(1 + L)",
    paramHint: "MP at L = 0 is a; at L = 9 it's a/10",
    defaultParams: { a: 10 },
    y:        (L, { a }) => a * Math.log(1 + Math.max(0, L)),
    profit:   (L, { a }, p, w) => p * a * Math.log(1 + Math.max(0, L)) - w * L,
    optimumL: ({ a }, p, w) => Math.max(0, (a * p) / w - 1),
    optimumY: ({ a }, p, w) => a * Math.log(1 + Math.max(0, (a * p) / w - 1)),
    optimumProfit: ({ a }, p, w) => {
      const L = Math.max(0, (a * p) / w - 1);
      return p * a * Math.log(1 + L) - w * L;
    },
    foc: "p \\cdot \\frac{a}{1 + L} = w \\;\\Rightarrow\\; L^* = \\frac{a p}{w} - 1",
  },
};

export const TECH_LIST = Object.values(TECHS);

export function getTech(id) { return TECHS[id] || TECHS.tomcat; }

// Random pick — used by the slot machine.
export function rollTech() {
  const ids = Object.keys(TECHS);
  return ids[Math.floor(Math.random() * ids.length)];
}

if (typeof window !== "undefined") window.Techs = TECHS;
