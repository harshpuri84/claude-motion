# LinkedIn caption: Ungraded, not unreliable

Video: `renders/share.mp4` (4:5, 1080x1350, 40.5 s, music only).
Adapted from `05-Areas/Career/LinkedIn Engine/drafts/2026-10-24 - Ungraded, not unreliable (video).md` to match the shipped cut.

## Post

AI agents aren't unreliable. Ungraded ones are.

This month Google open-sourced Harness², where agents tune their own prompts, tools and memory. On every lap of that loop, the agent climbs a score. If the score is wrong, the agent gets better at the wrong thing, faster.

In August I audited a 139-field extraction schema before grading anything. I asked one question per field:

Did this value come from the input the model reads?

For 86 of the 139, the answer was no. Other systems set them downstream. Grading them only measures the pipeline agreeing with itself, so I cut them.

That left 53. Only 3 needed an LLM judge. Plain rules check the other 50, and an agent can't talk its way past an exact match.

Before you let an agent improve itself:
1. List every field it writes.
2. Keep the ones that come from the input.
3. Rules first. Judge last.

Fix the score first. Then let the agent climb it.

## Checks before posting

- [ ] Listen to the score with sound on, start to finish (nobody has heard it yet).
- [ ] "This month" is true only until 31 Oct 2026 (Harness² code went public 6 Oct). After that, write "In October".
- [ ] Harness² claims come from secondary coverage; the paper (arXiv 2610.14224) was not read.
- [ ] Figures 139 / 86 / 53 / 3 / 50 match `Lab/hubble-extraction-eval/dataset/schema.json` and the v4 field-audit draft.
- [ ] Write the final hook in your own words if this one doesn't sound like you.
