#!/usr/bin/env bash
# Fetch a job posting URL as plain text. Direct fetch with a browser user agent
# first (works on sites that 403 the default WebFetch). Prints the JobPosting
# JSON-LD description if present, otherwise the page's visible text.
# Usage: ./fetch-jd.sh <url>   (exits non-zero if the direct fetch is blocked)
set -euo pipefail

URL="${1:?usage: fetch-jd.sh <url>}"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT
code="$(curl -sS -o "$tmp" -w "%{http_code}" -A "$UA" -L "$URL" || echo 000)"
if [ "$code" != "200" ]; then
  echo "direct fetch failed with HTTP $code" >&2
  exit 2
fi

python3 - "$tmp" <<'PY'
import sys, re, html, json
raw = open(sys.argv[1], encoding="utf-8", errors="ignore").read()

# Prefer a JobPosting JSON-LD block (clean, structured description).
for b in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', raw, flags=re.S):
    try:
        d = json.loads(b)
    except Exception:
        continue
    for it in (d if isinstance(d, list) else [d]):
        if isinstance(it, dict) and it.get("@type") == "JobPosting":
            print("TITLE:", it.get("title", ""))
            loc = it.get("jobLocation", "")
            if loc:
                print("LOCATION_JSONLD:", json.dumps(loc)[:200])
            desc = html.unescape(re.sub(r"<[^>]+>", "\n", it.get("description", "")))
            print("\n".join(l.strip() for l in desc.splitlines() if l.strip()))
            sys.exit(0)

# Fallback: strip tags to visible text.
t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", raw, flags=re.S | re.I)
t = html.unescape(re.sub(r"<[^>]+>", "\n", t))
print("\n".join(l.strip() for l in t.splitlines() if l.strip()))
PY
