/* =====================================================================
   SIX METHODS
   ===================================================================== */
function methodScene(segId, bg) {
  return scene(segId, { cls: "dots", bg, trans: "iris", sfx: "whoosh", sfxGain: 0.4 });
}
function pillAt(parent, html, x, y, w, cls, fs, t, name = "pop") {
  const o = box(parent, "", "", x, y, w, null, "display:flex;justify-content:center");
  const p = el("div", "pill " + cls, html, o);
  if (fs) p.style.fontSize = fs + "px";
  if (t != null) pop(p, t, name, 0.45);
  return p;
}

/* ---------- 方法1：规则少、具体、一起定 ---------- */
{
  const sc = methodScene("m1a");
  mhead(sc, "方法 1", "规则：少 · 具体 · 一起定", "👀", "m1a");

  const A = group(sc, S("m1b") - 0.2, S("m1c") - 0.3);
  const mem = box(A, "card", `<div style="font-size:46px;font-weight:900;text-align:center;margin-top:40px">🧠 一次只记得住 <span style="color:var(--coral)">2～3</span> 件事</div>`, 170, 230, 860, 540);
  const slots = box(mem, "", "", 70, 200, 720, null, "display:flex;gap:30px;justify-content:center");
  const icons = ["🪥", "👕", "👟", "🎒"];
  const tFill = when("m1b", "两三件事");
  icons.forEach((ic, i) => {
    const s = el("div", "slot", `<span class="emo">${ic}</span>`, slots);
    if (i < 3) {
      show(s.firstChild, tFill - 0.6 + i * 0.25, "pop", 0.4);
      sfx(tFill - 0.6 + i * 0.25, "pop", 0.4);
    } else {
      s.style.borderColor = "#ffb4a5";
      keys(s.firstChild, [[tFill + 0.5, { opacity: 0, transform: "translateY(-200px)" }], [tFill + 0.8, { opacity: 1, transform: "translateY(0)" }],
        [tFill + 1.2, { opacity: 1, transform: "translate(60px,-60px) rotate(30deg)" }], [tFill + 1.7, { opacity: 0, transform: "translate(160px,300px) rotate(120deg)" }]], { ease: "out" });
      sfx(tFill + 0.8, "wrong", 0.4);
    }
  });
  const mx = box(mem, "", "4 件？记不住啦", 0, 420, 860, null, "text-align:center;font-size:40px;font-weight:900;color:var(--coral-d)");
  show(mx, tFill + 1.0, "up", 0.4);
  const big = box(A, "card", `<div style="text-align:center;margin-top:60px"><span class="num" style="font-size:250px;color:var(--coral);line-height:1">≤3</span></div>
    <div style="text-align:center;font-size:56px;font-weight:900">条规则</div><div style="text-align:center;font-size:38px;color:var(--muted);font-weight:700;margin-top:10px">每个时段（早上 / 睡前）</div>`, 1110, 230, 640, 540);
  pop(big, when("m1b", "规则别超过3条") - 0.2, "ding", 0.5);

  const Bg = group(sc, S("m1c") - 0.2, S("m1e") - 0.3);
  const rows = [["“要乖”", "👟", "鞋子放回鞋架", "要乖", "鞋子放回"], ["“别磨蹭”", "🧸", "玩具回到箱子里", "别磨蹭", "玩具回到"]];
  rows.forEach(([ab, ic, txt, pa, pc], i) => {
    const y = 230 + i * 190;
    const a = box(Bg, "abstract", ab, 170, y, 440);
    pop(a, when("m1c", pa) - 0.1, "pop", 0.4);
    const ar = box(Bg, "arrow", "→", 650, y + 10);
    show(ar, when("m1c", pc) - 0.3, "left", 0.3);
    const c = box(Bg, "concrete", `<span class="emo">${ic}</span>${txt}`, 790, y, 960);
    pop(c, when("m1c", pc) - 0.1, "correct", 0.35, "right");
  });
  stampAt(Bg, "太抽象", 470, 170, when("m1c", "太抽象"), "font-size:50px");
  const dd = box(Bg, "", "", 170, 640, 1580, null, "display:flex;gap:40px;justify-content:center");
  const good = el("div", "pill pill-teal", `多说 ✅ 要做什么`, dd);
  const bad = el("div", "pill", `少说 ❌ 不许做什么`, dd);
  bad.style.cssText += "background:#fff1ee;color:var(--coral-d)";
  [good, bad].forEach((p) => (p.style.fontSize = "48px"));
  pop(good, when("m1d", "要做什么"), "pop", 0.5);
  pop(bad, when("m1d", "不许做什么"), "pop", 0.5);
  const eg = box(Bg, "", `例：<s>不许乱扔</s> → <b style="color:var(--teal-d)">玩具回家</b>`, 170, 760, 1580, null, "text-align:center;font-size:38px;font-weight:700;color:var(--muted)");
  show(eg, when("m1d", "不许做什么") + 0.5, "up", 0.4);

  const C = group(sc, S("m1e") - 0.2, null);
  const kid = emo(C, "🧒", 230, 200, 330);
  pop(kid, S("m1e"), "pop", 0.4);
  const cr = emo(C, "🖍️", 120, 400, 520);
  pop(cr, when("m1e", "自己画"), "scribble", 0.6);
  const paper = box(C, "paper", `<div style="font-size:50px;font-weight:500;color:var(--coral-d)">我们的早晨规则</div>
    <div class="ln" style="font-size:46px;line-height:72px;margin-top:16px">① 起床 先上厕所</div><div class="ln" style="font-size:46px;line-height:72px">② 穿衣服 再刷牙</div><div class="ln" style="font-size:46px;line-height:72px">③ 鞋子放回鞋架</div>`, 560, 230, 560, 440, "transform:rotate(-3deg)");
  pop(paper, when("m1e", "一起商量顺序") - 0.2, "page", 0.6, "up");
  paper.querySelectorAll(".ln").forEach((l, i) => show(l, when("m1e", "自己画") + i * 0.35, "wipe", 0.4));
  const stk = emo(paper, "⭐", 100, 410, 300);
  pop(stk, when("m1e", "自己贴"), "coin", 0.6);
  const ch = [["🗣️ 一起商量顺序", "一起商量顺序"], ["🖍️ 自己画", "自己画"], ["⭐ 自己贴", "自己贴"]];
  ch.forEach(([t, ph], i) => pillAt(C, t, 1230, 250 + i * 120, 520, "pill-white", 44, when("m1e", ph)));
  banner(C, `自己定的规则，<b>更愿意守</b>`, 690, when("m1e", "自己定的规则"), null);
  const ft = box(C, "foot", "参考：自我决定理论（Deci & Ryan）——自主感让人更愿意坚持", null, null, null, null, "bottom:150px");
  show(ft, when("m1e", "自己定的规则"), "fade", 0.4);
}

