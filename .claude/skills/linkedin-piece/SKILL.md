---
name: linkedin-piece
description: Take one idea to a review-checked LinkedIn video (4:5, animate skill) plus its post copy, following PIPELINE.md. Use when Harsh wants a new LinkedIn video piece, says "make a piece about X", or invokes /linkedin-piece.
---

# LinkedIn piece

Usage: `/linkedin-piece "<idea in one sentence>"`, or `/linkedin-piece` and ask for the idea.

`PIPELINE.md` at the repo root is the source of truth. Read it first and follow its steps in order. This file covers how to run them.

## Rules for the whole run

- **All writing goes through the clarity skill** at `~/.claude/skills/clarity/`: the idea line, captions, the brief, `LOG.md` notes and the post. Load it before writing anything.
- **Reuse, do not rewrite.** The engine is the animate skill. Its tools, kit, grammar and templates are used as they are. Repo styles live in `styles/`.
- **Four gates.** Stop and wait for Harsh at the story check, the look check, the storyboard and the post hook. Render nothing before the storyboard is approved.
- **Done is measured.** Report the numbers from `tools/check.sh`, not "looks good". Say what was measured and not seen or heard.
- **No invented numbers.** Every figure on screen or in the post has a source in the brief's claims table. Leave a bracket and ask when one is missing.

## Run

1. **Load** the animate skill and the clarity skill. Read `PIPELINE.md`, `styles/REFERENCES.md`, and from the LinkedIn Engine (`~/Documents/Harsh OS/05-Areas/Career/LinkedIn Engine`) `_brand/positioning-and-pillars.md`, `_brand/voice.md`, `_brand/story-bank.md` and `.claude/skills/linkedin-post/SKILL.md`.
2. **Idea and angle.** Tighten the idea to one sayable sentence with clarity. Name the pillar. Web-check every claim and list it with its source. If it fits no pillar or is not Maersk-safe, say so and stop.
3. **Scaffold.** Pick a slug and run `tools/new-piece.sh <slug> --title "<title>" --style <style> --seconds <n>`. Ask the animate intake questions only for what you cannot infer. Defaults: 4:5, captions only, composed score, about 45s.
4. **Story check.** Pick the format from the animate grammar. Write the beat table and claims into `brief.md`. Show it. **Wait.**
5. **Look check.** Draw the 2 to 4 most different beats and render `look.png` with `still.mjs` (not `tile.mjs`, which is 9:16 only). Fix what you can see first. Show it. **Wait.**
6. **Storyboard.** Build and render `storyboard.png`. Check no panel shows something before its beat. Show it. **Wait.**
7. **Build and review.** Animate the panels. Run `tools/check.sh <slug> --export`. Fix and re-run until it passes. Look at every `review/shot*-sheet.jpg` and `review/phone.jpg`. Write the per-shot PASS table, the numbers and the weakest shot in `LOG.md`.
8. **Post copy.** Write `post.md` with clarity, using the `linkedin-post` structure and rubric: three hook options and which you would pick, the post, the grade table, open questions. Run `tools/check.sh <slug>` again until the post checks pass. Copy it to LinkedIn Engine `drafts/YYYY-MM-DD - <title> (video).md`. Hand over with: **this is a first draft. Harsh writes the hook.**
9. **Wrap up.** Commit the piece on a branch named `<slug>-video` and open a PR. Append any new story to the story bank.

## Hand over

End with the video path, the review table, the weakest shot, and the post draft path.
