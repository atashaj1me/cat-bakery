// lore-apocalypse.js — narrative beats for the Apocalypse campaign.
//
// Three things live here:
//   1. ARC_SCROLLS — full-bleed scrolls shown at the start of Day 1, 5, 9, 13.
//   2. NPC_INTERJECTIONS — one-line mid-day commentary keyed by day.
//   3. MEMORY_TEMPLATES — phrases used to surface past-day mistakes.

export const ARC_SCROLLS = {
  1: {
    title: "Arc I — The Doomsday Edict",
    cinematic: "🌑",
    body: `
      <p>The Cat Queen's banner hangs from every shutter. The Royal Crier has read the
      Doomsday Edict at dawn: <strong>Whiskerton is at war</strong>. Felinia, our once-friendly
      flour exporter, now arms itself.</p>
      <p>Every bakery is now a strategic asset. Every loaf a unit of national
      power. The next sixteen days will test whether you understand the kingdom's
      economy well enough to keep it alive.</p>
      <p>The Royal Census has revealed that no two cats want the same thing. Master
      the dialect of each utility class — Cobb-Douglas, quasilinear, perfect-substitutes
      — or your bakery's pantry will rot under unsold pastry.</p>
    `,
  },
  5: {
    title: "Arc II — The Welfare Wars",
    cinematic: "⚔️",
    body: `
      <p>You survived the first four days. The Council convenes.</p>
      <p>👹 <strong>The Inflation Daemon</strong> stalks the realm now. Today it adjusts
      the bread ceiling; tomorrow it stacks a tax atop the ceiling. Compute every
      wedge separately. The Mayor will not accept arithmetic by intuition.</p>
      <p>Felinia, meanwhile, has begun retaliating against our tariffs. You will
      need to think one move ahead.</p>
    `,
  },
  9: {
    title: "Arc III — The Market Failures Trilogy",
    cinematic: "🃏",
    body: `
      <p>Four kinds of market failure plague the kingdom: externality, asymmetric
      information, monopoly, public goods.</p>
      <p>🎩 <strong>Baron Whiskerton</strong> has returned from exile in Felinia. He
      did not retire after all. He intends to exploit each failure in turn — the
      polluter, the lemon-seller, the price-discriminator, the free-rider.</p>
      <p>Defeat him at his own game. The first-best policies are taught in the
      Whiskerton Academy textbooks. You memorise them or you lose.</p>
    `,
  },
  13: {
    title: "Arc IV — The Master's Examination",
    cinematic: "🏛️",
    body: `
      <p>The Royal Examination Bureau has convened in the Great Hall. The Examiners
      sit in a horseshoe of velvet seats. They have called you forward.</p>
      <p>Three days of essay rehearsal and a synthesis exam stand between you and
      <strong>Master Examiner</strong> certification. There is no time pressure to
      memorise. There IS time pressure to compute.</p>
      <p>The Inflation Daemon and Baron Whiskerton both await the verdict.</p>
    `,
  },
};

