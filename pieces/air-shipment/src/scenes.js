// =====================================================================
//  SCENES — one air shipment, 1080x1350. Red (#d4382c) only ever marks the shipment.
// =====================================================================
const DAWN = [[0, '#1b2358'], [260, '#283888'], [520, '#2b58b9'], [700, '#3995cb'], [800, '#f0b98a'], [900, '#ef8f3c']];
const DUSK = [[0, '#151a48'], [300, '#283888'], [560, '#5b5fae'], [740, '#e07a6a'], [860, '#ef8f3c'], [920, '#f2c84b']];

function bpCutaway(x, y, s, key, stamps) {   // a window cut into the fuselage: the ULD and the red-band carton inside
  const P = ellipsePts(x, y, s, s * 0.62, 0, 40);
  ctx.save(); trace(P, true); ctx.fillStyle = BP.navy2; ctx.fill(); ctx.clip();
  bpStrokes(x - s, y - s, x + s, y + s, [[y - s, '#2b3a7a'], [y + s, '#10132e']], { key: key + 'in', per: 60 });
  bpULD(x - s * 0.25, y + s * 0.5, s * 1.1, key + 'u');
  bpCarton(x + s * 0.35, y + s * 0.22, s * 0.62, { key: key + 'c', stamps, shadow: false, bob: 0 });
  ctx.restore();
  ctx.strokeStyle = BP.creamW; ctx.lineWidth = 4; trace(wobble(P, true, 1, key + 'rim'), true); ctx.stroke();
}

function scenePickup() {
  bpSky([[0, '#2b58b9'], [300, '#3995cb'], [700, '#57cad6'], [900, '#96dad6']], { key: 'day' });
  bpCloud(820, 420, 230, 'cB1', { tall: 0.7 });
  bpCloud(200, 300, 140, 'cB2');
  bpCloud(560, 760, 120, 'cB3', { tall: 0.4 });
  // houses behind the road
  for (let k = 0; k < 6; k++) bpHouse(-40 + k * 200, 1000, 150, 90, 'hb' + k, { roof: k % 2 ? BP.blue : BP.ink });
  for (let k = 0; k < 4; k++) bpTree(120 + k * 260, 1000, 40, 'tb' + k);
  // road
  bpStrokes(-20, 1000, W + 20, H + 20, [[1000, '#8b90b4'], [1150, '#5b5fae'], [1350, '#3a3f63']], { key: 'road', per: 70 });
  for (let k = 0; k < 6; k++) { const x = mod(k * 240 - TT * 120, W + 240) - 120; ctx.fillStyle = BP.creamW; ctx.fillRect(x, 1188, 120, 10); }
  // poles and wires (the reference's sky lines, here the road out of town)
  bpPole(200, 260, 1010, 'p1'); bpPole(900, 220, 1000, 'p2');
  for (const [a, b, s] of [[290, 250, 70], [320, 280, 80], [350, 310, 60], [400, 350, 90]]) { bpWire(-40, a + 40, 200, a, s * 0.3, 'w0' + a); bpWire(200, a, 900, b, s, 'w1' + a); bpWire(900, b, W + 40, b + 60, s * 0.4, 'w2' + a); }
  // the truck, the carton visible through the open curtain
  const tx = 300 + (TT - 4) * 70, ty = 1150;
  bpTruck(tx, ty, 190, 'truck');
  ctx.fillStyle = BP.navy2; ctx.fillRect(tx - 230, ty - 200, 230, 150);
  bpCarton(tx - 120, ty - 112, 120, { key: 'hero', stamps: 1, shadow: false });
  bpTag('02', 'Pickup');
}

