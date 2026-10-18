const { el, show, hide, anim, sfx, hook, S, End, when, counter, prog, ease, stagger } = E;
const { box, emo, keys, pop, during, scene, mhead, strike, stampAt, banner, bubble, mark, bob, wobble, shake, pulse, group, flash } = K;
const W = 1920;

/* =====================================================================
   HOOK  (frame 0 must already read as a complete, thumbnail-worthy image)
   ===================================================================== */
{
  const sc = scene("h1", { cls: "hook-bg" });
  const rays = el("div", "rays", "", sc);
  anim(rays, [{ transform: "rotate(0)" }, { transform: "rotate(30deg)" }], 0, 10, { ease: "linear" });
  const cam = el("div", "cam", "", sc);
  anim(cam, [{ transform: "scale(1.07)" }, { transform: "scale(1)" }], 0, 3.5, { ease: "out" });

  // dawdling kid + stuck progress bar
  const kidWrap = box(cam, "", "", 1290, 250);
  const kid = emo(kidWrap, "🧒", 400, 0, 0);
  wobble(kid, 0, 3.6, 5, 1.4);
  const toy = emo(cam, "🧸", 150, 1640, 500);
  bob(toy, 0, 3.6, 14, 0.9);
  emo(cam, "👟", 120, 1190, 600, "transform:rotate(-20deg)");
  const lb = box(cam, "loadbar", `<div class="lb-t">穿鞋进度 <span>3%</span></div><div class="track"><div class="fill"></div></div>`, 1290, 735, 480);
  const fill = lb.querySelector(".fill");
  anim(fill, [{ width: "2%" }, { width: "4%" }, { width: "2.5%" }, { width: "3%" }], 0, 3.4, { ease: "linear", fill: "none" });

  // headline – visible at t=0, no entry animation
  const who = box(cam, "", "", 96, 205, null, null, "z-index:5");
  const whoP = el("div", "pill pill-sun", `<span class="emo">🧒</span> 4–6岁家长必看`, who);
  whoP.style.cssText += "font-size:38px;border:4px solid var(--ink);padding:6px 24px";
  const hl = box(cam, "", "", 90, 285);
  const l1 = el("div", "hl1", `每天催<span class="n">12</span>遍`, hl);
  const l2 = el("div", "hl2", "越催越慢？", hl);
  l1.style.fontSize = "126px";
  l1.querySelector(".n").style.fontSize = "190px";
  l2.style.fontSize = "206px";
  l2.style.marginTop = "26px";
  counter(l1.querySelector(".n"), 12, 100, 0.05, 3.0, (v) => Math.round(v), (x) => x);
  anim(l2, [{ transform: "scale(1) rotate(-2deg)" }, { transform: "scale(1.045) rotate(-2deg)" }, { transform: "scale(1) rotate(-2deg)" }], 0, 0.8, { iter: 5, ease: "inOut", fill: "both" });
  sfx(3.0, "ding", 0.45);
  pulse(l1.querySelector(".n"), 3.0, 1, 1.25, 0.4);

  // nagging bubbles: the first two are already on screen at frame 0; none cover the kid's face or the headline
  const B = [
    [1000, 90, -6, "快点！", 66, 0], [1560, 110, 5, "快穿鞋！", 54, 0], [1660, 310, 8, "快走！", 52, 0.25],
    [1150, 450, -8, "快快快！", 50, 0.5], [1290, 150, 3, "快刷牙！", 48, 0.75], [70, 790, -6, "我数到三！", 50, 1.0],
    [1160, 610, 6, "还不动？", 46, 1.25], [420, 70, -4, "说了多少遍了！", 46, 1.5], [500, 800, 5, "听见没有？", 46, 1.75],
    [1750, 640, 6, "快！", 56, 2.0], [880, 780, -4, "快点吃！", 46, 2.25], [1300, 880, -3, "快点快点！", 46, 2.5],
    [560, 172, -8, "快点！！", 72, 2.75], [60, 70, 6, "别玩了！", 46, 3.0],
  ];
  const bubbles = B.map(([x, y, r, txt, fs, t], i) => {
    const o = box(cam, "hb", "", x, y, null, null, `transform:rotate(${r}deg);z-index:${10 + i}`);
    const inn = el("div", "in", txt, o);
    inn.style.fontSize = fs + "px";
    if (t > 0) {
      anim(inn, [{ opacity: 0, transform: "scale(.2)" }, { opacity: 1, transform: "scale(1.15)", offset: 0.6 }, { opacity: 1, transform: "scale(1)" }], t, 0.28, { ease: "out", fill: "backwards" });
      sfx(t, "pop", i % 2 ? 0.45 : 0.6);
    }
    // all bubbles get sucked into the mouth at the "freeze"
    const dx = 960 - (x + 120), dy = 470 - (y + 50);
    keys(o, [[3.5 + i * 0.012, { transform: `rotate(${r}deg)`, opacity: 1 }], [3.95 + i * 0.012, { transform: `translate(${dx}px,${dy}px) rotate(${r}deg) scale(.1)`, opacity: 0 }]], { ease: "in", fill: "forwards" });
    return o;
  });
  hide(who, 3.5, "fade", 0.3);
  sfx(0, "hit", 0.55);
  for (let t = 0; t < 3.45; t += 0.25) sfx(t, Math.round(t * 4) % 2 ? "tock" : "tick", 0.4);

  // freeze → mouth
  sfx(3.48, "impact", 0.8);
  sfx(3.55, "whoosh", 0.6);
  hide(hl, 3.5, "left", 0.4);
  hide(kidWrap, 3.5, "fade", 0.3);
  hide(toy, 3.5, "fade", 0.3);
  hide(lb, 3.5, "fade", 0.3);
  cam.querySelectorAll(".emo").forEach((e) => { if (e !== kid && e !== toy) hide(e, 3.5, "fade", 0.3); });

  const mouthO = box(sc, "", "", 960 - 150, 470 - 150, 300, 300, "z-index:30");
  const mouth = emo(mouthO, "👄", 300, 0, 0);
  pop(mouthO, 3.92, null, 0, "pop", 0.45);
  anim(mouth, [{ transform: "scaleY(1)" }, { transform: "scaleY(.82)" }, { transform: "scaleY(1)" }], 4.3, 0.32, { iter: 14, ease: "inOut", fill: "none" });
  // the mouth keeps spilling little "快点"s
  for (let k = 0, t = 4.3; t < End("h2") - 0.3; k++, t += 0.5) {
    const ang = [-150, -30, 160, 20, -110, -60, 200, -10][k % 8] * Math.PI / 180;
    const mb = box(sc, "hb", "", 900, 440, null, null, "z-index:29");
    const mi = el("div", "in", "快点", mb);
    mi.style.cssText += "font-size:30px;padding:6px 16px;border-width:3px";
    keys(mb, [[t, { opacity: 0, transform: "scale(.3)" }], [t + 0.15, { opacity: 1, transform: "scale(1)" }],
      [t + 1.3, { opacity: 0, transform: `translate(${Math.cos(ang) * 520}px, ${Math.sin(ang) * 300}px) scale(1.1) rotate(${(k % 2 ? 1 : -1) * 12}deg)` }]], { ease: "out" });
  }

  const notObey = box(sc, "", "", null, 130, null, null, "left:0;right:0;display:flex;justify-content:center;z-index:31");
  const nb = el("div", "pill pill-ink", `<span class="emo">🧒</span> 孩子不听话？`, notObey);
  nb.style.fontSize = "56px";
  nb.style.position = "relative";
  pop(nb, S("h2"), "blip", 0.5);
  strike(nb, when("h2", "不听话") + 0.35);

  const rule = box(sc, "", "", 1290, 330, null, null, "z-index:31;text-align:center");
  rule.innerHTML = `<div class="emo" style="font-size:150px">📜</div><div class="pill pill-white" style="font-size:42px;margin-top:10px">家里的规则</div>`;
  pop(rule, when("h2", "家里的规则"), "pop", 0.6);
  keys(rule, [[when("h2", "长在你的嘴上") - 0.1, { transform: "none", opacity: 1 }], [when("h2", "长在你的嘴上") + 0.5, { transform: "translate(-330px, 120px) scale(.2)", opacity: 0 }]], { ease: "in", fill: "forwards" });
  sfx(when("h2", "长在你的嘴上"), "swish", 0.4);
  const onMouth = box(sc, "", "", null, 740, null, null, "left:0;right:0;display:flex;justify-content:center;z-index:31");
  const om = el("div", "pill pill-sun", `规则 一直长在 <b style="color:var(--coral-d)">大人嘴上</b>`, onMouth);
  om.style.fontSize = "60px";
  pop(om, when("h2", "长在你的嘴上") + 0.45, "ding", 0.45);
}