// NPC interjections — short, recur per day, build relationships
export const NPC_INTERJECTIONS = {
  1: [
    { who: "🐱 Penny Whiskers", line: "I split my coins evenly — Cobb-Douglas, simple as that. Tell me what I'll buy." },
    { who: "🤵 Sir Pawley III", line: "I want cake. I will pay whatever, up to my reservation price. Quasilinear, dear baker." },
    { who: "🐈‍⬛ Mittens the Engineer", line: "I follow calories per coin. Whichever bun gives me more, I buy ONLY that." },
  ],
  2: [
    { who: "🐱 Penny Whiskers", line: "Sugar prices rose this week. I bought fewer pastries — but did the SE alone account for that, or did the IE pile on?" },
  ],
  3: [
    { who: "👩‍🍳 Apprentice Biscuit", line: "Flour AND butter? Then it's two-input cost min. Tangency of isoquant and isocost, Master." },
  ],
  4: [
    { who: "🐈 Baroness Cream", line: "I prefer cake today even if the loan rate is 5%. Show me my lifetime budget." },
  ],
  5: [
    { who: "🏛️ Mayor Mittens", line: "Two markets, one decree. Solve them together, not separately." },
  ],
  6: [
    { who: "🐱 Penny Whiskers", line: "First a ceiling. Then a tax. Then a subsidy?? My head spins. Compute each wedge in turn." },
    { who: "👹 Inflation Daemon", line: "Heehee. Stack them all. Watch the triangle multiply." },
  ],
  7: [
    { who: "🐅 Trade Minister Tabby", line: "Felinia will retaliate. Predict their best response BEFORE choosing our tariff." },
  ],
  8: [
    { who: "🐈‍⬛ Mayor Mittens", line: "A tariff and a quota are economically equivalent — unless you care about who gets the rent." },
  ],
  9: [
    { who: "🚒 Whiskerton Air Board", line: "Coase first; Pigouvian as backup. We measure who holds the property right." },
  ],
  10: [
    { who: "🏥 Whiskerton Mutual", line: "Don't pool. Separate. Bind the IC constraint tightly." },
  ],
  11: [
    { who: "🎩 Baron Whiskerton", line: "I'm the only baker now. Regulate me at min AC, and I break even. Regulate me at MC, and I LOSE money." },
  ],
  12: [
    { who: "🐱 Penny Whiskers", line: "The community oven? Everyone wants more than they're willing to pay for. Sum our MWTPs vs MC." },
  ],
  13: [
    { who: "🐯 Examiner Whiskertine", line: "No hints today. Eight parts. Each one closes the door behind it." },
  ],
  14: [
    { who: "🐯 Examiner Whiskertine", line: "Twenty-four cells. ±0.3 tolerance. Begin." },
  ],
  15: [
    { who: "🐯 Royal Panel", line: "Thirty minutes. Fifteen questions. The pace of the real exam, halved. Go." },
  ],
  16: [
    { who: "🐯 Royal Examination Bureau", line: "One synthesis problem. All the wedges, all the markets, one welfare computation." },
    { who: "🎩 Baron Whiskerton", line: "I am the monopolist in your final scenario. Make me weep." },
  ],
};

// Memory callback templates — referenced if the player has a relevant past entry
// in `bakery.apocalypseLog`.  Each template is a function that takes the past
// score (0-100) and returns a phrase.  If score < 60, the callback is critical;
// if 60-80, neutral; if >80, encouraging.
export const MEMORY_TEMPLATES = {
  // Day 6 references Days 2 & 4
  6: ({ d2score, d4score }) => {
    if (d2score == null && d4score == null) return null;
    const worst = Math.min(d2score ?? 100, d4score ?? 100);
    if (worst < 60) {
      return `<strong>Mayor Mittens:</strong> "Your earlier work on Slutsky (${d2score?.toFixed(0) ?? "—"}) and intertemporal trade (${d4score?.toFixed(0) ?? "—"}) was shaky. This stacked-controls problem is harder. Concentrate."`;
    }
    if (worst < 80) {
      return `<strong>Mayor Mittens:</strong> "You handled the foundations adequately. Today we stack them."`;
    }
    return `<strong>Mayor Mittens:</strong> "Strong foundations. Apply them — the wedges accumulate."`;
  },
  // Day 11 references Day 9
  11: ({ d9score }) => {
    if (d9score == null) return null;
    if (d9score < 60) return `<strong>Baron Whiskerton:</strong> "You botched the Coase bargain. Now regulate me — let's see if you've improved."`;
    return `<strong>Baron Whiskerton:</strong> "You understood the bargaining outcome. Today, regulation."`;
  },
  // Day 13 references Day 6
  13: ({ d6score }) => {
    if (d6score == null) return null;
    if (d6score < 70) return `<strong>Examiner Whiskertine:</strong> "Your stacked-controls performance was ${d6score.toFixed(0)}/100. This essay covers similar ground at full exam difficulty. Eight parts. Begin."`;
    return `<strong>Examiner Whiskertine:</strong> "Stacked controls — you scored ${d6score.toFixed(0)}. Apply the same recipe at full essay depth."`;
  },
  // Day 16 references the full log
  16: ({ avg, lowestDay, lowestScore }) => {
    if (avg == null) return null;
    if (avg >= 90) return `<strong>Royal Panel:</strong> "Your campaign average is ${avg.toFixed(0)}/100. Whatever this synthesis problem throws at you, you can handle it."`;
    if (avg >= 70) return `<strong>Royal Panel:</strong> "Average ${avg.toFixed(0)}/100. Your weakest day was Day ${lowestDay} at ${lowestScore.toFixed(0)}. The synthesis incorporates that topic. Prove you have learned."`;
    return `<strong>Royal Panel:</strong> "Average only ${avg.toFixed(0)}/100. Day ${lowestDay} was your nadir at ${lowestScore.toFixed(0)}. The synthesis demands you finally master what you have avoided."`;
  },
};