function sceneConsol() {
  // the hub interior: blue wall, warm lamps
  bpSky([[0, '#151a48'], [500, '#283888'], [900, '#2b58b9']], { key: 'hub', per: 100 });
  for (let k = 0; k < 4; k++) { const x = 140 + k * 270; bpLine([[x, 0], [x, 120]], { w: 2, c: '#8b90b4', key: 'lc' + k }); bpRays(x, 140, 28, 900, 'lamp' + k, { a0: Math.PI * 0.32, span: Math.PI * 0.36, al: 0.35 }); ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.ellipse(x, 135, 40, 14, 0, 0, TAU); ctx.fill(); }
  // racking behind
  for (let k = 0; k < 5; k++) { bpLine([[60 + k * 240, 380], [60 + k * 240, 930]], { w: 3, c: '#ef8f3c', key: 'rk' + k }); }
  for (let r = 0; r < 3; r++) { bpLine([[40, 440 + r * 170], [W - 40, 440 + r * 170]], { w: 3, c: '#ef8f3c', key: 'rh' + r }); for (let k = 0; k < 9; k++) { const R = RNG('rb', r, k); bpFill(bpRect(80 + k * 112, 440 + r * 170 - R.r(50, 90), R.r(70, 100), R.r(50, 90) - 4), [[0, '#cdb487'], [H, '#9c8562']], { key: 'rbx' + r + k, lw: 1.4 }); } }
  // floor
  bpStrokes(-20, 930, W + 20, H + 20, [[930, '#5b5fae'], [1350, '#20285e']], { key: 'hubfl', per: 80 });
  // the ULD being built: plain cartons stacked, ours goes on top
  const ux = 540, uy = 1210, us = 620;
  const P = bpULD(ux, uy, us, 'uld', { label: 'AKE 0471' });
  ctx.save(); trace(P, true); ctx.clip();
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { if (r === 2 && k > 1) continue; bpFill(bpRect(ux - 290 + k * 140, uy - 140 - r * 135, 132, 128), [[0, '#e6d3ac'], [H, '#b39a6e']], { key: 'cc' + r + k, lw: 1.6 }); }
  ctx.restore();
  const drop = EZ.o2(ev(10.2, 1.4));
  bpCarton(ux + 150, lerp(uy - 760, uy - 470, drop), 150, { key: 'hero', stamps: 2, shadow: false });
  // the net, half pulled over
  ctx.save(); ctx.strokeStyle = 'rgba(239,143,60,0.8)'; ctx.lineWidth = 2;
  for (let k = 0; k < 10; k++) { ctx.beginPath(); ctx.moveTo(ux - 300 + k * 30, uy - 520); ctx.lineTo(ux - 300 + k * 30 + 60, uy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ux - 300 + k * 30 + 60, uy - 520); ctx.lineTo(ux - 300 + k * 30, uy); ctx.stroke(); }
  ctx.restore();
  bpTag('03', 'Consol');
}

function sceneUplift() {
  bpSky([[0, '#10132e'], [500, '#151a48'], [820, '#283888']], { key: 'ramp' });
  bpStars(40, 'ramp', 420);
  // floodlights
  for (const fx of [140, 980]) { bpLine([[fx, 160], [fx, 900]], { w: 5, c: '#8b90b4', key: 'fl' + fx }); bpRays(fx, 170, 50, 1100, 'flr' + fx, { a0: Math.PI * 0.25, span: Math.PI * 0.5, al: 0.3, c: '#fff1c2' }); ctx.fillStyle = '#fff6d8'; ctx.fillRect(fx - 40, 150, 80, 30); }
  // the wet ramp
  bpStrokes(-20, 900, W + 20, H + 20, [[900, '#3a3f63'], [1350, '#10132e']], { key: 'tarmac', per: 70, light: 0.08 });
  bpStrokes(380, 920, 1080, 1200, [[900, '#8b90b4'], [1200, '#3a3f63']], { key: 'refl', per: 400, al: 0.5 });
  // the freighter, too big for the frame: belly door open
  bpPlane(700, 520, 1300, 0, 'big', { lights: true, gear: 230 });
  ctx.fillStyle = '#ffcf6a'; ctx.fillRect(470, 545, 170, 120); ctx.strokeStyle = BP.line; ctx.lineWidth = 3; ctx.strokeRect(470, 545, 170, 120);
  // the loader rising with the ULD
  const up = EZ.io(ev(14.4, 2.6)), ly = lerp(1000, 690, up);
  bpFill(bpRect(380, ly, 360, 36), [[0, '#f2c84b'], [H, '#c99a2a']], { key: 'ldtop', lw: 2 });
  for (let k = 0; k < 2; k++) bpLine([[400 + k * 320, ly + 36], [720 - k * 320, 1080]], { w: 6, c: '#f2c84b', key: 'sc' + k });
  bpFill(bpRect(360, 1080, 400, 60), [[0, '#f2c84b'], [H, '#8a6a20']], { key: 'ldb', lw: 2 });
  bpULD(560, ly, 260, 'uldU');
  bpXray(530, ly - 120, 70, 'xU', 3);
  bpTag('04', 'Uplift');
}