/* ---------- 方法2：流程图卡 ---------- */
{
  const sc = methodScene("m2a", "#f2f8f6");
  mhead(sc, "方法 2", "做一张「流程图卡」", "👀", "m2a");
  const board = box(sc, "board", `<div class="ttl">🌞 我的早晨</div>`, 120, 200, 1680, 470);
  show(board, S("m2b") - 0.3, "up", 0.5);
  const steps = [["😴", "起床", "起床"], ["🚽", "上厕所", "上厕所"], ["👕", "穿衣服", "穿衣服"], ["🪥", "刷牙", "刷牙"], ["🥣", "吃早饭", "吃早饭"], ["👟", "穿鞋出门", "穿鞋出门"]];
  const cards = steps.map(([e, l, ph], i) => {
    const c = box(board, "rc", `<div class="flip"><div class="face front"><div class="no">${i + 1}</div><span class="emo">${e}</span><div class="l">${l}</div><span class="emo me">🧒</span></div>
      <div class="face back"><span class="emo">✅</span><div class="l">完成</div></div></div>`, 46 + i * 270, 120);
    pop(c, when("m2b", ph) - 0.1, "pop", 0.5);
    return c;
  });
  // photo mode while "拍孩子自己做的样子"
  const tPh = when("m2c", "拍孩子");
  hook((t) => board.classList.toggle("photo", t >= tPh + 0.1));
  flash(sc, tPh);
  const pol = box(sc, "polaroid", `<div class="pic emo">🧒🪥</div><div class="cap">这是我在刷牙！</div>`, 1330, 170, null, null, "z-index:12;transform:rotate(5deg)");
  const polI = pol;
  keys(polI, [[when("m2c", "照片里的自己") - 0.2, { opacity: 0, transform: "rotate(16deg) translateY(200px) scale(.6)" }], [when("m2c", "照片里的自己") + 0.3, { opacity: 1, transform: "rotate(5deg)" }],
    [End("m2c") + 0.1, { opacity: 1, transform: "rotate(5deg)" }], [End("m2c") + 0.4, { opacity: 0, transform: "rotate(5deg) translateY(60px)" }]], { ease: "out" });
  sfx(when("m2c", "照片里的自己") - 0.1, "page", 0.6);
  const cap2 = pillAt(sc, `<span class="emo">📸</span> 拍孩子自己做的样子`, 120, 720, 1680, "pill-ink", 44, tPh + 0.2);
  hide(cap2, End("m2c"), "fade", 0.3);

  // flip as each step gets done, magnet hops along
  const mag = box(board, "magnet", `<span class="emo">⭐</span>`, 46 + 75, 60);
  const tf = [when("m2d", "每做完一项"), when("m2d", "就让他") + 0.2, when("m2d", "翻过来")];
  pop(mag, tf[0] - 0.4, "blip", 0.5);
  const mk = [[tf[0] - 0.4, { transform: "none" }]];
  tf.forEach((t, i) => {
    anim(cards[i].querySelector(".flip"), [{ transform: "rotateY(0)" }, { transform: "rotateY(180deg)" }], t, 0.55, { ease: "inOut" });
    sfx(t, "flip", 0.8);
    sfx(t + 0.4, "correct", 0.25);
    mk.push([t + 0.25, { transform: `translateX(${i * 270}px)` }], [t + 0.6, { transform: `translateX(${(i + 1) * 270}px)` }]);
  });
  keys(mag, mk, { ease: "inOut" });
  const col = pillAt(sc, `每做完一项 → 自己<b style="color:var(--sun)">翻卡片</b> / 挪磁贴`, 120, 720, 1680, "pill-ink", 44, when("m2d", "每做完一项") + 0.3);
  hide(col, End("m2d"), "fade", 0.3);

  // new line for the parent
  const ringC = box(board, "", "", 46 + 3 * 270 - 14, 106, 264, 328, "border:8px solid var(--sun);border-radius:34px");
  during(ringC, when("m2e", "下一步是什么") - 0.1, End("m2f"), "pop", "fade", "ding", 0.4);
  pulse(cards[3], when("m2e", "下一步是什么"), 3, 1.06, 0.6);
  const b1 = box(sc, "", "", 250, 720);
  const bb1 = el("div", "bubble bad", `“快去刷牙！”`, b1);
  bb1.style.position = "relative";
  pop(bb1, when("m2e", "快去刷牙") - 0.1, "pop", 0.45);
  strike(bb1, when("m2e", "而是问一句"));
  hide(b1, S("m2f") - 0.2, "fade", 0.3);
  const b2 = box(sc, "", "", 780, 720);
  const bb2 = el("div", "bubble good", `“看看你的图，下一步是什么？” <span class="emo">👀</span>`, b2);
  bb2.style.position = "relative";
  pop(bb2, when("m2e", "看看你的图") - 0.1, "correct", 0.4);
  hide(b2, S("m2f") - 0.2, "fade", 0.3);
  const cmd = box(sc, "", "", 0, 720, W, null, "display:flex;justify-content:center;align-items:center;gap:30px");
  cmd.innerHTML = `<div class="pill pill-white" style="font-size:46px">指挥者：</div><div class="pill" style="font-size:46px;background:#fff1ee;color:var(--coral-d);position:relative" id="c-mom"><span class="emo">👩</span> 妈妈</div>
    <div style="font-size:60px;font-weight:900;color:var(--muted)">→</div><div class="pill pill-teal" style="font-size:46px" id="c-rule"><span class="emo">📋</span> 那张图 = 规则本身</div>`;
  const [cw, cm, ca, cr] = cmd.children;
  show(cw, S("m2f"), "pop", 0.4);
  show(cm, S("m2f") + 0.1, "pop", 0.4);
  strike(cm, when("m2f", "不再是你"));
  show(ca, when("m2f", "而是那张图") - 0.2, "left", 0.3);
  pop(cr, when("m2f", "而是那张图"), "correct", 0.45);
}

