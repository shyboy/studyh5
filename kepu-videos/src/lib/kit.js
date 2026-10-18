/* Landscape explainer helpers built on engine.js (window.E). */
(function () {
  const { el, show, hide, anim, sfx, S, End } = E;

  /* Absolutely positioned div. css: "x,y[,w[,h]]" handled by pos(). */
  function box(parent, cls, html, x, y, w, h, extra) {
    const e = el("div", "abs " + (cls || ""), html, parent);
    pos(e, x, y, w, h);
    if (extra) e.style.cssText += extra;
    return e;
  }
  function pos(e, x, y, w, h) {
    if (x != null) e.style.left = x + "px";
    if (y != null) e.style.top = y + "px";
    if (w != null) e.style.width = w + "px";
    if (h != null) e.style.height = h + "px";
    return e;
  }
  function emo(parent, ch, size, x, y, extra) {
    return box(parent, "emo", ch, x, y, null, null, `font-size:${size}px;` + (extra || ""));
  }

  /* One animation from absolute-time keyframes: keys(e, [[t, {props}], ...]). */
  function keys(target, pts, opt = {}) {
    const t0 = pts[0][0], t1 = pts[pts.length - 1][0], d = Math.max(t1 - t0, 0.001);
    const kf = pts.map(([t, p]) => Object.assign({ offset: Math.min(1, Math.max(0, (t - t0) / d)), easing: E.EASE[opt.ease || "inOut"] }, p));
    return anim(target, kf, t0, d, { ease: "linear", fill: opt.fill || "both" });
  }

  function pop(e, t, name = "pop", gain = 0.5, type = "pop", dur = 0.5) {
    show(e, t, type, dur);
    if (name) sfx(t, name, gain);
    return e;
  }

  /* Visible from t0 (entry) until t1 (exit). */
  function during(e, t0, t1, inType = "up", outType = "fade", name = null, gain = 0.4) {
    show(e, t0, inType, 0.5);
    if (t1 != null) hide(e, t1, outType, 0.35);
    if (name) sfx(t0, name, gain);
    return e;
  }

  /* Scenes stack in creation order; each fades in over the previous one. */
  const scenes = [];
  function scene(first, opt = {}) {
    const sc = el("div", "scene " + (opt.cls || ""));
    if (opt.bg) sc.style.background = opt.bg;
    scenes.push({ sc, first, opt });
    return sc;
  }
  const TRANS = {
    fade: [{ opacity: 0 }, { opacity: 1 }],
    iris: [{ clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(80% at 50% 50%)" }],
    slide: [{ transform: "translateX(100%)" }, { transform: "none" }],
    up: [{ transform: "translateY(100%)" }, { transform: "none" }],
    zoom: [{ opacity: 0, transform: "scale(1.08)" }, { opacity: 1, transform: "none" }],
  };
  function finishScenes() {
    scenes.forEach((s, i) => {
      const tIn = S(s.first) - (s.opt.lead || 0.4);
      s.tIn = i === 0 ? 0 : tIn;
    });
    scenes.forEach((s, i) => {
      const dur = s.opt.dur || 0.55;
      if (i > 0) anim(s.sc, TRANS[s.opt.trans || "fade"], s.tIn, dur, { ease: "inOut" });
      const next = scenes[i + 1];
      if (next) {
        const tOff = next.tIn + (next.opt.dur || 0.55) + 0.02;
        anim(s.sc, [{ visibility: "visible" }, { visibility: "hidden" }], tOff, 0.001, { fill: "forwards", ease: "linear" });
      }
      if (i > 0 && s.opt.sfx !== false) sfx(s.tIn, s.opt.sfx || "swish", s.opt.sfxGain || 0.35);
    });
  }

  /* Method header: pops large in the centre while the title is read, then docks at the top. */
  function mhead(sc, badge, title, ico, segId, opt = {}) {
    const h = el("div", "mhead", `<div class="in"><div class="badge">${badge}</div><div class="t">${title}</div>${ico ? `<div class="emo stage-ico">${ico}</div>` : ""}</div>`, sc);
    const t0 = S(segId), t1 = opt.dock != null ? opt.dock : End(segId) + 0.05;
    const big = `translateY(${opt.y || 330}px) scale(${opt.scale || 1.45})`;
    keys(h, [
      [t0 - 0.35, { opacity: 0, transform: big + " translateY(40px)" }],
      [t0 + 0.05, { opacity: 1, transform: big }],
      [t1, { opacity: 1, transform: big }],
      [t1 + 0.6, { opacity: 1, transform: "none" }],
    ], { ease: "out" });
    sfx(t0 - 0.3, "bell", 0.5);
    return { h, docked: t1 + 0.6 };
  }

  function strike(parent, t, color) {
    const s = el("div", "strike", "", parent);
    if (color) s.style.background = color;
    anim(s, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], t, 0.3, { ease: "out" });
    sfx(t, "wrong", 0.35);
    return s;
  }

  function stampAt(parent, text, x, y, t, extra) {
    const st = box(parent, "stamp", text, x, y, null, null, extra);
    anim(st, [
      { opacity: 0, transform: "rotate(-12deg) scale(2.4)" },
      { opacity: 1, transform: "rotate(-12deg) scale(.92)", offset: 0.6 },
      { opacity: 1, transform: "rotate(-12deg) scale(1)" },
    ], t, 0.35, { ease: "in" });
    sfx(t + 0.2, "stamp", 0.7);
    return st;
  }

  /* Banner centred horizontally (outer keeps translateX, inner animates). */
  function banner(parent, html, y, t0, t1, cls) {
    const b = box(parent, "banner", `<div class="in ${cls || ""}">${html}</div>`, null, y);
    const inner = b.firstChild;
    show(inner, t0, "pop", 0.5);
    sfx(t0, "ding", 0.35);
    if (t1 != null) hide(inner, t1, "fade", 0.3);
    return b;
  }

  function bubble(parent, html, x, y, cls, t0, extra) {
    const b = box(parent, "bubble " + (cls || ""), html, x, y, null, null, extra);
    pop(b, t0, "pop", 0.45);
    return b;
  }

  function mark(parent, ok, x, y, t) {
    const m = box(parent, "mark " + (ok ? "ok" : "x"), ok ? "✓" : "✕", x, y);
    pop(m, t, ok ? "correct" : null, 0.35);
    return m;
  }

  /* Gentle looping motion on an inner element. */
  function bob(e, t0, dur, amp = 10, period = 2.4) {
    anim(e, [{ transform: "translateY(0)" }, { transform: `translateY(${-amp}px)` }, { transform: "translateY(0)" }], t0, period, { iter: Math.ceil(dur / period), ease: "inOut", fill: "none" });
  }
  function wobble(e, t0, dur, deg = 4, period = 1.6) {
    anim(e, [{ transform: "rotate(0)" }, { transform: `rotate(${deg}deg)` }, { transform: "rotate(0)" }, { transform: `rotate(${-deg}deg)` }, { transform: "rotate(0)" }], t0, period, { iter: Math.ceil(dur / period), ease: "linear", fill: "none" });
  }
  function shake(e, t0, dur, px = 8) {
    const kf = [];
    for (let i = 0; i <= 10; i++) kf.push({ transform: i === 10 ? "none" : `translate(${(i % 2 ? 1 : -1) * px}px, ${(i % 3 - 1) * px * 0.4}px) rotate(${(i % 2 ? 1 : -1) * 3}deg)` });
    anim(e, kf, t0, dur, { ease: "linear", fill: "none" });
  }
  function pulse(e, t0, n = 2, s = 1.08, period = 0.6) {
    anim(e, [{ transform: "scale(1)" }, { transform: `scale(${s})` }, { transform: "scale(1)" }], t0, period, { iter: n, ease: "inOut", fill: "none" });
  }

  /* Fade a whole group out (used for in-scene layout changes). */
  function group(parent, t0, t1) {
    const g = el("div", "full", "", parent);
    if (t0 != null) show(g, t0, "fade", 0.35);
    if (t1 != null) hide(g, t1, "fade", 0.35);
    return g;
  }

  function flash(parent, t) {
    const f = el("div", "full", "", parent);
    f.style.background = "#fff";
    f.style.zIndex = 60;
    anim(f, [{ opacity: 0 }, { opacity: 0.9, offset: 0.15 }, { opacity: 0 }], t, 0.45, { ease: "out" });
    sfx(t, "shutter", 0.8);
    return f;
  }

  window.K = { box, pos, emo, keys, pop, during, scene, finishScenes, mhead, strike, stampAt, banner, bubble, mark, bob, wobble, shake, pulse, group, flash, scenes };
})();
