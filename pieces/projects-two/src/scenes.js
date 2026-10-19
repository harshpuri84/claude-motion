// =====================================================================
//  SCENES — projects-two. World 1920x1080; TT on 2s. Paper worlds and navy blueprint worlds cut hard.
// =====================================================================
const lt = (k) => TT - BEATS_T[k];
const N = 11;
const dial = (i, lab, dark) => progressDial((i + 1) / N, (i + 1) + ' · ' + lab, dark ? { dark: true } : {});
function chip(str, x, y, fill, t, o = {}) {   // a paper chip that pops in, centred on x
  const s = popS(t); if (s <= 0) return 0;
  const w = sansW(str, o.size || 34) + 56, h = 70;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  paint(rrectPts(-w / 2, -h / 2, w, h, 16), { fill, key: 'chip' + str, w: 2.8, amt: 0.5, line: PP.ink });
  sansText(str, 0, 12, o.size || 34, PP.ink, { weight: 700, align: 'center' });
  ctx.restore(); return w;
}
const THC = [PP.terra, '#7aa6d6', '#8fcf7a'];

// ---- 1. hook: "Projects is for small business" gets crossed out (paper, blue)
function sceneHook() {
  const T0 = BEATS_T.hook;
  stripeWorld('hook', 'blue');
  paperCloud(180, 280, 0.9, 'h1'); paperCloud(1760, 300, 0.8, 'h2');
  const s = popS(T0 + 0.3);
  if (s > 0) {
    ctx.save(); ctx.translate(960, 520); ctx.scale(s, s); ctx.translate(-960, -520);
    const HP = rrectPts(340, 300, 1240, 420, 30); softShadow(HP, 'hk', 14, 18, 0.18); paint(HP, { fill: '#fbfaf6', key: 'hkc', w: 3.4, amt: 0.6, line: PP.ink });
    sansText('Projects =', 960, 450, 92, PP.ink, { weight: 700, align: 'center' });
    sansText('Cowork for non-tech people', 960, 570, 76, PP.ink, { weight: 600, align: 'center' });
    ink([[430, 610], [1490, 610]], { w: 6, amt: 0.6, key: 'hku', color: '#7a9cc6', frac: ev(T0 + 0.8, 1.6) });
    ctx.restore();
  }
  const x = ev(VW('hook', 'wrong') - 0.2, 0.35);
  if (x > 0) {
    ink([[380, 320], [1540, 700]], { w: 11, amt: 1, key: 'x1', frac: clamp(x * 2), color: PP.terra });
    ink([[1540, 320], [380, 700]], { w: 11, amt: 1, key: 'x2', frac: clamp(x * 2 - 1), color: PP.terra });
  }
  const wr = ev(VW('hook', 'wrong') + 0.25, 0.5);
  const pw = ev(VW('hook', 'powerful') - 0.4, 0.6);
  if (wr > 0 && pw <= 0) handText('I was wrong.', 960 - handW('I was wrong.', 84, 700) / 2, 900, 84, PP.terraD, { key: 'wrong', weight: 700, rot: -0.02, frac: wr });
  if (pw > 0) handText('much more powerful', 960 - handW('much more powerful', 84, 700) / 2, 900, 84, PP.ink, { key: 'pow', weight: 700, rot: -0.02, frac: pw });
  walker(380, 860, 78, { key: 'hero', mood: wr > 0 ? 'wow' : 'smile' });
  sceneLabel('my first take', T0 + 0.1);
  dial(0, 'hook');
}