/* route: mouth → eyes → heart */
function routeNodes(parent, y, opts = {}) {
  const xs = [420, 960, 1500];
  const data = [["👄", "大人的嘴", "n1", "催促 · 提醒"], ["👀", "孩子的眼", "n2", "看得见的工具"], ["💗", "孩子的心", "n3", "自己提醒自己"]];
  const svg = el("div", "full", `<svg width="1920" height="1080" style="position:absolute;left:0;top:0">
    <path id="ra1" d="M 580 ${y - 30} Q 690 ${y - 130} 800 ${y - 30}" fill="none" stroke="#2e2a4f" stroke-width="9" stroke-linecap="round" stroke-dasharray="4 22"/>
    <path id="ra2" d="M 1120 ${y - 30} Q 1230 ${y - 130} 1340 ${y - 30}" fill="none" stroke="#2e2a4f" stroke-width="9" stroke-linecap="round" stroke-dasharray="4 22"/>
    <path d="M 784 ${y - 52} L 806 ${y - 26} L 774 ${y - 18}" fill="none" stroke="#2e2a4f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" class="ah1"/>
    <path d="M 1324 ${y - 52} L 1346 ${y - 26} L 1314 ${y - 18}" fill="none" stroke="#2e2a4f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" class="ah2"/>
  </svg>`, parent);
  const nodes = data.map(([e, lab, cls, sub], i) => {
    const n = box(parent, "node " + cls, `<span class="emo">${e}</span><div class="lab">${lab}</div>${opts.sub ? `<div class="sub">${sub}</div>` : ""}`, xs[i], y);
    return n;
  });
  const arrows = [svg.querySelector("#ra1"), svg.querySelector("#ra2")];
  const heads = [svg.querySelector(".ah1"), svg.querySelector(".ah2")];
  return { xs, nodes, arrows, heads };
}
function drawArrow(a, h, t) {
  anim(a, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], t, 0.5, { ease: "out" });
  show(h, t + 0.4, "fade", 0.2);
  sfx(t, "swish", 0.35);
}