/* ---------- 方法3：时间看得见 ---------- */
{
  const sc = methodScene("m3a");
  mhead(sc, "方法 3", "让时间「看得见」", "👀", "m3a");
  const t0 = S("m3b"), t1 = End("m3d");
  const hg = box(sc, "hourglass", `<svg width="300" height="440" viewBox="0 0 300 440">
    <defs><clipPath id="hgTop"><path d="M40 40 L260 40 C260 140 170 180 158 220 L142 220 C130 180 40 140 40 40 Z"/></clipPath>
    <clipPath id="hgBot"><path d="M142 220 L158 220 C170 260 260 300 260 400 L40 400 C40 300 130 260 142 220 Z"/></clipPath></defs>
    <path d="M40 40 L260 40 C260 140 170 180 158 220 C170 260 260 300 260 400 L40 400 C40 300 130 260 142 220 C130 180 40 140 40 40 Z" fill="#fff" stroke="#2e2a4f" stroke-width="10" stroke-linejoin="round"/>
    <rect class="st" x="30" y="60" width="240" height="170" fill="#ffc93c" clip-path="url(#hgTop)"/>
    <rect class="sb" x="30" y="400" width="240" height="0" fill="#ffc93c" clip-path="url(#hgBot)"/>
    <rect class="stream" x="146" y="215" width="8" height="185" fill="#ffc93c"/>
    <rect x="20" y="18" width="260" height="28" rx="12" fill="#2e2a4f"/><rect x="20" y="394" width="260" height="28" rx="12" fill="#2e2a4f"/>
  </svg>`, 230, 220);
  pop(hg, when("m3b", "沙漏") - 0.1, "pop", 0.5);
  const st = hg.querySelector(".st"), sb = hg.querySelector(".sb"), stream = hg.querySelector(".stream");
  hook((t) => {
    const k = Math.max(0, Math.min(1, (t - when("m3b", "沙漏")) / (t1 - when("m3b", "沙漏")))) * 0.62;
    st.setAttribute("y", 60 + k * 170);
    sb.setAttribute("y", 400 - k * 150);
    sb.setAttribute("height", k * 150);
    stream.style.opacity = t > when("m3b", "沙漏") && t < t1 ? 1 : 0;
  });
  const hl = box(sc, "lab", "沙漏", 230, 680, 300);
  show(hl, when("m3b", "沙漏") + 0.2, "up", 0.4);
  const tm = box(sc, "timer", `<div class="disc"></div><div class="mid"></div>`, 640, 250);
  pop(tm, when("m3b", "可视化计时器") - 0.1, "pop", 0.5);
  const disc = tm.querySelector(".disc");
  hook((t) => {
    const a0 = when("m3b", "可视化计时器");
    const k = Math.max(0, Math.min(1, (t - a0) / (t1 - a0)));
    const deg = 300 * (1 - k * 0.55);
    disc.style.background = `conic-gradient(#ff6b4a 0 ${deg}deg, #f6efe4 ${deg}deg 360deg)`;
  });
  const tl = box(sc, "lab", "可视化计时器", 640, 680, 380);
  show(tl, when("m3b", "可视化计时器") + 0.2, "up", 0.4);
  const see = pillAt(sc, `<span class="emo">👀</span> 时间一点点变少，亲眼看得到`, 120, 770, 1000, "pill-ink", 40, when("m3b", "时间一点点"));
  hide(see, End("m3b") + 0.2, "fade", 0.3);

  const songs = [["🎵🪥", "一首刷牙歌", "放完 = 牙刷好了", "一首刷牙歌"], ["🎵🧸", "一首收玩具歌", "唱完 = 玩具都回家", "一首收玩具"]];
  songs.forEach(([e, a, b, ph], i) => {
    const s = box(sc, "song", `<span class="emo">${e}</span><div class="t">${a}<small>${b}</small></div>`, 1170, 250 + i * 240);
    pop(s, when("m3c", ph) - 0.1, "sparkle", 0.4, "right");
  });
  const notes = box(sc, "", "", 1650, 210);
  ["🎶", "🎵"].forEach((n, i) => { const d = emo(notes, n, 70, i * 70, i * 40); show(d, when("m3c", "用歌来计时") + i * 0.3, "pop", 0.4); bob(d, when("m3c", "用歌来计时"), 20, 16, 1.2 + i * 0.3); });

  const b1 = box(sc, "", "", 1180, 770);
  const bb1 = el("div", "bubble bad", `“快点！”`, b1);
  bb1.style.position = "relative";
  pop(bb1, when("m3d", "快点") - 0.1, "pop", 0.4);
  strike(bb1, when("m3d", "而是说"));
  const b2 = box(sc, "", "", 1450, 770);
  const bb2 = el("div", "bubble good", `“沙漏还剩一半哦～”`, b2);
  bb2.style.position = "relative";
  bb2.style.marginLeft = "-120px";
  pop(bb2, when("m3d", "沙漏还剩一半") - 0.1, "correct", 0.4);
  hide(b1, when("m3d", "让时间去催他") - 0.2, "fade", 0.3);
  hide(b2, when("m3d", "让时间去催他") - 0.2, "fade", 0.3);
  const fin = box(sc, "", "", 1120, 770, 700, null, "display:flex;justify-content:center");
  const fp = el("div", "pill pill-ink", `让 <b style="color:var(--sun)">时间</b> 去催他，而不是你`, fin);
  fp.style.fontSize = "44px";
  pop(fp, when("m3d", "让时间去催他"), "ding", 0.45);
}