// ---- 2. harness: one project holds skills, rules, hooks (paper, green)
function sceneHarness() {
  const T0 = BEATS_T.harness;
  stripeWorld('harness', 'green');
  paperCloud(1700, 250, 0.8, 'g1');
  const s = popS(T0 + 0.2);
  if (s > 0) {
    ctx.save(); ctx.translate(960, 560); ctx.scale(s, s); ctx.translate(-960, -560);
    const P = rrectPts(420, 300, 1080, 560, 28);   // a project folder with a tab
    softShadow(P, 'fold', 14, 18, 0.18);
    paint([[420, 300], [700, 300], [740, 250], [420, 250]], { fill: '#e9b949', key: 'tab', w: 3, amt: 0.5, line: PP.ink });
    paint(P, { fill: '#f4e3b0', key: 'fold', w: 3.4, amt: 0.6, line: PP.ink });
    handText('Team OS', 480, 235, 56, PP.ink, { key: 'hos', weight: 700 });
    ctx.restore();
  }
  [['skills', VW('harness', 'skills'), 690, '#c75b39'], ['rules', VW('harness', 'rules'), 960, '#7aa6d6'], ['hooks', VW('harness', 'hooks'), 1230, '#8fcf7a']].forEach(([n, t, x, c], i) => {
    const a = ev(t, 0.4); if (a <= 0) return;
    const k = EZ.back(a);
    chip(n, x, lerp(160, 560, k), c, t, { size: 44, rot: [-0.03, 0.02, -0.02][i] });
  });
  if (TT > VW('harness', 'project')) sansText('one project', 960, 790, 36, PP.ink, { weight: 600, align: 'center', al: ev(VW('harness', 'project'), 0.4) });
  const os = ev(VW('harness', 'os'), 0.4); if (os > 0) ink(ellipsePts(640, 222, 190, 56, 0, 40), { closed: true, w: 6, amt: 0.6, key: 'hosc', color: PP.terra, frac: os });
  walker(300, 840, 70, { key: 'hero', mood: 'happy' });
  sceneLabel('my whole harness', T0 + 0.1);
  dial(1, 'harness');
}

// ---- 3. split: one goal, a main chat, parallel threads (blueprint)
function sceneSplit() {
  const T0 = BEATS_T.split, cx = 470, cy = 560;
  blueprintWorld('split');
  for (let k = 0; k < 2; k++) { const u = mod((TT - T0) * 0.6 + k * 0.5, 1), r = 110 + u * 260; bpLine(ellipsePts(cx, cy, r, r, 0, 90), { closed: true, w: 1.6, color: `rgba(174,185,236,${0.45 * (1 - u)})`, glow: 'rgba(0,0,0,0)' }); }
  bpLine(ellipsePts(cx, cy, 110, 110, 0, 80), { closed: true, w: 2.4 });
  sansText('main chat', cx, cy + 170, 30, PP.label, { weight: 600, align: 'center' });
  walker(cx, cy, 62, { key: 'hero', dark: true });
  const g = ev(T0 + 0.3, 0.5);   // the goal arrives
  if (g > 0) { sansText('one goal', cx, cy - 200, 40, PP.gold, { weight: 700, align: 'center', al: g }); bpLine([[cx, cy - 170], [cx, cy - 118]], { w: 3, color: PP.gold, glow: 'rgba(242,198,109,0.3)', frac: g }); }
  const th = VW('split', 'split');
  ['thread 1', 'thread 2', 'thread 3'].forEach((n, i) => {
    const y = [310, 560, 810][i], f = ev(th + i * 0.25, 0.7); if (f <= 0) return;
    const P = []; for (let k = 0; k <= 30; k++) { const u = k / 30; P.push([lerp(cx + 110, 1330, u), lerp(cy, y, EZ.io(u))]); }
    bpLine(P, { w: 2.4, frac: f });
    if (f >= 1) {
      const u = ((TT - th - 0.8 - i * 0.25) * 0.5) % 1, p = pointAt(P, u); if (p) glint(p[0], p[1], 9);
      const w = bpPill(n, 1500, y, { size: 30 });
      ctx.fillStyle = THC[i]; ctx.beginPath(); ctx.arc(1500 + w / 2 + 30, y, 10, 0, TAU); ctx.fill();
    }
  });
  if (TT > VW('split', 'parallel')) sansText('in parallel', 1500, 930, 34, PP.gold, { weight: 600, align: 'center', al: ev(VW('split', 'parallel'), 0.4) });
  sceneLabel('one goal, many threads', T0 + 0.1, { dark: true });
  dial(2, 'split', true);
}

