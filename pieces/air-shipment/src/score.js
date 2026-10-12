  // SCORE BODY — one air shipment. D major, 120 BPM. Thin at origin, groove on the main leg, fullest above the clouds,
  // dead silence over the night earth, the loudest hit on touchdown (31.0), warm and decaying to the doorstep.
  const R = RNG('score');
  const FIG = [['D4', 'A4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'A4'], ['B3', 'Fs4', 'D4', 'Fs4', 'B4', 'Fs4', 'D4', 'Fs4'],
    ['G3', 'D4', 'B3', 'D4', 'G4', 'D4', 'B3', 'D4'], ['A3', 'E4', 'Cs4', 'E4', 'A4', 'E4', 'Cs4', 'E4']];
  const ROOT = ['D2', 'B1', 'G1', 'A1'];
  const BOX = [['D4', 0], ['A4', E8]];   // the carton's motif: a rising fifth, once per hand-off
  const boxMotif = (t, vel) => BOX.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.2, 0.6, 2600, 0.35));
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };

  // ================= MUSIC =================
  to = 'm';
  // the bed: pads overlap by ~1s and fade in/out slowly, so a morph never lands in a hole
  const bed = (t0, t1, notes, peak, o = {}) => pad(Math.max(0, t0 - 0.5), t1 + 0.6, notes, peak, { att: 1.0, rel: 1.0, send: 0.4, ...o });
  drone(0.0, 28.0, nz('D2'), 0.035, { att: 1.5, rel: 0.25 });
  bed(0.0, 14.0, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 900 });
  bed(14.0, 23.0, ['D3', 'A3', 'E4'], 0.03, { cut: 1000 });
  pad(22.5, 28.0, ['D3', 'A3', 'E4', 'A4'], 0.034, { cut: 1300, att: 1.0, rel: 0.02, send: 0.12 });   // stops dead into the night
  [0.5].forEach((t) => boxMotif(t, 0.12));
  [4.0, 9.0, 14.0].forEach((t) => boxMotif(t + E8, 0.07));   // a quiet nod just after each hand-off
  each(1.0, 9.0, BEAT, (t, k) => pluck(t, nz(FIG[Math.floor(k / 4) % 4][(k * 2) % 8]), 0.05, Math.sin(k) * 0.3, 0.4, 2400, 0.3));
  each(9.0, 14.0, E8, (t, k) => { pluck(t, nz(FIG[Math.floor(k / 8) % 4][k % 8]), 0.052 * (k % 2 ? 0.75 : 1), Math.sin(k * 0.9) * 0.3, 0.32, 3000, 0.2); if (k % 4 === 0) bass(t, nz(ROOT[Math.floor(k / 8) % 4]), 0.13); });
  // main leg (14-23): 8ths, then 16ths from the climb
  each(14.0, 23.0, E16, (t, k) => {
    const climb = t >= 18, fig = FIG[Math.floor(k / 16) % 4], acc = (k % 4 === 0 ? 1.2 : k % 2 === 0 ? 1.0 : 0.75) * (climb ? Math.min(1, 0.35 + (t - 18) / 1.5) : 1);
    if (climb || k % 2 === 0) pluck(t, nz(fig[k % 8]), 0.048 * acc, Math.sin(k * 0.9) * 0.35, 0.3, 3400, 0.16);
    if (k % 2 === 0) bass(t, nz(ROOT[Math.floor(k / 16) % 4]), 0.14);
    if (climb && t >= 19 && k % 4 === 0) sub(t, 0.05);
  });
  riser(16.5, 18.0, 0.006);
  // above the clouds (23-28): the fullest; dry in the last beat, stops dead at 28.0
  each(23.0, 28.0, E16, (t, k) => {
    const fig = FIG[Math.floor(k / 16) % 4], acc = k % 4 === 0 ? 1.25 : 0.9, dry = t >= 27.5 ? 0.02 : 0.12;
    pluck(t, nz(fig[k % 8]), 0.056 * acc, Math.sin(k * 0.9) * 0.4, t >= 27.75 ? 0.18 : 0.28, 5200, dry);
    pluck(t, nz(fig[k % 8]) * 2, 0.015 * acc, -Math.sin(k * 0.9) * 0.4, 0.18, 7000, dry * 0.5);
    if (k % 2 === 0) bass(t, nz(ROOT[Math.floor(k / 16) % 4]), 0.14);
    if (k % 4 === 0) sub(t, 0.06);
    noiseHit(t, 0.016, 'highpass', 8500, 0.7, k % 2 ? 0.015 : 0.026, k % 2 ? 0.3 : -0.3);
  });
  [23.5, 25.0, 26.5].forEach((t, i) => chime(t, [nz('A5'), nz('D6'), nz('Fs6')], 0.028, (i - 1) * 0.3));
  // night (28-31): one faint high note; the rest is room tone (SFX)
  pluck(28.6, nz('Fs5'), 0.012, 0.3, 0.9, 1600, 0.5);
  // touchdown (31.0): stab + sub on the hit, a flat chord that hands over to the last-mile bed without a gap
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(31.0 + i * 0.006, nz(n), 0.36, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  sub(31.0, 0.35);
  pad(31.0, 34.6, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.16, { cut: 2400, att: 0.01, rel: 3.2, send: 0.4 });   // the flat chord: one sound, decays slowly through the 33s morph
  drone(31.0, 45.0, nz('D2'), 0.028, { att: 0.02, rel: 1.2 });
  pad(32.0, 39.6, ['D3', 'A3', 'D4', 'Fs4'], 0.017, { cut: 1000, att: 1.6, rel: 1.0, send: 0.4 });
  bed(39.0, 44.4, ['D3', 'A3', 'Fs4'], 0.018, { type: 'triangle', cut: 900 });
  [33.0, 39.0].forEach((t) => boxMotif(t + E8, 0.06));
  each(33.5, 39.0, E8, (t, k) => { if (k % 2 === 0 || k % 8 === 5) pluck(t, nz(FIG[Math.floor(k / 8) % 4][k % 8]), 0.022, Math.sin(k) * 0.3, 0.35, 2600, 0.25); if (k % 4 === 0) bass(t, nz(ROOT[Math.floor(k / 8) % 4]), 0.06); });
  [[41.0, 'A4'], [41.5, 'D5'], [42.0, 'Fs5'], [43.0, 'E5'], [43.5, 'D5']].forEach(([t, n], i) => pluck(t, nz(n), 0.02, (i - 2) * 0.15, 0.7, 2800, 0.45));

  // ================= SFX =================
  to = 's';
  [4, 9, 14, 18, 23, 33, 39].forEach((tc) => sweep(tc - 0.6, tc + 0.05, 0.006, 600, 3200, 0));   // a soft swish into each morph
  drone(28.2, 30.3, 55, 0.0015, { att: 0.4, rel: 0.3 });   // room tone: a faint low hum, well under -40 dB                                   // room tone under the night
  each(1.0, 2.2, E16, (t) => noiseHit(t, 0.05, 'bandpass', 3200 + R.n(400), 2, 0.03, 0.3));          // the slip prints
  noiseHit(4.2, 2.0, 'lowpass', 400, 0.8, 0.02, -0.2, 0, 220);                                        // truck rumble
  [10.4, 11.0, 11.6].forEach((t) => noiseHit(t, 0.12, 'lowpass', 700, 1, 0.08));                       // cartons land
  sweep(14.3, 17.0, 0.02, 200, 900, 0);                                                              // the loader whine
  sweep(15.5, 18.4, 0.012, 180, 700, 0);                                                            // engines spool up across the morph
  noiseHit(30.85, 0.15, 'bandpass', 2600, 4, 0.05, 0, 0, 1400);                                       // tyre chirp into the hit
  noiseHit(31.0, 2.4, 'lowpass', 1000, 0.7, 0.07, 0, 0.3, 160);                                       // the touchdown roar, a long rollout
  [36.0, 36.15].forEach((t) => chime(t, [nz('A6')], 0.012, 0.4));                                      // a bicycle bell
  each(40.0, 41.6, E16, (t) => noiseHit(t, 0.06, 'bandpass', 2400 + R.n(300), 1.6, 0.014, 0.25));    // the signature