{
  const sc = scene("h3", { cls: "dots", trans: "iris", lead: 0.35 });
  const g = el("div", "full", "", sc);
  g.style.transformOrigin = "960px 60px";
  const R = routeNodes(g, 470);
  const [n1, n2, n3] = R.nodes;
  keys(n1, [[S("h3") - 0.2, { transform: "translate(540px,0) scale(1.3)", opacity: 0 }], [S("h3") + 0.1, { transform: "translate(540px,0) scale(1.3)", opacity: 1 }], [S("h3") + 0.9, { transform: "none", opacity: 1 }]], { ease: "inOut" });
  const tEye = when("h3", "搬到孩子的眼前"), tHeart = when("h3", "再搬进");
  R.arrows.forEach((a) => (a.style.clipPath = "inset(0 100% 0 0)"));
  R.heads.forEach((hh) => (hh.style.opacity = 0));
  drawArrow(R.arrows[0], R.heads[0], tEye - 0.45);
  pop(n2, tEye, "pop", 0.6);
  drawArrow(R.arrows[1], R.heads[1], tHeart - 0.45);
  pop(n3, tHeart, "sparkle", 0.6);
  const card = box(g, "rulecard", "规则", 420, 250);
  pop(card, when("h3", "把规则"), "blip", 0.5);
  keys(card, [[tEye - 0.3, { transform: "none" }], [tEye + 0.3, { transform: "translate(540px,-40px) rotate(8deg)" }], [tEye + 0.5, { transform: "translate(540px,0) rotate(0)" }],
    [tHeart - 0.3, { transform: "translate(540px,0)" }], [tHeart + 0.3, { transform: "translate(1080px,-40px) rotate(-8deg)" }], [tHeart + 0.5, { transform: "translate(1080px,0) rotate(0)" }]], { ease: "inOut" });
  const tag = box(sc, "", "", null, 70, null, null, "left:0;right:0;display:flex;justify-content:center");
  const tg = el("div", "pill pill-ink", `<span class="emo">🔬</span> 发展心理学`, tag);
  pop(tg, when("h3", "发展心理学"), "blip", 0.5);
  hide(tag, S("h4") - 0.2, "fade", 0.3);

  // title card
  anim(g, [{ transform: "none" }, { transform: "translateY(-10px) scale(.52)" }], S("h4") - 0.25, 0.7, { ease: "inOut" });
  hide(card, S("h4") - 0.25, "fade", 0.3);
  const tt = box(sc, "bigtitle", "不催，也能自己动", 0, 470, W, null, "font-size:150px");
  show(tt, S("h4") + 0.05, "up", 0.6);
  sfx(S("h4"), "sparkle", 0.6);
  const ul = box(sc, "underline", "", 640, 640, 640);
  anim(ul, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], S("h4") + 0.4, 0.5, { ease: "out" });
  const st = box(sc, "bigtitle", "给 5 岁孩子建立「规则感」", 0, 690, W, null, "font-family:var(--sans);font-weight:900;font-size:54px;color:var(--ink2)");
  show(st, S("h4") + 0.5, "up", 0.5);
  const chips = box(sc, "", "", null, 800, null, null, "left:0;right:0;display:flex;justify-content:center;gap:36px");
  const c1 = el("div", "pill pill-coral", `<span class="emo">🧰</span> 6 个方法`, chips);
  const c2 = el("div", "pill pill-teal", `<span class="emo">📅</span> 4 周养成计划`, chips);
  [c1, c2].forEach((c) => (c.style.fontSize = "46px"));
  pop(c1, when("h4", "6个"), "pop", 0.6);
  pop(c2, when("h4", "4周"), "pop", 0.6);
}

