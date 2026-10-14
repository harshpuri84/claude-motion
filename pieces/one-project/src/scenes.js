// =====================================================================
//  SCENES — one-project. World 1920x1080; TT on 2s; lt = time since the beat started.
// =====================================================================
const lt = (k) => TT - BEATS_T[k];

// ---- 1. one project (paper, blue stripes)
function sceneOpen() {
  const t = lt('open');
  stripeWorld('open', 'blue');
  paperCloud(150, 300, 0.9, 'c1'); paperCloud(1790, 260, 0.7, 'c2'); paperCloud(1760, 800, 1.0, 'c3');
  const s = popS(BEATS_T.open + 0.3);
  if (s > 0) {   // the real "New project" dialog, in an inked frame
    const x = 700, y = 170, w = 690, h = 711;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.rotate(-0.015); ctx.translate(-(x + w / 2), -(y + h / 2));
    const P = rrectPts(x, y, w, h, 26);
    softShadow(P, 'dlg', 14, 18, 0.18);
    trace(P, true); ctx.fillStyle = '#ffffff'; ctx.fill();
    drawAsset('new-project.png', x, y, w, h, { fit: 'cover', r: 26 });
    ink(P, { closed: true, w: 3.4, amt: 0.6, key: 'dlgrim', color: PP.ink });
    ctx.restore();
  }
  walker(470, 820, 78, { key: 'hero', mood: t > 2 ? 'happy' : 'smile' });
  // a hand-drawn arrow from the hero to the dialog
  ink([[560, 740], [610, 640], [690, 600]], { w: 3.2, amt: 0.8, key: 'arw', frac: ev(BEATS_T.open + 1.2, 0.5) });
  if (TT > BEATS_T.open + 1.7) ink([[668, 584], [692, 600], [668, 620]], { w: 3.2, amt: 0.5, key: 'arwh' });
  sceneLabel('one project', BEATS_T.open + 0.1);
  progressDial(1 / 7, '1 · project');
}

// ---- 2. one main chat plans and hands out threads (blueprint)
function sceneMain() {
  const T0 = BEATS_T.main, cx = 470, cy = 580;
  blueprintWorld('main');
  for (let k = 0; k < 2; k++) {   // a slow pulse out of the main chat
    const u = mod((TT - T0) * 0.6 + k * 0.5, 1), r = 110 + u * 260;
    bpLine(ellipsePts(cx, cy, r, r, 0, 90), { closed: true, w: 1.6, color: `rgba(174,185,236,${0.45 * (1 - u)})`, glow: 'rgba(0,0,0,0)' });
  }
  bpLine(ellipsePts(cx, cy, 110, 110, 0, 80), { closed: true, w: 2.4 });
  sansText('main chat', cx, cy + 170, 30, PP.label, { weight: 600, align: 'center' });
  walker(cx, cy, 62, { key: 'hero', dark: true });
  // the plan: three dashed lines written beside it
  const tp = VW('main', 'plans');
  ['plan the work', 'split it in three', 'hand each piece out'].forEach((s, i) => {
    const a = ev(tp + i * 0.3, 0.3); if (a <= 0) return;
    const y = 300 + i * 52;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = PP.line; ctx.lineWidth = 2; ctx.strokeRect(300, y - 22, 24, 24);
    if (TT > tp + 1.2 + i * 0.3) bpLine([[304, y - 10], [311, y - 2], [322, y - 18]], { w: 3, color: PP.cyan });
    sansText(s, 344, y, 28, PP.label, { weight: 500, count: Math.ceil(a * s.length) }); ctx.restore();
  });
  // three branches to three threads, a packet on each
  const th = VW('main', 'hands');
  [330, 580, 830].forEach((y, i) => {
    const f = ev(th + i * 0.25, 0.7); if (f <= 0) return;
    const P = []; for (let k = 0; k <= 30; k++) { const u = k / 30; P.push([lerp(cx + 110, 1330, u), lerp(cy, y, EZ.io(u))]); }
    bpLine(P, { w: 2.4, frac: f });
    if (f >= 1) {
      const u = ((TT - th - 0.8 - i * 0.25) * 0.5) % 1, p = pointAt(P, u);
      if (p) glint(p[0], p[1], 9);
      const w = bpPill('thread ' + (i + 1), 1500, y, { size: 30 });
      ctx.fillStyle = [PP.terra, '#7aa6d6', '#8fcf7a'][i]; ctx.beginPath(); ctx.arc(1500 + w / 2 + 30, y, 10, 0, TAU); ctx.fill();
    }
  });
  sceneLabel('one main chat, many threads', T0 + 0.1, { dark: true });
  progressDial(2 / 7, '2 · threads', { dark: true });
}

