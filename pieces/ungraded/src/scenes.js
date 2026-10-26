// =====================================================================
//  SCENES: ungraded. World coordinates 1080x1350; time TT on 2s; ev / popS for events.
//  Look check: beats 1 (climb), 6 (sort) and 10 (payoff) are drawn; the rest are placeholders.
// =====================================================================
const BASE_Y = 1080;                         // the chart's floor line in the climb / payoff callback
const OLD_BAR = { x: 600, w: 160, top: 300 };
const GRADEABLE = (i) => (i * 37) % 139 < 53;   // a fixed scatter: exactly 53 of the 139 fields
const JUDGE = new Set([9, 26, 41]);             // 3 of the 53 need the LLM judge

// ---- a field tile: raw (unsorted), green (rule), yellow (judge), grey (excluded)
function tile(x, y, s, kind, key) {
  if (kind === 'grey') {
    paint(rrectPts(x, y, s, s, 4), { fill: '#ddd5c4', key, line: 'rgba(58,36,23,0.45)', w: 1.6, tex: [{ k: 'hatch', a: 0.8, gap: 3.5, al: 0.55 }] });
    return;
  }
  const fill = kind === 'green' ? C.green : kind === 'yellow' ? C.yellow : C.cream;
  const tex = kind === 'raw'
    ? [{ k: 'pencil', c: '#e1d2b2', al: 0.6, per: 40 }]
    : [{ k: 'pencil', c: kind === 'green' ? C.greenL : C.yellowL, al: 0.55, per: 40 }, { k: 'hatch', a: 0.8, gap: 4, al: 0.25, dens: (px, py) => clamp((px - x + py - y) / s) }];
  paint(rrectPts(x, y, s, s, 4), { fill, key, w: 2, tex });
}

// ---- a caption card for 4:5: one or two hand-lettered lines, written on after the shot starts
function capCard(lines, y, size, o = {}) {
  const tc = (o.t0 ?? E0) + 0.2;
  if (!o.done && TT < tc) return;   // no empty card: it appears with its first letters
  const f = () => {
    const ws = lines.map((l) => handW(l, size)), w = Math.max(...ws) + size * 1.0, lh = size * 1.22, h = lines.length * lh + size * 0.55;
    ctx.save(); ctx.translate(CX, y); ctx.rotate(o.rot ?? 0.012);
    paint(rrectPts(-w / 2 + 6, -h / 2 + 8, w, h, 12), { fill: 'rgba(58,36,23,0.3)', line: false, key: 'capsh' + lines[0], tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
    paint(rrectPts(-w / 2, -h / 2, w, h, 12), { fill: C.paper, key: 'cap' + lines[0], w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }] });
    lines.forEach((l, i) => {
      const t0 = tc + i * 0.5;
      handText(l, -ws[i] / 2, -h / 2 + size * 0.42 + lh * (i + 0.62), size, (o.colors && o.colors[i]) || C.ink, { key: 'capt' + l, frac: o.done ? 1 : ev(t0, 0.55) });
    });
    ctx.restore();
  };
  if (DEFER) DEFER.push(f); else f();
}
function topTag(str, size = 52) {
  const f = () => inkCard(str, 60 + (handW(str, size) + size * 0.9) / 2, 112, size, { rot: -0.03, s: popS(E0 + 0.15) });
  if (DEFER) DEFER.push(f); else f();
}

