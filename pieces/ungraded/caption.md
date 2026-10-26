# LinkedIn caption: Ungraded, not unreliable

Video: `renders/share.mp4` (4:5, 1080x1350, 40.5 s, music only).
Adapted from `05-Areas/Career/LinkedIn Engine/drafts/2026-10-24 - Ungraded, not unreliable (video).md` to match the shipped cut.

## Post

Before you improve an agent, check what you're rewarding.

This month Google Research open-sourced Harness². It edits the harness around a model (prompts, memory, tools, skills) by comparing how runs behave, with no ground-truth answers in the loop. Agents will change faster. You still have to decide what "got better" means for yours.

In August I audited a 139-field extraction schema before grading anything. For each field I asked one question: is the agent responsible for deriving this value from its inputs?

For 86 of the 139, the answer was no. Other systems set them downstream. They weren't extraction work, so they didn't belong in the extraction score. They still need their own integration checks.

That left 53. Only 3 needed an LLM judge. Plain rules check the other 50, and an agent can't talk its way past an exact match. A rule is only as good as its reference answer and normalisation, though. It will enforce a wrong answer just as consistently.

Before you let an agent improve itself:
1. List every field it writes.
2. Grade the ones it's responsible for deriving from its inputs.
3. Rules first. Judge last.

Fix the score first. Then let the agent climb it.

## Checks before posting

- [ ] Listen to the score with sound on, start to finish (nobody has heard it yet).
- [ ] "This month" is true only until 31 Oct 2026 (Harness² code went public 6 Oct). After that, write "In October".
- [ ] Harness² wording checked against the github.com/google-research/harness2 README on 26 Oct 2026; paper not read.
- [ ] Figures 139 / 86 / 53 / 3 / 50 match `Lab/hubble-extraction-eval/dataset/schema.json` and the v4 field-audit draft.
- [ ] Write the final hook in your own words if this one doesn't sound like you.