function sceneClimb() {
  bpSky([[0, '#283888'], [300, '#2b58b9'], [700, '#3995cb'], [1100, '#57cad6']], { key: 'climb' });
  bpCloud(160, 1180, 260, 'cC1', { tall: 0.8 }); bpCloud(980, 1000, 220, 'cC2', { tall: 0.9 });
  bpCloud(900, 260, 120, 'cC3'); bpCloud(120, 420, 90, 'cC4');
  // contrail puffs down-left behind the plane
  const px = 600 + (TT - 18) * 22, py = 560 - (TT - 18) * 30;
  for (let k = 0; k < 9; k++) { const u = k / 8; bpCloud(px - 230 - u * 520, py + 140 + u * 380, 34 + u * 40, 'tr' + k, { n: 4, tall: 0.3, wide: 0.8 }); }
  bpPlane(px, py, 620, -0.38, 'climb', { lights: true });
  bpCutaway(px - 30, py + 10, 70, 'cutC', 4);
  bpTag('05', 'Main leg');
}

function sceneCruise() {
  bpSky([[0, '#1b2358'], [260, '#283888'], [520, '#2b58b9'], [760, '#57cad6'], [880, '#f2c84b'], [960, '#ef8f3c']], { key: 'cruise' });
  bpStars(18, 'cruise', 260);
  bpRays(600, 960, 70, 1100, 'raysC', { al: 0.75 });
  bpSun(600, 975, 70, 'sunC', { halo: 4 });
  // the cloud sea: rows of warm cumulus, smaller toward the horizon
  for (let r = 0; r < 5; r++) for (let k = 0; k < 7 - r; k++) { const R = RNG('sea', r, k), s = 150 - r * 22; bpCloud(-60 + k * (1200 / (7 - r)) + R.n(40) + (r % 2) * 80, 1350 - r * 80 + R.n(10), s, 'sea' + r + k, { warm: BP.peach, shade: '#c99ad0', n: 5, tall: 0.35 }); }
  const px = 360 + (TT - 23) * 30;
  bpLine([[px - 1200, 482], [px - 220, 482]], { w: 3, c: 'rgba(255,255,255,0.7)', key: 'cont1' });
  bpLine([[px - 1200, 494], [px - 220, 494]], { w: 2, c: 'rgba(255,255,255,0.5)', key: 'cont2' });
  bpPlane(px, 480, 460, 0, 'cruise', { lights: true });
  bpCutaway(px - 40, 482, 56, 'cutR', 4);
  bpTag('05', 'Main leg');
}

function sceneLastMile() {
  bpSky([[0, '#283888'], [400, '#5b5fae'], [700, '#e07a6a'], [900, '#f0b98a']], { key: 'eve' });
  bpCloud(780, 330, 160, 'cL1', { warm: BP.peach, body: '#f3d9c4', tall: 0.5 });
  bpCloud(200, 480, 110, 'cL2', { warm: BP.peach, body: '#f3d9c4' });
  for (let k = 0; k < 5; k++) bpHouse(-30 + k * 230, 1010, 190, 150, 'hl' + k, { roof: k % 2 ? BP.ink : BP.blue, lit: true });
  for (let k = 0; k < 3; k++) bpTree(200 + k * 360, 1010, 50, 'tl' + k);
  for (const lx of [100, 640]) { bpLine([[lx, 640], [lx, 1030]], { w: 5, c: '#3a3f63', key: 'lamp' + lx }); ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(lx, 640, 16, 0, TAU); ctx.fill(); bpRays(lx, 640, 18, 160, 'lr' + lx, { a0: 0, span: TAU, al: 0.5 }); }
  bpStrokes(-20, 1010, W + 20, H + 20, [[1010, '#8b90b4'], [1350, '#3a3f63']], { key: 'street', per: 70 });
  // the van, back window showing the carton
  const vx = 260 + (TT - 33) * 70, vy = 1180;
  bpFill(resample([[vx - 220, vy - 40], [vx - 220, vy - 250], [vx + 120, vy - 250], [vx + 220, vy - 150], [vx + 220, vy - 40]], true, 14), [[vy - 250, '#f6f1e2'], [vy, '#a9adc4']], { key: 'van', lw: 2.4 });
  ctx.fillStyle = BP.navy2; ctx.fillRect(vx - 200, vy - 230, 150, 120);
  bpCarton(vx - 125, vy - 160, 90, { key: 'hero', stamps: 6, shadow: false });
  ctx.fillStyle = '#d7f0f4'; ctx.fillRect(vx + 120, vy - 230, 70, 70);
  for (const wx of [vx - 130, vx + 140]) { ctx.fillStyle = BP.line; ctx.beginPath(); ctx.arc(wx, vy - 30, 44, 0, TAU); ctx.fill(); ctx.fillStyle = BP.grey; ctx.beginPath(); ctx.arc(wx, vy - 30, 18, 0, TAU); ctx.fill(); }
  bpTag('07', 'Last mile');
}