// ---- 3. pick up recent work (paper, green stripes)
function sceneDetect() {
  const t = lt('detect'), T0 = BEATS_T.detect;
  stripeWorld('detect', 'green');
  // 1. the real start screen; the hero presses "Pick up recent work"
  const sx = 110, sy = 210, sw = 800, sh = 120;
  softShadow(rrectPts(sx - 20, sy - 20, sw + 40, sh + 40, 18), 'pk', 10, 14, 0.16);
  paint(rrectPts(sx - 20, sy - 20, sw + 40, sh + 40, 18), { fill: '#fbfaf6', key: 'pkb', w: 3, amt: 0.5, line: PP.ink });
  drawAsset('pick-up.png', sx, sy, sw, sh, { fit: 'contain' });
  const press = ev(T0 + 0.9, 0.25), cxp = sx + 130, cyp = sy + 100;
  if (press > 0) { ctx.save(); ctx.globalAlpha = 1 - ev(T0 + 1.15, 0.5); ink(rrectPts(cxp - 130, cyp - 24, 260, 48, 14), { closed: true, w: 4, amt: 0.6, color: PP.terra, key: 'press' }); ctx.restore(); }
  const hx = lerp(330, 260, press), hy = lerp(520, 430, press);
  walker(hx, hy, 58, { key: 'hero', mood: t > 4 ? 'happy' : 'wow' });
  // 2. it reads the recent sessions: cards stream into the main chat
  const n = Math.min(14, Math.floor(clamp((TT - T0 - 1.6) / 2.4) * 14 + 0.0001));
  const names = ['claude-motion', 'kpi-cockpit', 'curry-studio', 'ai-presentation'];
  const topCard = Math.min(13, Math.floor((TT - T0 - 1.6 - 0.45) / 0.17));   // only the top card of the pile keeps its label
  for (let i = 0; i < 14; i++) {   // each card flies in and lands on a growing pile
    const a = ev(T0 + 1.6 + i * 0.17, 0.45); if (a <= 0) continue;
    const R = RNG('sc', i), k = EZ.o3(a);
    const tx = 600 + R.r(-40, 40) + i * 4, ty = 560 + R.r(-30, 30) - i * 6;
    const x = lerp(-260, tx, k), y = lerp(980, ty, k) - Math.sin(k * Math.PI) * 160;
    docCard(x, y, 280, 170, a < 1 || i !== topCard ? '' : (i < 4 ? names[i] : 'session ' + (i + 1)), { key: 'sc' + i, size: 24, lines: 3, accent: ['#d97757', '#7a9cc6', '#6f9c4f', '#e9b949'][i % 4], rot: R.n(0.16) * k });
  }
  if (TT > T0 + 1.6) {
    paint(rrectPts(560, 960 - 70, 420, 74, 16), { fill: PP.paper, key: 'cnt', w: 2.6, amt: 0.4, line: PP.ink });
    sansText('reading sessions', 588, 937, 28, PP.ink, { weight: 500 });
    monoText(String(n).padStart(2, ' '), 900, 938, 32, PP.terraD, { key: 'cntn' });
  }
  // 3. suggested threads, then "Start 3 threads"
  const cx = 1020, cy = 250, cw = 780, ch = 560, cs = popS(T0 + 4.3);
  if (cs > 0) {
    ctx.save(); ctx.translate(cx + cw / 2, cy + ch / 2); ctx.scale(cs, cs); ctx.translate(-(cx + cw / 2), -(cy + ch / 2));
    softShadow(rrectPts(cx, cy, cw, ch, 24), 'sug', 12, 16, 0.16);
    paint(rrectPts(cx, cy, cw, ch, 24), { fill: '#fbfaf6', key: 'sug', w: 3.2, amt: 0.6, line: PP.ink });
    sansText('suggested threads', cx + 40, cy + 64, 28, 'rgba(43,38,34,0.6)', { weight: 500 });
    const rows = [['push the unpushed branch', 'committed on the Mac, never pushed'], ['build Friday’s AI talk', 'due 16 October, nothing built yet'], ['fix two broken skills', 'waiting for a yes to fix them']];
    rows.forEach(([a, b], i) => {
      const r = ev(T0 + 4.7 + i * 0.35, 0.3); if (r <= 0) return;
      ctx.save(); ctx.globalAlpha = r;
      const y = cy + 140 + i * 120;
      sansText(a, cx + 40, y, 36, PP.ink, { weight: 600 });
      sansText(b, cx + 40, y + 40, 24, 'rgba(43,38,34,0.6)', { weight: 400 });
      sansText('↵', cx + cw - 60, y + 14, 32, 'rgba(43,38,34,0.5)', { weight: 400 });
      ctx.restore();
    });
    const bp = ev(T0 + 6.6, 0.2), by = cy + ch - 90;
    paint(rrectPts(cx + 40, by, 270, 64, 14), { fill: bp > 0 ? PP.terra : PP.paper, key: 'startb', w: 2.6, amt: 0.4, line: PP.ink });
    sansText('Start 3 threads', cx + 64, by + 42, 30, bp > 0 ? '#fff8ef' : PP.ink, { weight: 600 });
    ctx.restore();
    // three threads leave to the right
    for (let i = 0; i < 3; i++) {
      const f = ev(T0 + 6.8 + i * 0.15, 0.6); if (f <= 0) continue;
      const y0 = cy + 140 + i * 120 + 10, P = [[cx + cw, y0], [cx + cw + 60, y0 - 10 + i * 10], [W + 40, y0 - 60 + i * 60]];
      ink(P, { w: 5, amt: 1, key: 'thr' + i, frac: f, color: [PP.terra, '#3f7a8c', '#6f9c4f'][i] });
    }
  }
  sceneLabel('pick up recent work', T0 + 0.1);
  progressDial(3 / 7, '3 · pick up');
}