// ---- the chart the agent stands on (beats 1, 2, 4, 9, 10)
function chartPaper(key) {
  paperSheet(key);
  ink([[110, BASE_Y], [970, BASE_Y]], { w: 4, key: key + 'floor' });
  for (let i = 0; i < 8; i++) ink([[150 + i * 110, BASE_Y], [150 + i * 110, BASE_Y + 18]], { w: 2.2, key: key + 'tk' + i, color: 'rgba(58,36,23,0.6)' });
  // background life: an eraser, a paper clip, eraser crumbs
  ctx.save(); ctx.translate(170, 960); ctx.rotate(-0.18);
  paint(rrectPts(0, 0, 150, 62, 10), { fill: C.roseL, key: key + 'eras', w: 2.6, tex: [{ k: 'pencil', c: C.rose, al: 0.5, per: 50 }] });
  paint(rrectPts(0, 0, 54, 62, 8), { fill: C.skyL, key: key + 'erasb', w: 2.6, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.3 }] });
  ctx.restore();
  ink([[900, 1150], [900, 1230], [930, 1250], [960, 1230], [960, 1130], [930, 1110], [918, 1122], [918, 1210]], { w: 3.6, color: '#8a8590', key: key + 'clip' });
  for (let i = 0; i < 7; i++) { const R = RNG('crumb', key, i); ctx.fillStyle = C.roseD; ctx.beginPath(); ctx.arc(R.r(330, 520), R.r(1035, 1070), R.r(2, 5), 0, TAU); ctx.fill(); }
}
function selfBar(top, key, frac = 1) {   // the score the agent wrote: terracotta pencil, scribbled
  const { x, w } = OLD_BAR, y = BASE_Y - (BASE_Y - top) * frac;
  paint(box(x, y, w, BASE_Y - y), { fill: C.cream, key, w: 3.4, tex: [{ k: 'pencil', c: C.terra, al: 0.75, per: 26, a: -0.5 }, { k: 'hatch', a: 0.8, gap: 5, al: 0.3, dens: (px) => clamp((px - x) / w) }] });
  for (let i = 1; i < 8; i++) { const ty = BASE_Y - i * 100; if (ty > y + 10) ink([[x - 26, ty], [x, ty]], { w: 2.6, color: C.terra, key: key + 'tick' + i }); }
}

// ---- beat 1: the flash-forward, on top of its own score
function sceneClimb() {
  chartPaper('pA');
  selfBar(OLD_BAR.top, 'barA');
  handText('100%', OLD_BAR.x + OLD_BAR.w + 26, OLD_BAR.top + 130, 68, C.terra, { key: 'hundred', rot: -0.05 });
  handText('my score', OLD_BAR.x + OLD_BAR.w + 30, OLD_BAR.top + 195, 44, C.terra, { key: 'myscore', rot: -0.03 });
  drawPencil(OLD_BAR.x + OLD_BAR.w + 4, OLD_BAR.top - 6, -0.75, 210, 1, 'penA');
  for (let i = 0; i < 9; i++) { const R = RNG('conf', i), a = R.r(-2.6, -0.5), d = 120 + R.r(0, 70) + 10 * ((B + i) % 3); star4(680 + Math.cos(a) * d, 240 + Math.sin(a) * d, R.r(12, 20), C.ink); }
  clawd(OLD_BAR.x + OLD_BAR.w / 2, OLD_BAR.top - 78, 78, { key: 'hero', mood: 'happy' });
  capCard(["Before you improve an agent,"], 1218, 58);
}

