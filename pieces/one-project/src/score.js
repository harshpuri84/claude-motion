  // SCORE BODY — one-project. Quiet under the voice: thin early, fullest after the payoff.
  // The payoff hit lands on the cut into the verdict, in the pause between the curry line and the verdict line.
  const BT = BEATS_T, HIT = BT.verdict, STOP = HIT - 0.55;
  to = 'm';
  // pads: one chord per section, ending hard before the hit
  pad(0.2, BT.detect, ['D3', 'A3', 'Fs4'], 0.016, { type: 'triangle', cut: 800, att: 0.8, rel: 0.4 });
  pad(BT.detect, BT.builds, ['B2', 'Fs3', 'D4'], 0.017, { type: 'triangle', cut: 850, att: 0.4, rel: 0.4 });
  pad(BT.builds, STOP, ['G2', 'D3', 'B3', 'Fs4'], 0.019, { type: 'triangle', cut: 950, att: 0.4, rel: 0.25, send: 0 });
  // beat 2: a pluck as each thread lands
  for (let i = 0; i < 3; i++) pluck(VW('main', 'hands') + i * 0.25 + 0.7, nz(['A4', 'D5', 'Fs5'][i]), 0.1, [-0.4, 0, 0.4][i], 0.3, 2600, 0.2);
  // beat 3: the press, cards landing, the start button
  to = 's';
  blip(BT.detect + 0.9, 1400, 900, 0.05, 0.08, -0.3);
  for (let i = 0; i < 14; i++) noiseHit(BT.detect + 1.6 + i * 0.17 + 0.42, 0.05, 'bandpass', 2400 + (i % 3) * 300, 1.2, 0.045, -0.2 + (i % 5) * 0.1);
  blip(BT.detect + 6.6, 1200, 1700, 0.06, 0.09, 0.3);
  to = 'm';
  for (let i = 0; i < 3; i++) pluck(BT.detect + 6.8 + i * 0.15, nz(['D5', 'Fs5', 'A5'][i]), 0.08, 0.5, 0.25, 3000, 0.25);
  // beat 4: typing in the thread
  to = 's';
  for (let i = 0; i < 4; i++) for (let k = 0; k < 6; k++) blip(BT.thread + 0.8 + i * 0.6 + k * 0.07, 2200 + k * 40, 2100, 0.015, 0.025, -0.3);
  to = 'm';
  // beat 5: a pluck per card, rising
  ['kpi', 'video', 'presentation', 'quoting'].forEach((w, i) => pluck(VW('builds', w), nz(['D4', 'Fs4', 'A4', 'D5'][i]), 0.11, -0.45 + i * 0.3, 0.35, 2800, 0.25));
  // beat 6: one message in, three documents out
  to = 's';
  sweep(BT.curry + 0.55, BT.curry + 1.1, 0.012, 500, 1800, -0.5);
  for (let i = 0; i < 3; i++) noiseHit(BT.curry + 2.0 + i * 0.55, 0.22, 'bandpass', 1400 + i * 300, 0.8, 0.06, 0.2 + i * 0.2, 0, 3200);
  // the payoff: silence from STOP, then a short stab and a sub on the cut, then a flat chord
  to = 'm';
  chime(HIT, [nz('D5'), nz('Fs5'), nz('A5')], 0.12); sub(HIT, 0.5);
  pad(HIT + 0.05, DURATION, ['D3', 'A3', 'D4', 'Fs4'], 0.024, { cut: 1100, att: 0.3, rel: 0.6, send: 0.35 });
  // the verdict's two sides
  pluck(VW('verdict', 'business'), nz('A4'), 0.09, -0.5, 0.35, 2600, 0.25);
  pluck(VW('verdict', 'own'), nz('D5'), 0.09, 0.5, 0.35, 2600, 0.25);