// ---- 4. each thread is its own session; same idea as subagents and Cowork (blueprint)
function treeGlyph(x, y, s, key, f = 1) {
  const kids = [[-70, 120], [0, 120], [70, 120]];
  kids.forEach(([dx, dy], i) => bpLine([[x, y + 22 * s], [x + dx * s, y + (dy - 22) * s]], { w: 2, frac: f }));
  ctx.fillStyle = PP.terra; ctx.beginPath(); ctx.arc(x, y, 22 * s, 0, TAU); ctx.fill();
  kids.forEach(([dx, dy]) => { if (f < 1) return; ctx.fillStyle = '#16204a'; ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, 16 * s, 0, TAU); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = PP.line; ctx.stroke(); });
}
function sceneThread() {
  const T0 = BEATS_T.thread;
  blueprintWorld('thread');
  // one thread opened up: its own session, its own branch
  const s = popS(T0 + 0.3), x = 260, y = 250, w = 760, h = 520;
  if (s > 0) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-(x + w / 2), -(y + h / 2));
    const P = rrectPts(x, y, w, h, 22);
    trace(P, true); ctx.fillStyle = 'rgba(14,20,45,0.95)'; ctx.fill();
    bpLine(P, { closed: true, w: 2.4 });
    bpLine([[x, y + 64], [x + w, y + 64]], { w: 1.4, color: PP.lineD, glow: 'rgba(0,0,0,0)' });
    monoText('thread 1  ·  own session', x + 30, y + 42, 26, PP.label, { key: 'thh', weight: 500 });
    bpPill('branch: thread-1', x + w - 170, y + 32, { size: 20 });
    const L = ['$ git checkout -b thread-1', 'reading the brief…', 'editing scenes.js', 'tests: 14 passing'];
    L.forEach((t, i) => monoText(t, x + 40, y + 130 + i * 62, 30, i === 3 ? PP.cyan : PP.label, { key: 'tl' + i, count: Math.floor(clamp((TT - T0 - 0.8 - i * 0.6) / 0.5) * t.length) }));
    ctx.restore();
  }
  // the same shape three times
  const ts = VW('thread', 'subagents');
  [['subagents', 1260], ['Cowork', 1480], ['threads', 1700]].forEach(([lab, gx], i) => {
    const f = ev(ts + i * 0.35, 0.5); if (f <= 0) return;
    treeGlyph(gx, 420, 0.95, 'tg' + i, f);
    sansText(lab, gx, 620, 28, PP.label, { weight: 600, align: 'center', al: f });
  });
  if (TT > ts + 1.2) sansText('=', 1370, 520, 44, 'rgba(230,234,255,0.6)', { weight: 400, align: 'center' }), sansText('=', 1590, 520, 44, 'rgba(230,234,255,0.6)', { weight: 400, align: 'center' });
  const fw = ev(VW('thread', 'window'), 0.6);   // a cleaner window around the third
  if (fw > 0) {
    const P = rrectPts(1590, 340, 220, 320, 18);
    bpLine(P, { closed: true, w: 3, color: PP.gold, glow: 'rgba(242,198,109,0.25)', frac: fw });
    if (fw >= 1) sansText('a cleaner window', 1700, 710, 26, PP.gold, { weight: 600, align: 'center' });
  }
  sceneLabel('each thread is its own session', T0 + 0.1, { dark: true });
  progressDial(4 / 7, '4 · sessions', { dark: true });
}

