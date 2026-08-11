#!/usr/bin/env bash
# Render a data JSON into a tagged, print-ready PDF via the shared template + headless Chrome.
# Usage: ./generate.sh <data.json> <output.pdf>
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA="${1:?usage: generate.sh <data.json> <output.pdf>}"
OUT="${2:?usage: generate.sh <data.json> <output.pdf>}"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Google Chrome not found at $CHROME" >&2; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
HTML="$WORK/resume.html"

node "$DIR/build.js" "$DATA" "$HTML"

# Chrome prints a tagged PDF (StructTreeRoot) with H1/H2/list/link structure.
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "file://$HTML" >/dev/null 2>&1

echo "wrote $OUT"
