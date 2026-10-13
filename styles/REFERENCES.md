# Style references

Looks to borrow from when you start a new piece. Every entry is a post by [Kevin Ngo](https://x.com/kevin_t_ngo). Each one notes what the look does, what kind of piece it fits, and how to get it from this repo's canvas setup.

The notes come from watching the posts in a browser. Posts 2 and 9 played their animation, and the notes describe the motion that was visible. For the other videos only the opening frame was seen, and the image posts are stills, so their motion notes are suggestions, not descriptions.

To ask for one, name it in your prompt. For example: "Use the animate skill. Look: pencil on notebook paper (see styles/REFERENCES.md). 20s about a customs hold."

## Quick picker

| # | Look | Best for | Energy |
|---|------|----------|--------|
| 1 | [Single ink line on cream](#1-single-ink-line-on-cream) | Calm intros, one idea, logo reveals | Very slow |
| 2 | [Pencil on notebook paper](#2-pencil-on-notebook-paper) | Explainers with people, step counts, onboarding | Playful |
| 3 | [Painterly night and day split](#3-painterly-night-and-day-split) | Before and after, two-sided comparisons | Slow |
| 4 | [Lit dome in the dark](#4-lit-dome-in-the-dark) | Hub or warehouse as a safe place, night operations | Quiet |
| 5 | [Engraved hatching in two inks](#5-engraved-hatching-in-two-inks) | Brand films, posters, premium tone | Stately |
| 6 | [Paper globe with lyric type](#6-paper-globe-with-lyric-type) | Global network stories set to music | Rhythmic |
| 7 | [Real terminal as the set](#7-real-terminal-as-the-set) | Product stories, how a tool helped someone | Talky |
| 8 | [Coloured-pencil board game](#8-coloured-pencil-board-game) | Strategy, us vs them, turn-based processes | Playful |
| 9 | [Crayon still life with music](#9-crayon-still-life-with-music) | Loops, mood pieces, social cut-downs | Gentle |

---

## 1. Single ink line on cream

[Post](https://x.com/kevin_t_ngo/status/2093500169723814093): "I asked Claude Fable 5 to make its own personal website."

- **What it looks like:** a warm cream page, nearly empty. One dark line, drawn by hand, makes a loop like a flower head. A thin stem falls from it, with a dotted line beside the stem. At the bottom is a band of tiny handwriting scribbles, like lines of text seen from far away. There's no colour except a hint of rust at the centre of the loop.
- **Motion to try:** draw the line on as one continuous stroke, with the dots appearing one at a time down the page. Hold on long pauses. Nothing else moves.
- **Fits:** the opening or closing card of a piece, a single promise ("one booking, one view"), or a calm end card under the logo.
- **In this repo:** `ink(P, { frac })` already draws a path partly, so drive `frac` from time. Fill the background flat with `BP.creamW`, keep `bpStrokes` off, and use `handText` at a small size for the scribble band.

## 2. Pencil on notebook paper

[Post](https://x.com/kevin_t_ngo/status/2109003656280646014): "Claude Opus 5.5 animated GIFs on paper using JavaScript."

- **What it looks like:** small chibi characters in coloured pencil, drawn on a photo of lined, squared notebook paper. A spiral-bound pad shows in the second GIF. The colours are soft and the outlines are rough.
- **Motion seen:** short loops. A handwritten "1" becomes "1 2 3", written on in place, and a character pops up from behind the top edge. Characters bob gently. The second GIF draws a rainbow path that winds down the page to a character.
- **Fits:** explainers that need people, such as customers, drivers and agents. It also suits counted steps ("3 documents you need") and onboarding or how-to clips. Loops work well for social posts.
- **In this repo:** this would be a new style folder, for example `styles/notebook/`. It needs a paper texture with a faint grid, a `pencil()` fill at low density for skin and clothes, and `handText` that writes on character by character. Keep loops short and seamless, around 2 to 4 seconds.

## 3. Painterly night and day split

[Post](https://x.com/kevin_t_ngo/status/2108559491499479351): "I asked Claude Opus 5.5 and Grok 4.7 to make JavaScript drawings." (image carousel)

- **What it looks like:** a soft sunset meadow full of tiny flowers, with a small orange robot and a white round companion. A black, star-filled silhouette cuts in from the right like a profile or cliff, so the frame is split between day and night. Another slide is a botanical study with pebbles and leaves.
- **Motion to try:** slow push-in on the meadow, then let the dark shape slide across as a wipe, with stars twinkling inside it.
- **Fits:** before and after stories ("manual vs automated"), two sides of one process, or day shift into night shift.
- **In this repo:** the night half is a clipped region filled with `bpStars`. Use a dense flower field from small `bpStrokes` marks, and pick one hero colour (the orange) that marks the subject, like red marks the shipment in `air-shipment`.

## 4. Lit dome in the dark

[Post](https://x.com/kevin_t_ngo/status/2108559495597367695): the second half of post 3's thread. (image carousel)

- **What it looks like:** a glass dome greenhouse on a dark, cratered plain under a starfield. Inside it's warm and lit, with sunflowers, potted plants and the small orange robot. A smaller dome sits beside it, with a rocket edge at the far left. The next slide adds a line of handwritten text and a scatter of city lights.
- **Motion to try:** a slow lateral dolly along the ground, with the window glow flickering softly. Then cut to the text slide and write the line on.
- **Fits:** a hub, warehouse or control tower shown as the warm safe place in a hostile environment. It also suits night operations, or a "while you sleep" story.
- **In this repo:** build the dome from `bpArc` ribs over a `bpFill` with a warm gradient. Make the ground `bpStrokes` in `BP.tar` and `BP.navy`, and place a few `bpStars`. Ballpoint already has the gold and orange glow colours for this.

## 5. Engraved hatching in two inks

[Post](https://x.com/kevin_t_ngo/status/2108276280286425117): "JavaScript drawings by Claude Opus 5.5." (image carousel)

- **What it looks like:** an etching or banknote engraving. The sky is a tiled pattern of fan-shaped scallops in blue ink, and it turns peach toward a low sun drawn as radiating hatched rays. A crescent moon, a brick chimney and roofs are drawn in fine parallel lines. The second slide is gold and brown, with dotted rays and a woodcut feel.
- **Motion to try:** reveal the hatching row by row, like a press printing, while the sun's rays rotate very slowly. Keep camera moves to a minimum.
- **Fits:** brand films, anniversary or milestone posts, poster-style stills that move slightly, and anything that should feel premium or archival.
- **In this repo:** this would be a new style. Hatching is `bpStrokes` with `spread: 0` and fixed angles per region. Scallops are rows of arcs. Limit the palette to two inks plus paper.

## 6. Paper globe with lyric type

[Post](https://x.com/kevin_t_ngo/status/2108208479358026208): "I made a music video about plate tectonics and continental drift. Animated in Python, rendered in Blender. Made with Claude Opus 5.5 + Suno v6."

- **What it looks like:** a big hand-drawn globe on textured paper, in muted blue sea and green land. The continents have ink outlines, and small pine trees and mountains are drawn on them. A serif headline sits at the top, "GIVE IT TWO HUNDRED", with the key words in orange. It reads as a lyric on screen.
- **Motion to try** (only the first frame was seen): the globe turns slowly while continents drift, with lyric lines set on the beat and one or two words picked out in the accent colour.
- **Fits:** global network stories, trade lanes, "how far your parcel travels", and anything set to music with words on screen.
- **In this repo:** `bpGlobe` is the starting point. Set lyric lines in a serif face at the top safe area, and time them with `score.js` beats (the `bpm` in `piece.json`). Keep one accent colour for the emphasised words.

## 7. Real terminal as the set

[Post](https://x.com/kevin_t_ngo/status/2106864721525915941): "I made a short film called Slow Me Down." A dad vibe codes a game for his daughter, and she asks Claude why he always loses. "Made with Sonnet 5.5 using real Claude Code sessions."

- **What it looks like:** it opens on a dark Claude Code terminal, showing the pixel mascot, the version line and the working folder. The real tool screen is the set, and the story is told through what gets typed.
- **Motion to try** (only the first frame was seen): type-on prompts at a human pace, with output that scrolls, and cuts between the terminal and the world the code changes.
- **Fits:** product or customer stories ("how a planner fixed a booking in two minutes"), internal tool launches, or a human moment told through a screen.
- **In this repo:** a terminal panel is a dark rect plus monospaced `fillText` revealed character by character. Mix it with any drawn style for the "real world" cutaways.

## 8. Coloured-pencil board game

[Post](https://x.com/kevin_t_ngo/status/2105428752348189126): link only, no caption. (image carousel)

- **What it looks like:** a chessboard ruled by hand on paper with rank and file letters, shaded in light green pencil. The pieces are cute critters, purple on one side and orange mushroom-capped on the other. "your move" is written underneath, beside a doodled pencil and eraser. The next slide zooms in on the critters.
- **Motion to try:** pieces hop one square at a time, and the caption rewrites itself each turn. Push in on a piece for close-ups.
- **Fits:** strategy and planning stories, us vs them (shipper and carrier, two routes), turn-based processes such as approvals or customs back-and-forth.
- **In this repo:** draw the grid with `bpLine`, keep the pieces small sprites built from `pencil()` fills, and move them with eased hops of one square per beat.

## 9. Crayon still life with music

[Post](https://x.com/kevin_t_ngo/status/2103482164193165711): "I asked Claude Opus 5.5 to compose piano music. Animation drawn using JavaScript."

- **What it looks like:** crayon or soft pencil on paper. Sheet music sits on a piano stand, with a glowing yellow lamp behind and a pale blue wall. A black cat lies on top of the stand, and the orange pixel Claude mascot peeks up from below.
- **Motion seen:** the cat leaves the frame and the mascot rises behind the stand, squashing slightly with its eyes changing shape. The camera stays locked, so all the life comes from the characters and the music.
- **Fits:** loops, mood pieces, social cut-downs, or a "thank you" or end card with a score under it.
- **In this repo:** lock the frame and put the motion in two or three small actors with squash and stretch. Use a lamp glow as a radial gradient behind crayon `bpStrokes`. Sync the small moves to the notes in `score.js`.