// ---- 5. what came out (paper)
function buildCard(i, x, y, w, h, title, draw, t) {
  const a = ev(t, 0.45); if (a <= 0) return;
  const k = EZ.back(a);
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.rotate([-0.03, 0.02, -0.015, 0.025][i]); ctx.translate(-(x + w / 2), -(y + h / 2));
  const P = rrectPts(x, y, w, h, 18);
  softShadow(P, 'bc' + i, 10, 14, 0.16);
  paint(P, { fill: PP.paper, key: 'bc' + i, w: 3, amt: 0.6, line: PP.ink });
  draw(x + 24, y + 24, w - 48, h - 120);
  sansText(title, x + 24, y + h - 46, 30, PP.ink, { weight: 700 });
  ctx.restore();
}
function sceneBuilds() {
  const T0 = BEATS_T.builds;
  stripeWorld('builds', 'rose');
  const w = 380, h = 420, y = 330, xs = [120, 545, 970, 1395];
  buildCard(0, xs[0], y, w, h, 'KPI cockpit', (x, y, w, h) => {
    [0.5, 0.8, 0.35, 0.65].forEach((v, i) => { paint(rrectPts(x + i * (w / 4) + 10, y + h * (1 - v), w / 4 - 22, h * v, 6), { fill: ['#7a9cc6', PP.terra, '#e9b949', '#6f9c4f'][i], key: 'bar' + i, w: 2, amt: 0.4, line: PP.ink }); });
  }, VW('builds', 'kpi'));
  buildCard(1, xs[1], y, w, h, 'video engine', (x, y, w, h) => {
    paint(rrectPts(x, y, w, h, 10), { fill: '#f1e6cd', key: 've', w: 2, amt: 0.4, line: PP.ink });
    ink([[x + 30, y + h - 40], [x + 110, y + 70], [x + 200, y + h - 70], [x + w - 30, y + 50]], { w: 4, amt: 1.5, key: 'vel', color: PP.terra, frac: ev(VW('builds', 'video') + 0.3, 1.2) });
    drawPencil(x + w - 40, y + 60, -0.8, 150, 0.6, 'vpen');
  }, VW('builds', 'video'));
  buildCard(2, xs[2], y, w, h, 'AI presentation', (x, y, w, h) => {
    for (let k = 2; k >= 0; k--) paint(rrectPts(x + k * 16, y + k * 14, w - 40, h - 40, 8), { fill: k ? '#ece4d2' : '#ffffff', key: 'sl' + k, w: 2, amt: 0.4, line: PP.ink });
    sansText('Claude Design', x + 26, y + 60, 26, PP.terraD, { weight: 700 });
    ctx.fillStyle = 'rgba(43,38,34,0.25)'; ctx.fillRect(x + 26, y + 90, 200, 10); ctx.fillRect(x + 26, y + 112, 150, 10);
  }, VW('builds', 'presentation'));
  buildCard(3, xs[3], y, w, h, 'quoting tool', (x, y, w, h) => {
    docCard(x + 30, y, w - 60, h, 'Quote', { key: 'qq', accent: '#c75b39', lines: 4, total: true, size: 26 });
  }, VW('builds', 'quoting'));
  walker(lerp(140, 300, ev(T0, 1.2)), 900, 54, { key: 'hero', mood: 'happy', walk: TT < T0 + 1.2 ? 1.6 : 0 });
  sceneLabel('what came out', T0 + 0.1);
  progressDial(5 / 7, '5 · builds');
}

