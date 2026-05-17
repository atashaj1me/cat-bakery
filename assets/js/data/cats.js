// cats.js — recurring NPC roster.
//
// Each cat has a utility class. The campaign uses these to compute
// "who would buy what at your prices" for the daily consequence cinematic.

export const CATS = {
  penny: {
    id: "penny", name: "Penny Whiskers", emoji: "🐱",
    blurb: "The first regular. Splits her coins evenly between bread and pastry.",
    type: "cobbDouglas",
    params: { alpha: 1, beta: 1, income: 12 },   // even Cobb-Douglas weights
    favourite: "loaf",
  },
  pawley: {
    id: "pawley", name: "Sir Pawley III", emoji: "🤵",
    blurb: "Wealthy. Wants cake. Won't haggle below his reservation price.",
    type: "quasilinear",
    params: { a: 8, reservation: 18, focus: "cake" },  // v(x) = a·√x
    favourite: "cake",
  },
  engineer: {
    id: "engineer", name: "Mittens the Engineer", emoji: "🐈‍⬛",
    blurb: "Buys whichever item gives the most calories per coin.",
    type: "perfectSubs",
    params: { caloriesPerLoaf: 4, caloriesPerBaguette: 5, budget: 8 },
    favourite: "calories",
  },
  inspector: {
    id: "inspector", name: "Inspector Mittens", emoji: "👮",
    blurb: "Refuses anything not baked today. A walking freshness alarm.",
    type: "freshOnly",
    params: { alpha: 1, beta: 1, income: 10 },
    favourite: "freshness",
  },
  cream: {
    id: "cream", name: "Baroness Cream", emoji: "🐈",
    blurb: "Adores croissants. Pays whatever to get a fresh one.",
    type: "quasilinear",
    params: { a: 6, reservation: 14, focus: "croissant" },
    favourite: "croissant",
  },
  baron: {
    id: "baron", name: "Baron Whiskerton", emoji: "🎩",
    blurb: "Your rival baker. Tries to undercut you. Retires on Day 9.",
    type: "rival",
    params: {},
    favourite: "your-demise",
  },
  tim: {
    id: "tim", name: "Tabby Tim", emoji: "🐅",
    blurb: "Eats one loaf with one cupcake. Always exactly one of each.",
    type: "perfectComp",
    params: { ratio: 1, income: 6 },
    favourite: "loaf+cupcake",
  },
  furrington: {
    id: "furrington", name: "Mrs Furrington", emoji: "🐈‍⬛",
    blurb: "Poor. Bread is inferior for her — when the price RISES she buys MORE bread (Giffen).",
    type: "giffen",
    params: { income: 3 },
    favourite: "bread",
  },
};

// Compute one customer's basket and total spend at given prices.
// Returns { spent, items: [{ item, qty }], satisfied: bool, reason }.
export function purchase(cat, prices, freshStock = true) {
  const p = prices;  // { loaf, baguette, croissant, cake, cupcake }

  switch (cat.type) {
    case "cobbDouglas": {
      // Two-good split between loaves and a sweet (cupcakes if any, else cake).
      const sweet = p.cupcake ?? p.cake ?? p.croissant ?? p.baguette;
      const sweetName = p.cupcake != null ? "cupcake" : p.cake != null ? "cake" : p.croissant != null ? "croissant" : "baguette";
      if (!isFinite(p.loaf) || !isFinite(sweet) || p.loaf <= 0 || sweet <= 0)
        return { spent: 0, items: [], satisfied: false, reason: "no items priced" };
      const { alpha, beta, income } = cat.params;
      const x = (alpha / (alpha + beta)) * (income / p.loaf);
      const y = (beta / (alpha + beta)) * (income / sweet);
      const spent = x * p.loaf + y * sweet;
      return {
        spent: Math.round(spent * 100) / 100,
        items: [{ item: "loaf", qty: Math.round(x * 10) / 10 }, { item: sweetName, qty: Math.round(y * 10) / 10 }],
        satisfied: x > 0.1 && y > 0.1,
        reason: `Cobb-Douglas split: ${(alpha/(alpha+beta)).toFixed(2)} on bread, ${(beta/(alpha+beta)).toFixed(2)} on pastry`,
      };
    }

    case "quasilinear": {
      // v(x) = a·√x, optimum at v'(x) = p → x* = (a/(2p))²
      const focusPrice = p[cat.params.focus];
      if (!isFinite(focusPrice) || focusPrice <= 0)
        return { spent: 0, items: [], satisfied: false, reason: `${cat.params.focus} not for sale` };
      if (focusPrice > cat.params.reservation)
        return { spent: 0, items: [], satisfied: false, reason: `${cat.params.focus} above reservation (${cat.params.reservation})` };
      const a = cat.params.a;
      const x = Math.pow(a / (2 * focusPrice), 2);
      return {
        spent: Math.round(x * focusPrice * 100) / 100,
        items: [{ item: cat.params.focus, qty: Math.round(x * 10) / 10 }],
        satisfied: true,
        reason: `Quasilinear v'(x)=p → x = (a/2p)² = ${x.toFixed(2)}`,
      };
    }

    case "perfectSubs": {
      // Pick whichever bread gives most calories/coin.
      const loafScore = cat.params.caloriesPerLoaf / p.loaf;
      const bagScore = cat.params.caloriesPerBaguette / (p.baguette ?? Infinity);
      if (loafScore >= bagScore) {
        const x = cat.params.budget / p.loaf;
        return { spent: cat.params.budget, items: [{ item: "loaf", qty: Math.round(x * 10) / 10 }], satisfied: x > 0, reason: `Perfect substitute: ${loafScore.toFixed(2)} cal/coin on loaf` };
      } else {
        const x = cat.params.budget / p.baguette;
        return { spent: cat.params.budget, items: [{ item: "baguette", qty: Math.round(x * 10) / 10 }], satisfied: x > 0, reason: `Perfect substitute: ${bagScore.toFixed(2)} cal/coin on baguette` };
      }
    }

    case "perfectComp": {
      // 1 loaf + 1 cupcake at kink. Spend min of budget vs needed.
      const cost = p.loaf + (p.cupcake ?? Infinity);
      if (!isFinite(cost) || cost > cat.params.income)
        return { spent: 0, items: [], satisfied: false, reason: `cannot afford one of each (need ${cost})` };
      const sets = Math.floor(cat.params.income / cost);
      return {
        spent: Math.round(sets * cost * 100) / 100,
        items: [{ item: "loaf", qty: sets }, { item: "cupcake", qty: sets }],
        satisfied: sets > 0,
        reason: `Perfect complements: 1 loaf + 1 cupcake at kink`,
      };
    }

    case "freshOnly": {
      if (!freshStock) return { spent: 0, items: [], satisfied: false, reason: "would not buy day-old stock" };
      // Otherwise behaves as Cobb-Douglas.
      return purchase({ ...cat, type: "cobbDouglas" }, prices);
    }

    case "giffen": {
      // Pure flavour: buys 1 loaf if price > 4, else 0.5 loaves.
      if (!isFinite(p.loaf)) return { spent: 0, items: [], satisfied: false, reason: "no bread" };
      const qty = p.loaf > 4 ? 1 : 0.5;
      return {
        spent: Math.round(qty * p.loaf * 100) / 100,
        items: [{ item: "loaf", qty }],
        satisfied: true,
        reason: `Giffen: higher price ⇒ more bread (income effect dominates)`,
      };
    }

    case "rival":
    default:
      return { spent: 0, items: [], satisfied: false, reason: "" };
  }
}
