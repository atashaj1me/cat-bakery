// graph.js — minimal inline-SVG chart helpers for D/S diagrams.
//
// Coordinate convention: economics convention (price on Y, quantity on X).
// Constructor takes the data range (qMax, pMax) and viewport dimensions.

const NS = "http://www.w3.org/2000/svg";

export class Chart {
  constructor({ qMax, pMax, width = 520, height = 360, pad = 40 }) {
    this.qMax = qMax;
    this.pMax = pMax;
    this.width = width;
    this.height = height;
    this.pad = pad;
    this.svg = document.createElementNS(NS, "svg");
    this.svg.setAttribute("class", "chart");
    this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  // map (q, p) → svg (x, y)
  x(q) { return this.pad + (q / this.qMax) * (this.width - 2 * this.pad); }
  y(p) { return this.height - this.pad - (p / this.pMax) * (this.height - 2 * this.pad); }

  drawAxes({ qLabel = "Quantity", pLabel = "Price" } = {}) {
    const { pad, width, height } = this;
    // axes
    this._line(pad, height - pad, width - pad, height - pad, "axis");
    this._line(pad, pad / 2, pad, height - pad, "axis");
    // arrowheads / labels
    this._text(width - pad, height - pad + 16, qLabel, { anchor: "end" });
    this._text(pad - 4, pad / 2 - 4, pLabel, { anchor: "end" });
    // gridlines (simple, sparse)
    for (let i = 1; i <= 4; i++) {
      const xg = pad + (i / 4) * (width - 2 * pad);
      const yg = height - pad - (i / 4) * (height - 2 * pad);
      this._line(xg, pad / 2, xg, height - pad, "grid");
      this._line(pad, yg, width - pad, yg, "grid");
      // tick labels
      this._text(xg, height - pad + 14, ((i / 4) * this.qMax).toFixed(0), { anchor: "middle", size: 10 });
      this._text(pad - 6, yg + 4, ((i / 4) * this.pMax).toFixed(0), { anchor: "end", size: 10 });
    }
  }

  // Linear demand q = a − b·p ⇒ p_choke = a/b, q_max = a.
  drawDemand({ a, b }) {
    const pChoke = a / b;
    const qMax = a;
    this._line(this.x(0), this.y(pChoke), this.x(qMax), this.y(0), "demand");
    this._text(this.x(qMax), this.y(0) - 6, "D", { anchor: "start", cls: "demand" });
  }

  drawSupply({ c = 0, d }) {
    const pMin = Math.max(0, -c / d);
    const qAtPmax = Math.max(0, c + d * this.pMax);
    this._line(this.x(0), this.y(pMin), this.x(qAtPmax), this.y(this.pMax), "supply");
    this._text(this.x(qAtPmax), this.y(this.pMax) + 12, "S", { anchor: "end", cls: "supply" });
  }

  drawPriceLine(p, label, cls = "pmax") {
    this._line(this.x(0), this.y(p), this.x(this.qMax), this.y(p), cls);
    if (label) this._text(this.x(this.qMax) - 4, this.y(p) - 4, label, { anchor: "end", size: 10 });
  }

  // Filled polygon from list of [q, p] points.
  fillPolygon(points, cls) {
    const poly = document.createElementNS(NS, "polygon");
    poly.setAttribute("class", cls);
    poly.setAttribute("points", points.map(([q, p]) => `${this.x(q)},${this.y(p)}`).join(" "));
    this.svg.appendChild(poly);
  }

  marker(q, p, label) {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", this.x(q));
    c.setAttribute("cy", this.y(p));
    c.setAttribute("r", 4);
    c.setAttribute("fill", "#3c2a1e");
    this.svg.appendChild(c);
    if (label) this._text(this.x(q) + 6, this.y(p) - 6, label, { size: 11 });
  }

  _line(x1, y1, x2, y2, cls) {
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("class", cls);
    this.svg.appendChild(l);
  }

  _text(x, y, text, { anchor = "start", size = 12, cls } = {}) {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("text-anchor", anchor);
    t.setAttribute("font-size", size);
    if (cls) t.setAttribute("class", cls);
    t.textContent = text;
    this.svg.appendChild(t);
  }

  clear() {
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
  }

  mountInto(container) {
    container.innerHTML = "";
    container.appendChild(this.svg);
  }
}