// ---- beat 6: the sort. 139 fields pass the question; Yes goes green, No goes grey
function sortedAt(t) {
  const c = TIMELINE.cues;
  if (t < c.sortStart) return 0;
  if (t < c.rush) return Math.floor((t - c.sortStart) / E8 + 1e-6);   // 3 tiles on 8ths
  return Math.min(139, 3 + Math.floor(136 * Math.pow(clamp((t - c.rush) / (c.sortEnd - c.rush)), 2) + 1e-6));
}
function sceneSort(o = {}) {
  const qf = o.q ?? 1;
  woodSurface(-40, -40, W + 40, H + 40, 'deskS', {});
  ctx.save(); ctx.translate(70, 170); ctx.rotate(-0.008);
  paint(box(0, 0, 940, 960), { fill: C.paper, key: 'schema', w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.45, per: 90 }, { k: 'hatch', a: 0.8, gap: 6, al: 0.12, dens: (x, y) => clamp((x + y - 1300) / 600) }] });
  ctx.restore();
  // the question: the plan in red dashes, the words in ink
  planInk(box(120, 215, 840, 104), { closed: true, key: 'qbox', frac: qf });
  if (qf >= 1) handText('Is the agent responsible for this value?', 150, 284, 46, C.ink, { key: 'q', frac: o.qText ?? 1 });
  // the pile still to sort, the tile in flight, the bins
  const n = sortedAt(TT), s = 26, g = 4;
  const flying = TT >= TIMELINE.cues.sortStart && n < 139;
  for (let i = n + (flying ? 1 : 0); i < 139; i++) { const c = i % 20, r = Math.floor(i / 20); tile(240 + c * (s + g), 350 + r * (s + g), s, 'raw', 'p' + i); }
  ink([[540, 570], [540, 640]], { w: 3, key: 'chute' });
  ink([[540, 640], [300, 740]], { w: 3, key: 'yesL' }); ink([[540, 640], [780, 740]], { w: 3, key: 'noL' });
  handText('yes', 330, 676, 44, C.green, { key: 'yes', weight: 700 }); handText('no', 690, 676, 44, '#7d7468', { key: 'no', weight: 700 });
  paint(box(110, 760, 380, 320), { fill: '#eef0dc', key: 'binG', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.12 }] });
  paint(box(590, 760, 380, 320), { fill: '#ece5d6', key: 'binX', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.12 }] });
  let ng = 0, nx = 0;
  for (let i = 0; i < n; i++) {
    if (GRADEABLE(i)) { const c = ng % 12, r = Math.floor(ng / 12); tile(124 + c * (s + g) + 2, 1050 - r * (s + g), s, 'green', 'g' + i); ng++; }
    else { const c = nx % 12, r = Math.floor(nx / 12); tile(604 + c * (s + g) + 2, 1050 - r * (s + g), s, 'grey', 'x' + i); nx++; }
  }
  if (flying) { const k = n % 2 ? 0.35 : 0.7, ty = GRADEABLE(n), px = lerp(540, ty ? 300 : 780, k), py = lerp(640, 740, k); tile(px - 17, py - 17, 34, ty ? 'green' : 'grey', 'fly'); }
  handText(String(ng), 130, 838, 64, C.green, { key: 'cg', weight: 700 }); handText('graded', 130 + handW(String(ng), 64, 700) + 14, 834, 40, C.green, { key: 'cgl' });
  handText(String(nx), 610, 838, 64, '#6d655a', { key: 'cx', weight: 700 }); handText('excluded', 610 + handW(String(nx), 64, 700) + 14, 834, 40, '#6d655a', { key: 'cxl' });
  clawd(905, 1170, 58, { key: 'hero', mood: 'wow' });
  topTag('From my August audit: 139 fields', 44);
  if (!o.sheet) capCard(['86 were set downstream', 'by other systems.'], 1200, 48, { t0: TIMELINE.cues.rush - 0.6 });
}