function curryStudio(x0, x1, yA, yC) {
  // the studio: an awning, a sign, a counter with a pot
  softShadow(rrectPts(x0, yA, x1 - x0, 560, 12), 'stsh', 14, 18, 0.14);
  paint(rrectPts(x0, yA, x1 - x0, 560, 12), { fill: '#f6efe0', key: 'studio', w: 3.2, amt: 0.6, line: PP.ink, tex: [{ k: 'pencil', c: '#ece0c6', al: 0.4, per: 500 }] });
  for (let i = 0; i < 8; i++) {   // the awning
    const ax = x0 - 30 + i * ((x1 - x0 + 60) / 8), aw = (x1 - x0 + 60) / 8;
    const P = [[ax, yA - 70], [ax + aw, yA - 70], [ax + aw, yA + 10], [ax + aw / 2, yA + 36], [ax, yA + 10]];
    paint(P, { fill: i % 2 ? '#fbf3e3' : PP.terra, key: 'aw' + i, w: 2.6, amt: 0.5, line: PP.ink });
  }
  paint(rrectPts(x0 + 90, yA + 70, x1 - x0 - 180, 92, 12), { fill: PP.paper, key: 'sign', w: 2.8, amt: 0.5, line: PP.ink });
  handText('The Curry Studio', x0 + 132, yA + 134, 52, PP.terraD, { key: 'signt', weight: 700 });
  // window shelf with jars
  for (let i = 0; i < 5; i++) { const jx = x0 + 120 + i * 92; paint(rrectPts(jx, yA + 220, 56, 76, 10), { fill: ['#e9b949', '#c75b39', '#8fae5c', '#d98b3a', '#b5533a'][i], key: 'jar' + i, w: 2.2, amt: 0.4, line: PP.ink }); paint(rrectPts(jx - 4, yA + 208, 64, 18, 4), { fill: '#8a6a4a', key: 'lid' + i, w: 2, amt: 0.3, line: PP.ink }); }
  ink([[x0 + 90, yA + 300], [x1 - 90, yA + 300]], { w: 3, amt: 0.4, key: 'shelf' });
  // counter and pot
  paint(rrectPts(x0 - 20, yC, x1 - x0 + 40, 130, 10), { fill: '#d9b98c', key: 'counter', w: 3, amt: 0.5, line: PP.ink, tex: [{ k: 'pencil', c: '#c9a674', al: 0.5, per: 300, a: 0.02 }] });
  const px = x0 + 240, py = yC - 40;
  paint(ellipsePts(px, py, 120, 70, 0, 50, 0, Math.PI), { fill: '#3f3a36', key: 'pot', w: 3, amt: 0.5, line: PP.ink });
  paint(ellipsePts(px, py, 124, 24, 0, 50), { fill: '#d98b3a', key: 'curry', w: 2.6, amt: 0.4, line: PP.ink, tex: [{ k: 'stipple', c: '#b5533a', al: 0.6, n: 80 }] });
  for (let i = 0; i < 3; i++) { const P = []; for (let k = 0; k <= 10; k++) P.push([px - 50 + i * 50 + Math.sin(k * 0.8 + TT * 3 + i) * 12, py - 30 - k * 16]); ink(P, { w: 3, amt: 0.6, color: 'rgba(43,38,34,0.35)', key: 'steam' + i }); }
}

