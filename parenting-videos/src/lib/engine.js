/* Deterministic frame engine: every visual is a paused Web Animation or a hook(t),
   so seek(t) renders any frame exactly. Timeline comes from build/<id>/timeline.json. */
(function () {
  const TL = window.__TL || { duration: 10, fps: 30, segments: [] };
  const seg = {};
  TL.segments.forEach((s) => (seg[s.id] = s));
  const PUNCT = "，。！？；：、…,.!?;:　 “”\"‘’'（）()《》—-~～·";

  const EASE = {
    out: "cubic-bezier(.16,1,.3,1)",
    inOut: "cubic-bezier(.65,0,.35,1)",
    in: "cubic-bezier(.5,0,.75,0)",
    back: "cubic-bezier(.34,1.56,.64,1)",
    linear: "linear",
  };
  const hooks = [];
  const sfxList = [];

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = {
    out: (x) => 1 - Math.pow(1 - x, 3),
    out5: (x) => 1 - Math.pow(1 - x, 5),
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    back: (x) => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    lin: (x) => x,
  };
  const prog = (t, start, dur, fn = ease.out) => fn(clamp((t - start) / dur));

  function el(tag, cls, html, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    (parent || document.getElementById("stage")).appendChild(e);
    return e;
  }

  function anim(target, kf, start, dur, opt = {}) {
    const a = target.animate(kf, {
      delay: Math.max(0, start) * 1000,
      duration: Math.max(0.001, dur) * 1000,
      fill: opt.fill || "both",
      easing: EASE[opt.ease] || opt.ease || EASE.out,
      iterations: opt.iter || 1,
      direction: opt.dir || "normal",
      composite: opt.composite || "replace",
    });
    a.pause();
    return a;
  }

  const PRESETS = {
    fade: [{ opacity: 0 }, { opacity: 1 }],
    up: [{ opacity: 0, transform: "translateY(50px)" }, { opacity: 1, transform: "none" }],
    down: [{ opacity: 0, transform: "translateY(-50px)" }, { opacity: 1, transform: "none" }],
    left: [{ opacity: 0, transform: "translateX(-120px)" }, { opacity: 1, transform: "none" }],
    right: [{ opacity: 0, transform: "translateX(120px)" }, { opacity: 1, transform: "none" }],
    pop: [
      { opacity: 0, transform: "scale(.4)" },
      { opacity: 1, transform: "scale(1.08)", offset: 0.6 },
      { opacity: 1, transform: "scale(1)" },
    ],
    zoom: [{ opacity: 0, transform: "scale(1.5)" }, { opacity: 1, transform: "scale(1)" }],
    slam: [
      { opacity: 0, transform: "scale(2.6) rotate(var(--rot,0deg))", filter: "blur(8px)" },
      { opacity: 1, transform: "scale(.94) rotate(var(--rot,0deg))", filter: "blur(0)", offset: 0.55 },
      { opacity: 1, transform: "scale(1) rotate(var(--rot,0deg))", filter: "blur(0)" },
    ],
    blur: [{ opacity: 0, filter: "blur(20px)", transform: "scale(1.04)" }, { opacity: 1, filter: "blur(0)", transform: "none" }],
    wipe: [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
    wipeUp: [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
    flip: [
      { opacity: 0, transform: "perspective(900px) rotateX(-90deg)" },
      { opacity: 1, transform: "perspective(900px) rotateX(0)" },
    ],
  };
  const OUTS = {
    fade: [{ opacity: 1 }, { opacity: 0 }],
    up: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-60px)" }],
    down: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(60px)" }],
    left: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(-200px)" }],
    right: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(200px)" }],
    shrink: [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.6)" }],
    grow: [{ opacity: 1, transform: "scale(1)", filter: "blur(0)" }, { opacity: 0, transform: "scale(1.4)", filter: "blur(14px)" }],
    dim: [{ opacity: 1 }, { opacity: 0.28 }],
  };

  function show(target, start, type = "up", dur = 0.6, ease = "out") {
    return anim(target, PRESETS[type] || type, start, dur, { ease });
  }
  function hide(target, start, type = "fade", dur = 0.4, ease = "inOut") {
    return anim(target, OUTS[type] || type, start, dur, { fill: "forwards", ease });
  }
  function stagger(list, start, step, type = "up", dur = 0.6, ease = "out") {
    Array.from(list).forEach((e, i) => show(e, start + i * step, type, dur, ease));
  }
  function hook(fn) {
    hooks.push(fn);
  }
  function sfx(t, name, gain = 1) {
    sfxList.push({ t: +t.toFixed(3), name, gain });
  }

  function counter(target, from, to, start, dur, fmt = (v) => Math.round(v).toString(), fn = ease.out5) {
    hook((t) => {
      target.textContent = fmt(from + (to - from) * prog(t, start, dur, fn));
    });
  }

  /* Absolute time at which `word` is spoken inside segment `id` (falls back to segment start). */
  function W(id, word, nth = 0) {
    const s = seg[id];
    if (!s) throw new Error("no segment " + id);
    if (!word || !s.ct) return s.start;
    const needle = Array.from(word).filter((c) => !PUNCT.includes(c)).join("");
    let idx = -1;
    for (let k = 0; k <= nth; k++) idx = s.clean.indexOf(needle, idx + 1);
    if (idx < 0) {
      console.log("W(): word not found", id, word);
      return s.start;
    }
    return s.start + (s.ct[idx] ?? 0);
  }

  function seek(t) {
    for (const a of document.getAnimations()) a.currentTime = t * 1000;
    for (const h of hooks) h(t);
  }

  window.E = { TL, seg, EASE, ease, clamp, prog, el, anim, show, hide, stagger, hook, sfx, counter, seek, W, sfxList, S: (id) => seg[id].start, End: (id) => seg[id].end };
  window.seek = seek;
  window.__sfx = sfxList;
})();