// ---- 4. session: own branch, in the cloud, laptop closed, local on request (blueprint)
function cloudPts(cx, cy, s) { return [[-210, 60], [-250, -10], [-170, -70], [-110, -120], [-20, -150], [70, -120], [130, -140], [220, -80], [250, 0], [210, 60]].map(([x, y]) => [cx + x * s, cy + y * s]); }
function sceneSession() {
  const T0 = BEATS_T.session;
  blueprintWorld('session');
  // the cloud with a thread running inside
  const cc = popS(T0 + 0.3), cx = 1060, cy = 400;
  if (cc > 0) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(cc, cc); ctx.translate(-cx, -cy);
    const P = cloudPts(cx, cy, 1.9); trace(P, true); ctx.fillStyle = 'rgba(30,40,85,0.9)'; ctx.fill(); bpLine(P, { closed: true, w: 2.8 });
    bpPill('own branch', cx - 150, cy - 150, { size: 34 });
    ['thread 1 · own session', 'editing skills', 'tests passing'].forEach((s, i) => monoText(s, cx - 330, cy - 40 + i * 58, 36, i === 2 ? PP.cyan : PP.label, { key: 'cl' + i, count: Math.floor(clamp((TT - T0 - 0.8 - i * 0.6) / 0.5) * s.length) }));
    ctx.restore();
    sansText('in the cloud', cx, cy + 260, 44, PP.gold, { weight: 600, align: 'center', al: ev(VW('session', 'cloud'), 0.4) });
  }
  // the laptop closes on "laptop"
  const lx = 460, ly = 800, close = ev(VW('session', 'laptop'), 0.5);
  paint(rrectPts(lx - 150, ly, 300, 26, 8), { fill: '#2a3566', key: 'lapb', w: 2.4, amt: 0.3, line: PP.line });
  const ang = lerp(1.0, 0, EZ.io(close)), lh = 200 * Math.sin(ang) + 4;
  bpLine(rrectPts(lx - 130, ly - lh, 260, lh, 10), { closed: true, w: 2.6, color: PP.label });
  if (close >= 1) { sansText('z z z', lx + 160, ly - 40, 44, PP.label, { weight: 600, al: 0.8 }); }
  // work keeps going: a pulse from the cloud, and a phone check-in
  if (close >= 1) {
    const u = mod((TT - VW('session', 'laptop')) * 0.7, 1);
    bpLine([[cx - 120, cy + 150], [lx + 100, ly - 40]], { w: 2, dash: [10, 8], color: 'rgba(174,185,236,0.5)', glow: 'rgba(0,0,0,0)' });
    glint(lerp(cx - 120, lx + 100, u), lerp(cy + 150, ly - 40, u), 8);
    const pa = ev(VW('session', 'keeps') + 0.2, 0.5);
    if (pa > 0) { bpLine(rrectPts(1480, 540, 250, 400, 30), { closed: true, w: 3, frac: pa }); sansText('thread 1', 1605, 680, 34, PP.label, { weight: 600, align: 'center', al: pa }); sansText('running', 1605, 740, 34, PP.cyan, { weight: 700, align: 'center', al: pa }); sansText('check in', 1605, 990, 40, PP.gold, { weight: 700, align: 'center', al: pa }); }
  }
  // local files on request
  const lo = ev(VW('session', 'local'), 0.5);
  if (lo > 0) { bpPill('local files', 760, 960, { size: 38 }); bpLine([[1000, 560], [900, 760], [lx + 80, ly - 30]], { w: 3, color: PP.gold, glow: 'rgba(242,198,109,0.3)', frac: lo }); }
  walker(220, 800, 54, { key: 'hero', dark: true });
  sceneLabel('every thread is a full session', T0 + 0.1, { dark: true });
  dial(3, 'session', true);
}

