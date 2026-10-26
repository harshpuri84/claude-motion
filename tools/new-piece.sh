#!/usr/bin/env bash
# Starts a LinkedIn piece: pieces/<slug>/ from the animate template, set to 4:5.
# usage: tools/new-piece.sh <slug> [--title "Title"] [--style sketchbook] [--seconds 45] [--size 1080x1350]
# See PIPELINE.md for what comes next.
set -euo pipefail

cd "$(dirname "$0")/.."
slug="${1:-}"; shift || true
[[ "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "usage: tools/new-piece.sh <slug> [--title T] [--style S] [--seconds N] [--size WxH]" >&2; exit 2; }

title="$slug"; style="sketchbook"; seconds=45; size="1080x1350"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --title) title="$2"; shift 2 ;;
    --style) style="$2"; shift 2 ;;
    --seconds) seconds="$2"; shift 2 ;;
    --size) size="$2"; shift 2 ;;
    *) echo "unknown option $1" >&2; exit 2 ;;
  esac
done

dest="pieces/$slug"
[[ -e "$dest" ]] && { echo "$dest already exists" >&2; exit 1; }

ANIMATE=$(tools/animate-path.sh)
tpl="$ANIMATE/templates/piece"
[[ -d "$tpl" ]] || { echo "no piece template at $tpl" >&2; exit 1; }

if [[ ! -d "styles/$style" && ! -d "$ANIMATE/styles/$style" ]]; then
  echo "style '$style' is not in styles/ or the animate skill's styles/" >&2; exit 1
fi

mkdir -p "$dest"
cp -R "$tpl/." "$dest/"
cp templates/linkedin/post.md "$dest/post.md"

w="${size%x*}"; h="${size#*x}"
SLUG="$slug" TITLE="$title" STYLE="$style" SECONDS_="$seconds" W="$w" H="$h" DEST="$dest" node -e '
const fs = require("fs");
const e = process.env, file = e.DEST + "/piece.json";
const p = JSON.parse(fs.readFileSync(file, "utf8"));
const fps = 24, dur = Number(e.SECONDS_);
p.name = e.SLUG;
p.title = e.TITLE;
p.style = e.STYLE;
p.format = { width: +e.W, height: +e.H, fps, bpm: 120, duration: dur, frames: Math.round(dur * fps) };
p.review = { safe: { top: 60, bottom: 60, right: 60 }, refs: {}, textIgnore: [] };
fs.writeFileSync(file, JSON.stringify(p, null, 2) + "\n");
for (const f of ["brief.md", "LOG.md", "post.md"]) {
  const path = e.DEST + "/" + f;
  let s = fs.readFileSync(path, "utf8");
  s = s.replaceAll("<title>", e.TITLE).replaceAll("<name>", e.SLUG)
       .replace("1080x1920", `${e.W}x${e.H}`)
       .replace("<N>s = <N*24> frames", `${dur}s = ${Math.round(dur * fps)} frames`);
  fs.writeFileSync(path, s);
}
'

cat <<EOF
Started $dest ($size, ${seconds}s, style $style).

Next (PIPELINE.md):
  3. Story check: fill the beat table in $dest/brief.md, get it approved.
  4. Look check: node $ANIMATE/tools/still.mjs $dest 2.0,15.0,38.0 $dest/look.png --scale 0.5
  5. Storyboard: node $ANIMATE/tools/build.mjs $dest && node $ANIMATE/tools/storyboard.mjs $dest
  6-7. Render and review: tools/check.sh $slug --export
  8. Post copy: $dest/post.md, written with ~/.claude/skills/clarity/
EOF