/* =====================================================================
   PART 1 – why nagging backfires
   ===================================================================== */
{
  const sc = scene("p1a", { bg: "var(--ink)", trans: "up", sfx: "whoosh" });
  const p = box(sc, "part", "PART 1", 0, 300, W, null, "text-align:center");
  show(p, S("p1a") - 0.1, "up", 0.5);
  const t = box(sc, "bigtitle", "为什么越催越慢？", 0, 400, W, null, "font-size:140px;color:#fff");
  show(t, S("p1a") + 0.1, "zoom", 0.6);
  const icons = box(sc, "", "", null, 640, null, null, "left:0;right:0;display:flex;justify-content:center;gap:90px");
  ["⏰", "🧠", "⏳"].forEach((e, i) => {
    const d = el("div", "emo", e, icons);
    d.style.fontSize = "110px";
    pop(d, when("p1a", "为什么") + 0.2 + i * 0.18, "pop", 0.4);
  });
}

function reasonHead(sc, n, title, segId) {
  const h = box(sc, "mhead", `<div class="in"><div class="badge" style="background:var(--ink)">原因 ${n}</div><div class="t">${title}</div></div>`);
  show(h, S(segId) - 0.1, "down", 0.5);
  sfx(S(segId) - 0.1, "bell", 0.45);
  return h;
}