/* ---------- 方法4：当……就…… ---------- */
{
  const sc = methodScene("m4a", "#fdf0f3");
  mhead(sc, "方法 4", "用「当……就……」代替「再不……就……」", "👀", "m4a", { scale: 1.2 });

  const A = group(sc, null, S("m4c") - 0.3);
  const L = box(A, "vs", `<div class="hd" style="background:var(--coral)"><span class="emo">😠</span>再不……就……</div><div class="q">“你再不穿鞋，<br>我们就不去公园了！”</div><div class="re"><span class="emo">😣</span>孩子：被逼的</div>`, 150, 220);
  const R = box(A, "vs", `<div class="hd" style="background:var(--teal)"><span class="emo">🙂</span>当……就……</div><div class="q">“当你穿好鞋，<br>我们就出发去公园！” <span class="emo">🌳</span></div><div class="re"><span class="emo">😃</span>孩子：我能做到</div>`, 990, 220);
  pop(L, when("m4b", "你再不穿鞋") - 0.2, "pop", 0.5, "left");
  pop(R, when("m4b", "当你穿好鞋") - 0.2, "pop", 0.5, "right");
  stampAt(A, "威胁", 690, 290, when("m4b", "是威胁"));
  const okS = stampAt(A, "规则", 1530, 290, when("m4b", "是规则"));
  okS.style.borderColor = "var(--teal)";
  okS.style.color = "var(--teal)";
  banner(A, `同一件事，<b>孩子的感受完全不一样</b>`, 730, when("m4b", "同一件事"), null);

  const Bg = group(sc, S("m4c") - 0.2, S("m4d") - 0.3);
  const q1 = box(Bg, "choice", `<div class="opt">先 <span class="emo">🪥</span> 刷牙</div><div class="or">还是</div><div class="opt">先 <span class="emo">👕</span> 换睡衣？</div>`, null, 250, null, null, "left:0;right:0;justify-content:center");
  const q2 = box(Bg, "choice", `<div class="opt">穿 <span class="sock" style="background:#4d9de0"></span> 蓝袜子</div><div class="or">还是</div><div class="opt">穿 <span class="sock" style="background:#ffc93c"></span> 黄袜子？</div>`, null, 450, null, null, "left:0;right:0;justify-content:center");
  [q1, q2].forEach((q, i) => {
    const [a, , b] = q.children;
    const ph = i ? ["蓝袜子", "黄袜子"] : ["先刷牙", "先换睡衣"];
    pop(a, when("m4c", ph[0]) - 0.1, "pop", 0.45);
    show(q.children[1], when("m4c", ph[0]) + 0.3, "fade", 0.3);
    pop(b, when("m4c", ph[1]) - 0.1, "pop", 0.45);
  });
  const pick = q2.children[2];
  keys(pick, [[when("m4c", "有了选择权") - 0.2, { borderColor: "transparent" }], [when("m4c", "有了选择权"), { borderColor: "#19a78f" }]], { ease: "linear" });
  banner(Bg, `有限的选择 → <b>“这是我自己的事”</b>`, 680, when("m4c", "有了选择权"), null);

  const C = group(sc, S("m4d") - 0.2, S("m4e") - 0.3);
  const boxO = box(C, "", "", 760, 280, 400, null, "text-align:center");
  boxO.innerHTML = `<div class="emo" style="font-size:260px">📦</div><div class="pill pill-sun" style="font-size:46px;margin-top:-10px">休息箱 · 住一天</div>`;
  pop(boxO, when("m4d", "休息箱") - 0.3, "pop", 0.5);
  const toys = [["🧸", 220, 560], ["🚗", 400, 600], ["🧩", 560, 560]];
  toys.forEach(([e, x, y], i) => {
    const d = emo(C, e, 110, x, y);
    show(d, when("m4d", "玩具没收回箱子") + i * 0.12, "pop", 0.4);
    const t = when("m4d", "住一天") + i * 0.22;
    const dx = 900 - x, dy = 360 - y;
    keys(d, [[t, { transform: "none", opacity: 1 }], [t + 0.25, { transform: `translate(${dx * 0.5}px, ${dy - 160}px) rotate(-20deg)`, opacity: 1 }], [t + 0.5, { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: 0 }]], { ease: "linear", fill: "forwards" });
    sfx(t + 0.45, "tap", 0.8);
  });
  const nat = pillAt(C, `<span class="emo">🌱</span> 后果自然发生`, 1260, 300, 520, "pill-white", 44, when("m4d", "后果自然发生"));
  const pre = pillAt(C, `<span class="emo">📌</span> 提前说好`, 1260, 420, 520, "pill-teal", 44, when("m4d", "提前说好"));

  const D = group(sc, S("m4e") - 0.2, null);
  const items = [["😌", "语气平静", "语气平静"], ["🙅", "不翻旧账", "不翻旧账"], ["🤐", "不讲大道理", "不讲大道理"]];
  items.forEach(([e, l, ph], i) => {
    const c = box(D, "check", `<span class="emo">${e}</span>${l}`, 160 + i * 545, 240);
    pop(c, when("m4e", ph) - 0.1, "correct", 0.3);
  });
  const eqr = box(D, "", "", 0, 560, W, null, "display:flex;justify-content:center;gap:28px;align-items:center");
  eqr.innerHTML = `<div class="pill pill-teal" style="font-size:50px">后果 = 规则的一部分</div><div class="pill" style="font-size:50px;background:#fff1ee;color:var(--coral-d)">≠ 惩罚</div><div class="pill" style="font-size:50px;background:#fff1ee;color:var(--coral-d)">≠ 发脾气</div>`;
  const [e1, e2, e3] = eqr.children;
  pop(e1, when("m4e", "后果是规则的一部分"), "ding", 0.4);
  pop(e2, when("m4e", "不是惩罚"), "pop", 0.4);
  pop(e3, when("m4e", "更不是发脾气"), "pop", 0.4);
}

