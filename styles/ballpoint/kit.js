// =====================================================================
//  styles/ballpoint/kit.js — dense coloured-pencil / ballpoint strokes, mostly horizontal, layered blues,
//  cream cumulus with lavender shading, crisp thin dark lines for structures, warm gold light and orange city glow.
//  Built on kit/core.js. Needs from the head: HAND, CX. Red (#d4382c) is reserved for the shipment.
// =====================================================================
const BP = {
  navy: '#151a48', navy2: '#1b2358', ink: '#283888', blue: '#2b58b9', mid: '#3995cb', cyan: '#57cad6', ice: '#96dad6',
  cream: '#ece6d3', creamW: '#f6f1e2', lav: '#8d8fd0', lavD: '#5b5fae', peach: '#f0b98a', orange: '#ef8f3c', gold: '#f2c84b',
  sun: '#fff1c2', line: '#1d2040', red: '#d4382c', redD: '#9e2219', grey: '#a9adc4', tar: '#3a3f63', glow: '#ffb347',
};
function bpHex(h) { if (h[0] !== '#') { const m = h.match(/\d+/g).map(Number); return m; } return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function bpMix(a, b, u) { const A = bpHex(a), Bb = bpHex(b); return '#' + A.map((v, i) => Math.round(v + (Bb[i] - v) * u).toString(16).padStart(2, '0')).join(''); }
function bpGrad(stops, y) {   // stops: [[y, '#hex'], ...] sorted by y
  if (y <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) if (y <= stops[i][0]) return bpMix(stops[i - 1][1], stops[i][1], (y - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
  return stops[stops.length - 1][1];
}
// the medium: a field of long, nearly horizontal strokes whose colour follows a vertical gradient
function bpStrokes(x0, y0, x1, y1, stops, o = {}) {
  const key = o.key || 'bps', S = RNG('bps', key), R = RNG('bpj', key, B);
  const n = o.n ?? Math.floor((x1 - x0) * (y1 - y0) / (o.per ?? 120)), a = o.a ?? 0, L0 = o.len?.[0] ?? 40, L1 = o.len?.[1] ?? 220;
  const buckets = new Map();
  for (let i = 0; i < n; i++) {
    const x = S.r(x0 - 40, x1), y = S.r(y0, y1), l = S.r(L0, L1), aa = a + S.n(o.spread ?? 0.025), p = S.f();
    let c = bpGrad(stops, y + S.n(o.mixY ?? 40));
    if (p < (o.light ?? 0.16)) c = bpMix(c, o.lightC || '#ffffff', 0.45); else if (p > 1 - (o.dark ?? 0.2)) c = bpMix(c, o.darkC || BP.navy, 0.35);
    const q = (c.slice(1).match(/../g).map((h) => (parseInt(h, 16) >> 3) << 3).map((v) => v.toString(16).padStart(2, '0')).join(''));
    if (!buckets.has(q)) buckets.set(q, []);
    buckets.get(q).push([x + R.n(1.2), y + R.n(0.8), x + Math.cos(aa) * l + R.n(1.2), y + Math.sin(aa) * l + R.n(0.8)]);
  }
  ctx.lineCap = 'round'; ctx.lineWidth = o.w ?? 2.2; ctx.globalAlpha = o.al ?? 0.85;
  for (const [q, segs] of buckets) { ctx.strokeStyle = '#' + q; ctx.beginPath(); for (const s of segs) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } ctx.stroke(); }
  ctx.globalAlpha = 1;
}
function bpSky(stops, o = {}) {   // full-bleed sky: a flat base, then the strokes
  ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, H); stops.forEach(([y, c]) => g.addColorStop(clamp(y / H), c)); ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, H + 120); ctx.restore();
  bpStrokes(-20, -20, W + 20, H + 20, stops, o);
}
function bpFill(P, stops, o = {}) {   // a shape filled with strokes, optional crisp outline
  ctx.save(); trace(P, true); ctx.fillStyle = o.base || bpGrad(stops, bbox(P).y0); ctx.fill(); ctx.clip();
  const bb = bbox(P, 4); bpStrokes(bb.x0, bb.y0, bb.x1, bb.y1, stops, { per: 90, len: [20, 120], ...o }); ctx.restore();
  if (o.line !== false) { ctx.strokeStyle = o.line || BP.line; ctx.lineWidth = o.lw ?? 2.2; ctx.lineJoin = 'round'; trace(o.wob === false ? P : wobble(P, true, 0.6, (o.key || 'f') + 'o'), true); ctx.stroke(); }
}
function bpLine(P, o = {}) { ink(P, { w: o.w ?? 2, color: o.c ?? BP.line, amt: o.amt ?? 0.35, key: o.key ?? 'bpl', frac: o.frac, closed: o.closed }); }
const bpRect = (x, y, w, h) => resample([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, 24);

// ---- cumulus: union of bumps, cream body, lavender shading toward the bottom right, peach rim on the lit side
function bpCloud(cx, cy, s, key, o = {}) {
  const R = RNG('cl', key), bumps = [];
  const n = o.n ?? 7;
  for (let i = 0; i < n; i++) { const u = i / (n - 1); bumps.push([cx + (u - 0.5) * 2 * s * (o.wide ?? 1.1) + R.n(s * 0.08), cy - Math.sin(u * Math.PI) * s * (o.tall ?? 0.55) + R.n(s * 0.05), s * (0.32 + Math.sin(u * Math.PI) * 0.28) * R.r(0.85, 1.1)]); }
  bumps.push([cx, cy + s * 0.1, s * 0.55]);
  const path = () => { ctx.beginPath(); for (const [x, y, r] of bumps) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); } };
  const J = RNG('clj', key, B);
  ctx.save(); ctx.lineWidth = o.lw ?? 3.2; ctx.strokeStyle = o.rim || BP.lav; for (const [x, y, r] of bumps) { ctx.beginPath(); ctx.arc(x + J.n(0.8), y + J.n(0.8), r, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = o.body || BP.cream; for (const [x, y, r] of bumps) { ctx.beginPath(); ctx.arc(x, y, r - 2.4, 0, TAU); ctx.fill(); }
  path(); ctx.clip();
  const bb = { x0: cx - s * 1.8, y0: cy - s * 1.2, x1: cx + s * 1.8, y1: cy + s * 0.8 };
  pencil(bb, { key: key + 'p', c: '#ffffff', al: 0.6, per: 60, a: -0.05, len: 40 });
  pencil(bb, { key: key + 's', c: o.shade || BP.lav, al: 0.55, per: 26, a: -0.08, len: 34, w: 1.8, dens: (x, y) => clamp((y - cy + s * 0.15) / (s * 0.6) + (x - cx) / (s * 3)) });
  if (o.warm) pencil(bb, { key: key + 'w', c: o.warm, al: 0.55, per: 40, a: -0.1, len: 30, dens: (x, y) => clamp((cy - y) / (s * 0.5) - (x - cx) / (s * 2)) });
  ctx.restore();
}

// ---- the hero: the shipment. A cream carton with a red band, a barcode label and stamps from each hand-off.
function bpCarton(x, y, s, o = {}) {
  const key = o.key || 'carton', d = s * 0.42, R = RNG('ct', key, B);
  y += Math.sin(TT * TAU * 0.8) * s * 0.012 * (o.bob ?? 1);
  SPARK_AT = toScreen(x, y);
  const front = bpRect(x - s / 2, y - s * 0.38, s, s * 0.76);
  const top = [[x - s / 2, y - s * 0.38], [x - s / 2 + d, y - s * 0.38 - d * 0.6], [x + s / 2 + d, y - s * 0.38 - d * 0.6], [x + s / 2, y - s * 0.38]];
  const side = [[x + s / 2, y - s * 0.38], [x + s / 2 + d, y - s * 0.38 - d * 0.6], [x + s / 2 + d, y + s * 0.38 - d * 0.6], [x + s / 2, y + s * 0.38]];
  if (o.shadow !== false) { ctx.save(); ctx.fillStyle = 'rgba(21,26,72,0.28)'; ctx.beginPath(); ctx.ellipse(x + d * 0.6, y + s * 0.4, s * 0.62, s * 0.08, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  bpFill(side, [[y - s, '#c9b48e'], [y + s, '#9c8562']], { key: key + 'sd', lw: Math.max(1.6, s * 0.012) });
  bpFill(resample(top, true, 12), [[y - s, '#f5ead0'], [y, '#e3d2ae']], { key: key + 'tp', lw: Math.max(1.6, s * 0.012) });
  bpFill(front, [[y - s / 2, '#e6d3ac'], [y + s / 2, '#cdb487']], { key: key + 'fr', lw: Math.max(1.8, s * 0.014) });
  // the red band: the one colour that means "this shipment"
  const bw = s * 0.16;
  bpFill(bpRect(x - bw / 2, y - s * 0.38, bw, s * 0.76), [[y - s, BP.red], [y + s, BP.redD]], { key: key + 'band', lw: Math.max(1.2, s * 0.008), lightC: '#ff9a8a' });
  bpFill(resample([[x - bw / 2, y - s * 0.38], [x - bw / 2 + d, y - s * 0.38 - d * 0.6], [x + bw / 2 + d, y - s * 0.38 - d * 0.6], [x + bw / 2, y - s * 0.38]], true, 8), [[y - s, BP.red], [y, BP.redD]], { key: key + 'bandt', lw: Math.max(1.2, s * 0.008) });
  // label with a barcode
  const lx = x - s * 0.44, ly = y - s * 0.05, lw = s * 0.3, lh = s * 0.3;
  ctx.fillStyle = BP.creamW; ctx.fillRect(lx, ly, lw, lh); ctx.strokeStyle = BP.line; ctx.lineWidth = Math.max(1, s * 0.006); ctx.strokeRect(lx, ly, lw, lh);
  const BC = RNG('bc', key); ctx.fillStyle = BP.line; for (let bx = lx + lw * 0.1; bx < lx + lw * 0.9; bx += lw * 0.045) if (BC.f() < 0.7) ctx.fillRect(bx, ly + lh * 0.12, lw * BC.r(0.012, 0.03), lh * 0.45);
  ctx.fillRect(lx + lw * 0.1, ly + lh * 0.7, lw * 0.6, Math.max(1, lh * 0.05)); ctx.fillRect(lx + lw * 0.1, ly + lh * 0.82, lw * 0.4, Math.max(1, lh * 0.05));
  // stamps: one per hand-off so far
  for (let i = 0; i < (o.stamps ?? 0); i++) {
    const sx = x + s * 0.2 + (i % 2) * s * 0.16, sy = y - s * 0.24 + Math.floor(i / 2) * s * 0.16, sr = s * 0.065;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(RNG('stp', key, i).n(0.5)); ctx.strokeStyle = 'rgba(40,56,136,0.85)'; ctx.lineWidth = Math.max(1, s * 0.008);
    ctx.beginPath(); ctx.arc(0, 0, sr, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, sr * 0.62, 0, TAU); ctx.stroke(); ctx.restore();
  }
}

// ---- light: sun disc, gold rays, stars
function bpSun(x, y, r, key, o = {}) {
  ctx.save(); const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * (o.halo ?? 2.4)); g.addColorStop(0, 'rgba(255,240,190,0.7)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); ctx.restore();
  bpFill(ellipsePts(x, y, r, r, 0, 48), [[y - r, o.c0 || BP.sun], [y + r, o.c1 || BP.orange]], { key, line: o.line ?? false, a: -0.6, spread: 0.3, len: [10, 50], light: 0.3 });
}
function bpRays(x, y, n, len, key, o = {}) {
  const S = RNG('ray', key), J = RNG('rayj', key, B);
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = (o.a0 ?? Math.PI) + S.f() * (o.span ?? Math.PI) + J.n(0.004), l = len * S.r(0.5, 1.1), w = S.r(1, 3.4);
    ctx.strokeStyle = S.f() < 0.75 ? (o.c || BP.gold) : '#fff6d8'; ctx.globalAlpha = S.r(0.45, 0.9) * (o.al ?? 1); ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * len * 0.05, y + Math.sin(a) * len * 0.05); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  ctx.restore();
}
function bpStars(n, key, y1 = H * 0.5, o = {}) {
  const S = RNG('stars', key);
  for (let i = 0; i < n; i++) { const tw = 0.7 + 0.3 * ((B + i) % 3) / 2; star4(S.r(20, W - 20), S.r(20, y1), S.r(3, o.big ?? 9) * tw, o.c || '#fdf6dc'); }
}

// ---- ground and town
function bpPole(x, y0, y1, key) {
  bpFill(bpRect(x - 9, y0, 18, y1 - y0), [[y0, '#c9cbe0'], [y1, '#6c70a8']], { key: key + 'p', lw: 1.8, a: Math.PI / 2, len: [20, 80] });
  for (const [dy, w] of [[30, 150], [90, 110]]) { bpFill(bpRect(x - w / 2, y0 + dy, w, 10), [[0, '#3a3f63'], [H, '#3a3f63']], { key: key + 'x' + dy, lw: 1.4 }); for (const s of [-1, 1]) { ctx.fillStyle = '#f4f6ff'; ctx.beginPath(); ctx.ellipse(x + s * w * 0.38, y0 + dy - 8, 6, 10, 0, 0, TAU); ctx.fill(); } }
}
function bpWire(x0, y0, x1, y1, sag, key, o = {}) { const P = []; for (let i = 0; i <= 24; i++) { const u = i / 24; P.push([lerp(x0, x1, u), lerp(y0, y1, u) + Math.sin(u * Math.PI) * sag]); } bpLine(P, { w: o.w ?? 1.8, key, c: o.c }); }
function bpHouse(x, y, w, h, key, o = {}) {   // y = ground line
  const roofH = h * 0.55;
  bpFill(bpRect(x, y - h, w, h), [[y - h, o.wall || '#efe7d2'], [y, '#cfc6b4']], { key: key + 'w', lw: 1.8, a: Math.PI / 2, spread: 0.05, len: [10, 40] });
  bpFill(resample([[x - w * 0.08, y - h], [x + w / 2, y - h - roofH], [x + w * 1.08, y - h]], true, 14), [[y - h - roofH, o.roof || BP.blue], [y - h, BP.navy2]], { key: key + 'r', lw: 1.8, a: -0.5 });
  const lit = o.lit;
  for (let k = 0; k < 2; k++) { const wx = x + w * (0.18 + k * 0.42), wy = y - h * 0.72; ctx.fillStyle = lit ? '#ffcf6a' : '#6e78b8'; ctx.fillRect(wx, wy, w * 0.22, h * 0.3); ctx.strokeStyle = BP.line; ctx.lineWidth = 1.4; ctx.strokeRect(wx, wy, w * 0.22, h * 0.3); }
}
function bpTree(x, y, r, key) { for (let k = 0; k < 3; k++) { const R = RNG('tr', key, k); bpFill(ellipsePts(x + R.n(r * 0.4), y - r - k * r * 0.35, r * R.r(0.7, 1), r * 0.7, 0, 24), [[y - r * 2, '#4f9a76'], [y, '#235a52']], { key: key + k, lw: 1.4, a: -0.4, spread: 0.4, len: [8, 30] }); } }

// ---- vehicles
function bpPlane(x, y, L, rot, key, o = {}) {   // a twin-engine freighter, side view, nose to the right; (x, y) = centre
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const h = L * 0.11;
  const body = resample([[-L * 0.5, -h * 0.25], [-L * 0.42, -h * 0.5], [L * 0.36, -h * 0.5], [L * 0.47, -h * 0.32], [L * 0.5, 0], [L * 0.47, h * 0.3], [L * 0.36, h * 0.5], [-L * 0.3, h * 0.5], [-L * 0.48, h * 0.05]], true, 16);
  const fin = resample([[-L * 0.47, -h * 0.3], [-L * 0.5, -h * 1.75], [-L * 0.42, -h * 1.75], [-L * 0.3, -h * 0.5]], true, 12);
  const wing = resample([[-L * 0.02, h * 0.2], [L * 0.12, h * 0.2], [-L * 0.12, h * 0.95], [-L * 0.2, h * 0.95]], true, 12);
  const eng = (ex) => resample([[ex - L * 0.06, h * 0.55], [ex + L * 0.06, h * 0.5], [ex + L * 0.06, h * 1.05], [ex - L * 0.06, h * 1.0]], true, 8);
  const lit = o.night ? [[-h, '#b8bfe0'], [h, '#4c548c']] : [[-h, '#ffffff'], [h, '#a9adc4']];
  bpFill(fin, lit, { key: key + 'f', lw: 2, a: 0, len: [20, 90] });
  bpFill(body, lit, { key: key + 'b', lw: 2.2, a: 0, len: [30, 160] });
  bpFill(wing, lit, { key: key + 'w', lw: 1.8 });
  bpFill(eng(L * 0.02), [[0, '#d9dcec'], [h, '#6b6f97']], { key: key + 'e', lw: 1.8 });
  ctx.fillStyle = BP.navy; for (let k = 0; k < 4; k++) ctx.fillRect(L * 0.4 + k * h * 0.12, -h * 0.28, h * 0.09, h * 0.12);
  bpLine([[-L * 0.42, h * 0.05], [L * 0.44, h * 0.05]], { w: 2.2, c: BP.ink, key: key + 'stripe' });
  if (o.gear) { for (const gx of [L * 0.3, -L * 0.08]) { bpLine([[gx, h * 0.5], [gx, h * 0.5 + o.gear]], { w: 4, key: key + 'g' + gx }); ctx.fillStyle = BP.line; ctx.beginPath(); ctx.arc(gx, h * 0.5 + o.gear, h * 0.2, 0, TAU); ctx.fill(); } }
  if (o.lights) { ctx.fillStyle = (B % 6) < 3 ? '#ff5050' : '#ffe0e0'; ctx.beginPath(); ctx.arc(-L * 0.46, -h * 1.7, 5, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function bpTruck(x, y, s, key, o = {}) {   // box truck, side view, facing right; y = ground; a window in the box shows the cargo
  const L = s * 2.6;
  bpFill(bpRect(x - L / 2, y - s * 1.15, L * 0.72, s), [[y - s, '#f2ecdc'], [y, '#c9c1ad']], { key: key + 'box', lw: 2.2, a: 0, len: [30, 120] });
  bpFill(resample([[x + L * 0.25, y - s * 0.15], [x + L * 0.25, y - s * 0.85], [x + L * 0.4, y - s * 0.85], [x + L * 0.5, y - s * 0.5], [x + L * 0.5, y - s * 0.15]], true, 12), [[y - s, o.cab || BP.mid], [y, BP.blue]], { key: key + 'cab', lw: 2.2 });
  ctx.fillStyle = '#d7f0f4'; ctx.fillRect(x + L * 0.3, y - s * 0.78, L * 0.11, s * 0.28);
  for (const wx of [x - L * 0.35, x - L * 0.05, x + L * 0.38]) { ctx.fillStyle = BP.line; ctx.beginPath(); ctx.arc(wx, y - s * 0.12, s * 0.16, 0, TAU); ctx.fill(); ctx.fillStyle = BP.grey; ctx.beginPath(); ctx.arc(wx, y - s * 0.12, s * 0.07, 0, TAU); ctx.fill(); }
  bpLine([[x - L / 2, y - s * 0.15], [x + L * 0.5, y - s * 0.15]], { w: 3, key: key + 'ch' });
}
function bpULD(x, y, s, key, o = {}) {   // an AKE container, side view: one lower corner contoured; y = base
  const P = resample([[x - s * 0.5, y], [x + s * 0.28, y], [x + s * 0.5, y - s * 0.32], [x + s * 0.5, y - s * 0.84], [x - s * 0.5, y - s * 0.84]], true, 14);
  bpFill(P, [[y - s, '#e4e7f2'], [y, '#8b90b4']], { key: key + 'u', lw: 2.4, a: Math.PI / 2, len: [20, 80], spread: 0.04 });
  for (let k = 1; k < 5; k++) bpLine([[x - s * 0.5 + k * s * 0.2, y - s * 0.84], [x - s * 0.5 + k * s * 0.2, k > 3 ? y - s * 0.2 : y]], { w: 1.2, c: 'rgba(29,32,64,0.45)', key: key + 'r' + k });
  if (o.label) { ctx.fillStyle = BP.creamW; ctx.fillRect(x - s * 0.4, y - s * 0.74, s * 0.34, s * 0.12); ctx.fillStyle = BP.line; ctx.font = `700 ${s * 0.07}px ${MONO}`; ctx.fillText(o.label, x - s * 0.37, y - s * 0.65); }
  return P;
}

// ---- night earth: a curved horizon with an atmosphere rim, city glow, routes
function bpGlobe(cy, R, key, o = {}) {
  const cx = W * 0.5, P = ellipsePts(cx, cy, R, R, 0, 120);
  ctx.save(); trace(P, true); ctx.fillStyle = '#1b2358'; ctx.fill(); ctx.clip();
  bpStrokes(cx - R, cy - R, cx + R, cy - R + H, [[cy - R, '#3a4aa0'], [cy - R + 600, '#151a48']], { key: key + 'g', per: 70, a: -0.12, len: [30, 140], light: 0.1 });
  const S = RNG('city', key);
  for (let i = 0; i < (o.cities ?? 60); i++) {
    const a = S.r(-0.9, 0.9) - Math.PI / 2, rr = S.r(R * 0.75, R * 0.995), x = cx + Math.cos(a) * rr * 1.25, y = cy + Math.sin(a) * rr;
    if (y < cy - R + 10) continue;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 26); g.addColorStop(0, 'rgba(255,190,90,0.75)'); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.fillRect(x - 26, y - 26, 52, 52);
    ctx.fillStyle = '#ffd98a'; for (let k = 0; k < 6; k++) { const J = RNG('cj', key, i, k); ctx.fillRect(x + J.n(12), y + J.n(7), 2.4, 2.4); }
  }
  ctx.restore();
  ink(arcPts(cx, cy, R + 6, -Math.PI * 0.95, -Math.PI * 0.05, 60), { w: 10, color: 'rgba(87,202,214,0.35)', key: key + 'atm' });
  ink(arcPts(cx, cy, R, -Math.PI * 0.95, -Math.PI * 0.05, 60), { w: 3, color: '#cfeff2', key: key + 'rim', amt: 0.3 });
}
function bpArc(x0, y0, x1, y1, hgt, key, o = {}) { const P = []; for (let i = 0; i <= 40; i++) { const u = i / 40; P.push([lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(u * Math.PI) * hgt]); } ink(P, { w: o.w ?? 2.4, color: o.c ?? 'rgba(150,230,235,0.85)', key, amt: 0.3, frac: o.frac }); return P; }

// ---- captions: a shipping tag on a string, lower left; step number in mono, the step name by hand
function bpTag(num, str) {
  const f = () => {
    const s = popS(E0 + 0.25); if (s <= 0.01) return;
    const x = 70, y = H - 210, w = Math.max(300, handW(str, 64) + 150), h = 120;
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.035); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(21,26,72,0.35)'; ctx.fillRect(8, 10, w, h);
    const P = resample([[0, 0], [w - 30, 0], [w, h / 2], [w - 30, h], [0, h]], true, 14);
    bpFill(P, [[0, BP.creamW], [h, '#e3d9bf']], { key: 'tag' + str, lw: 2.4, len: [20, 90] });
    ctx.beginPath(); ctx.arc(w - 40, h / 2, 10, 0, TAU); ctx.fillStyle = BP.navy; ctx.fill();
    bpLine([[w - 40, h / 2], [w + 40, h / 2 - 50], [w + 90, h / 2 - 140]], { w: 2, c: '#8a6a4a', key: 'tagstr' });
    monoText(num, 26, 50, 30, BP.red, { key: 'tn' + num });
    handText(str, 26 + monoW(30) * 2.6, 82, 64, BP.line, { key: 'tt' + str, frac: ev(E0 + 0.4, 0.5) });
    ctx.restore();
  };
  if (DEFER) DEFER.push(f); else f();
}
function handText(str, x, y, size, color, o = {}) {
  ctx.save(); const R = RNG('ht', o.key ?? str, B); ctx.translate(x + R.n(0.6), y + R.n(0.6));
  ctx.font = `${o.weight ?? 400} ${size}px ${HAND}`; ctx.fillStyle = color; const w = ctx.measureText(str).width, frac = clamp(o.frac ?? 1);
  if (frac <= 0) { ctx.restore(); return w; }
  if (frac < 1) { ctx.beginPath(); ctx.rect(-4, -size * 1.2, w * frac + 4, size * 1.7); ctx.clip(); }
  ctx.fillText(str, 0, 0); ctx.restore(); return w;
}
function handW(str, size) { ctx.save(); ctx.font = `400 ${size}px ${HAND}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }

// =====================================================================
//  STYLE hooks
// =====================================================================
const STYLE = {
  name: 'ballpoint',
  paper: '#ece6d3',
  backdrop(c) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); bpStrokes(0, 0, W, H, [[0, c[0] === '#' ? c : '#ece6d3'], [H, c[0] === '#' ? c : '#ece6d3']], { key: 'bd', per: 300, al: 0.5 }); },
  window(P, key, src) { ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore(); ctx.strokeStyle = BP.creamW; ctx.lineWidth = 4; trace(wobble(P, true, 1.2, key), true); ctx.stroke(); },
  blob(P, c, key) { bpFill(P, [[0, c[0] === '#' ? c : BP.cream], [H, c[0] === '#' ? c : BP.cream]], { key, lw: 3 }); },
  hero(x, y, r, o) { bpCarton(x, y, r * 1.6, { ...o, key: o.key }); },
  heroColor: '#d4382c',
  heroPts: (x, y, r) => ellipsePts(x, y, r, r * 0.8, 0, 96),
  post() { grain({ n: 1800 }); },
};