{
  const sc = scene("p1b", { cls: "dots", trans: "slide" });
  reasonHead(sc, "①", "你成了孩子的「闹钟」", "p1b");
  // layout A: alarm clock + what the kid really learns
  const A = group(sc, null, S("p1d") - 0.3);
  const ckO = box(A, "", "", 250, 280, 320, 320, "text-align:center");
  const ck = emo(ckO, "⏰", 280, 20, 0);
  pop(ckO, when("p1b", "闹钟") - 0.2, null, 0, "pop", 0.5);
  shake(ck, when("p1b", "闹钟"), 1.0, 10);
  sfx(when("p1b", "闹钟"), "alarm", 0.5);
  const lab = box(A, "", "", 230, 640, 360, null, "display:flex;justify-content:center");
  const lp = el("div", "pill pill-coral", "妈妈牌闹钟", lab);
  lp.style.fontSize = "44px";
  pop(lp, when("p1b", "闹钟") + 0.3, "blip", 0.4);
  const c1 = box(A, "rcard", `<div class="k">以为他学会了：</div><div class="v">“该刷牙了” <span class="emo">🪥</span></div>`, 760, 270, 960);
  const c2 = box(A, "rcard", `<div class="k">其实他学会了：</div><div class="v" style="color:var(--coral-d)">“等妈妈喊了再说” <span class="emo">🙉</span></div>`, 760, 500, 960);
  pop(c1, when("p1c", "该刷牙了") - 0.2, "pop", 0.5, "right");
  strike(c1.querySelector(".v"), when("p1c", "而是") - 0.1);
  pop(c2, when("p1c", "等妈妈喊了") - 0.1, "pop", 0.5, "right");
  pulse(c2, when("p1c", "再说"), 1, 1.04, 0.5);

  // layout B: three reminders, only the third one counts
  const Bg = group(sc, S("p1d") - 0.2, null);
  const cols = [
    ["第 1 遍", "#c9c1b3", "😊", "“该刷牙啦～”", 2, "🧒 …没反应"],
    ["第 2 遍", "#f2a33a", "😐", "“快去刷牙！”", 4, "🧒 …还在玩"],
    ["第 3 遍", "#e2482c", "😡", "“我数到三！！”", 7, "🏃 这次是真的！"],
  ];
  const tc = [when("p1d", "往往"), when("p1d", "要等到") + 0.4, when("p1d", "第三遍")];
  cols.forEach(([hd, color, face, say, vol, kid], i) => {
    const c = box(Bg, "colcard", `<div class="hd" style="background:${color}">${hd}</div><div class="face emo">${face}</div><div class="say">${say}</div>
      <div class="vol">${[1, 2, 3, 4, 5, 6, 7].map((k) => `<i style="height:${12 + k * 7}px;${k <= vol ? `background:${color}` : ""}"></i>`).join("")}</div><div class="kid">${kid}</div>`, 250 + i * 490, 230);
    pop(c, tc[i], "pop", 0.55, "up");
    if (i === 2) {
      const k = c.querySelector(".kid");
      k.style.color = "var(--coral-d)";
      show(k, when("p1d", "这次是真的"), "pop", 0.4);
      sfx(when("p1d", "这次是真的"), "hit", 0.5);
      shake(c.querySelector(".face"), when("p1d", "声音变严厉"), 0.6, 6);
    }
  });
  stampAt(Bg, "白说", 370, 560, when("p1d", "前两遍"), "font-size:76px");
  stampAt(Bg, "白说", 860, 560, when("p1d", "等于白说"), "font-size:76px");
}

