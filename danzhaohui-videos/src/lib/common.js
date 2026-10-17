/* Shared building blocks: ink mountains, brand watermark, seal end card. */
(function () {
  const { el, show, hide, anim, sfx, typewriter, hook, prog, ease } = E;

  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  /* Layered ink-wash mountain lines (like the site's hero art). */
  function mountains(parent, opts = {}) {
    const W = 1080, H = opts.h || 900, layers = opts.layers || 5, r = rng(opts.seed || 3);
    const color = opts.color || "#c9a25a";
    let paths = "";
    for (let l = 0; l < layers; l++) {
      const base = H * (0.35 + 0.13 * l);
      let d = `M -20 ${base}`;
      let x = -20;
      while (x < W + 40) {
        const w = 90 + r() * 180, h = 60 + r() * (220 - l * 30);
        d += ` Q ${x + w * 0.5} ${base - h} ${x + w} ${base - r() * 30}`;
        x += w;
      }
      const op = (opts.opacity || 0.55) * (0.4 + 0.6 * (l + 1) / layers);
      if (opts.fill) paths += `<path d="${d} L ${W + 40} ${H} L -20 ${H} Z" fill="${opts.fill}" opacity="${0.08 + l * 0.05}"/>`;
      paths += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${2 + l * 0.6}" opacity="${op}"/>`;
    }
    const svg = el("div", "abs", `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${paths}</svg>`, parent);
    svg.style.cssText += `left:0;bottom:${opts.bottom || 0}px;width:${W}px;height:${H}px;`;
    return svg;
  }

  function filters() {
    const d = el("div", "", `<svg width="0" height="0" style="position:absolute"><defs>
      <filter id="roughen"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
      <filter id="inky"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.25" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
    </defs></svg>`);
    return d;
  }

  function brandmark(parent, opts = {}) {
    const b = el("div", "brandmark", `<div class="seal">招</div><div class="col"><div class="name">单招汇</div><div class="url">danzhaohui.com</div></div>`, parent);
    if (opts.light) b.style.color = "#fff";
    return b;
  }

  /* Seal-stamp end card. Returns the end time. */
  function endcard(start, opts = {}) {
    const c = el("div", "endcard paper");
    mountains(c, { seed: 11, h: 820, color: "#b8894a", opacity: 0.45, fill: "#7a6a4a" });
    const box = el("div", "sealbox", "", c);
    const splash = el("div", "splash", "", box);
    const seal = el("div", "bigseal", `<span style="grid-area:a">单</span><span style="grid-area:b">招</span><span style="grid-area:c;font-size:230px">汇</span>`, box);
    seal.style.gridTemplateAreas = '"c a" "c b"';
    const title = el("div", "title", "单招汇", c);
    const search = el("div", "search", `<div class="ico"></div><div class="q"></div>`, c);
    const chips = el("div", "chips", (opts.chips || ["免费查学校", "查专业", "看分数线"]).map((x, i) => `<div class="chip ${i === 0 ? "red" : ""}">${x}</div>`).join(""), c);
    const note = el("div", "note", opts.note || "资料为2026年参考 · 报名、考试、录取以官方通知为准", c);

    show(c, start, [{ clipPath: "circle(0% at 50% 30%)" }, { clipPath: "circle(150% at 50% 30%)" }], 0.7, "inOut");
    anim(seal, [
      { opacity: 0, transform: "scale(2.6) rotate(-14deg)" },
      { opacity: 1, transform: "scale(.92) rotate(-4deg)", offset: 0.55 },
      { opacity: 1, transform: "scale(1.02) rotate(-6deg)", offset: 0.8 },
      { opacity: 1, transform: "scale(1) rotate(-6deg)" },
    ], start + 0.45, 0.55, { ease: "cubic-bezier(.5,0,.75,0)" });
    anim(splash, [{ opacity: 0.9, transform: "scale(.4)" }, { opacity: 0, transform: "scale(1.3)" }], start + 0.75, 0.6, { ease: "out" });
    anim(box, [{ transform: "translate(0,0)" }, { transform: "translate(-8px,6px)" }, { transform: "translate(6px,-4px)" }, { transform: "translate(0,0)" }], start + 0.75, 0.25, { ease: "linear" });
    sfx(start + 0.72, "stamp", 1);
    show(title, start + 1.0, "up", 0.6);
    show(search, start + 1.25, "pop", 0.6);
    typewriter(search.querySelector(".q"), "danzhaohui.com", start + 1.6, 18);
    sfx(start + 1.6, "type", 0.6);
    E.stagger(chips.children, start + 2.4, 0.12, "pop", 0.5);
    sfx(start + 2.4, "pop", 0.5);
    show(note, start + 2.8, "fade", 0.6);
    return start + 3.2;
  }

  window.C = { mountains, filters, brandmark, endcard, rng };
})();
