/* =====================================================================
   4-WEEK PLAN · EXPECTATIONS · PHRASE CARD · ENDING
   ===================================================================== */
{
  const sc = scene("w0", { cls: "dots", bg: "#fff6e9", trans: "up", sfx: "whoosh" });
  mhead(sc, "计划", "4 周养成计划", "📅", "w0", { scale: 1.6 });
  const W4 = [
    ["第 1 周", "#ff6b4a", "🤝", "一起定规则<br>做图卡", "家长全程陪着做<br>熟悉流程", 100, "w1"],
    ["第 2 周", "#f2a33a", "👉", "只指图卡", "问一句：<br>“下一步是什么？”", 70, "w2"],
    ["第 3 周", "#5fb88f", "⏳", "加沙漏和口诀", "提醒只用<br>一两个词", 40, "w3"],
    ["第 4 周", "#19a78f", "🕊️", "大部分放手", "睡前回顾：<br>“今天哪件事是你自己做到的？”", 15, "w4"],
  ];
  W4.forEach(([hd, c, e, a, b, m, id], i) => {
    const w = box(sc, "week", `<div class="hd" style="background:${c}">${hd}</div><span class="emo ic">${e}</span><div class="tx">${a}<small>${b}</small></div>
      <div class="meter"><div class="ml">家长出手</div><div class="tr"><div class="fl" style="width:${m}%;background:${c}"></div></div></div>`, 120 + i * 430, 220);
    pop(w, S(id) - 0.1, "pop", 0.5, "up");
    anim(w.querySelector(".fl"), [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], S(id) + 0.4, 0.6, { ease: "out" });
    w.querySelector(".fl").style.transformOrigin = "0 50%";
    const t1 = i < 3 ? S(W4[i + 1][6]) - 0.1 : End("w4") + 0.3;
    keys(w, [[S(id) + 0.5, { boxShadow: "0 16px 40px rgba(46,42,79,.12)" }], [S(id) + 0.8, { boxShadow: `0 0 0 8px ${c}, 0 24px 50px rgba(46,42,79,.2)` }],
      [t1, { boxShadow: `0 0 0 8px ${c}, 0 24px 50px rgba(46,42,79,.2)` }], [t1 + 0.3, { boxShadow: "0 16px 40px rgba(46,42,79,.12)" }]], { ease: "inOut", fill: "none" });
  });
}