// ---- 6. the curry studio (paper, yellow stripes)
function sceneCurry() {
  const t = lt('curry');
  stripeWorld('curry', 'yellow');
  paperCloud(170, 260, 0.7, 'cc1'); paperCloud(1500, 210, 0.6, 'cc2');
  const x0 = 520, x1 = 1180, yA = 330, yC = 760;
  curryStudio(x0, x1, yA, yC);
  walker(1010, yC - 80, 62, { key: 'hero', mood: t > 3 ? 'happy' : 'smile' });
  // one message in from the left
  const m = ev(BEATS_T.curry + 0.6, 0.5), mx = lerp(-460, 70, EZ.out ? EZ.out(m) : m);
  if (m > 0) {
    paint(rrectPts(mx, 470, 400, 120, 22), { fill: '#ffffff', key: 'msg', w: 2.8, amt: 0.5, line: PP.ink });
    paint([[mx + 330, 586], [mx + 380, 586], [mx + 386, 626]], { fill: '#ffffff', key: 'msgt', w: 2.4, amt: 0.3, line: PP.ink });
    if (m > 0.85) sansText('one message', mx + 34, 518, 30, PP.ink, { weight: 700 });
    ctx.fillStyle = 'rgba(43,38,34,0.25)'; ctx.fillRect(mx + 34, 548, 300, 8);
    if (m >= 1) { const a = ev(BEATS_T.curry + 1.2, 0.5); bpLine([[470, 540], [470 + 60 * a, 540]], { w: 4, color: PP.terra, glow: 'rgba(0,0,0,0)', frac: 1 }); }
  }
  // three documents out to the right
  const D = [['Quote', '#c75b39', -0.08], ['Invoice', '#3f7a8c', 0.02], ['Email', '#6f9c4f', 0.1]];
  D.forEach(([name, c, rot], i) => {
    const a = ev(BEATS_T.curry + 2.0 + i * 0.55, 0.45); if (a <= 0) return;
    const k = EZ.back(a), tx = 1290 + i * 175, ty = 360 + i * 90;
    const x = lerp(1050, tx, k), y = lerp(620, ty, k);
    docCard(x, y, 250, 320, name, { key: 'doc' + i, accent: c, rot: rot * k, total: i < 2, lines: i === 2 ? 7 : 5 });
  });
  sceneLabel('one message, three documents', BEATS_T.curry + 0.1);
  progressDial(6 / 7, '6 · curry studio');
}