function scenePOD() {
  bpSky(DUSK, { key: 'dusk' });
  bpStars(40, 'dusk', 420);
  bpRays(250, 900, 30, 700, 'raysZ', { al: 0.3, c: '#f0b98a' });
  bpSun(250, 900, 150, 'sunZ', { c0: '#ffd98a', c1: '#e05a3a' });
  bpCloud(900, 380, 150, 'cA1', { warm: '#e07a6a', body: '#f0d2c2', tall: 0.45 });
  // the same framing as the opening; the warehouse is now a house, its door lit
  bpFill(bpRect(420, 650, 700, 260), [[650, '#2b3270'], [910, '#1b2358']], { key: 'hs', lw: 2 });
  bpFill(resample([[400, 650], [760, 560], [1100, 650]], true, 16), [[560, '#283888'], [650, '#1b2358']], { key: 'hsr', lw: 2 });
  bpFill(bpRect(600, 740, 140, 170), [[740, '#ffd98a'], [910, '#ef8f3c']], { key: 'hdoor', lw: 2, light: 0.3 });
  for (const wx of [470, 850, 950]) { ctx.fillStyle = '#ffcf6a'; ctx.fillRect(wx, 720, 60, 60); }
  bpStrokes(-20, 905, W + 20, H + 20, [[905, '#5b5fae'], [1100, '#3a3f63'], [1350, '#20285e']], { key: 'dock', per: 80 });
  bpLine([[0, 908], [W, 906]], { w: 2.4, key: 'dockedge' });
  // the doormat and the carton, every stamp collected
  bpFill(bpRect(290, 1150, 360, 50), [[1150, '#b0616a'], [1200, '#7a3a40']], { key: 'mat', lw: 2 });
  bpCarton(470, 1010, 270, { key: 'hero', stamps: 8 });
  // the signature on a handheld, written on
  ctx.save(); ctx.translate(880, 1060); ctx.rotate(0.08);
  bpFill(bpRect(-110, -150, 220, 300), [[-150, '#3a3f63'], [150, '#10132e']], { key: 'hh', lw: 2.4 });
  ctx.fillStyle = BP.creamW; ctx.fillRect(-90, -120, 180, 200);
  const sig = []; for (let i = 0; i <= 40; i++) { const u = i / 40; sig.push([-70 + u * 140, 10 + Math.sin(u * 14) * 22 * (1 - u * 0.5) - u * 20]); }
  bpLine(sig, { w: 3, c: BP.line, key: 'sig', frac: ev(40, 1.6) });
  monoText('POD', -70, -80, 26, BP.line, { key: 'podt' });
  ctx.restore();
  bpTag('08', 'POD');
}
function bpXray(x, y, r, key, stamps) {   // a round x-ray window: the red-band carton inside whatever carries it
  const P = ellipsePts(x, y, r, r, 0, 36);
  ctx.save(); trace(P, true); ctx.fillStyle = BP.navy2; ctx.fill(); ctx.clip();
  bpStrokes(x - r, y - r, x + r, y + r, [[y - r, '#2b3a7a'], [y + r, '#10132e']], { key: key + 'in', per: 60 });
  bpCarton(x - r * 0.1, y + r * 0.15, r * 1.1, { key: key + 'c', stamps, shadow: false, bob: 0 });
  ctx.restore(); ctx.strokeStyle = BP.creamW; ctx.lineWidth = 4; trace(wobble(P, true, 1, key + 'rim'), true); ctx.stroke();
}