/* ---------- 方法5：自己提醒自己 ---------- */
{
  const sc = methodScene("m5a", "#f2f8f6");
  mhead(sc, "方法 5", "教孩子「自己提醒自己」", "💗", "m5a");

  const A = group(sc, S("m5b") - 0.2, S("m5c") - 0.3);
  const kid = emo(A, "🧒", 250, 230, 380);
  pop(kid, S("m5b"), "pop", 0.4);
  const th = box(A, "thought", "先穿鞋…再背包…", 330, 240);
  pop(th, when("m5b", "自言自语"), "blip", 0.5);
  const q = box(A, "quote", `<div style="font-size:40px;font-weight:700;color:var(--muted)">📖 苏联心理学家 · 维果茨基（Vygotsky）</div>
    <div class="q1" style="font-size:58px;font-weight:900;margin-top:24px">自言自语</div>
    <div class="q2" style="font-size:58px;font-weight:900;margin-top:10px">= 用语言 <span style="background:var(--sun-l);padding:0 12px;border-radius:12px">指挥自己</span></div>`, 1000, 260, 760);
  pop(q, when("m5b", "维果茨基") - 0.2, "page", 0.5, "right");
  show(q.querySelector(".q1"), when("m5b", "自言自语"), "up", 0.4);
  show(q.querySelector(".q2"), when("m5b", "用语言指挥自己"), "up", 0.4);

  const Bg = group(sc, S("m5c") - 0.2, S("m5d") - 0.3);
  const ttl = pillAt(Bg, `<span class="emo">🚪</span> 出门口诀`, 0, 210, W, "pill-ink", 46, when("m5c", "编口诀"));
  const ch = box(Bg, "", "", 0, 320, W, null, "display:flex;justify-content:center;gap:60px");
  [["👟", "一鞋"], ["🎒", "二包"], ["🥤", "三水杯"]].forEach(([e, l]) => {
    const it = el("div", "chant", "", ch);
    it.style.position = "relative";
    it.innerHTML = `<div class="it"><span class="emo">${e}</span><b>${l}</b></div>`;
    pop(it, when("m5c", l) - 0.05, "count", 0.6);
  });
  const sing = pillAt(Bg, `<span class="emo">🎵</span> 边做边念`, 0, 680, W, "pill-sun", 44, when("m5c", "边做边念"));

  const C = group(sc, S("m5d") - 0.2, S("m5e") - 0.3);
  const night = box(C, "night", "", 140, 200, 1640, 620);
  show(night, S("m5d") - 0.2, "fade", 0.4);
  const moon = emo(night, "🌙", 150, 80, 70);
  ["⭐", "✨", "⭐"].forEach((s, i) => { const d = emo(night, s, 46, 280 + i * 120, 60 + (i % 2) * 70); show(d, S("m5d") + i * 0.2, "pop", 0.4); });
  const nt = box(night, "", `睡前 <span class="num" style="font-size:120px;color:var(--sun)">2</span> 分钟<br><span style="font-size:52px">计划时间</span>`, 80, 270, 600, null, "color:#fff;font-size:70px;font-weight:900;line-height:1.3");
  show(nt, when("m5d", "两分钟") - 0.2, "up", 0.5);
  const pp = box(night, "paper", `<div style="font-size:52px;font-weight:500;color:var(--coral-d)">明天早上</div>
    <div class="ln" style="font-size:48px;line-height:72px;margin-top:14px">① 先穿衣服 👕</div><div class="ln" style="font-size:48px;line-height:72px">② 再刷牙 🪥</div><div class="ln" style="font-size:48px;line-height:72px">③ 吃早饭 🥣</div>`, 820, 70, 640, 470, "transform:rotate(2deg)");
  pop(pp, when("m5d", "明天早上") - 0.2, "page", 0.6, "up");
  const lns = pp.querySelectorAll(".ln");
  show(lns[0], when("m5d", "先做什么"), "wipe", 0.5);
  show(lns[1], when("m5d", "再做什么"), "wipe", 0.5);
  show(lns[2], when("m5d", "说出来"), "wipe", 0.5);
  sfx(when("m5d", "先做什么"), "scribble", 0.5);
  sfx(when("m5d", "再做什么"), "scribble", 0.5);
  const crayon = emo(night, "🖍️", 100, 1450, 420);
  pop(crayon, when("m5d", "画出来"), "scribble", 0.6);

  const D = group(sc, S("m5e") - 0.2, null);
  const games = [["🧍", "一二三木头人", "练：忍住", "一二三木头人", "pill-coral"], ["🚦", "红灯停 绿灯行", "练：忍住", "红灯停", "pill-coral"], ["🔄", "反着做", "练：切换", "反着做", "pill-teal"]];
  games.forEach(([e, n, tg, ph, cls], i) => {
    const g = box(D, "game", `<span class="emo">${e}</span><div class="nm">${n}</div><div class="tg"><div class="pill ${cls}" style="font-size:40px">${tg}</div></div>`, 165 + i * 545, 210);
    pop(g, when("m5e", ph) - 0.1, "pop", 0.5);
    show(g.querySelector(".tg"), when("m5e", i < 2 ? "忍住" : "切换"), "pop", 0.4);
  });
  sfx(when("m5e", "忍住"), "ding", 0.4);
  sfx(when("m5e", "切换"), "ding", 0.4);
  const sub = box(D, "", "（说“摸头”就摸脚）", 165 + 2 * 545, 590, 470, null, "text-align:center;font-size:30px;color:var(--muted);font-weight:700");
  show(sub, when("m5e", "反着做") + 0.2, "fade", 0.3);
  banner(D, `游戏里守规则 <b>＞</b> 说教里守规则`, 750, S("m5f"), null);
}