// ---- 5. pull request: a thread opens it, watches it, fixes CI (paper, rose)
function scenePR() {
  const T0 = BEATS_T.pr;
  stripeWorld('pr', 'rose');
  paperCloud(1700, 230, 0.8, 'p1');
  const s = popS(T0 + 0.3), x = 520, y = 240, w = 880, h = 640;
  if (s > 0) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-(x + w / 2), -(y + h / 2));
    const P = rrectPts(x, y, w, h, 26);
    softShadow(P, 'pr', 14, 18, 0.18); paint(P, { fill: '#fbfaf6', key: 'pr', w: 3.4, amt: 0.6, line: PP.ink });
    sansText('Pull request', x + 44, y + 80, 44, PP.ink, { weight: 700 });
    chip('open', x + w - 110, y + 64, '#8fcf7a', T0 + 0.8, { size: 28 });
    ['a thread opened this', TT > VW('pr', 'answers') + 0.4 ? 'review comments: resolved' : 'review comments: 1'].forEach((t, i) => sansText(t, x + 44, y + 170 + i * 66, 40, 'rgba(43,38,34,0.75)', { weight: 600 }));
    // CI row: red, then green after "fix"
    const fix = VW('pr', 'fix'), ok = TT > fix + 0.8;
    { const cd = ev(fix - 0.1, 0.7); if (cd > 0 && cd < 1) { ctx.fillStyle = PP.terra; ctx.beginPath(); ctx.arc(lerp(x - 80, x + 300, EZ.io(cd)), y + 385, 16, 0, TAU); ctx.fill(); } }
    paint(rrectPts(x + 44, y + 340, w - 88, 90, 16), { fill: ok ? '#e4f2d8' : '#f8dcd5', key: 'ci', w: 2.8, amt: 0.5, line: PP.ink });
    sansText('CI', x + 80, y + 398, 36, PP.ink, { weight: 700 });
    if (ok) { ink([[x + 560, y + 388], [x + 590, y + 416], [x + 650, y + 350]], { w: 9, amt: 0.6, key: 'ck', color: '#3f7a2c', frac: ev(fix + 0.8, 0.3) }); sansText('passing', x + 690, y + 398, 36, '#3f7a2c', { weight: 700 }); }
    else { ink([[x + 560, y + 358], [x + 620, y + 418]], { w: 9, amt: 0.6, key: 'cx1', color: PP.terraD }); ink([[x + 620, y + 358], [x + 560, y + 418]], { w: 9, amt: 0.6, key: 'cx2', color: PP.terraD }); sansText('failing', x + 690, y + 398, 36, PP.terraD, { weight: 700 }); }
    sansText('thread pushes the fix', x + 44, y + 540, 40, PP.ink, { weight: 600, al: ev(fix, 0.4) });
    ctx.restore();
  }
  // watching eye
  const e = ev(VW('pr', 'watches'), 0.4);
  if (e > 0) { ink(ellipsePts(1560, 420, 90, 52, 0, 40), { closed: true, w: 5, amt: 0.6, key: 'eye', color: PP.ink, frac: e }); ctx.fillStyle = PP.terra; ctx.beginPath(); ctx.arc(1560 + Math.sin(TT * 1.3) * 12, 420, 20, 0, TAU); ctx.fill(); sansText('watching', 1560, 540, 44, PP.ink, { weight: 600, align: 'center', al: e }); }
  const several = ev(VW('pr', 'several'), 0.4);   // "several PRs": small stack builds up
  for (let i = 0; i < 4; i++) { const a = ev(VW('pr', 'several') + i * 0.25, 0.3); if (a > 0) chip('PR', 1440 + i * 120, 760 + (i % 2) * 18, '#fbfaf6', VW('pr', 'several') + i * 0.25, { size: 40, rot: [-0.05, 0.04, -0.03, 0.05][i] }); }
  walker(260, 860, 70, { key: 'hero', mood: 'happy' });
  sceneLabel('it opens the PR and fixes CI', T0 + 0.1);
  dial(4, 'pull requests');
}