function sceneBooking() {
  // the opening hero shot: a huge dawn sun on the horizon, its reflection running up the wet dock to the carton
  bpSky(DAWN, { key: 'dawn' });
  bpStars(30, 'dawn', 360);
  bpRays(540, 860, 60, 1000, 'raysA', { al: 0.4 });
  bpSun(540, 860, 230, 'sunA');
  bpCloud(170, 470, 150, 'cA1', { warm: BP.peach, tall: 0.45 });
  bpCloud(930, 380, 120, 'cA2', { warm: BP.peach, tall: 0.5 });
  // the shipper's warehouse and a dock crane, silhouettes at the edges
  bpFill(bpRect(780, 690, 340, 200), [[690, '#20285e'], [890, '#151a48']], { key: 'wh', lw: 2 });
  bpFill(resample([[760, 690], [950, 640], [1120, 690]], true, 12), [[640, '#283888'], [690, '#1b2358']], { key: 'whr', lw: 2 });
  for (let k = 0; k < 3; k++) { ctx.fillStyle = (B + k * 5) % 14 < 7 ? '#ffd98a' : '#8a7a50'; ctx.fillRect(820 + k * 80, 760, 30, 30); }
  bpLine([[110, 880], [110, 520], [330, 520]], { w: 7, c: '#1b2358', key: 'crane' });
  bpLine([[110, 600], [200, 520]], { w: 4, c: '#1b2358', key: 'crane2' });
  bpLine([[300, 520], [300, 640 + Math.sin(TT * 2) * 6]], { w: 2, c: '#1b2358', key: 'craneh' });
  // the sea and the dock: the sun's reflection as a column of short gold strokes
  bpStrokes(-20, 880, W + 20, H + 20, [[880, '#3a3f63'], [1100, '#283888'], [1350, '#151a48']], { key: 'sea', per: 70, light: 0.1 });
  bpStrokes(380, 885, 700, 1350, [[880, '#ffe9a8'], [1350, '#ef8f3c']], { key: 'refl', per: 260, len: [20, 90], al: 0.8 });
  bpLine([[0, 884], [W, 882]], { w: 2.4, key: 'horizon' });
  // pallet + the carton, centred on the sun's path
  bpFill(bpRect(350, 1150, 380, 40), [[1150, '#d6a466'], [1190, '#a8773f']], { key: 'pal', lw: 2 });
  for (let k = 0; k < 3; k++) bpFill(bpRect(370 + k * 150, 1190, 40, 34), [[1190, '#a8773f'], [1224, '#7a5530']], { key: 'palb' + k, lw: 1.6 });
  bpCarton(540, 1010, 280, { key: 'hero', stamps: 0 });
  // the booking: a large slip types itself out above the carton
  const sx = 640, sy = 560, show = EZ.o2(ev(0.4, 0.6));
  if (show > 0) {
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(0.05); ctx.scale(show, show);
    ctx.fillStyle = 'rgba(21,26,72,0.35)'; ctx.fillRect(10, 12, 300, 210);
    bpFill(bpRect(0, 0, 300, 210), [[0, BP.creamW], [210, '#e3d9bf']], { key: 'slip', lw: 2.2, len: [20, 90] });
    const lines = ['BOOKING', 'GEN CARGO', '1 PC  14 KG', 'READY 06:00'];
    lines.forEach((s, i) => monoText(s, 22, 46 + i * 42, i ? 24 : 32, i ? BP.line : BP.red, { key: 'bk' + i, count: Math.floor(clamp((TT - 0.8 - i * 0.35) / 0.35) * s.length) }));
    ctx.restore();
    bpLine([[sx + 60, sy + 214], [560, 880]], { w: 1.6, c: 'rgba(29,32,64,0.6)', key: 'slipstr' });
  }
  for (const [gx, gy] of [[160 + TT * 18, 300], [240 + TT * 14, 350]]) bpLine([[gx - 18, gy], [gx - 6, gy - 8 + (B % 2) * 6], [gx, gy], [gx + 6, gy - 8 + (B % 2) * 6], [gx + 18, gy]], { w: 2.4, key: 'gull' + gy });
  bpTag('01', 'Booking');
}