/* ---------- 方法6：撤提醒 + 用对反馈 ---------- */
{
  const sc = methodScene("m6a");
  mhead(sc, "方法 6", "一级一级撤掉提醒，再用对反馈", "💗", "m6a", { scale: 1.3 });

  const A = group(sc, null, S("m6d") - 0.3);
  const lv = [["🤝", "陪着一起做", "先陪着一起做", "#ff6b4a"], ["👉", "指一指图卡", "只指一指图卡", "#f28c3a"], ["💬", "只说一个词", "只说一个词", "#f2b23a"], ["👀", "一个眼神", "只给一个眼神", "#5fb88f"], ["🕊️", "完全放手", "完全放手", "#19a78f"]];
  const tops = lv.map((_, i) => 330 + i * 95);
  const xs = lv.map((_, i) => 130 + i * 335);
  lv.forEach(([e, l, ph, c], i) => {
    const s = box(A, "step", `<div class="lv">第${i + 1}级</div><span class="emo">${e}</span><div class="l">${l}</div>`, xs[i], tops[i], 325, 900 - tops[i], `background:${c}`);
    pop(s, when("m6b", ph) - 0.15, "pop", 0.5, "up");
  });
  const kidO = box(A, "", "", 0, 0, null, null, "z-index:5");
  const kid = emo(kidO, "🧒", 120, 0, 0);
  const kp = (i) => ({ transform: `translate(${xs[i] + 200}px, ${tops[i] - 160}px)` });
  const kf = [[when("m6b", "先陪着一起做") + 0.2, Object.assign({ opacity: 0 }, kp(0))], [when("m6b", "先陪着一起做") + 0.5, Object.assign({ opacity: 1 }, kp(0))]];
  ["只指一指图卡", "只说一个词", "只给一个眼神", "完全放手"].forEach((ph, i) => {
    const t = when("m6b", ph) + 0.2;
    kf.push([t, Object.assign({ opacity: 1 }, kp(i))], [t + 0.4, Object.assign({ opacity: 1 }, kp(i + 1))]);
    sfx(t + 0.35, "tap", 0.6);
  });
  const t2 = S("m6c") + 0.1, tDown = when("m6c", "往下退一级"), tUp = when("m6c", "回到上一级");
  kf.push([t2, Object.assign({ opacity: 1 }, kp(4))], [t2 + 0.5, Object.assign({ opacity: 1 }, kp(1))], [tDown, Object.assign({ opacity: 1 }, kp(1))], [tDown + 0.45, Object.assign({ opacity: 1 }, kp(2))], [tUp, Object.assign({ opacity: 1 }, kp(2))], [tUp + 0.45, Object.assign({ opacity: 1 }, kp(1))]);
  keys(kidO, kf, { ease: "inOut" });
  sfx(tDown + 0.4, "tap", 0.7);
  sfx(tUp + 0.4, "tap", 0.7);
  const p1 = pillAt(A, `✅ 稳定了 → 往下退一级`, 1080, 200, 760, "pill-teal", 42, tDown - 0.3);
  const p2 = pillAt(A, `↩️ 做不到 → 回上一级，没关系`, 1080, 300, 760, "pill-sun", 42, tUp - 0.2);
  const hand = box(A, "", "", 1080, 220, 760, null, "display:flex;justify-content:center");
  const hp = el("div", "pill pill-white", `<span class="emo">📉</span> 提醒越来越少`, hand);
  hp.style.fontSize = "42px";
  pop(hp, when("m6b", "完全放手") + 0.3, "sparkle", 0.4);
  hide(hp, S("m6c") - 0.1, "fade", 0.3);

  const Bg = group(sc, S("m6d") - 0.2, S("m6e") - 0.3);
  const bad = box(Bg, "praise", `“你真棒！”`, 180, 230, null, null, "color:var(--coral-d);background:#fff1ee;position:absolute");
  pop(bad, when("m6d", "你真棒") - 0.1, "pop", 0.45);
  const badL = pillAt(Bg, `太笼统`, 640, 250, 260, "pill-white", 40, when("m6d", "你真棒") + 0.5, "wrong");
  const good = box(Bg, "praise", `“你自己<span style="background:var(--sun-l);padding:0 8px;border-radius:10px">看了图</span>，就去<span style="background:var(--sun-l);padding:0 8px;border-radius:10px">刷牙</span>了，<br>一次都没让妈妈提醒。”`, 180, 440, 1200, null, "color:var(--teal-d)");
  pop(good, when("m6d", "你自己看了图") - 0.15, "correct", 0.45, "up");
  const gl = pillAt(Bg, `<span class="emo">🔍</span> 说出你看到的过程`, 1300, 280, 480, "pill-teal", 42, when("m6d", "说出你看到的过程"));
  const pr = emo(Bg, "😊", 160, 1490, 520);
  pop(pr, S("m6d"), "sparkle", 0.4);

  const C = group(sc, S("m6e") - 0.2, S("m6f") - 0.3);
  const chart = box(C, "card", `<div style="font-size:48px;font-weight:900;margin:36px 0 26px 50px">⭐ 贴纸表</div><div class="stars" style="margin-left:50px">${Array.from({ length: 10 }, () => `<span class="emo">⭐</span>`).join("")}</div>`, 200, 230, 680, 480);
  pop(chart, when("m6e", "贴纸奖励") - 0.2, "pop", 0.5);
  chart.querySelectorAll(".stars span").forEach((s, i) => { show(s, when("m6e", "贴纸奖励") + 0.1 + i * 0.08, "pop", 0.3); });
  sfx(when("m6e", "贴纸奖励") + 0.2, "coin", 0.5);
  pillAt(C, `✅ 短期用来启动`, 1010, 330, 700, "pill-teal", 50, when("m6e", "短期用来启动"));
  const lng = pillAt(C, `❌ 长期当筹码`, 1010, 480, 700, "", 50, when("m6e", "长期当筹码"), "wrong");
  lng.style.cssText += "background:#fff1ee;color:var(--coral-d)";

  const D = group(sc, S("m6f") - 0.2, null);
  const ex = box(D, "card", `<div style="font-size:46px;font-weight:900;margin:34px 0 0 50px">🔬 经典实验 · 1973</div>
    <div style="font-size:30px;font-weight:700;color:var(--muted);margin:8px 0 0 50px">Lepper 等 · 斯坦福大学附属幼儿园 · 学前儿童画画</div>
    <div style="font-size:32px;font-weight:700;color:var(--ink2);margin:30px 0 0 50px">之后自由时间里，<b>主动画画的时间</b></div>`, 170, 210, 1000, 560);
  pop(ex, when("m6f", "经典实验") - 0.2, "page", 0.5, "up");
  const bA = box(ex, "bar", "", 50, 280, 640, null, "background:var(--teal)");
  const bB = box(ex, "bar", "", 50, 410, 320, null, "background:var(--coral)");
  const lA = box(ex, "barlab", "没约定奖励", 60, 300, null, null, "color:#fff");
  const lB = box(ex, "barlab", "事先约好奖励", 60, 430, null, null, "color:#fff");
  anim(bA, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], when("m6f", "事先约好") - 0.2, 0.7, { ease: "out" });
  show(lA, when("m6f", "事先约好"), "fade", 0.3);
  anim(bB, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], when("m6f", "之后自己主动"), 0.7, { ease: "out" });
  show(lB, when("m6f", "之后自己主动") + 0.2, "fade", 0.3);
  const down = box(ex, "barlab", "反而变少 ↓", 400, 425, null, null, "color:var(--coral-d);font-size:44px");
  show(down, when("m6f", "反而变少"), "pop", 0.4);
  sfx(when("m6f", "反而变少"), "wrong", 0.35);
  const ft = box(ex, "", "示意图，非原始数据", null, null, null, null, "right:30px;bottom:20px;font-size:22px;color:var(--muted)");
  const med = box(D, "", "", 1250, 260, 520, null, "text-align:center");
  med.innerHTML = `<div class="emo" style="font-size:210px">🏅</div><div style="font-size:54px;font-weight:900;margin-top:20px">为自己做到<br>而<span style="color:var(--coral)">骄傲</span></div>`;
  pop(med, when("m6f", "我们要的"), "sparkle", 0.6);
}