// ---- 6. library and routine (paper, yellow)
function sceneLibrary() {
  const T0 = BEATS_T.library;
  stripeWorld('library', 'yellow');
  paperCloud(220, 240, 0.8, 'l1');
  const s = popS(T0 + 0.3), x = 700, y = 330, w = 520, h = 430;
  if (s > 0) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-(x + w / 2), -(y + h / 2));
    paint([[x, y], [x + 200, y], [x + 240, y - 50], [x, y - 50]], { fill: '#e9b949', key: 'lt', w: 3, amt: 0.5, line: PP.ink });
    paint(rrectPts(x, y, w, h, 24), { fill: '#f4e3b0', key: 'lib', w: 3.4, amt: 0.6, line: PP.ink });
    handText('Library', x + 40, y + 70, 56, PP.ink, { key: 'lib', weight: 700 });
    docCard(x + 50, y + 110, 200, 270, 'files', { key: 'lr', accent: '#c75b39', lines: 5, rot: -0.04, size: 26 });
    docCard(x + 270, y + 130, 200, 250, 'output', { key: 'ls', accent: '#3f7a8c', lines: 4, rot: 0.04, size: 24 });
    ctx.restore();
  }
  // three threads read from it
  const r = VW('library', 'thread');
  [0, 1, 2].forEach((i) => {
    const a = ev(r + i * 0.2, 0.6); if (a <= 0) return;
    const y0 = [380, 540, 700][i];
    ink([[1260, y0], [1400, y0 + (i - 1) * 30], [1500, y0 + (i - 1) * 40]], { w: 5, amt: 0.8, key: 'rl' + i, color: THC[i], frac: a });
    paint(ellipsePts(1560, y0 + (i - 1) * 40, 44, 44, 0, 28), { fill: THC[i], key: 'rd' + i, w: 2.6, amt: 0.4, line: PP.ink }); sansText('thread ' + (i + 1), 1630, y0 + (i - 1) * 40 + 12, 38, PP.ink, { weight: 700 });
  });
  // the daily routine: a clock, then a new thread opens on "regresses"
  const c = ev(VW('library', 'daily'), 0.5);
  if (c > 0) {
    ink(ellipsePts(340, 760, 90, 90, 0, 40), { closed: true, w: 6, amt: 0.6, key: 'clk', color: PP.ink, frac: c });
    const ha = TT * 1.2; ink([[340, 760], [340 + Math.cos(ha) * 60, 760 + Math.sin(ha) * 60]], { w: 6, amt: 0.2, key: 'hand', color: PP.terraD });
    sansText('every day', 340, 900, 44, PP.ink, { weight: 600, align: 'center', al: c });
  }
  const rg = ev(VW('library', 'regression'), 0.5);
  if (rg > 0) { ink([[450, 740], [560, 700], [640, 660]], { w: 4, amt: 0.6, key: 'ra', color: PP.terraD, frac: rg }); chip('new thread', 900, 880, '#f8dcd5', VW('library', 'regression'), { size: 44, rot: 0.02 }); }
  sceneLabel('shared library, daily routine', T0 + 0.1);
  dial(5, 'library');
}

// ---- 7. tips intro: the Threads tab, nothing waiting (paper, blue). Redrawn with generic titles; the real screenshot shows private names.
function sceneTips() {
  const T0 = BEATS_T.tips;
  stripeWorld('tips', 'blue');
  paperCloud(260, 220, 0.8, 't1c');
  const x = 880, y = 130, w = 880, h = 830, s = popS(T0 + 0.3);
  if (s > 0) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-(x + w / 2), -(y + h / 2));
    const P = rrectPts(x, y, w, h, 28); softShadow(P, 'tp', 14, 18, 0.18); paint(P, { fill: '#fbfaf6', key: 'tp', w: 3.4, amt: 0.6, line: PP.ink });
    sansText('Welcome back.', x + 44, y + 90, 56, PP.ink, { weight: 700 });
    sansText('Nothing is waiting on you.', x + 44, y + 142, 36, 'rgba(43,38,34,0.6)', { weight: 400 });
    const groups = [['Waiting on you', '0', []], ['Idle', '2', ['hooks setup', 'skills cleanup']], ['Resolved', '7', ['rules draft', 'release notes', 'PR fixes']]];
    let yy = y + 200;
    groups.forEach(([g, n, rows], gi) => {
      const a = ev(T0 + 0.8 + gi * 0.35, 0.3); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      paint(rrectPts(x + 28, yy, w - 56, 62, 14), { fill: '#eeece4', key: 'gh' + gi, w: 2, amt: 0.4, line: 'rgba(43,38,34,0.25)' });
      sansText(g, x + 56, yy + 44, 38, PP.ink, { weight: 600 }); monoText(n, x + 56 + sansW(g, 38) + 24, yy + 44, 36, PP.label === '#e6eaff' ? PP.terraD : 'rgba(43,38,34,0.6)', { key: 'gn' + gi });
      yy += 84;
      rows.forEach((r, ri) => { sansText(r, x + 56, yy + 38, 38, gi === 2 ? 'rgba(43,38,34,0.5)' : PP.ink, { weight: 500 }); monoText(gi === 2 ? '3d' : '1h', x + w - 120, yy + 38, 34, 'rgba(43,38,34,0.45)', { key: 'gt' + gi + ri }); yy += 76; });
      yy += 14;
      ctx.restore();
    });
    ctx.restore();
  }
  chip('3 tips', 400, 560, '#fbfaf6', T0 + 0.5, { size: 54, rot: -0.03 });
  walker(260, 860, 74, { key: 'hero', mood: 'smile' });
  sceneLabel('managing the coordinator', T0 + 0.1);
  dial(6, 'tips');
}

