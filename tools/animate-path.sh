#!/usr/bin/env bash
# Prints the animate skill folder (the one holding tools/build.mjs).
# Set ANIMATE to skip the search.
set -euo pipefail

if [[ -n "${ANIMATE:-}" ]]; then
  [[ -f "$ANIMATE/tools/build.mjs" ]] || { echo "ANIMATE=$ANIMATE has no tools/build.mjs" >&2; exit 1; }
  echo "$ANIMATE"; exit 0
fi

for root in "$HOME/.claude/plugins" "$HOME/.claude/skills"; do
  [[ -d "$root" ]] || continue
  hit=$(find "$root" -path '*animate/tools/build.mjs' -not -path '*/node_modules/*' 2>/dev/null | head -1)
  if [[ -n "$hit" ]]; then dirname "$(dirname "$hit")"; exit 0; fi
done

echo "animate skill not found. Install it (/plugin install animate@animate) or set ANIMATE." >&2
exit 1
