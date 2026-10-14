// =====================================================================
//  styles/crosshatch/kit.js — sketchy ink on warm paper. The drawing primitives live in kit/core.js
//  (ink, paint with hatch / cross / pencil / stipple textures, wobble on the boil, grain, monoText, handwrite,
//  drawPencil, irisHole, hexGrid, construct); this file adds the look's surfaces, props, hero, captions and STYLE.
//  Needs from the piece head: HAND (font stack), CX (caption centre x).
//  Shade with density functions (dens(x, y) -> 0..1), never flat fills; world-anchor textures when the camera pans.
// =====================================================================
const HANDF = HAND;
function handText(str, x, y, size, color, o = {}) {
  ctx.save();
  const R = RNG('ht', o.key ?? str, B);
  ctx.translate(x + R.n(0.7), y + R.n(0.7)); ctx.rotate((o.rot ?? 0) + R.n(0.006));
  ctx.font = `${o.weight ?? 400} ${size}px ${HANDF}`; ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(str).width, frac = clamp(o.frac ?? 1);
  if (frac <= 0) { ctx.restore(); return w; }
  if (frac < 1) { ctx.beginPath(); ctx.rect(-4, -size * 1.2, w * frac + 4, size * 1.7); ctx.clip(); }
  ctx.globalAlpha = o.al ?? 1; ctx.fillText(str, 0, 0);
  ctx.restore();
  return w;
}
function handW(str, size, weight = 400) { ctx.save(); ctx.font = `${weight} ${size}px ${HANDF}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }
const box = (x, y, w, h) => resample([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, 30);   // dense, so trace() keeps the corners

// ---- surfaces: a full-bleed world in ink (paper, wood, cloth, the dark "inside the machine")
function paperSheet(key = 'sheet', o = {}) {   // warm paper with faint ruled lines
  paint(box(-40, -40, W + 80, H + 80), { raw: true, line: false, fill: o.fill || C.paper, key: key + 'b', tex: [{ k: 'pencil', c: '#fffaf0', al: 0.45, per: 700, a: -0.6 }] });
  if (o.ruled !== false) { ctx.save(); ctx.strokeStyle = C.paperLine; ctx.lineWidth = 1.4; ctx.beginPath(); for (let y = 260; y < H; y += 64) { ctx.moveTo(0, y); ctx.lineTo(W, y + RNG('rl', key, y).n(2)); } ctx.stroke(); ctx.restore(); }
}
function woodSurface(x0, y0, x1, y1, key, o = {}) {
  const S = RNG('woodS', key), R = RNG('woodR', key, B);
  paint(box(x0, y0, x1 - x0, y1 - y0), {
    raw: true, line: false, fill: o.fill || C.wood, key,
    tex: [{ k: 'pencil', c: C.woodL, al: 0.32, a: 0.02, len: 46, per: 900 }, { k: 'pencil', c: C.woodD, al: 0.16, a: -0.03, len: 30, per: 1400 }],
  });
  ctx.beginPath();
  for (let y = y0; y < y1; y += S.r(11, 24)) {
    const f = S.r(0.002, 0.006), ph = S.r(0, TAU), A = S.r(1, 5);
    let down = S.f() < 0.8, left = S.r(40, 420);
    for (let x = x0; x <= x1; x += 22) {
      const yy = y + Math.sin(x * f + ph) * A + R.n(0.5);
      if (down) ctx.lineTo(x, yy); else ctx.moveTo(x, yy);
      left -= 22;
      if (left <= 0) { down = !down; left = down ? S.r(60, 480) : S.r(10, 70); if (down) ctx.moveTo(x, yy); }
    }
  }
  ctx.strokeStyle = C.ink; ctx.lineWidth = o.gw ?? 1.3; ctx.globalAlpha = o.gal ?? 0.42; ctx.stroke(); ctx.globalAlpha = 1;
}
function darkWorld(key, o = {}) {   // navy, dust specks and tiny crosses: inside the computer
  fillAll(o.fill || C.navy);
  const R = RNG('dust', key), J = RNG('dustj', key, B);
  ctx.save(); screen();
  ctx.fillStyle = 'rgba(150,160,220,0.28)'; ctx.beginPath();
  for (let i = 0; i < (o.dust ?? 260); i++) ctx.rect(R.r(0, W) + J.n(0.6), R.r(0, H) + J.n(0.6), R.r(1, 2.4), R.r(1, 2.4));
  ctx.fill();
  ctx.strokeStyle = 'rgba(40,44,90,0.5)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < 70; i++) { const x = R.r(0, W), y = R.r(0, H); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); }
  ctx.stroke(); ctx.restore();
}
function stripedCloth(key, o = {}) {
  paint(box(-600, -600, 2300, 2300 + H), { raw: true, line: false, fill: o.base || C.cream, key: key + 'b', tex: [{ k: 'pencil', c: '#fffaf0', al: 0.5, per: 500, a: -0.8 }] });
  for (let k = -12; k < 12; k++) {
    const x = k * 190, P = [[x, -600], [x + 95, -600], [x + 95 + 2300, 1700 + H], [x + 2300, 1700 + H]];
    paint(P, { raw: true, line: false, fill: o.stripe || 'rgba(240,205,120,0.45)', key: key + 's' + k, tex: [{ k: 'hatch', a: Math.atan2(2300, 2300), gap: 4, c: o.hatchC || '#d9a441', al: 0.35, w: 1, dash: [30, 140] }] });
  }
}

// ---- props
function inkMug(x, y, r, key = 'mug', o = {}) {   // a mug seen from above; the coffee is a good bridge object
  paint(ellipsePts(x + 16, y + 20, r, r, 0, 40), { fill: 'rgba(92,55,28,0.25)', line: false, key: key + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4 }] });
  paint(rrectPts(x + r * 0.7, y - 20, r * 0.75, 40, 18), { fill: '#f2ede2', key: key + 'h', w: 3 });
  paint(ellipsePts(x, y, r, r, 0, 44), { fill: '#f2ede2', key: key + 'b', w: 3.2, tex: [{ k: 'pencil', c: '#d9cdb8', al: 0.6, per: 60 }, { k: 'hatch', gap: 4, a: 0.7, al: 0.3, dash: [8, 24], dens: (px, py) => clamp((px - x + py - y) / r) }] });
  ink(ellipsePts(x, y, r * 0.84, r * 0.84, 0, 40), { closed: true, w: 2, key: key + 'rim' });
  paint(ellipsePts(x, y, r * 0.78, r * 0.78, 0, 40), { fill: '#6e4128', key: key + 'c', w: 1.6, tex: [{ k: 'cross', c: '#2e170b', al: 0.35, gap: 5 }] });
  if (o.steam !== false) for (let i = 0; i < 3; i++) { const P = []; for (let k = 0; k <= 10; k++) P.push([x - 30 + i * 30 + Math.sin(k * 0.8 + TT * 3 + i) * 10, y - r - 20 - k * 14]); ink(P, { w: 2.4, color: 'rgba(58,36,23,0.45)', key: key + 'st' + i }); }
}
function toolPill(label, arg, x, y, t, o = {}) {   // a hand-painted tool-call tag: Read(notes.md). Keep them true.
  const size = o.size ?? 30, cw = monoW(size), text = label + '(' + arg + ')';
  const w = 70 + cw * text.length, h = size * 1.75, pop = EZ.back(seg(TT, t, t + 0.12));
  if (pop <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop); ctx.rotate(o.rot ?? -0.02);
  paint(rrectPts(4, 6, w, h, 14), { fill: 'rgba(58,36,23,0.35)', line: false, key: 'pillsh' + label });
  paint(rrectPts(0, 0, w, h, 14), { fill: C.paper, key: 'pill' + label, w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.6, per: 90 }] });
  ctx.beginPath(); ctx.arc(30, h / 2, 9, 0, TAU); ctx.fillStyle = o.dot || C.green; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke();
  monoText(label, 50, h / 2 + size * 0.36, size, C.ink, { key: 'pl' + label });
  monoText('(' + arg + ')', 50 + cw * label.length, h / 2 + size * 0.36, size, '#8a5a3a', { key: 'pa' + label, weight: 400 });
  ctx.restore();
}
function planInk(P, o = {}) {   // the plan: red pencil dashes, written on
  if ((o.frac ?? 1) <= 0) return;
  ctx.save(); ctx.setLineDash(o.dash ?? [16, 11]);
  ink(P, { closed: o.closed, color: o.c ?? 'rgba(212,56,44,0.92)', w: o.w ?? 3.4, amt: o.amt ?? 2.2, key: o.key ?? 'plan', frac: o.frac, alpha: o.al ?? 1 });
  ctx.restore();
}

// ---- the hero: a terracotta dot with a cream asterisk and a pair of eyes; works on paper and on navy
function dotHero(x, y, r, o = {}) {
  const key = o.key ?? 'hero', dark = !!o.dark;
  y += Math.sin(TT * TAU * 0.9 + key.length) * r * 0.04;                  // idle bob
  SPARK_AT = toScreen(x, y);
  if (!dark && o.shadow !== false) paint(ellipsePts(x + r * 0.55, y + r * 0.75, r * 1.08, r, 0, 28), { fill: 'rgba(58,36,23,0.3)', line: false, key: key + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.6 }] });
  const P = ellipsePts(x, y, r, r, 0, 30);
  if (dark) { ink(P, { closed: true, color: 'rgba(240,150,110,0.18)', w: r * 0.7, key: key + 'g' }); ink(P, { closed: true, color: 'rgba(200,208,240,0.2)', w: 16, key: key + 'g2' }); }
  paint(P, {
    fill: C.terra, key, line: dark ? C.peri : C.ink, w: dark ? 5 : Math.max(3, r * 0.08),
    tex: [{ k: 'cross', c: C.orangeD, al: 0.5, gap: 5 }, { k: 'pencil', c: C.orangeL, al: 0.35, per: 60, dens: (px, py) => clamp((x - px + y - py) / r) }],
  });
  asterisk(x, y - r * 0.38, r * 0.06, r * 0.26, 8, o.spin ?? TT * 0.5, C.cream, Math.max(2, r * 0.06));
  const blink = (B + key.length * 7) % 41 < 2, ey = y + r * 0.08;
  for (const s of [-1, 1]) {
    if (blink) ink([[x + s * r * 0.28 - r * 0.08, ey], [x + s * r * 0.28 + r * 0.08, ey]], { w: r * 0.06, color: C.ink, key: key + 'bl' + s, amt: 0.3 });
    else { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(x + s * r * 0.28, ey, r * 0.075, r * (o.mood === 'wow' ? 0.12 : 0.1), 0, 0, TAU); ctx.fill(); }
  }
  if (o.mood === 'happy') ink(arcPts(x, y + r * 0.3, r * 0.2, Math.PI * 0.15, Math.PI * 0.85, 10), { w: r * 0.06, color: C.ink, key: key + 'm', amt: 0.4 });
  return P;
}

// ---- captions: a paper card with an ink outline, drawn after the camera (DEFER)
function inkCard(str, x, y, size, o = {}) {
  const w = handW(str, size) + size * 0.9, h = size * 1.45, s = o.s ?? 1; if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.02); ctx.scale(s, s);
  paint(rrectPts(-w / 2 + 6, -h / 2 + 8, w, h, 10), { fill: 'rgba(58,36,23,0.3)', line: false, key: 'cardsh' + str, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(rrectPts(-w / 2, -h / 2, w, h, 10), { fill: C.paper, key: 'card' + str, w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }] });
  handText(str, -w / 2 + size * 0.45, size * 0.36, size, o.color ?? C.ink, { key: 'cardt' + str, frac: o.frac });
  ctx.restore();
}
const inkTag = (str) => { const f = () => inkCard(str, 70 + (handW(str, 80) + 72) / 2, 330, 80, { rot: -0.04, s: popS(E0 + 0.2) }); if (DEFER) DEFER.push(f); else f(); };
const inkCaption = (str) => { const f = () => inkCard(str, CX, 1440, 50, { rot: 0.012, frac: ev(E0 + 0.45, 0.6) }); if (DEFER) DEFER.push(f); else f(); };

// =====================================================================
//  paperprint additions — 16:9 explainer look: diagonal-striped paper worlds and navy blueprint worlds,
//  a small lowercase scene label top-left and a progress dial top-right. Lines are cleaner than crosshatch
//  (low wobble), fills are flat paper with light pencil grain, not heavy hatching.
// =====================================================================
const SANS = '"Inter", "SF Pro Text", "Helvetica Neue", "Segoe UI", Arial, sans-serif';
const PP = {
  ink: '#2b2622', paper: '#f8f5eb', paper2: '#efe9d8', cream: '#ede5cc', bar: '#e6dfcb',
  tint: { blue: '#c9d6d8', green: '#d6e2c6', yellow: '#ecdca4', rose: '#ecd2c4' },
  navy: '#0e142d', navy2: '#16204a', navyL: '#1d2858', line: '#aeb9ec', lineD: 'rgba(150,165,230,0.35)',
  label: '#eef0ff', under: '#e9c46a', terra: '#d97757', terraD: '#b85c3f', cyan: '#6fe0cf', gold: '#f2c66d',
};
const PPS = 1;   // the kit draws in a 1920x1080 world

function sansText(str, x, y, size, color, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 600} ${size}px ${SANS}`; ctx.fillStyle = color; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = o.al ?? 1;
  const w = ctx.measureText(str).width;
  const n = o.count == null ? str.length : Math.max(0, Math.min(str.length, o.count));
  ctx.fillText(str.slice(0, n), x, y);
  ctx.restore(); return w;
}
function sansW(str, size, weight = 600) { ctx.save(); ctx.font = `${weight} ${size}px ${SANS}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }

// ---- worlds
function stripeWorld(key, tint = 'blue', o = {}) {
  fillAll(PP.cream);
  const c = PP.tint[tint] || tint, band = o.band ?? 150, a = -0.62;   // stripes rise to the right
  ctx.save(); screen(); ctx.translate(W / 2, H / 2); ctx.rotate(a);
  ctx.fillStyle = c;
  for (let k = -12; k <= 12; k++) ctx.fillRect(k * band * 2, -H * 2, band, H * 4);
  ctx.restore();
  // faint construction grid, like a layout sheet
  ctx.save(); screen(); ctx.strokeStyle = 'rgba(90,80,60,0.07)'; ctx.lineWidth = 1; ctx.setLineDash([3, 7]); ctx.beginPath();
  for (let x = 160; x < W; x += 400) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 180; y < H; y += 360) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke(); ctx.restore();
}
function blueprintWorld(key, o = {}) {
  fillAll(PP.navy);
  ctx.save(); screen();
  const g = ctx.createRadialGradient(W * 0.5, H * 0.48, 40, W * 0.5, H * 0.5, W * 0.62);
  g.addColorStop(0, '#1f2a5c'); g.addColorStop(0.55, '#141b40'); g.addColorStop(1, '#0b1028');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,140,230,0.06)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0; x <= W; x += 48) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y <= H; y += 48) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  // edge rulers with ticks
  ctx.strokeStyle = 'rgba(170,185,240,0.30)'; ctx.beginPath();
  for (const x of [120, W - 120]) { ctx.moveTo(x, 250); ctx.lineTo(x, H - 150); for (let y = 250; y <= H - 150; y += 22) { const l = (y / 22) % 5 === 0 ? 12 : 6; ctx.moveTo(x, y); ctx.lineTo(x + (x < W / 2 ? l : -l), y); } }
  ctx.stroke();
  // corner brackets
  ctx.strokeStyle = 'rgba(170,185,240,0.22)'; ctx.beginPath();
  for (const [x, y, sx, sy] of [[40, 40, 1, 1], [W - 40, 40, -1, 1], [40, H - 40, 1, -1], [W - 40, H - 40, -1, -1]]) { ctx.moveTo(x, y + sy * 26); ctx.lineTo(x, y); ctx.lineTo(x + sx * 26, y); }
  ctx.stroke();
  // dust on 2s
  const R = RNG('bpd', key), J = RNG('bpdj', key, B);
  ctx.fillStyle = 'rgba(170,185,250,0.22)'; ctx.beginPath();
  for (let i = 0; i < (o.dust ?? 160); i++) ctx.rect(R.r(0, W) + J.n(0.6), R.r(0, H) + J.n(0.6), R.r(1, 2.2), R.r(1, 2.2));
  ctx.fill();
  ctx.restore();
}

// ---- chrome: the scene label (top-left) and the progress dial (top-right); drawn at screen size via DEFER
function sceneLabel(str, t0, o = {}) {
  const f = () => {
    ctx.save(); screen();
    const dark = !!o.dark, size = o.size ?? 46, x = 110, y = 118;
    const n = Math.ceil(clamp((TT - t0) / 0.5) * str.length);
    const w = sansText(str, x, y, size, dark ? PP.label : PP.ink, { count: n });
    const u = ev(t0 + 0.3, 0.4);
    if (u > 0) { ctx.fillStyle = dark ? 'rgba(200,210,250,0.55)' : PP.under; ctx.fillRect(x, y + 16, Math.min(w, 260) * u, 5); }
    ctx.restore();
  };
  if (DEFER) DEFER.push(f); else f();
}
function progressDial(frac, label, o = {}) {
  const f = () => {
    ctx.save(); screen();
    const dark = !!o.dark, x = W - 165, y = 120, r = 44;
    ctx.lineWidth = 3; ctx.strokeStyle = dark ? 'rgba(200,210,250,0.28)' : 'rgba(43,38,34,0.18)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = PP.terra; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(frac)); ctx.stroke();
    ctx.fillStyle = dark ? '#1a2148' : PP.paper; ctx.beginPath(); ctx.arc(x, y, r - 8, 0, TAU); ctx.fill();
    ctx.fillStyle = PP.terra; ctx.fillRect(x - 8, y - 8, 16, 16);
    sansText(label, x, y + r + 40, 26, dark ? 'rgba(230,234,255,0.8)' : 'rgba(43,38,34,0.75)', { weight: 500, align: 'center' });
    ctx.restore();
  };
  if (DEFER) DEFER.push(f); else f();
}

// ---- paper props
function softShadow(P, key, dx = 10, dy = 14, al = 0.16) {
  ctx.save(); ctx.translate(dx, dy); trace(P, true); ctx.fillStyle = `rgba(60,45,30,${al})`; ctx.fill(); ctx.restore();
}
function appWindow(x, y, w, h, title, o = {}) {   // a generic app window in ink (not a real product's UI)
  const key = o.key ?? 'win' + title, r = 22;
  const P = rrectPts(x, y, w, h, r);
  softShadow(P, key);
  paint(P, { fill: PP.paper, key, w: 3.4, amt: 0.7, line: PP.ink, tex: [{ k: 'pencil', c: '#efe7d2', al: 0.35, per: 600, a: -0.5 }] });
  ctx.save(); trace(P, true); ctx.clip();
  ctx.fillStyle = PP.bar; ctx.fillRect(x, y, w, 64);
  ctx.restore();
  ink([[x, y + 64], [x + w, y + 64]], { w: 2.4, amt: 0.5, key: key + 'bar', color: PP.ink });
  ['#e06b5a', '#e9b949', '#6fae63'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 34 + i * 30, y + 32, 9, 0, TAU); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = PP.ink; ctx.stroke(); });
  if (title) sansText(title, x + w / 2, y + 42, 26, 'rgba(43,38,34,0.75)', { weight: 500, align: 'center' });
  return { x, y: y + 64, w, h: h - 64 };
}
function paperCloud(x, y, s, key) {   // a flat-bottomed cloud from round bumps; drifts slowly
  x += TT * 9 * s;
  const bumps = [[-52, -4, 30], [-18, -26, 40], [24, -20, 34], [56, -2, 26]], P = [];
  for (let i = 0; i <= 60; i++) {   // outline = farthest point of the bump union along each angle (upper half), flat base
    const a = Math.PI + Math.PI * i / 60; let best = 0;
    for (const [bx, by, br] of bumps) { const dx = Math.cos(a), dy = Math.sin(a), b = bx * dx + by * dy, c = bx * bx + by * by - br * br, d = b * b - c; if (d >= 0) best = Math.max(best, b + Math.sqrt(d)); }
    P.push([x + Math.cos(a) * best * s * 1.15, y + Math.min(0, Math.sin(a) * best) * s]);
  }
  paint(P, { fill: '#fbf9f1', key, w: 2.6, amt: 0.6, line: PP.ink, tex: [{ k: 'hatch', a: 0.2, gap: 6, al: 0.16, dash: [20, 30], dens: (px, py) => clamp((py - y + 16) / 22) }] });
}
function docCard(x, y, w, h, title, o = {}) {   // a paper document with a header line and text lines
  const key = o.key ?? 'doc' + title, P = rrectPts(x, y, w, h, 10);
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(o.rot ?? 0); ctx.translate(-(x + w / 2), -(y + h / 2));
  softShadow(P, key, 8, 10, 0.18);
  paint(P, { fill: PP.paper, key, w: 3, amt: 0.6, line: PP.ink });
  ctx.fillStyle = o.accent ?? PP.terra; ctx.fillRect(x + 22, y + 24, w - 44, 8);
  sansText(title, x + 22, y + 72, o.size ?? 30, PP.ink, { weight: 700 });
  const R = RNG('docl', key);
  for (let i = 0; i < (o.lines ?? 5); i++) { const ly = y + 106 + i * 26; if (ly > y + h - 24) break; ctx.fillStyle = 'rgba(43,38,34,0.22)'; ctx.fillRect(x + 22, ly, (w - 44) * R.r(0.5, 0.95), 7); }
  if (o.total) { ctx.fillStyle = 'rgba(43,38,34,0.75)'; ctx.fillRect(x + w - 22 - 90, y + h - 40, 90, 10); }
  ctx.restore();
}

// ---- blueprint props: clean hairlines with a glow
function bpLine(P, o = {}) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let Q = P, cl = !!o.closed; if (o.frac != null && o.frac < 1) { if (o.frac <= 0) { ctx.restore(); return; } Q = subPath(cl ? [...P, P[0]] : P, o.frac); cl = false; }
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.strokeStyle = o.glow ?? 'rgba(150,170,255,0.18)'; ctx.lineWidth = (o.w ?? 2) * 4; trace(Q, cl); ctx.stroke();
  ctx.strokeStyle = o.color ?? PP.line; ctx.lineWidth = o.w ?? 2; ctx.globalAlpha = o.al ?? 1; trace(Q, cl); ctx.stroke();
  ctx.restore();
}
function bpPill(str, x, y, o = {}) {   // a rounded node with a mono label
  const size = o.size ?? 26, w = monoW(size) * str.length + 44, h = size * 1.7;
  ctx.save(); ctx.globalAlpha = o.al ?? 1;
  const P = rrectPts(x - w / 2, y - h / 2, w, h, h / 2);
  trace(P, true); ctx.fillStyle = o.fill ?? 'rgba(22,32,74,0.92)'; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = o.line ?? PP.line; ctx.stroke();
  monoText(str, x - w / 2 + 22, y + size * 0.36, size, o.color ?? PP.label, { key: 'bpp' + str, weight: 500 });
  ctx.restore();
  return w;
}
function glint(x, y, s, al = 1) { ctx.save(); ctx.globalAlpha = al; star4(x, y, s, '#ffffff'); ctx.globalAlpha = al * 0.3; ctx.fillStyle = '#c9d4ff'; ctx.beginPath(); ctx.arc(x, y, s * 1.4, 0, TAU); ctx.fill(); ctx.restore(); }

// ---- the hero: Clawd, a square terracotta block with two tall eyes, side arms and four short legs
function walker(x, y, r, o = {}) {
  const key = o.key ?? 'hero', dark = !!o.dark, lc = dark ? PP.line : PP.ink;
  const walk = o.walk ?? 0, ph = TT * TAU * walk;
  y += Math.sin(TT * TAU * 0.9) * r * 0.03 - (walk ? Math.abs(Math.sin(ph)) * r * 0.06 : 0);   // idle bob, a hop when walking
  SPARK_AT = toScreen(x, y);
  const bw = r * 2, bh = r * 1.55, top = y - bh / 2, bot = y + bh / 2;
  if (!dark) { ctx.fillStyle = 'rgba(60,45,30,0.13)'; ctx.beginPath(); ctx.ellipse(x, bot + r * 0.42, r * 1.15, r * 0.14, 0, 0, TAU); ctx.fill(); }
  // legs: four short blocks, alternating when walking
  for (let i = 0; i < 4; i++) {
    const lx = x - bw / 2 + bw * (0.14 + i * 0.24), lift = walk ? Math.max(0, Math.sin(ph + (i % 2) * Math.PI)) * r * 0.12 : 0;
    paint(rrectPts(lx - r * 0.07, bot - 4, r * 0.14, r * 0.36 - lift, 3), { fill: PP.terraD, key: key + 'lg' + i, w: Math.max(2, r * 0.045), amt: 0.3, line: lc });
  }
  // arms: small side nubs
  for (const s of [-1, 1]) paint(rrectPts(s < 0 ? x - bw / 2 - r * 0.22 : x + bw / 2 - 2, y - r * 0.05, r * 0.24, r * 0.28, 4), { fill: PP.terra, key: key + 'arm' + s, w: Math.max(2, r * 0.045), amt: 0.3, line: lc });
  const P = rrectPts(x - bw / 2, top, bw, bh, r * 0.12);
  if (dark) { ink(P, { closed: true, color: 'rgba(240,150,110,0.18)', w: r * 0.5, key: key + 'g', amt: 0.4 }); }
  paint(P, { fill: PP.terra, key, w: Math.max(2.6, r * 0.06), amt: 0.5, line: lc, tex: [{ k: 'pencil', c: '#e89a7a', al: 0.35, per: 60, dens: (px, py) => clamp((x - px + top + bh - py) / (2 * r)) }, { k: 'hatch', a: 0.8, gap: 5, al: 0.22, dens: (px, py) => clamp((px - x + py - y) / r) }] });
  // eyes: two tall dark blocks; a blink now and then
  const blink = (B + key.length * 7) % 41 < 2, eh = o.mood === 'wow' ? r * 0.36 : r * 0.3;
  for (const s of [-1, 1]) { ctx.fillStyle = '#1d1712'; const ex = x + s * r * 0.42 - r * 0.07; if (blink) ctx.fillRect(ex, y - r * 0.1, r * 0.14, r * 0.05); else ctx.fillRect(ex, y - r * 0.08 - eh / 2, r * 0.14, eh); }
  return P;
}

// =====================================================================
//  STYLE — the renderer's hooks (see styles/cut-paper/kit.js for the contract)
// =====================================================================
const STYLE = {
  name: 'paperprint',
  paper: C.paper,
  backdrop(c) { paint(box(-40, -40, W + 80, H + 80), { raw: true, line: false, fill: c, key: 'backdrop', tex: [{ k: 'pencil', c: '#fffaf0', al: 0.35, per: 700, a: -0.6 }] }); },
  window(P, key, src) {   // the world seen through an inked hole with a hatched shadow
    const Q = wobble(P, true, 2.5, key, 9);
    ctx.save(); ctx.translate(10, 14); trace(Q, true); ctx.clip(); hatch(bbox(Q, 20), { key: key + 'sh', a: 0.8, gap: 5, al: 0.45 }); ctx.restore();
    ctx.save(); trace(Q, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore();
    ink(P, { closed: true, w: 4.5, key: key + 'rim', double: true });
  },
  blob(P, c, key) { paint(P, { fill: c, key, w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35 }, { k: 'pencil', c: '#fff6e0', al: 0.3, per: 80 }] }); },
  hero(x, y, r, o) { walker(x, y, r * 0.6, { ...o, key: o.key }); },
  heroColor: C.terra,
  heroPts: (x, y, r) => ellipsePts(x, y, r * 0.6, r * 0.6, 0, 96),
  post() { grain({ n: 1800, dark: 'rgba(70,45,25,0.08)', light: 'rgba(255,250,236,0.10)' }); },
};
