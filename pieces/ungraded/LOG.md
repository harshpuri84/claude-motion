# LOG: ungraded

- 25 Oct 2026: intake (4:5, music only, crosshatch, the dot as the agent). Story approved: 10 beats, F4 mission, 40.5s.
- Look check: beats 1, 6 and 10 drawn full size (`look.png`). Fixed before showing: hero shadow over "100%", payoff labels running off the right edge, byline under the caption card.
- Look check approved (Away Mode answered "all three up").
- Storyboard: all 10 beats drawn (`storyboard.png`). Fixed before showing: beat 4 moved from close to wide (the close camera cut the hero off); beat 5 showed a sorted tile before the sort starts.
- Known on the board: beat 4 "its own pencil" label sits on the bar edge; beat 3 tool pills are small (28px mono).
- 25 Oct 2026: hero swapped from the crosshatch ink dot to Clawd, the square terracotta block from `styles/paperprint/kit.js` (`walker`), at the user's request. Ported to `src/hero.js`; `clawd(x, y, r)` keeps the dot's ground line. Payoff: 13 full rows of 4, Clawd holds up the 53rd tile.
- Build: payoff reworked so Clawd rides the stack up (it hung in the air on the cut frame); caption cards no longer appear empty before their text writes on; three captions moved inside the 60px safe margin.
- Review format set to `beat-cut`: the story is F4, but its rush is a tile cascade inside one shot, not four hard cuts, and F4's rush check crashed on it.
- Export: frames 0..971 in 25.6s, `renders/share.mp4` (ffmpeg-full).

- 26 Oct 2026: text re-cut after an outside review. The hook overclaimed, and the Harness² line was wrong: per its README, Harness² refines the harness from behavioural contrasts between executions, without ground-truth feedback, so it does not climb a score. Changed on screen: beat 1 "Before you improve an agent,"; beat 2 "check what you're rewarding." (terracotta, one line); beat 3 "This month Google Research open-sourced Harness². It tunes an agent's prompts, tools and memory." and the bar label "score" became "harness"; beat 4 "A bad score can reward the wrong behaviour."; beats 5-6 question "Is the agent responsible for this value?" and caption "86 were set downstream by other systems."; beat 8 step 2 "2. Grade the ones it's responsible for.", wrapped onto two lines inside its dashed box (one line ran into the right safe zone). Timings, beats, cuts, visuals and `score.js` unchanged. Old cut kept as `renders/share-v1.mp4` and `renders/final-v1.mp4`.
- Export: frames 0..971 in 30.5s, `renders/share.mp4` (ffmpeg-full).

## Review (final)
| check | result |
|---|---|
| cuts on 8th grid | PASS (9/9, 0 frames off) |
| text cut-off / overlap / safe zone | PASS (0 / 0 / 0) |
| dead beats | PASS (0 over 3s) |
| loudness | -15.0 LUFS, true peak -1.0 dBFS |
| payoff | loudest 100ms at 37.0s (-9.5 dBFS), 2.0s at <= -40 dBFS before it |
| story arc | 4/5: "peak has the highest cut rate" fails by design (the rush is inside one shot) |
| determinism | tile check deterministic: true |

Weakest shot: beat 8 (recipe) opens on an almost empty page with Clawd alone for about 0.5s before the heading writes on. The two-line step 2 box now sits close to step 3.
Not verified: nobody has listened to the score; the numbers above are measured, not heard.