function bpArrowArc(x0, y0, x1, y1, hgt, key, o = {}) {   // an arc with an arrowhead at its leading point
  const fr = o.frac ?? 1; if (fr <= 0) return;
  const P = bpArc(x0, y0, x1, y1, hgt, key, o), Q = subPath(P, fr), e = Q[Q.length - 1], p = Q[Math.max(0, Q.length - 3)];
  const a = Math.atan2(e[1] - p[1], e[0] - p[0]), L = o.head ?? 18;
  ctx.save(); ctx.fillStyle = o.c ?? 'rgba(150,230,235,0.95)'; ctx.beginPath(); ctx.moveTo(e[0] + Math.cos(a) * L * 0.6, e[1] + Math.sin(a) * L * 0.6);
  ctx.lineTo(e[0] + Math.cos(a + 2.5) * L, e[1] + Math.sin(a + 2.5) * L); ctx.lineTo(e[0] + Math.cos(a - 2.5) * L, e[1] + Math.sin(a - 2.5) * L); ctx.closePath(); ctx.fill(); ctx.restore();
  return e;
}
function bpPin(x, y, c, key) { const g = ctx.createRadialGradient(x, y, 0, x, y, 46); g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - 46, y - 46, 92, 92); ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(x, y, 8 + (B % 4 < 2 ? 1.5 : 0), 0, TAU); ctx.fill(); ink(ellipsePts(x, y, 20, 20, 0, 24), { closed: true, w: 2, color: c, key }); }

function sceneNight() {
  fillAll('#0c0f2a');
  bpStrokes(-20, -20, W + 20, 820, [[0, '#0c0f2a'], [820, '#1b2358']], { key: 'nsky', per: 200, light: 0.05 });
  bpStars(80, 'night', 700, { big: 7 });
  bpRays(60, 760, 50, 700, 'dawnflare', { a0: -Math.PI * 0.55, span: Math.PI * 0.75, al: 0.55 });
  star4(60, 760, 34, '#fff6d8');
  bpGlobe(2050, 1320, 'earth', { cities: 90 });
  // the whole network: cyan arcs launching from cities, each with an arrowhead
  const S = RNG('net');
  for (let k = 0; k < 14; k++) {
    const x0 = S.r(40, 1040), y0 = S.r(880, 1250); let x1 = x0 + (S.f() < 0.5 ? -1 : 1) * S.r(220, 520); if (x1 < 30 || x1 > 1050) x1 = x0 - (x1 - x0);
    const y1 = clamp(y0 + S.n(60), 880, 1250), h = Math.abs(x1 - x0) * S.r(0.35, 0.55), d = S.r(0, 1.6);
    bpArrowArc(x0, y0, x1, y1, h, 'net' + k, { c: 'rgba(150,230,235,0.75)', w: 1.8, frac: clamp(ev(28 + d * 0.3, 1.8) * 0.9 + 0.1), head: 14 });
  }
  // our route, in the shipment's red: origin pin -> destination pin, the arrow nearly home
  const o = [190, 1010], d = [890, 960], fr = 0.35 + 0.6 * EZ.io(ev(28, 2.8));
  bpPin(o[0], o[1], 'rgba(255,190,90,0.9)', 'pinO'); bpPin(d[0], d[1], 'rgba(212,56,44,0.9)', 'pinD');
  ctx.save(); ctx.setLineDash([2, 12]); bpArc(o[0], o[1], d[0], d[1], 460, 'routeghost', { c: 'rgba(212,56,44,0.45)', w: 3 }); ctx.restore();
  const e = bpArrowArc(o[0], o[1], d[0], d[1], 460, 'route', { c: 'rgba(222,64,50,1)', w: 6, frac: fr, head: 30 });
  if (e) { bpPlane(e[0], e[1] - 2, 90, -0.25 + fr * 0.5, 'tiny', {}); }
}