{
  const sc = scene("e1", { cls: "dots", bg: "#f2f8f6", trans: "iris", sfx: "whoosh" });
  mhead(sc, "预期", "管理好自己的预期", "🌱", "e1", { scale: 1.6 });
  const A = group(sc, S("e2") - 0.2, S("e3") - 0.3);
  const n = box(A, "card", `<div style="text-align:center;margin-top:30px"><span class="num big66" style="font-size:270px;color:var(--coral);line-height:1">0</span><span style="font-size:80px;font-weight:900"> 天</span></div>
    <div style="text-align:center;font-size:44px;font-weight:900">成年人养成一个新习惯</div><div style="text-align:center;font-size:36px;color:var(--muted);font-weight:700;margin-top:8px">平均约 66 天，两个多月</div>`, 170, 220, 820, 560);
  pop(n, when("e2", "成年人") - 0.2, "pop", 0.5);
  counter(n.querySelector(".big66"), 0, 66, when("e2", "平均也要"), 1.2);
  sfx(when("e2", "平均也要") + 1.1, "ding", 0.5);
  const ft = box(A, "foot", "参考：Lally 等，2010，伦敦大学学院习惯养成研究（中位数 66 天）", null, null, null, null, "bottom:150px");
  show(ft, when("e2", "成年人"), "fade", 0.4);
  pillAt(A, `<span class="emo">👍</span> 4 周看到进步 = 很好`, 1060, 330, 720, "pill-teal", 50, when("e2", "4周能看到进步"));
  const np = pillAt(A, `<span class="emo">🙅</span> 不追求完美`, 1060, 480, 720, "pill-white", 50, when("e2", "不要追求完美"));

  const Bg = group(sc, S("e3") - 0.2, S("e4") - 0.3);
  const card = box(Bg, "chart", "", 170, 210, 1580, 560);
  const pts = [[0, 0.1], [0.12, 0.22], [0.2, 0.3], [0.27, 0.18], [0.36, 0.38], [0.45, 0.48], [0.52, 0.33], [0.62, 0.55], [0.72, 0.64], [0.79, 0.5], [0.88, 0.72], [1, 0.85]];
  const X = (k) => 90 + k * 1400, Y = (v) => 470 - v * 380;
  let d = `M ${X(0)} ${Y(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [k0, v0] = pts[i - 1], [k1, v1] = pts[i];
    const mx = (X(k0) + X(k1)) / 2;
    d += ` C ${mx} ${Y(v0)} ${mx} ${Y(v1)} ${X(k1)} ${Y(v1)}`;
  }
  card.innerHTML = `<svg width="1580" height="560"><line x1="90" y1="490" x2="1500" y2="490" stroke="#2e2a4f" stroke-width="5"/>
    <text x="1500" y="535" font-size="30" text-anchor="end" fill="#8a8478" font-weight="700">时间 →</text><text x="100" y="60" font-size="30" fill="#8a8478" font-weight="700">自己做到的程度</text>
    <path class="cv" d="${d}" fill="none" stroke="#19a78f" stroke-width="12" stroke-linecap="round"/></svg>`;
  pop(card, S("e3") - 0.1, null, 0, "up");
  const cv = card.querySelector(".cv");
  cv.style.strokeDasharray = 2200;
  anim(cv, [{ strokeDashoffset: 2200 }, { strokeDashoffset: 0 }], S("e3") + 0.2, 3.2, { ease: "inOut" });
  const dips = [[3, "😴", "累了", "累了"], [6, "🍽️", "饿了", "饿了"], [9, "🤒", "生病了", "生病了"]];
  dips.forEach(([i, e, l, ph]) => {
    const [k, v] = pts[i];
    const t = box(card, "", `<span class="emo" style="font-size:70px">${e}</span><div style="font-size:36px;font-weight:900;color:var(--coral-d)">${l}</div>`, X(k) - 70, Y(v) + 18, 140, null, "text-align:center");
    pop(t, when("e3", ph) - 0.1, "pop", 0.45);
  });
  const ret = pillAt(Bg, `退回一级提醒 → 第二天再继续`, 0, 800, W, "pill-sun", 44, when("e3", "退回一级"));
  const fx = box(card, "", "进步是波浪形的，退步很正常", 0, 80, 1500, null, "text-align:right;font-size:34px;font-weight:900;color:var(--teal-d)");
  show(fx, when("e3", "会反复"), "fade", 0.4);

  const C = group(sc, S("e4") - 0.2, null);
  const cmp = box(C, "", "", 0, 270, W, null, "display:flex;justify-content:center;align-items:center;gap:60px");
  cmp.innerHTML = `<div class="card" style="position:relative;width:560px;height:360px;text-align:center"><div style="font-size:44px;font-weight:900;margin-top:40px;color:var(--muted)">现在 · 一天提醒</div><div class="num" style="font-size:180px;color:var(--coral);line-height:1.1">20次</div></div>
    <div style="font-size:120px;font-weight:900;color:var(--ink)">→</div>
    <div class="card" style="position:relative;width:560px;height:360px;text-align:center"><div style="font-size:44px;font-weight:900;margin-top:40px;color:var(--muted)">目标 · 一天提醒</div><div class="num" style="font-size:180px;color:var(--teal);line-height:1.1"><span class="cnt">20</span>次</div></div>`;
  const [ca, cb, cc] = cmp.children;
  pop(ca, when("e4", "从一天提醒二十次") - 0.1, "pop", 0.5);
  show(cb, when("e4", "变成两三次") - 0.3, "left", 0.3);
  pop(cc, when("e4", "变成两三次") - 0.2, "pop", 0.5);
  counter(cc.querySelector(".cnt"), 20, 2, when("e4", "变成两三次"), 0.9, (v) => (v < 3.5 ? "2~3" : Math.round(v)));
  sfx(when("e4", "变成两三次") + 0.8, "correct", 0.5);
  const not0 = pillAt(C, `目标不是“0 次提醒”`, 0, 700, W, "pill-white", 42, when("e4", "不是一次都不提醒"));
}

{
  const sc = scene("s1", { bg: "linear-gradient(160deg,#2e2a4f,#3f3a74)", trans: "up", sfx: "whoosh" });
  const card = box(sc, "card", "", 160, 90, 1600, 820, "background:#fff6e9");
  show(card, S("s1") - 0.2, "up", 0.5);
  const ttl = box(card, "", `<span class="emo">📌</span> 替换话术卡`, 0, 50, 1600, null, "text-align:center;font-family:var(--fun);font-size:80px;color:var(--ink)");
  show(ttl, S("s1"), "pop", 0.5);
  sfx(S("s1"), "bell", 0.5);
  const tag = box(card, "", "", 1240, 64, null, null, "");
  const tg = el("div", "pill pill-coral", `<span class="emo">📸</span> 截图保存`, tag);
  tg.style.fontSize = "38px";
  tg.style.transform = "rotate(6deg)";
  pop(tag, when("s1", "截图保存"), null);
  flash(sc, when("s1", "截图保存") + 0.15);
  const rows = [["“快点！”", "“看看图，下一步是什么？”", "s2"], ["“说了多少遍了！”", "“我们的规则是什么？”", "s3"], ["“你再不……就……”", "“当你……我们就……”", "s4"]];
  rows.forEach(([b, g, id], i) => {
    const r = box(card, "talk", `<div class="bad">${b}</div><div class="ar">→</div><div class="good">${g}</div>`, null, 200 + i * 175);
    r.style.left = "70px";
    const [bd, ar, gd] = r.children;
    pop(bd, S(id), "pop", 0.45);
    strike(bd, when(id, "换成") - 0.15);
    show(ar, when(id, "换成"), "left", 0.3);
    pop(gd, when(id, "换成") + 0.15, "correct", 0.4, "right");
  });
  const legend = box(card, "", "❌ 催促 &nbsp;&nbsp;→&nbsp;&nbsp; ✅ 让规则说话", 0, 740, 1600, null, "text-align:center;font-size:32px;font-weight:700;color:var(--muted)");
  show(legend, S("s4") + 0.5, "fade", 0.4);
}

{
  const sc = scene("s5", { cls: "dots", trans: "fade", sfx: false, dur: 0.8 });
  const icons = box(sc, "", "", 0, 150, W, null, "display:flex;justify-content:center;gap:50px;align-items:center;font-size:96px");
  icons.innerHTML = `<span class="emo">👄</span><span style="font-size:60px;font-weight:900;color:var(--muted)">→</span><span class="emo">👀</span><span style="font-size:60px;font-weight:900;color:var(--muted)">→</span><span class="emo">💗</span>`;
  stagger(icons.children, S("s5") - 0.2, 0.12, "pop", 0.4);
  sfx(S("s5"), "sparkle", 0.4);
  const a = box(sc, "bigtitle", "好的规则，不在大人的嘴上", 0, 350, W, null, "font-size:96px");
  const b = box(sc, "bigtitle", "而在孩子心里的<span style='background:var(--sun-l);padding:0 16px;border-radius:20px'>那张图</span>上", 0, 490, W, null, "font-size:96px");
  const c = box(sc, "bigtitle", "你少催一句，他就多长一点 <span class='emo'>🌱</span>", 0, 690, W, null, "font-size:84px;color:var(--coral)");
  show(a, when("s5", "不在大人的嘴上") - 0.3, "up", 0.6);
  show(b, when("s5", "而在孩子心里"), "up", 0.6);
  show(c, when("s5", "你少催一句"), "up", 0.6);
  sfx(when("s5", "你少催一句"), "ding", 0.4);
}

{
  const sc = scene("end", { cls: "hook-bg", trans: "iris", sfx: "whoosh" });
  const rays = el("div", "rays", "", sc);
  anim(rays, [{ transform: "rotate(0)" }, { transform: "rotate(30deg)" }], S("end"), 10, { ease: "linear" });
  const t = box(sc, "bigtitle", "觉得有用？", 0, 220, W, null, "font-size:130px;color:#fff;text-shadow:0 8px 0 rgba(120,20,10,.35)");
  show(t, S("end") - 0.1, "pop", 0.5);
  const row = box(sc, "", "", 0, 470, W, null, "display:flex;justify-content:center;gap:40px");
  row.innerHTML = `<div class="cta"><span class="emo">⭐</span>收藏</div><div class="cta"><span class="emo">📤</span>转给催娃的家长</div><div class="cta"><span class="emo">➕</span>关注</div>`;
  const [r1, r2, r3] = row.children;
  pop(r1, when("end", "记得收藏"), "pop", 0.6);
  pop(r2, when("end", "转给"), "pop", 0.6);
  pop(r3, when("end", "我们下期见") - 0.4, "pop", 0.6);
  const bye = box(sc, "bigtitle", "下期见 <span class='emo'>👋</span>", 0, 690, W, null, "font-size:90px;color:var(--sun);text-shadow:0 6px 0 rgba(120,20,10,.35)");
  show(bye, when("end", "我们下期见"), "up", 0.5);
  sfx(when("end", "我们下期见"), "sparkle", 0.5);
}

K.finishScenes();

/* ---------- HUD: chapter tag + progress bar (from Part 1 on) ---------- */
{
  const CH = [["p1a", "原因", "为什么越催越慢"], ["p2a", "思路", "规则搬家路线"], ["m1a", "方法1", "规则少·具体·一起定"], ["m2a", "方法2", "流程图卡"], ["m3a", "方法3", "让时间看得见"],
    ["m4a", "方法4", "当……就……"], ["m5a", "方法5", "自己提醒自己"], ["m6a", "方法6", "撤提醒·用对反馈"], ["w0", "计划", "4周养成"], ["e1", "预期", "别追求完美"], ["s1", "话术", "替换话术卡"]];
  const t0 = S("p1a"), tEnd = S("s5") - 0.4;
  const bar = el("div", "hud-bar", "");
  const tag = el("div", "hud-tag", "");
  const segs = CH.map(([id], i) => {
    const a = S(id), b = i + 1 < CH.length ? S(CH[i + 1][0]) : tEnd;
    const s = el("div", "seg", "<i></i>", bar);
    s.style.width = ((b - a) / (tEnd - t0)) * 100 + "%";
    return { a, b, fill: s.firstChild };
  });
  show(bar, t0 - 0.4, "fade", 0.4);
  show(tag, t0 - 0.4, "left", 0.5);
  hide(bar, tEnd, "fade", 0.4);
  hide(tag, tEnd, "fade", 0.4);
  let last = -1;
  hook((t) => {
    segs.forEach((s) => (s.fill.style.width = Math.max(0, Math.min(1, (t - s.a) / (s.b - s.a))) * 100 + "%"));
    let k = 0;
    CH.forEach(([id], i) => { if (t >= S(id) - 0.4) k = i; });
    if (k !== last) {
      tag.innerHTML = `<b>${CH[k][1]}</b>${CH[k][2]}`;
      last = k;
    }
  });
}

E.subtitles({
  skip: ["h1"],
  highlight: ["不是孩子不听话", "嘴上", "眼前", "心里", "6个", "4周", "闹钟", "第三遍", "白说", "执行功能", "前额叶", "3到5岁", "窗口期", "自己管自己", "看不见时间", "管理权",
    "大人的嘴", "孩子的眼", "孩子的心", "规则别超过3条", "具体的动作", "要做什么", "让孩子参与", "更愿意守", "流程图卡", "下一步是什么", "规则本身", "让时间看得见", "沙漏",
    "让时间去催他", "当……就……", "是威胁", "是规则", "有限的选择", "提前说好", "语气平静", "不是惩罚", "自言自语", "编口诀", "做个计划", "规则游戏", "撤掉提醒", "五级",
    "退一级", "没关系", "说出你看到的过程", "启动", "筹码", "骄傲", "两个多月", "不要追求完美", "退回一级提醒", "两三次", "截图保存", "那张图", "少催一句", "收藏"],
});
