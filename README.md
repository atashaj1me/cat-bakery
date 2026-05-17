# Cat Society Bakery

A browser-based ECON201 (Microeconomic Analysis) final-exam prep game. You play the role of a cat-society baker; each chapter is a microeconomics topic in disguise.

Static HTML/CSS/JS — no build step, no dependencies. Saves progress to `localStorage`.

## Quick start (local)

The site uses ES modules, which the browser will refuse to load via `file://`. Run a tiny static server from this folder:

```sh
# Python 3
python3 -m http.server 8000

# or Node, if installed
npx serve .
```

Then open <http://localhost:8000/>.

## Chapters

| # | Title | Covers | Vault source |
|---|---|---|---|
| 0 | Bakery Preparation | Pre-midterm consumer choice, production, profit max | `PreMidterm Refresh` |
| 1 | Market Day | Ch 14 Competitive Eq · Ch 15 First Welfare Theorem | `Ch14`, `Ch15` |
| 2 | The Sugar Tax | Ch 19 Taxes/Subsidies + **Essay 1 walkthrough** (price ceiling) | `Ch19`, `Price ceiling — bread market (Essay 1 walkthrough)` |
| 3 | Imported Flour & Tariffs | Ch 20 Trade + **Essay 2 walkthrough** (surplus table) | `Ch20`, `Tariff surplus table (Essay 2 walkthrough)` |
| 4 | Oven Smoke | Ch 21 Externalities · Pigouvian tax | `Ch21`, `Pigouvian tax — driving externality` |
| 5 | The Lemon Loaves | Ch 22 Asymmetric Information | `Ch22` |
| 6 | The Only Bakery in Town | Ch 23 Monopoly · Lerner · 3rd-deg PD | `Ch23`, `Constant-elasticity monopoly markup`, `Monopoly with per-unit tax` |
| ★ | Final Mock Exam | 75-min · 15 MCQs · 1 essay | `Final Practice — MCQ keys & explanations` |

Each chapter (except the final mock) follows the same loop: story → interactive sim → 3 exam-style MCQs → mastery card with formulas & traps. Chapters unlock sequentially at ≥60% total; the mock exam unlocks after Chapter 6.

## Deploying to GitHub Pages

1. Create a new public repository on GitHub (any name, e.g. `cat-bakery`).
2. From this folder:
   ```sh
   git init
   git add .
   git commit -m "Initial release"
   git branch -M main
   git remote add origin git@github.com:<your-username>/cat-bakery.git
   git push -u origin main
   ```
3. In the GitHub repo: **Settings → Pages → Source = "Deploy from a branch", Branch = `main` / `(root)`**. Save.
4. After ~1 minute the site is live at `https://<your-username>.github.io/cat-bakery/`.

The `.nojekyll` file in the project root tells GitHub Pages to serve `chapters/*.html` as-is (otherwise Jekyll's default behaviour can interfere).

## Sanity-check the math

Open the browser console on any page and use the exposed `Econ` namespace to verify formulas against the vault's worked examples:

```js
Econ.equilibrium({a: 26, b: 1, c: 0, d: 0.3});
// {p: 20, q: 6}   -- Essay 1 part (a)

Econ.priceCeiling({a: 26, b: 1, c: 0, d: 0.3, pmax: 10}).dwl;
// 19.5            -- Essay 1 part (d)

Econ.lernerPrice({mc: 1, elasticityAbs: 3});
// 1.5             -- Final Practice MCQ 14

Econ.externalityDriving({alpha: 8, gamma: 2});
// { nash: 4, social: 3, pigouvianTax: 2 }  -- Final Practice MCQ 5

Econ.profitTwoInput({a: 4, b: 6, w1: 1, w2: 2, p: 4}).y;
// 68              -- Final Practice MCQ 6
```

The state can be inspected or wiped via `CatBakeryState`:

```js
CatBakeryState.get();   // current localStorage record
CatBakeryState.reset(); // clear progress
```

## File layout

```
cat-bakery/
├── index.html
├── .nojekyll
├── README.md
├── chapters/
│   ├── 0-bakery-preparation.html
│   ├── 1-market-day.html
│   ├── 2-sugar-tax.html
│   ├── 3-tariffs.html
│   ├── 4-oven-smoke.html
│   ├── 5-lemon-loaves.html
│   ├── 6-monopoly.html
│   └── final-mock.html
└── assets/
    ├── css/style.css
    └── js/
        ├── state.js        # localStorage progress
        ├── econ.js         # pure formulas
        ├── graph.js        # SVG chart helper
        ├── mcq.js          # MCQ renderer
        ├── chapter.js      # shared chapter shell
        └── data/mcqs.js    # all MCQ content
```

Good luck — and don't pick (a) on Q4 of the practice exam.