function sceneTouchdown() {
  // side-on landing: the runway runs across the frame. Mains touch at 31.0, the nose comes down by 32.6, the ground rushes left
  const u = TT - 31, GY = 1090;                                   // GY: the runway surface the tyres touch
  bpSky([[0, '#283888'], [380, '#5b5fae'], [620, '#e07a6a'], [740, '#ef8f3c'], [790, '#f2c84b']], { key: 'td' });
  bpSun(900, 760, 70, 'sunT', { c0: '#fff1c2', c1: '#ef8f3c', halo: 3 });
  bpCloud(200, 300, 120, 'cT1', { warm: BP.peach, body: '#f3d9c4' }); bpCloud(860, 220, 90, 'cT2', { warm: BP.peach, body: '#f3d9c4' });
  // the far side of the airfield: terminal and tower silhouettes, slow parallax
  const far = -u * 40;
  bpFill(bpRect(far - 40, 700, 520, 90), [[700, '#2b3270'], [790, '#1b2358']], { key: 'term', lw: 1.6 });
  for (let k = 0; k < 8; k++) { ctx.fillStyle = '#ffcf6a'; ctx.fillRect(far + k * 60, 730, 26, 14); }
  bpFill(bpRect(far + 620, 560, 40, 230), [[560, '#2b3270'], [790, '#1b2358']], { key: 'tower', lw: 1.6 });
  bpFill(resample([[far + 590, 560], [far + 690, 560], [far + 675, 510], [far + 605, 510]], true, 10), [[510, '#3a4aa0'], [560, '#1b2358']], { key: 'cab', lw: 1.6 });
  // grass, runway, foreground grass
  bpStrokes(-20, 785, W + 20, 1000, [[785, '#3a3f63'], [1000, '#2b3270']], { key: 'grassF', per: 70, len: [120, 400] });
  bpStrokes(-20, 1000, W + 20, 1180, [[1000, '#6b6f97'], [1180, '#3a3f63']], { key: 'rwy', per: 50, len: [160, 420] });
  bpStrokes(-20, 1180, W + 20, H + 20, [[1180, '#2b3270'], [1350, '#151a48']], { key: 'grassN', per: 60, len: [160, 420] });
  for (const y of [1004, 1176]) bpLine([[-20, y], [W + 20, y]], { w: 3, c: '#e4e7f2', key: 'edge' + y });
  for (let k = 0; k < 6; k++) { const x = mod(k * 260 - u * 1500, W + 260) - 130; ctx.fillStyle = BP.creamW; ctx.fillRect(x, GY - 4, 130, 8); }
  for (let k = 0; k < 9; k++) for (const y of [1000, 1180]) { const x = mod(k * 150 - u * 1500, W + 150) - 75, g = ctx.createRadialGradient(x, y, 0, x, y, 22); g.addColorStop(0, 'rgba(255,230,160,1)'); g.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - 22, y - 22, 44, 44); }
  // the freighter: the pitch eases from nose-up to level, the main wheels stay on the runway
  const L = 900, h = L * 0.11, gear = 90, ly = h * 0.5 + gear + h * 0.2, mx = -L * 0.08;
  const r = -0.07 * (1 - EZ.io(seg(TT, 31.2, 32.6))), px = 560;
  const py = GY - (Math.sin(r) * mx + Math.cos(r) * ly);
  const W2 = (lx, lyy) => [px + Math.cos(r) * lx - Math.sin(r) * lyy, py + Math.sin(r) * lx + Math.cos(r) * lyy];
  // tyre smoke: puffs from the mains on contact, the nose wheel when it comes down
  const [mwx] = W2(mx, ly), [nwx] = W2(L * 0.3, ly);
  for (let k = 0; k < 7; k++) { const age = u - k * 0.06; if (age < 0) continue; bpCloud(mwx - 20 - age * 520, GY - 10 - age * 30, 26 + age * 70, 'smk' + k, { n: 4, tall: 0.5, body: '#f6f1e2', shade: '#b8bfe0' }); }
  for (let k = 0; k < 4; k++) { const age = TT - 32.6 - k * 0.06; if (age < 0) continue; bpCloud(nwx - 20 - age * 520, GY - 10 - age * 20, 18 + age * 40, 'smkN' + k, { n: 4, tall: 0.5, body: '#f6f1e2', shade: '#b8bfe0' }); }
  bpPlane(px, py, L, r, 'land', { lights: true, gear });
  const [xx, xy] = W2(L * 0.05, 0);
  bpXray(xx, xy, 52, 'xT', 5);
  bpTag('06', 'Arrival');
}
