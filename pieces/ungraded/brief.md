# Ungraded, not unreliable: brief

- **Spec:** 4:5, 1080x1350, 24fps, 40.5s, 120 BPM. Style `crosshatch`. Music only (the LinkedIn feed autoplays muted).
- **Hero:** Clawd, the square terracotta block from the Projects videos (`styles/paperprint/kit.js`), playing the agent.
- **Format:** F4 mission. Flash-forward open, the plan in red dashes then done in ink, a 16th-note rush of tiles, silence, payoff. Hard cuts on the 8th grid.
- **Device:** the opening image comes back changed. The agent stands on a score bar again, now built from graded field tiles.
- **Colour:** terracotta = the agent and what it wrote; red dashes = the plan (the question); green = graded by a rule; yellow = graded by the LLM judge; grey hatch = excluded.

## Beats
| # | Time | What happens | Bridge | Sound |
|---|---|---|---|---|
| 1 | 0-3 | On top of a tall self-written score bar, 100%. "AI agents aren't unreliable." | time-cut flicker | quiet pad |
| 2 | 3-6 | Rewind: the dot draws the bar itself. "Ungraded ones are." | cut on the beat | pencil-scratch hit |
| 3 | 6-12 | The loop: prompts, tools, memory; the bar grows per lap. Harness² line. | push in on the pencil | groove, pluck per lap |
| 4 | 12-15 | The bar shoots up; its own pencil circled. "Self-improvement climbs a score. A wrong score means faster wrong." | hard cut | riser |
| 5 | 15-17 | Turn: silence, the schema sheet, the question slams on in red dashes. | plan becomes ink | drop, hit on the question |
| 6 | 17-23 | Rush: 139 tiles through the question; 86 grey, 53 green. "86 were set downstream, not read from the input." | gather the 53 | flat groove, tick per tile |
| 7 | 23-29 | 50 ruler ticks, 3 loupes; the dot bounces off "exact match". | callback to the sheet | bounce |
| 8 | 29-35 | Recipe in dashes, then ink: list the fields, keep the input ones, rules first, judge last. | the dot looks at its old bar | groove thins |
| 9 | 35-37 | Quiet: the old bar erases. | hold | lowest, 1.5s |
| 10 | 37-40.5 | The 53 tiles stack into a shorter, solid bar. "Fix the score before the agent climbs it." Harsh Puri. | the opening, changed | loudest hit, flat chord |

## Claims and sources
- Harness²: recursive self-improvement of an agent's harness (prompts, tools, memory, skills, subagents), weights untouched; Google Cloud AI Research + Northwestern; code `google-research/harness2` on GitHub 6 Oct 2026, paper arXiv 2610.14224 on 9 Oct 2026; the paper says open-world tasks have no ground truth or verifier. Sources: hyper.ai summary of 2610.14224; remio.ai, aiidelist.com, besthub.dev coverage. Full paper not read.
- 139 fields, 53 gradeable, 86 excluded (downstream-derived): `Lab/hubble-extraction-eval/dataset/schema.json`, story bank S1, verified 2026-08-25.
- 3 of 53 need an LLM judge, 50 deterministic: `LinkedIn Engine/drafts/2026-08-25 - The field audit with tool (v4).md`.
- Which tiles are gradeable on screen is a fixed scatter, not the real field order (illustrative).