// ---- 8. tip 1: coordinator low, threads smaller model (blueprint)
function sceneT1() {
  const T0 = BEATS_T.t1;
  blueprintWorld('t1');
  sansText('1', 200, 230, 120, PP.gold, { weight: 700 });
  // the coordinator with an effort slider set to low
  const cx = 560, cy = 560;
  bpLine(ellipsePts(cx, cy, 120, 120, 0, 80), { closed: true, w: 2.6 });
  walker(cx, cy, 66, { key: 'hero', dark: true });
  sansText('coordinator', cx, cy + 190, 40, PP.label, { weight: 600, align: 'center' });
  const sy = 330; bpLine([[cx - 160, sy], [cx + 160, sy]], { w: 3, color: PP.lineD });
  const k = ev(VW('t1', 'low') - 0.2, 0.5), kx = lerp(cx + 150, cx - 140, EZ.io(k));
  ctx.fillStyle = PP.gold; ctx.beginPath(); ctx.arc(kx, sy, 16, 0, TAU); ctx.fill();
  sansText('effort: low', cx, sy - 40, 46, PP.gold, { weight: 700, align: 'center' });
  // three threads, each on a smaller model
  const th = VW('t1', 'smaller');
  [300, 560, 820].forEach((y, i) => {
    const f = ev(th - 0.5 + i * 0.2, 0.6); if (f <= 0) return;
    const P = []; for (let q = 0; q <= 24; q++) { const u = q / 24; P.push([lerp(cx + 120, 1250, u), lerp(cy, y, EZ.io(u))]); }
    bpLine(P, { w: 2.4, frac: f });
    if (f >= 1) { bpPill('thread ' + (i + 1), 1380, y, { size: 36 }); bpPill('smaller model', 1700, y, { size: 32 }); }
  });
  // plan limits: a meter that fills as threads run
  const m = 1, mw = 520; bpLine(rrectPts(700, 960, mw, 22, 11), { closed: true, w: 2, color: PP.lineD, glow: 'rgba(0,0,0,0)' });
  const fr = TT < th ? lerp(0.15, 0.9, ev(T0 + 0.5, 3.5)) : lerp(0.9, 0.4, ev(th, 1.2)); ctx.fillStyle = PP.cyan; ctx.fillRect(704, 964, (mw - 8) * fr * m, 14);
  sansText('plan limits used', 700, 1012, 36, PP.label, { weight: 500 });
  sceneLabel('tip 1: low effort coordinator', T0 + 0.1, { dark: true });
  dial(7, 'tip 1', true);
}

// ---- 9. tip 2: tell it how to work (paper, green)
function sceneT2() {
  const T0 = BEATS_T.t2;
  stripeWorld('t2', 'green');
  sansText('2', 200, 230, 120, PP.terraD, { weight: 700 });
  const x = 560, y = 220, w = 1000, h = 640, s = popS(T0 + 0.3);
  if (s > 0) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-(x + w / 2), -(y + h / 2));
    const P = rrectPts(x, y, w, h, 28); softShadow(P, 't2', 14, 18, 0.18); paint(P, { fill: '#fbfaf6', key: 't2', w: 3.4, amt: 0.6, line: PP.ink });
    sansText('how I want you to work', x + 50, y + 90, 44, PP.ink, { weight: 700 });
    [['threads at once', '3', VW('t2', 'many')], ['update me', 'daily', VW('t2', 'often')], ['show a plan first', 'on', VW('t2', 'plan')]].forEach(([l, v, t], i) => {
      const a = ev(t, 0.35); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      const yy = y + 200 + i * 130;
      sansText(l, x + 60, yy + 20, 38, PP.ink, { weight: 500 });
      paint(rrectPts(x + w - 260, yy - 30, 200, 70, 35), { fill: i === 2 ? '#8fcf7a' : '#f1e6cd', key: 'tg' + i, w: 2.8, amt: 0.4, line: PP.ink });
      sansText(v, x + w - 160, yy + 20, 34, PP.ink, { weight: 700, align: 'center' });
      ctx.restore();
    });
    ctx.restore();
  }
  walker(300, 860, 70, { key: 'hero', mood: 'happy' });
  sceneLabel('tip 2: say how you want it', T0 + 0.1);
  dial(8, 'tip 2');
}