// ---- beat 10: the payoff. Same chart, the old bar erased, a new one built from the 53 graded tiles
function scenePayoff() {
  chartPaper('pA');
  // where the old bar stood: a faint erased outline
  ctx.save(); ctx.setLineDash([10, 14]);
  ink(box(OLD_BAR.x, OLD_BAR.top, OLD_BAR.w, BASE_Y - OLD_BAR.top), { closed: true, w: 2, color: 'rgba(58,36,23,0.22)', key: 'ghost' });
  ctx.restore();
  const s = 36, g = 4, cols = 4, rows = Math.floor(53 / cols);   // 13 full rows; Clawd holds up the 53rd tile
  let landed = 0;
  for (let i = 0; i < 52; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const land = i < cols ? 1 : popS(E0 + (i - cols) * 0.012);   // the first row is down on the cut
    if (land <= 0) continue;
    landed = i + 1;
    tile(OLD_BAR.x + c * (s + g) + 2, BASE_Y - (r + 1) * (s + g), s, JUDGE.has(i) ? 'yellow' : 'green', 'nb' + i);
  }
  const top = BASE_Y - Math.ceil(landed / cols) * (s + g);   // Clawd rides the stack up
  if (landed === 52) handText('53 graded', OLD_BAR.x - 30 - handW('53 graded', 50, 700), top + 170, 50, C.green, { key: 'n53', weight: 700 });
  if (landed === 52) handText('50 rules, 3 judge', OLD_BAR.x - 30 - handW('50 rules, 3 judge', 38), top + 226, 38, C.ink, { key: 'n50' });
  drawPencil(330, 1060, -0.12, 220, 1, 'penDown');   // the pencil, put down
  clawd(OLD_BAR.x + OLD_BAR.w / 2, top - 76, 76, { key: 'hero', mood: 'happy' });
  if (popS(E0 + 0.8) > 0) { ctx.save(); ctx.translate(OLD_BAR.x + OLD_BAR.w / 2 + 96, top - 128); ctx.rotate(0.18 + Math.sin(TT * 3) * 0.05); tile(-18, -18, 36, 'green', 'nb52'); ctx.restore(); }
  capCard(['Fix the score', 'before the agent climbs it.'], 1150, 54, { colors: [C.green, C.ink] });
  const f = () => handText('Harsh Puri', CX - handW('Harsh Puri', 34) / 2, 1278, 34, '#6d655a', { key: 'byline', frac: ev(E0 + 1.6, 0.5) });
  if (DEFER) DEFER.push(f); else f();
}

function scenePlaceholder(title) {
  paperSheet('ph');
  capCard([title], 675, 50, { done: true });
}

// ---- beat 2: rewind. The dot draws its own bar as it climbs
function sceneDraw() {
  chartPaper('pA');
  const fr = 0.12 + 0.63 * EZ.o2(ev(E0 + 0.2, 2.4)), top = BASE_Y - (BASE_Y - OLD_BAR.top) * fr;
  selfBar(OLD_BAR.top, 'barA', fr);
  const wig = Math.sin(TT * 18) * 40;
  drawPencil(OLD_BAR.x + OLD_BAR.w / 2 + wig, top + 4, -0.75, 210, 1, 'penA');
  for (let i = 0; i < 4; i++) ink([[OLD_BAR.x + 20 + i * 34, top + 18], [OLD_BAR.x + 44 + i * 34, top + 6]], { w: 2.4, color: C.terra, key: 'scr' + i + (B % 3) });
  clawd(OLD_BAR.x - 70, top - 50, 70, { key: 'hero', mood: 'smile' });
  capCard(["check what you're rewarding."], 1200, 62, { colors: [C.terra] });
}

// ---- beat 3: inside the machine. The loop tunes prompts, tools, memory; the self-written bar grows a step per lap
function sceneLoop() {
  darkWorld('inside');
  hexGrid({ x0: -40, y0: 1000, x1: W + 40, y1: H + 40 }, 64, { key: 'hex' });
  const cx = 400, cy = 520, R = 250, lap = Math.max(0, Math.floor((TT - E0 - 0.5) / 1.25));
  ink(ellipsePts(cx, cy, R, R * 0.82, 0, 72), { closed: true, w: 4, color: C.peri, key: 'ring' });
  const a0 = (TT - E0) * 1.6;
  ink(arcPts(cx, cy, R, a0, a0 + 0.9, 14, 0.82), { w: 9, color: C.cyan, key: 'runner' });
  [['tune', 'prompts', 0], ['tune', 'tools', 2.1], ['tune', 'memory', 4.2]].forEach(([l, a, ang], i) =>
    toolPill(l, a, cx + Math.cos(ang - 1.2) * R - 130, cy + Math.sin(ang - 1.2) * R * 0.82 - 26, E0 + 0.3 + i * 0.4, { dot: C.cyan, size: 34 }));
  clawd(cx, cy, 82, { key: 'hero', dark: true, mood: 'happy' });
  // the score it keeps for itself, a step taller every lap
  const bh = 120 + Math.min(lap, 4) * 70;
  paint(box(810, 830 - bh, 110, bh), { fill: C.navy2, key: 'lbar', line: C.peri, w: 3, tex: [{ k: 'pencil', c: C.terra, al: 0.8, per: 24, a: -0.5 }] });
  monoText('harness', 812, 870, 30, C.peri, { key: 'lsc' });
  capCard(['This month Google Research', 'open-sourced Harness². It tunes', "an agent's prompts, tools and memory."], 1150, 44);
}