{
  const sc = scene("p1e", { cls: "dots", trans: "slide" });
  reasonHead(sc, "②", "大脑的「管理中心」还在施工", "p1e");
  const brain = emo(sc, "🧠", 300, 210, 250);
  pop(brain, S("p1e") + 0.3, "pop", 0.5);
  const cone = emo(sc, "🚧", 130, 440, 450);
  pop(cone, when("p1e", "还在施工"), null);
  stampAt(sc, "施工中", 150, 260, when("p1e", "还在施工") + 0.1, "font-size:56px");
  const pf = box(sc, "", "", 130, 640, 520, null, "display:flex;justify-content:center");
  const pfp = el("div", "pill pill-ink", `前额叶 = 管理中心`, pf);
  pfp.style.fontSize = "42px";
  pop(pfp, when("p1e", "管理中心"), "blip", 0.45);
  pulse(pfp, when("p1f", "前额叶"), 2, 1.1, 0.5);
  const age = box(sc, "", "", 130, 740, 520, null, "display:flex;justify-content:center");
  const ag = el("div", "pill pill-white", `<span class="emo">🎓</span> 二十多岁才完全成熟`, age);
  ag.style.fontSize = "36px";
  pop(ag, when("p1f", "二十多岁"), "pop", 0.45);

  const F = group(sc, null, S("p1g") - 0.3);
  const chips = [["📋", "管计划", "记住接下来要做什么", "管计划"], ["✋", "管忍住", "想玩也能先停下来", "管忍住"], ["🔄", "管切换", "从玩，切换到刷牙", "管切换"]];
  chips.forEach(([e, a, b, ph], i) => {
    const c = box(F, "chip3", `<span class="emo">${e}</span><div><div class="a">${a}</div><div class="b">${b}</div></div>`, 860, 230 + i * 140);
    pop(c, when("p1f", ph) - 0.1, "pop", 0.5, "right");
  });
  const ef = box(F, "", "", 860, 670, 880, null, "display:flex;justify-content:center");
  const efp = el("div", "pill pill-teal", `= 执行功能 <span style="font-size:30px;opacity:.85">Executive Function</span>`, ef);
  efp.style.fontSize = "50px";
  pop(efp, when("p1f", "执行功能"), "ding", 0.5);

  // growth window chart
  const G = group(sc, S("p1g") - 0.2, S("p1h") - 0.3);
  const ch = box(G, "chart", "", 820, 210, 960, 600);
  const X = (a) => 90 + a * 32, Y = (v) => 500 - v * 380;
  const curve = (a) => 1 / (1 + Math.exp(-(a - 4.2) * 1.1)) * 0.55 + Math.min(1, a / 25) * 0.42;
  let d = `M ${X(0)} ${Y(curve(0))}`;
  for (let a = 0.25; a <= 25; a += 0.25) d += ` L ${X(a).toFixed(1)} ${Y(curve(a)).toFixed(1)}`;
  ch.innerHTML = `<svg width="960" height="600">
    <rect class="band" x="${X(3)}" y="70" width="${X(5) - X(3)}" height="430" fill="#ffe08a" opacity=".7" rx="12"/>
    <line x1="90" y1="500" x2="900" y2="500" stroke="#2e2a4f" stroke-width="5"/>
    <line x1="90" y1="500" x2="90" y2="80" stroke="#2e2a4f" stroke-width="5"/>
    ${[0, 3, 5, 10, 15, 20, 25].map((a) => `<text x="${X(a)}" y="545" font-size="30" text-anchor="middle" fill="#2e2a4f">${a}</text>`).join("")}
    <text x="900" y="585" font-size="28" text-anchor="end" fill="#8a8478">年龄（岁）</text>
    <text x="110" y="62" font-size="30" fill="#8a8478">执行功能</text>
    <path class="cv" d="${d}" fill="none" stroke="#ff6b4a" stroke-width="12" stroke-linecap="round"/>
    <text class="bl" x="${X(5) + 24}" y="${Y(curve(5)) + 70}" font-size="40" fill="#e2482c" font-weight="900">3–5岁 突飞猛进</text>
  </svg>`;
  pop(ch, S("p1g") - 0.1, null, 0, "up");
  const cv = ch.querySelector(".cv");
  const L = 1400;
  cv.style.strokeDasharray = L;
  anim(cv, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], when("p1g", "3到5岁") - 0.4, 1.6, { ease: "inOut" });
  show(ch.querySelector(".band"), when("p1g", "3到5岁"), "fade", 0.4);
  show(ch.querySelector(".bl"), when("p1g", "突飞猛进"), "fade", 0.3);
  sfx(when("p1g", "突飞猛进"), "sparkle", 0.5);
  const src = box(G, "foot", "示意图 · 参考：哈佛大学儿童发展中心（Center on the Developing Child）", null, null, null, null, "right:140px;bottom:210px;font-size:22px");
  show(src, S("p1g"), "fade", 0.4);

  // goal card
  const Hh = group(sc, S("p1h") - 0.2, null);
  const goal = box(Hh, "rcard", `<div class="k">我们的目标</div>
     <div class="v g1" style="color:var(--muted)">❌ 让他更听话</div><br>
     <div class="v g2" style="font-size:66px;color:var(--teal-d)">✅ 练出 <span style="background:var(--sun-l);padding:0 10px;border-radius:12px">自己管自己</span> 的能力</div>`, 820, 260, 960);
  goal.style.lineHeight = "1.7";
  pop(goal, S("p1h"), "pop", 0.5, "up");
  strike(goal.querySelector(".g1"), when("p1h", "更听话") + 0.3);
  show(goal.querySelector(".g2"), when("p1h", "而是"), "up", 0.5);
  sfx(when("p1h", "自己管自己"), "correct", 0.5);
}

