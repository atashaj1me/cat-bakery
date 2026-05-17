// mcq.js — Multiple-choice question UI.
//
// Each call to renderMCQ(container, q, opts) renders one question.
// On answer, it returns whether the answer was correct via opts.onAnswer.

import { typesetMath } from "./chapter.js";

export function renderMCQ(container, q, { onAnswer, qIndex = 0, locked = false } = {}) {
  const card = document.createElement("div");
  card.className = "mcq";

  const h = document.createElement("h4");
  h.textContent = `Q${qIndex + 1}. ${q.prompt}`;
  card.appendChild(h);

  const opts = document.createElement("div");
  opts.className = "options";
  card.appendChild(opts);

  let answered = false;

  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.type = "button";
    btn.textContent = `${String.fromCharCode(65 + i)}. ${text}`;
    btn.addEventListener("click", () => {
      if (answered || locked) return;
      answered = true;
      const correct = i === q.answer;
      [...opts.children].forEach((b, j) => {
        if (j === q.answer) b.classList.add("correct");
        else if (j === i) b.classList.add("wrong");
        b.disabled = true;
      });
      const expl = document.createElement("div");
      expl.className = "explain";
      expl.innerHTML = `<strong>${correct ? "✓ Correct." : "✗ Not quite."}</strong> ${q.explanation}`;
      card.appendChild(expl);
      typesetMath(expl);
      if (onAnswer) onAnswer(correct, i);
    });
    opts.appendChild(btn);
  });

  container.appendChild(card);
  typesetMath(card);
  return { card };
}

// Renders a set of MCQs and reports overall percentage when all answered.
export function renderMCQSet(container, questions, { onComplete } = {}) {
  let answered = 0;
  let correct = 0;
  const intro = document.createElement("p");
  intro.innerHTML = `<em>Answer all ${questions.length} questions. Each shows the explanation immediately.</em>`;
  container.appendChild(intro);

  questions.forEach((q, idx) => {
    renderMCQ(container, q, {
      qIndex: idx,
      onAnswer: (isRight) => {
        answered += 1;
        if (isRight) correct += 1;
        if (answered === questions.length && onComplete) {
          const pct = Math.round((correct / questions.length) * 100);
          onComplete({ correct, total: questions.length, pct });
        }
      },
    });
  });
}
