#!/usr/bin/env bash
# Builds a piece, optionally renders it, runs the animate review and checks the post copy.
# usage: tools/check.sh <slug> [--export] [--only-audio] [--format 1:1]
#   --export      render frames, score and stems to renders/share.mp4 first
#   --only-audio  re-mix the score and remux, no new frames
# Exits non-zero if the review or the post check fails.
set -euo pipefail

cd "$(dirname "$0")/.."
slug="${1:-}"; shift || true
dir="pieces/$slug"
[[ -n "$slug" && -f "$dir/piece.json" ]] || { echo "usage: tools/check.sh <slug> [--export] [--only-audio] [--format F]" >&2; exit 2; }

export_args=(); review_args=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --export) export_args+=(--share); shift ;;
    --only-audio) export_args+=(--only-audio --share); shift ;;
    --format) review_args+=(--format "$2"); shift 2 ;;
    *) echo "unknown option $1" >&2; exit 2 ;;
  esac
done

# review.mjs draws labels with ffmpeg drawtext, which the Homebrew default ffmpeg lacks.
[[ -d /opt/homebrew/opt/ffmpeg-full/bin ]] && export PATH="/opt/homebrew/opt/ffmpeg-full/bin:$PATH"
# Capture first: under pipefail, grep -q closing the pipe early makes ffmpeg exit 141.
grep -q drawtext <<<"$(ffmpeg -hide_banner -filters 2>/dev/null)" \
  || { echo "ffmpeg has no drawtext filter. brew install ffmpeg-full" >&2; exit 1; }

ANIMATE=$(tools/animate-path.sh)

echo "== build"
node "$ANIMATE/tools/build.mjs" "$dir"

if [[ ${#export_args[@]} -gt 0 ]]; then
  echo "== export"
  node "$ANIMATE/tools/export.mjs" "$dir" "${export_args[@]}"
fi

status=0
if [[ -f "$dir/renders/final.mp4" ]]; then
  echo "== review"
  node "$ANIMATE/tools/review.mjs" "$dir" ${review_args[@]+"${review_args[@]}"} || status=1
  echo "Look at $dir/review/shot*-sheet.jpg and $dir/review/phone.jpg, then write the PASS table in $dir/LOG.md."
else
  echo "== review skipped: no $dir/renders/final.mp4 yet (run with --export)"
fi

if [[ -f "$dir/post.md" ]]; then
  echo "== post"
  node tools/post-check.mjs "$dir" || status=1
fi

exit $status