// ---- beat 4: the bar shoots up; the pencil is its own
function sceneRise() {
  chartPaper('pA');
  const top = springMove(E0 + 0.15, BASE_Y - (BASE_Y - OLD_BAR.top) * 0.75, 150, SPRING.snappy);
  selfBar(top, 'barR');
  for (let i = 0; i < 5; i++) ink([[OLD_BAR.x - 60 - i * 26, top + 120 + i * 60], [OLD_BAR.x - 60 - i * 26, top + 260 + i * 60]], { w: 3, color: 'rgba(58,36,23,0.5)', key: 'speed' + i });
  clawd(OLD_BAR.x + OLD_BAR.w / 2, top - 70, 70, { key: 'hero', mood: 'wow' });
  const px = OLD_BAR.x + OLD_BAR.w + 4, py = top - 6;
  drawPencil(px, py, -0.75, 210, 1, 'penA');
  ink(ellipsePts(px + 70, py - 70, 120, 90, -0.7, 40), { closed: true, w: 4, color: C.ink, key: 'circ', frac: ev(E0 + 1.0, 0.4) });
  handText('its own pencil', OLD_BAR.x + OLD_BAR.w + 16, py + 190, 36, C.ink, { key: 'own', frac: ev(E0 + 1.3, 0.4) });
  capCard(['A bad score can reward', 'the wrong behaviour.'], 1200, 48);
}

// ---- beat 5: the turn. Silence, the schema sheet, then the question slams on
function sceneSheet() { sceneSort({ sheet: true, q: ev(E0 + 0.95, 0.12), qText: ev(E0 + 1.1, 0.4) }); }

// ---- beat 7: 50 rules, 3 judge; the agent can't talk its way past an exact match
function sceneRules() {
  woodSurface(-40, -40, W + 40, H + 40, 'deskS', {});
  ctx.save(); ctx.translate(70, 150); ctx.rotate(0.006);
  paint(box(0, 0, 940, 900), { fill: C.paper, key: 'rsheet', w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.45, per: 90 }] });
  ctx.restore();
  handText('50', 130, 270, 96, C.green, { key: 'r50', weight: 700 }); handText('plain rules', 260, 262, 50, C.green, { key: 'r50l' });
  handText('3', 640, 270, 96, '#b8902a', { key: 'r3', weight: 700 }); handText('LLM judge', 710, 262, 50, '#b8902a', { key: 'r3l' });
  const s = 62, g = 10, cols = 9;
  for (let i = 0; i < 53; i++) {
    const c = i % cols, r = Math.floor(i / cols), x = 145 + c * (s + g), y = 340 + r * (s + g), j = JUDGE.has(i);
    tile(x, y, s, j ? 'yellow' : 'green', 'rt' + i);
    if (j) { ink(ellipsePts(x + s * 0.45, y + s * 0.45, 22, 22, 0, 24), { closed: true, w: 3.4, key: 'lp' + i }); ink([[x + s * 0.62, y + s * 0.62], [x + s * 0.92, y + s * 0.92]], { w: 5, key: 'lh' + i }); }
    else if (ev(E0 + 0.4 + i * 0.03, 0.1) > 0) ink([[x + 16, y + 32], [x + 27, y + 44], [x + 47, y + 18]], { w: 3.6, color: C.ink, key: 'ck' + i });
  }
  // the bounce: the agent pushes at a ruled tile and is thrown back
  const tx = 760, ty = 820, push = TT - (E0 + 3.0), bx = push < 0 ? 0 : push < 0.35 ? -80 * (push / 0.35) : -80 * Math.exp(-(push - 0.35) * 4) * Math.cos((push - 0.35) * 16);
  tile(tx, ty, 90, 'green', 'big');
  ink([[tx + 22, ty + 46], [tx + 40, ty + 66], [tx + 70, ty + 26]], { w: 5, key: 'bigck' });
  inkCard('exact match', tx + 45, ty - 46, 40, { rot: 0.03 });
  clawd(tx + 170 + bx, ty + 45, 64, { key: 'hero', mood: push > 0.35 && push < 1.2 ? 'wow' : 'smile' });
  if (TT < E0 + 3.0) capCard(['3 need an LLM judge.', '50 need plain rules.'], 1205, 50);
  else capCard(["An agent can't talk its way", 'past an exact match.'], 1205, 50, { t0: E0 + 3.0 });
}

