# LinkedIn piece pipeline

How one idea becomes a review-checked video and the post that goes with it. This is the process behind `weak-spots` and `ungraded`, written down so the next piece starts from one command.

Start a piece from the repo root:

```
/linkedin-piece "AI did not create new weak spots. It made our old ones cheap to find."
```

The skill runs every step below in order and stops at the four gates. To run it by hand, use the steps and commands below.

## What you need

- Claude Code with the animate skill installed (`/plugin install animate@animate`, see README).
- Node 18+, Playwright with Chromium.
- ffmpeg with `drawtext`. The Homebrew default build lacks it, so install `ffmpeg-full`. `tools/check.sh` puts `/opt/homebrew/opt/ffmpeg-full/bin` first on the PATH when it exists.
- The clarity skill at `~/.claude/skills/clarity/`. Every piece of writing in this pipeline goes through it: the idea line, captions, the brief, and the post.
- The LinkedIn Engine at `~/Documents/Harsh OS/05-Areas/Career/LinkedIn Engine`, for the pillars, story bank, voice and the post rubric.

## The steps

| # | Step | Output | Gate |
|---|---|---|---|
| 1 | Idea and angle | one sentence, a pillar, sourced claims | |
| 2 | Scaffold | `pieces/<slug>/` | |
| 3 | Story check | beat table in `brief.md` | **Harsh approves the story** |
| 4 | Look check | `look.png` | **Harsh approves the look** |
| 5 | Storyboard | `storyboard.png` | **Harsh approves the board** |
| 6 | Build and render | `index.html`, `renders/share.mp4` | |
| 7 | Review checks | `review/`, PASS table in `LOG.md` | must pass |
| 8 | Post copy | `post.md`, copied to LinkedIn Engine `drafts/` | **Harsh writes the hook** |
| 9 | Ship | posted, story bank updated | |

Nothing renders before gate 5. A storyboard is cheap and a render is not.

### 1. Idea and angle

Write the idea as one sentence you could say out loud. Run it through the clarity skill until a reader gets it on the first read.

- Pick the pillar from LinkedIn Engine `_brand/positioning-and-pillars.md`. If the idea fits no pillar, stop here.
- If the piece rides a news hook, say why now. `ungraded` used a 30-day trend sweep (`/last30days`) and picked the topic with the most interactions that fit a pillar.
- Every number on screen gets a source in the brief's claims table. If a source is secondary only, the brief says so ("paper not read").
- Obey the story bank's Publish line for any figure from Harsh's own work.

### 2. Scaffold

```
tools/new-piece.sh <slug> --title "The weak spots" --style sketchbook --seconds 46
```

This copies the animate skill's piece template into `pieces/<slug>/`, sets 4:5 (1080x1350, the LinkedIn feed size), 24fps, 120 BPM and a 60px safe margin, and adds `post.md`. Defaults: 4:5, 45s, captions only, music composed in code. LinkedIn autoplays muted, so captions carry the story and voice is optional.

### 3. Story check (gate)

Pick a format from the animate skill's `grammar/FORMATS.md` and write the beat table in `brief.md`: time, what happens, bridge into the next beat, sound. Captions go through the clarity skill.

The rules the last two pieces followed:

- One device carries the story. In `weak-spots` one circle is the lock dial, the magnifier, the clock, the key bow and the lock again.
- Each colour means one thing, written in the brief.
- Silence before the payoff, loudest hit on it.
- The end is the opening, changed.

Show the beat table and wait for approval.

### 4. Look check (gate)

Draw the 2 to 4 most different beats full size and put them side by side:

```
node $ANIMATE/tools/still.mjs pieces/<slug> 2.0,15.0,38.0 pieces/<slug>/look.png --scale 0.5
```

Use `still.mjs`, not `tile.mjs`, for 4:5. `tile.mjs` is hard-wired to 9:16 cells and phone-UI zones. Before you show it, fix what you can see: text under the safe margin, a hero shadow over a number, labels off the edge.

### 5. Storyboard (gate)

```
node $ANIMATE/tools/build.mjs pieces/<slug> && node $ANIMATE/tools/storyboard.mjs pieces/<slug>
```

The storyboard has one panel per beat, with its sound and transition. Check that no panel shows something before its beat (`ungraded` beat 5 showed a sorted tile before the sort). Approval is by panel number.

### 6. Build and render

Animate the approved panels, then:

```
tools/check.sh <slug> --export
```

This builds `index.html`, exports frames, score and stems to `renders/final.mp4` and `renders/share.mp4`, and runs the review in step 7. Add `--only-audio` to re-mix the score without re-rendering frames.

### 7. Review checks (must pass)

`tools/check.sh <slug>` runs `review.mjs` and then checks the post copy. The bar both pieces cleared:

| Check | Pass |
|---|---|
| Cut grid | every cut and morph on the 8th-note grid, 0 frames off |
| Text | 0 cut off, 0 overlapping, 0 outside the safe margin |
| Dead beats | nothing over 3s where the picture barely changes |
| Loudness | about -15 LUFS integrated, true peak -1.0 dBFS or lower |
| Payoff | loudest 100ms window is the payoff, after the silence |
| Story arc | 5/5, or the failing line explained as by design in `LOG.md` |

Deliberate overlaps (a counter whose digits jitter, a scale pop on the end card) go in `piece.json` under `review.textIgnore` as `[start, end, "why"]`. Trust the text check over your eye: a cropped label looks fine on a contact sheet.

Then look at the sheets yourself: `review/shotNN-sheet.jpg` per shot and `review/phone.jpg`, one frame a second at the size people watch. Write a per-shot PASS table in `LOG.md`, the measured numbers, and the weakest shot with what would fix it. Say what was measured and not heard ("nobody has listened to the score").

### 8. Post copy (gate)

Write `pieces/<slug>/post.md` with the clarity skill, using the LinkedIn Engine `linkedin-post` structure (hook, bridge, meat, mic drop, optional question) and grade it against that skill's rubric. Then copy it to LinkedIn Engine `drafts/YYYY-MM-DD - <title> (video).md`.

`tools/check.sh` checks the mechanical parts of the post: 800 to 1,400 characters, no em dashes, three hook options present, and every figure in the post also in the brief's claims table.

The draft has three hook options and says which one Claude would pick. Harsh writes the final hook. That step is not optional.

### 9. Ship

- Upload `renders/share.mp4` with the post.
- If the post used a new story, append it to LinkedIn Engine `_brand/story-bank.md` with its source and Publish line.
- Commit the piece on its own branch (`<slug>-video`) and open a PR. `frames/`, `renders/` and `review/` are git-ignored.

## Where things live

| Thing | Path |
|---|---|
| Pieces | `pieces/<slug>/` (brief, LOG, piece.json, src, post.md) |
| Repo styles | `styles/ballpoint`, `styles/paperprint`, and `styles/REFERENCES.md` for borrowed looks |
| Built-in styles | the animate skill's `styles/` (sketchbook, crosshatch, riso, math, pixel, isometric, cut paper) |
| Engine tools | the animate skill's `tools/` (`$ANIMATE` in this doc) |
| Post rubric and voice | LinkedIn Engine `.claude/skills/linkedin-post/` and `_brand/` |
| Writing | `~/.claude/skills/clarity/` |