// ---- 7. where each one fits (blueprint, with a paper card on each side)
function sceneVerdict() {
  const T0 = BEATS_T.verdict;
  blueprintWorld('verdict');
  sansText('the smoothest Claude has felt', W / 2, 250, 54, PP.label, { weight: 600, align: 'center' });
  { const uw = sansW('the smoothest Claude has felt', 54), u = ev(T0 + 0.5, 3.2); if (u > 0) bpLine([[W / 2 - uw / 2, 278], [W / 2 - uw / 2 + uw * u, 278]], { w: 5, color: PP.gold, glow: 'rgba(242,198,109,0.3)' }); }
  bpLine([[W / 2, 330], [W / 2, 960]], { w: 1.6, color: PP.lineD, frac: ev(T0 + 0.6, 0.6), glow: 'rgba(0,0,0,0)' });
  const L = popS(VW('verdict', 'business')), R = popS(VW('verdict', 'own'));
  // both cards' outlines draw on while the first sentence plays, so the frame keeps moving
  const pre = ev(T0 + 0.6, 2.6);
  if (L <= 0) bpLine(rrectPts(170, 330, 660, 520, 22), { closed: true, w: 3, frac: pre, dash: [10, 8], color: 'rgba(200,210,250,0.9)' });
  if (R <= 0) bpLine(rrectPts(1090, 330, 660, 520, 22), { closed: true, w: 3, frac: pre, dash: [10, 8], color: 'rgba(200,210,250,0.9)' });
  if (L > 0) {   // left: the studio again, a small copy of beat 6, on a paper card
    const cx = 500, cy = 590;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(L, L); ctx.translate(-cx, -cy);
    const P = rrectPts(170, 330, 660, 520, 22);
    softShadow(P, 'vl', 12, 16, 0.35);
    paint(P, { fill: PP.tint.yellow, key: 'vlc', w: 3, amt: 0.5, line: PP.ink });
    ctx.save(); trace(P, true); ctx.clip();
    ctx.translate(500, 590); ctx.scale(0.62, 0.62); ctx.translate(-850, -580);
    curryStudio(520, 1180, 330, 760);
    ctx.restore();
    walker(730, 768, 40, { key: 'heroL' });
    ctx.restore();
    if (L >= 1) { sansText('small business', cx, 920, 40, PP.label, { weight: 700, align: 'center' }); sansText('→  Projects', cx, 972, 34, PP.gold, { weight: 600, align: 'center' }); }
  }
  if (R > 0) {   // right: a terminal, Clawd at the keys
    const cx = 1420, cy = 590;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(R, R); ctx.translate(-cx, -cy);
    const P = rrectPts(1090, 330, 660, 520, 22);
    trace(P, true); ctx.fillStyle = '#0b1028'; ctx.fill(); bpLine(P, { closed: true, w: 2.4 });
    bpLine([[1090, 394], [1750, 394]], { w: 1.4, color: PP.lineD, glow: 'rgba(0,0,0,0)' });
    ['#e06b5a', '#e9b949', '#6fae63'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(1124 + i * 28, 362, 8, 0, TAU); ctx.fill(); });
    const tl = TT - VW('verdict', 'own');
    const L2 = ['$ claude', '> build the next prototype', '  Read  Edit  Bash', '  tests: passing'];
    L2.forEach((t, i) => monoText(t, 1130, 460 + i * 56, 30, i === 3 ? PP.cyan : i === 0 ? PP.gold : PP.label, { key: 'vt' + i, count: Math.floor(clamp((tl - 0.3 - i * 0.45) / 0.4) * t.length) }));
    walker(1640, 768, 40, { key: 'heroR', dark: true });
    ctx.restore();
    if (R >= 1) { sansText('my own work', cx, 920, 40, PP.label, { weight: 700, align: 'center' }); sansText('→  Claude Code', cx, 972, 34, PP.gold, { weight: 600, align: 'center' }); }
  }
  sceneLabel('where each one fits', T0 + 0.1, { dark: true });
  progressDial(7 / 7, '7 · verdict', { dark: true });
}

// ---- 8. end card (paper)
function sceneEnd() {
  stripeWorld('end', 'blue');
  paperCloud(260, 260, 0.8, 'e1'); paperCloud(1680, 330, 0.9, 'e2');
  const a = ev(BEATS_T.end + 0.15, 0.5);
  ctx.save(); ctx.globalAlpha = a;
  paint(rrectPts(460, 380, 1000, 200, 24), { fill: PP.paper, key: 'endc', w: 3.4, amt: 0.6, line: PP.ink });
  sansText('one project, many threads', W / 2, 500, 68, PP.ink, { weight: 700, align: 'center' });
  ctx.restore();
  walker(W / 2, 760, 70, { key: 'hero', mood: 'happy' });
}
