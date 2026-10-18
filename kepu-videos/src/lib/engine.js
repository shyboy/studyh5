/* Deterministic frame engine: every visual is a paused Web Animation or a hook(t),
   so seek(t) renders any frame exactly. Timeline comes from build/<id>/timeline.json. */
(function () {
  const TL = window.__TL || { duration: 10, fps: 30, segments: [] };
  const seg = {};
  TL.segments.forEach((s) => (seg[s.id] = s));

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
    up: [{ opacity: 0, transform: "translateY(60px)" }, { opacity: 1, transform: "none" }],
    down: [{ opacity: 0, transform: "translateY(-60px)" }, { opacity: 1, transform: "none" }],
    left: [{ opacity: 0, transform: "translateX(-120px)" }, { opacity: 1, transform: "none" }],
    right: [{ opacity: 0, transform: "translateX(120px)" }, { opacity: 1, transform: "none" }],
    pop: [
      { opacity: 0, transform: "scale(.4)" },
      { opacity: 1, transform: "scale(1.08)", offset: 0.6 },
      { opacity: 1, transform: "scale(1)" },
    ],
    zoom: [{ opacity: 0, transform: "scale(1.6)" }, { opacity: 1, transform: "scale(1)" }],
    slam: [
      { opacity: 0, transform: "scale(3)", filter: "blur(10px)" },
      { opacity: 1, transform: "scale(.94)", filter: "blur(0)", offset: 0.55 },
      { opacity: 1, transform: "scale(1)", filter: "blur(0)" },
    ],
    blur: [{ opacity: 0, filter: "blur(24px)", transform: "scale(1.05)" }, { opacity: 1, filter: "blur(0)", transform: "none" }],
    wipe: [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
    wipeUp: [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
    flip: [
      { opacity: 0, transform: "perspective(900px) rotateX(-90deg)" },
      { opacity: 1, transform: "perspective(900px) rotateX(0)" },
    ],
  };
  const OUTS = {
    fade: [{ opacity: 1 }, { opacity: 0 }],
    up: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-80px)" }],
    down: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(80px)" }],
    left: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(-200px)" }],
    right: [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(200px)" }],
    shrink: [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.6)" }],
    grow: [{ opacity: 1, transform: "scale(1)", filter: "blur(0)" }, { opacity: 0, transform: "scale(1.5)", filter: "blur(16px)" }],
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

  function typewriter(target, text, start, cps = 12, caret = true) {
    const chars = Array.from(text);
    hook((t) => {
      const n = clamp(Math.floor((t - start) * cps), 0, chars.length);
      const blink = caret && t >= start - 0.6 && Math.floor(t * 2) % 2 === 0;
      target.innerHTML = chars.slice(0, n).join("") + (caret ? `<span class="caret" style="opacity:${blink || (n > 0 && n < chars.length) ? 1 : 0}"></span>` : "");
    });
    return start + chars.length / cps;
  }

  /* Subtitles from segment chunk timings; keywords get highlighted. */
  function subtitles(opts = {}) {
    const box = el("div", "subs " + (opts.cls || ""));
    const inner = el("div", "subs-inner", "", box);
    const ids = opts.ids ? new Set(opts.ids) : null;
    const hl = opts.highlight || [];
    const list = TL.segments.filter((s) => s.subs && (!ids || ids.has(s.id)) && !(opts.skip || []).includes(s.id));
    let last = null;
    hook((t) => {
      let txt = "";
      for (const s of list) {
        if (t >= s.start && t < s.end + 0.12) {
          for (const c of s.subs) if (t >= s.start + c.t) txt = c.text;
        }
      }
      if (txt !== last) {
        let html = txt;
        for (const k of hl) html = html.split(k).join(`<em>${k}</em>`);
        inner.innerHTML = html;
        box.style.opacity = txt ? 1 : 0;
        last = txt;
      }
    });
    return box;
  }

  /* Time at which `phrase` starts being spoken in segment `id` (uses per-character TTS timings). */
  const PUNCT = /[，。！？；：、…,.!?;:\s“”"‘’'（）()《》—\-~～·]/g;
  function when(id, phrase, nth = 0) {
    const s = seg[id];
    if (!s) throw new Error("no segment " + id);
    const p = phrase.replace(PUNCT, "");
    let i = -1;
    for (let k = 0; k <= nth; k++) i = s.ck.indexOf(p, i + 1);
    if (i < 0) {
      console.log(`when(): "${phrase}" not found in ${id}`);
      return s.start;
    }
    return s.start + s.ct[i];
  }

  function seek(t) {
    for (const a of document.getAnimations()) a.currentTime = t * 1000;
    for (const h of hooks) h(t);
  }

  window.E = { TL, seg, EASE, ease, clamp, prog, el, anim, show, hide, stagger, hook, sfx, counter, typewriter, subtitles, seek, when, sfxList, S: (id) => seg[id].start, End: (id) => seg[id].end };
  window.seek = seek;
  window.__sfx = sfxList;
})();