{
  const sc = scene("p1i", { cls: "dots", trans: "slide" });
  reasonHead(sc, "③", "5岁孩子「看不见」时间", "p1i");
  const mk = (x, deg, label, t, color) => {
    const c = box(sc, "clock", `<div class="wedge" style="background:conic-gradient(${color} 0 ${deg}deg, transparent ${deg}deg 360deg)"></div><div class="dot"></div>`, x, 250);
    const l = box(sc, "clock-lab", label, x, 610);
    pop(c, t, "pop", 0.5);
    show(l, t + 0.15, "up", 0.4);
    return c;
  };
  mk(300, 30, "还有 5 分钟", when("p1j", "还有5分钟") - 0.1, "#ff6b4a");
  mk(1290, 300, "还有 50 分钟", when("p1j", "还有50分钟") - 0.1, "#4d9de0");
  const eq = box(sc, "bigtitle", "≈", 760, 270, 400, null, "font-size:240px;color:var(--coral)");
  pop(eq, when("p1j", "差不多"), null);
  sfx(when("p1j", "差不多"), "blip", 0.6);
  const sh = emo(sc, "🤷", 150, 885, 520);
  pop(sh, when("p1j", "差不多") + 0.2, "pop", 0.4);
  const q = emo(sc, "🤔", 170, 875, 240);
  pop(q, S("p1i") + 0.6, "pop", 0.4);
  hide(q, when("p1j", "差不多") - 0.1, "fade", 0.2);
  banner(sc, `看不见、摸不着 → <b>管不了</b>`, 760, when("p1j", "看不见"), null);
}

{
  const sc = scene("p1k", { bg: "#fdf0f3", trans: "zoom" });
  const h = box(sc, "mhead", `<div class="in"><div class="badge" style="background:var(--ink)">小结</div><div class="t">催促 = 管理权攥在大人手里</div></div>`);
  show(h, when("p1k", "催促") - 0.1, "down", 0.5);
  sfx(S("p1k"), "bell", 0.45);
  const mom = emo(sc, "👩", 270, 280, 330);
  pop(mom, S("p1k") + 0.1, "pop", 0.5);
  const keyO = box(sc, "", "", 560, 300, null, null, "text-align:center");
  keyO.innerHTML = `<div class="emo" style="font-size:150px">🔑</div><div class="pill pill-sun" style="font-size:40px">管理权</div>`;
  pop(keyO, when("p1k", "管理权"), "coin", 0.6);
  const kk = keyO.firstChild;
  wobble(kk, when("p1k", "攥在") , 3, 10, 0.8);
  const wall = box(sc, "bigtitle", "✋", 860, 360, 200, null, "font-family:var(--emoji);font-size:140px");
  pop(wall, when("p1k", "攥在大人手里"), "hit", 0.45);
  const kid = emo(sc, "🧒", 270, 1300, 330);
  pop(kid, when("p1k", "孩子没机会练") - 0.2, "pop", 0.5);
  const kp = box(sc, "", "", 1250, 640, 380, null, "display:flex;justify-content:center");
  const kpp = el("div", "pill pill-white", `练习机会：<b style="color:var(--coral)">0</b>`, kp);
  kpp.style.fontSize = "42px";
  pop(kpp, when("p1k", "没机会练"), "wrong", 0.35);
  const qm = emo(sc, "❓", 110, 1560, 260);
  pop(qm, when("p1k", "学不会"), "blip", 0.5);
  const momLab = box(sc, "", "", 230, 640, 380, null, "display:flex;justify-content:center");
  const ml = el("div", "pill pill-coral", `一直是大人在管`, momLab);
  ml.style.fontSize = "40px";
  pop(ml, when("p1k", "大人手里"), "blip", 0.4);
}

