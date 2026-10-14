# LOG — one-project

- 14 Oct 2026: intake, story (8 beats), look check (3 frames), beat 3 redrawn from the user's screenshots, real assets for beats 1 and 3.
- Voice: 7 lines generated (6 new + the approved verdict test), 62.62s, 144/153 words heard by whisper.
- Storyboard: panel 7 redrawn (studio reused), hero changed to square Clawd at the user's request. All 8 approved.
- Build: tiles across all 7 cuts deterministic; fixed empty first frames at the beat 5 and beat 7 cuts.
- Export needs ffmpeg-full (`PATH=/opt/homebrew/opt/ffmpeg-full/bin:$PATH`); the default Homebrew ffmpeg 9.0.2 has no drawtext or subtitles filter.
- Review fixes: pile labels only on the top card; slow push-in on every beat; cloud drift; beat starts snapped to the 8th grid; pulse ring (beat 2) and card outlines + gold underline (beat 7) for dead beats; bpLine partial closed outlines drew triangles (fixed in the kit).

## Review (final)
| check | result |
|---|---|
| cuts on 8th grid | PASS (7/7, 0 frames off) |
| text cut-off / overlap | PASS (0) |
| dead beats | PASS (0 over 3s) |
| loudness | -14.9 LUFS, true peak -1.5 dBFS |
| payoff | loudest 100ms at 50.0s (-7.2 dBFS, score only), 0.6s silence before |
| narration density | FAIL: line 1 at 3.50 w/s (the take's own pace) |
| story arc | 4/5: peak cut rate rule fails by design (one held scene per line) |

Weakest shot: beat 4 opens on 0.3s of empty navy before the thread panel pops in.
