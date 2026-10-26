// =====================================================================
//  THE HERO: Clawd, the square terracotta block with two tall eyes, side arms and four short legs.
//  Ported from styles/paperprint/kit.js (walker) so the ungraded piece keeps the same character.
//  clawd(x, y, r) takes a dot-style call: (x, y) is where a dot of radius r would sit, and the
//  block stands on the same ground line (y + r).
// =====================================================================
const CW = { ink: '#2b2622', line: '#aeb9ec', terra: '#d97757', terraD: '#b85c3f' };
function walker(x, y, r, o = {}) {
  const key = o.key ?? 'hero', dark = !!o.dark, lc = dark ? CW.line : CW.ink;
  const walk = o.walk ?? 0, ph = TT * TAU * walk;
  y += Math.sin(TT * TAU * 0.9) * r * 0.03 - (walk ? Math.abs(Math.sin(ph)) * r * 0.06 : 0);
  SPARK_AT = toScreen(x, y);
  const bw = r * 2, bh = r * 1.55, top = y - bh / 2, bot = y + bh / 2;
  if (!dark) { ctx.fillStyle = 'rgba(60,45,30,0.13)'; ctx.beginPath(); ctx.ellipse(x, bot + r * 0.42, r * 1.15, r * 0.14, 0, 0, TAU); ctx.fill(); }
  for (let i = 0; i < 4; i++) {
    const lx = x - bw / 2 + bw * (0.14 + i * 0.24), lift = walk ? Math.max(0, Math.sin(ph + (i % 2) * Math.PI)) * r * 0.12 : 0;
    paint(rrectPts(lx - r * 0.07, bot - 4, r * 0.14, r * 0.36 - lift, 3), { fill: CW.terraD, key: key + 'lg' + i, w: Math.max(2, r * 0.045), amt: 0.3, line: lc });
  }
  for (const s of [-1, 1]) paint(rrectPts(s < 0 ? x - bw / 2 - r * 0.22 : x + bw / 2 - 2, y - r * 0.05, r * 0.24, r * 0.28, 4), { fill: CW.terra, key: key + 'arm' + s, w: Math.max(2, r * 0.045), amt: 0.3, line: lc });
  const P = rrectPts(x - bw / 2, top, bw, bh, r * 0.12);
  if (dark) ink(P, { closed: true, color: 'rgba(240,150,110,0.18)', w: r * 0.5, key: key + 'g', amt: 0.4 });
  paint(P, { fill: CW.terra, key, w: Math.max(2.6, r * 0.06), amt: 0.5, line: lc, tex: [{ k: 'pencil', c: '#e89a7a', al: 0.35, per: 60, dens: (px, py) => clamp((x - px + top + bh - py) / (2 * r)) }, { k: 'hatch', a: 0.8, gap: 5, al: 0.22, dens: (px, py) => clamp((px - x + py - y) / r) }] });
  const blink = (B + key.length * 7) % 41 < 2, eh = o.mood === 'wow' ? r * 0.36 : r * 0.3;
  for (const s of [-1, 1]) { ctx.fillStyle = '#1d1712'; const ex = x + s * r * 0.42 - r * 0.07; if (blink) ctx.fillRect(ex, y - r * 0.1, r * 0.14, r * 0.05); else ctx.fillRect(ex, y - r * 0.08 - eh / 2, r * 0.14, eh); }
  return P;
}
function clawd(x, y, r, o = {}) {
  const rr = r * 1.0;
  return walker(x, y + r - 1.1 * rr, rr, o);
}