/* =====================================================================
   PART 2 – the route
   ===================================================================== */
{
  const sc = scene("p2a", { cls: "dots", trans: "iris", sfx: "whoosh" });
  const h = box(sc, "mhead", `<div class="in"><div class="badge" style="background:var(--teal)">思路</div><div class="t">把管理权交出去：规则搬家路线</div></div>`);
  show(h, S("p2a"), "down", 0.5);
  sfx(S("p2a"), "bell", 0.45);
  const R = routeNodes(sc, 400, { sub: true });
  R.arrows.forEach((a) => (a.style.clipPath = "inset(0 100% 0 0)"));
  R.heads.forEach((hh) => (hh.style.opacity = 0));
  pop(R.nodes[0], when("p2a", "大人的嘴"), "pop", 0.5);
  drawArrow(R.arrows[0], R.heads[0], when("p2a", "到孩子的眼") - 0.3);
  pop(R.nodes[1], when("p2a", "孩子的眼"), "pop", 0.5);
  drawArrow(R.arrows[1], R.heads[1], when("p2a", "再到") - 0.2);
  pop(R.nodes[2], when("p2a", "孩子的心"), "sparkle", 0.5);
  R.nodes.forEach((n) => (n.querySelector(".sub").style.opacity = 0));
  show(R.nodes[0].querySelector(".sub"), when("p2a", "大人的嘴") + 0.3, "fade", 0.3);
  show(R.nodes[1].querySelector(".sub"), when("p2b", "看得见的工具"), "fade", 0.3);
  show(R.nodes[2].querySelector(".sub"), when("p2b", "提醒自己"), "fade", 0.3);
  const r2 = box(sc, "ring", "", 960 - 165, 400 - 165, 330, 330);
  during(r2, when("p2b", "看得见的工具") - 0.2, when("p2b", "再让孩子") - 0.1, "pop", "fade");
  const r3 = box(sc, "ring", "", 1500 - 165, 400 - 165, 330, 330);
  during(r3, when("p2b", "再让孩子"), when("p2b", "下面6个方法") - 0.1, "pop", "fade");
  const m4 = box(sc, "", "", 700, 790, 520, null, "display:flex;gap:14px;justify-content:center");
  const m2 = box(sc, "", "", 1290, 790, 420, null, "display:flex;gap:14px;justify-content:center");
  const mk = (p, n, c) => { const d = el("div", "pill", n, p); d.style.cssText += `font-size:36px;padding:10px 22px;background:${c};color:#fff`; return d; };
  const chips = [mk(m4, "①", "#ff6b4a"), mk(m4, "②", "#ff6b4a"), mk(m4, "③", "#ff6b4a"), mk(m4, "④", "#ff6b4a"), mk(m2, "⑤", "#19a78f"), mk(m2, "⑥", "#19a78f")];
  chips.forEach((c, i) => pop(c, when("p2b", "下面6个方法") + 0.15 * i, "pop", 0.4));
  const x1 = emo(sc, "❌", 70, 385, 790);
  pop(x1, when("p2b", "下面6个方法") - 0.2, "wrong", 0.3);
}
