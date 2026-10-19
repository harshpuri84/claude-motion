  // SCORE BODY — projects-two. Quiet pads under the voice, a pluck per card or tab.
  to = 'm';
  pad(0.2, BEATS_T.session, ['D3', 'A3', 'Fs4'], 0.016, { type: 'triangle', cut: 800, att: 0.8, rel: 0.4 });
  pad(BEATS_T.session, BEATS_T.tips, ['B2', 'Fs3', 'D4'], 0.017, { type: 'triangle', cut: 850, att: 0.4, rel: 0.4 });
  pad(BEATS_T.tips, BEATS_T.close, ['G2', 'D3', 'B3', 'Fs4'], 0.019, { type: 'triangle', cut: 950, att: 0.4, rel: 0.25 });
  ['t1', 't2', 't3'].forEach((k, i) => pluck(BEATS_T[k] + 0.4, nz(['D5', 'Fs5', 'A5'][i]), 0.1, -0.3 + i * 0.3, 0.3, 2800, 0.25));
  chime(BEATS_T.close, [nz('D5'), nz('Fs5'), nz('A5')], 0.1);
  pad(BEATS_T.close + 0.05, DURATION, ['D3', 'A3', 'D4', 'Fs4'], 0.024, { cut: 1100, att: 0.3, rel: 0.6, send: 0.35 });
