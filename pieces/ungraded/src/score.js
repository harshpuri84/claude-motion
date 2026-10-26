  // ================= UNGRADED: the arc =================
  // a soft pad and Clawd's motif -> pencil scratches -> the loop's groove builds -> a riser that stops dead
  // -> silence, a hit on the question -> a flat groove with a tick per sorted tile -> thinner while the rules land
  // -> dead silence while the old bar erases -> the payoff: the loudest hit, then a flat chord
  const T = TIMELINE, cu = T.cues, R = RNG('score');
  const FIG = [['D4', 'A4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'A4'], ['D4', 'A4', 'B4', 'A4', 'E5', 'A4', 'B4', 'A4']];
  const MOTIF = [['D4', 0], ['A4', E8]];   // Clawd: a rising fifth
  const motif = (t, vel, notes = MOTIF) => notes.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };

  // ================= MUSIC =================
  to = 'm';
  // 1-2: on top of its own score, then the rewind
  pad(0.0, 6.1, ['D3', 'A3', 'Fs4'], 0.034, { type: 'triangle', cut: 850, att: 0.05, rel: 0.2 });
  motif(0.3, 0.2);
  pluck(3.35, nz('Fs4'), 0.16, 0, 0.5, 2600, 0.3); pluck(3.35, nz('D4'), 0.12, -0.2, 0.5, 2400, 0.3);   // "Ungraded"
  // 3-4: the loop. 8ths and a bass, a brighter pluck on every lap; 16ths under the riser, dry in the last beat
  pad(6.0, 15.0, ['D3', 'A3', 'E4'], 0.032, { cut: 1000, att: 0.3, rel: 0.02, send: 0.25 });
  each(6.0, 12.0, E8, (t, k) => { pluck(t, nz(FIG[0][k % 8]), 0.055 * (k % 2 ? 0.75 : 1), Math.sin(k) * 0.3, 0.3, 3000, 0.2); if (k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.15); });
  each(6.5, 12.0, 1.25, (t) => pluck(t, nz('D5'), 0.09, 0.3, 0.5, 4200, 0.3));
  each(12.0, 15.0, E16, (t, k) => {
    const dry = t >= 14.5 ? 0.02 : 0.12;
    pluck(t, nz(FIG[1][k % 8]), 0.05 * (k % 4 === 0 ? 1.25 : 0.85), Math.sin(k * 0.9) * 0.35, t >= 14.75 ? 0.15 : 0.25, 4200, dry);
    if (k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.15);
    if (k % 4 === 0) sub(t, 0.06);
  });
  riser(12.2, 14.95, 0.014);
  // 5: silence, then a hit when the question lands (not the loudest), a low drone under the sheet
  drone(15.9, 17.1, nz('D2'), 0.05, { att: 0.05, rel: 0.3 });
  ['D3', 'A3', 'D4'].forEach((n, i) => pluck(15.95 + i * 0.006, nz(n), 0.2, (i - 1) * 0.2, 0.5, 3000, 0.3));
  // 6: the sort. A flat groove; it carries the rush
  pad(17.0, 23.1, ['D3', 'A3', 'E4'], 0.03, { cut: 950, att: 0.2, rel: 0.2, send: 0.2 });
  each(17.0, 23.0, E8, (t, k) => { if (k % 2 === 0 || k % 8 === 5) pluck(t, nz(FIG[0][k % 8]), 0.045, Math.sin(k) * 0.3, 0.3, 2800, 0.2); if (k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.14); });
  // 7-8: the rules and the recipe, the groove thinning out, dry before the silence
  pad(23.0, 35.0, ['D3', 'A3', 'Fs4'], 0.03, { cut: 900, att: 0.3, rel: 0.02, send: 0.2 });
  each(23.0, 35.0, E8, (t, k) => {
    const thin = t >= 29 ? (k % 4 === 0) : (k % 2 === 0);
    if (thin) pluck(t, nz(FIG[1][k % 8]), 0.045, Math.sin(k) * 0.3, t >= 34.5 ? 0.12 : 0.3, 2600, t >= 34.5 ? 0.02 : 0.2);
    if (k % 4 === 0 && t < 34.5) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.12);
  });
  // 9: silence while the old bar erases (35.0-37.0): nothing on the music bus
  // 10: the payoff. A short stab and a sub on the hit, then a flat chord and Clawd's motif, completed
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(37.0 + i * 0.006, nz(n), 0.36, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  pad(37.0, 37.4, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.5, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });
  sub(37.0, 0.5);
  pad(37.6, 40.5, ['D3', 'A3', 'D4', 'Fs4'], 0.045, { cut: 1100, att: 0.25, rel: 0.4, send: 0.45 });
  motif(38.6, 0.16, [['D4', 0], ['A4', E8], ['D5', BEAT]]);

  // ================= SFX =================
  to = 's';
  const scratch = (t0, t1, vel = 0.03) => { for (let t = t0; t < t1 - 1e-6; t += E16) noiseHit(t + 0.01, 0.1, 'bandpass', 2800 + R.n(500), 1.4, vel * (0.7 + R.f() * 0.5), 0.2); };
  scratch(3.2, 5.6, 0.026);                                                // Clawd draws its own bar
  each(6.3, 7.5, 0.4, (t, k) => blip(t, 1500 + k * 200, 1300, 0.03, 0.05)); // the tool pills pop
  scratch(13.0, 13.5, 0.03);                                               // the circle round its pencil
  noiseHit(15.95, 0.12, 'bandpass', 1800, 1.2, 0.06, 0);                   // the dashes slam on
  // a tick per sorted tile: 8ths, then the rush (capped at one per 16th)
  [17.5, 18.0, 18.5].forEach((t, i) => blip(t, 1800, 1500, 0.04, 0.05));
  each(19.0, 21.0, E16, (t, k) => blip(t, 1700 + (k % 4) * 180, 1500, 0.025, 0.04 + 0.01 * (k / 16)));
  each(23.4, 25.0, E8, (t, k) => blip(t, 2200, 2000, 0.02, 0.03));          // the rule ticks
  sweep(26.0, 26.35, 0.012, 300, 1400, 0); pluck(26.35, nz('A2'), 0.14, 0.3, 0.3, 900, 0.1);   // the bounce off "exact match"
  [29.7, 31.4, 33.1].forEach((t) => scratch(t, t + 0.3, 0.028));          // each plan dashed in
  each(37.1, 37.75, E16, (t, k) => blip(t, 1600 + k * 120, 1400, 0.02, 0.025));   // the tiles stack