// ---- beat 8: the recipe. Each step is planned in red dashes, then written in ink
function sceneRecipe() {
  paperSheet('rec');
  handText('Before an agent improves itself:', 90, 210, 54, C.ink, { key: 'rhead', frac: ev(E0 + 0.1, 0.5) });
  const steps = [['1. List the fields it writes.', 'raw'], ["2. Grade the ones\nit's responsible for.", 'green'], ['3. Rules first. Judge last.', 'yellow']];
  steps.forEach(([txt, kind], i) => {
    const ls = txt.split('\n'), t0 = E0 + 0.7 + i * 1.7, y = 420 + i * 230, ind = ls.length > 1 ? handW(ls[0].slice(0, 3), 54) : 0, w = Math.max(...ls.map((l, k) => handW(l, 54) + (k ? ind : 0))) + 40;
    planInk(box(80, y - 70, w + 120, 104 + (ls.length - 1) * 64), { closed: true, key: 'rp' + i, frac: ev(t0, 0.3) });
    for (let k = 0; k < 3; k++) if (ev(t0 + 0.3, 0.2) > 0) tile(100 + k * 30, y - 46, 24, i === 2 && k === 2 ? 'yellow' : kind, 'ri' + i + k);
    ls.forEach((l, k) => handText(l, 210 + (k ? ind : 0), y + k * 64, 54, C.ink, { key: 'rt' + i + k, frac: ev(t0 + 0.45 + k * 0.4, 0.6) }));
  });
  clawd(880, 1150, 70, { key: 'hero', mood: 'smile' });
}

// ---- beat 9: quiet. The old bar erases, stroke by stroke
function sceneErase() {
  chartPaper('pA');
  const fr = 1 - EZ.o2(ev(E0 + 0.2, 1.5)), top = BASE_Y - (BASE_Y - OLD_BAR.top) * fr;
  ctx.save(); ctx.setLineDash([10, 14]);
  ink(box(OLD_BAR.x, OLD_BAR.top, OLD_BAR.w, BASE_Y - OLD_BAR.top), { closed: true, w: 2, color: 'rgba(58,36,23,0.22)', key: 'ghost' });
  ctx.restore();
  if (fr > 0.01) selfBar(top, 'barE');
  ctx.save(); ctx.translate(OLD_BAR.x + 20 + Math.sin(TT * 14) * 30, top - 50); ctx.rotate(-0.1);
  paint(rrectPts(0, 0, 150, 62, 10), { fill: C.roseL, key: 'erasE', w: 2.6, tex: [{ k: 'pencil', c: C.rose, al: 0.5, per: 50 }] });
  ctx.restore();
  clawd(OLD_BAR.x - 110, BASE_Y - 62, 62, { key: 'hero', mood: 'wow' });
}