// ---- 10. tip 3: threads share memory (blueprint)
function sceneT3() {
  const T0 = BEATS_T.t3, cx = 960, cy = 520;
  blueprintWorld('t3');
  sansText('3', 200, 230, 120, PP.gold, { weight: 700 });
  const m = popS(T0 + 0.3);
  if (m > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(m, m); ctx.translate(-cx, -cy); const P = rrectPts(cx - 260, cy - 90, 520, 180, 30); trace(P, true); ctx.fillStyle = 'rgba(14,20,45,0.95)'; ctx.fill(); bpLine(P, { closed: true, w: 2.8, color: PP.gold, glow: 'rgba(242,198,109,0.25)' }); sansText('shared memory', cx, cy - 6, 48, PP.label, { weight: 700, align: 'center' }); sansText('always show a plan first', cx, cy + 50, 34, PP.gold, { weight: 500, align: 'center' }); ctx.restore(); }
  const pr = T0 + 0.3;
  [[360, 860], [960, 880], [1560, 860]].forEach(([x, y], i) => {
    const f = ev(pr + 0.2 + i * 0.25, 0.7); if (f <= 0) return;
    const P = []; for (let q = 0; q <= 24; q++) { const u = q / 24; P.push([lerp(cx, x, u), lerp(cy + 90, y - 50, EZ.io(u))]); }
    bpLine(P, { w: 2.4, frac: f });
    if (f >= 1) { const u = ((TT - pr - 1 - i * 0.2) * 0.6) % 1, p = pointAt(P, u); if (p) glint(p[0], p[1], 9); bpPill('thread ' + (i + 1), x, y, { size: 36 }); ctx.fillStyle = THC[i]; ctx.beginPath(); ctx.arc(x + 110, y, 9, 0, TAU); ctx.fill(); }
  });
  walker(240, 780, 54, { key: 'hero', dark: true });
  sceneLabel('tip 3: threads share memory', T0 + 0.1, { dark: true });
  dial(9, 'tip 3', true);
}

// ---- 11. close: no clear verdict, more often (paper, blue)
function sceneClose() {
  const T0 = BEATS_T.close;
  stripeWorld('close', 'blue');
  paperCloud(220, 260, 0.9, 'c1'); paperCloud(1700, 300, 0.8, 'c2');
  const a = ev(T0 + 0.3, 0.6), b = ev(VW('close', 'more') - 0.3, 0.6);
  paint(rrectPts(360, 330, 1200, 380, 28), { fill: PP.paper, key: 'cl', w: 3.4, amt: 0.6, line: PP.ink });
  handText('No clear verdict yet.', 960 - handW('No clear verdict yet.', 84, 700) / 2, 480, 84, PP.ink, { key: 'v1', weight: 700, frac: a });
  handText('I will use it more.', 960 - handW('I will use it more.', 84, 700) / 2, 620, 84, PP.terraD, { key: 'v2', weight: 700, frac: b });
  chip('Beta · Pro and Max', 1330, 840, '#fbfaf6', VW('close', 'beta'), { size: 44, rot: -0.02 });
  { const nt = ev(VW('close', 'team') + 0.1, 0.4); if (nt > 0) sansText('not Team or Enterprise yet', 1330, 930, 36, PP.ink, { weight: 600, align: 'center', al: nt }); }
  walker(560, 860, 70, { key: 'hero', mood: 'happy' });
  dial(10, 'verdict');
}

// ---- end card
function sceneEnd() {
  stripeWorld('end', 'blue');
  paperCloud(260, 260, 0.8, 'e1'); paperCloud(1680, 330, 0.9, 'e2');
  const a = ev(BEATS_T.end + 0.15, 0.5);
  ctx.save(); ctx.globalAlpha = a;
  paint(rrectPts(460, 380, 1000, 200, 24), { fill: PP.paper, key: 'endc', w: 3.4, amt: 0.6, line: PP.ink });
  sansText('Projects, second look', W / 2, 500, 68, PP.ink, { weight: 700, align: 'center' });
  ctx.restore();
  walker(W / 2, 760, 70, { key: 'hero', mood: 'happy' });
}
