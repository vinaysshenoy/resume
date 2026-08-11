# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-person resume site: `resume.json` holds the content, `render.js` turns it into HTML, `resume.css` styles it for both screen and print. There is no build system, no package manager, no tests — the site is plain static files opened in a browser.

## Commands

```bash
./serve [port]                         # python3 http.server on :8000 by default; needed because render.js fetch()es resume.json
node build.js <data.json> <out.html>   # standalone HTML with CSS inlined, using the site's own template
./generate.sh <data.json> <out.pdf>    # build.js + headless Chrome --print-to-pdf (tagged PDF, macOS Chrome path hardcoded)
```

Rendering works on any data JSON, so `./generate.sh tailored/<slug>/resume.json out.pdf` is how a tailored variant becomes a PDF.

Tailoring skill script (in `.claude/skills/tailor-resume/`, run from that directory):

```bash
./fetch-jd.sh <url>                    # fetch a job posting as text (browser UA + JSON-LD extraction); exit 2 = blocked
```

## Architecture

**`resume.json` is the single source of truth for content.** Its shape drives everything:

```
name, title, location, phone, email, qualification, summary
summaries: [{id, label, text}]      # hand-written framings; tailoring picks one, site ignores
skills:    [{label, value}]
sections:  [{title, jobs: [{company, role?, dates?, location?,
                            body: [{type:"paragraph", text} | {type:"list", items:[]}],
                            stack?: [{label, value}]}]}]
education: [{institution, degree, dates, location}]
```

`sections` is generic — "Work Experience", "Personal Projects", etc. are all just sections of jobs. Adding a field to the JSON means adding a renderer branch in `render.js`.

**`render.js` has a deliberate dual life.** `buildResumeHtml(data)` is pure (no DOM, no fetch) and is `module.exports`ed so Node can `require()` it; the browser bootstrap at the bottom is guarded by `typeof document !== "undefined"`. `build.js` requires the same file, so **the site preview and any generated PDF always share one template.** Don't add DOM or fetch access inside `buildResumeHtml` or its helpers — that breaks the Node path.

**Escaping is intentionally asymmetric.** Structural fields (name, company, role, dates, skill labels/values) go through `escapeHtml`. Content fields — paragraph `text` and list `items` — are injected raw so `<a>` links can live directly in `resume.json`. Keep it that way; the input is a hand-authored file, not user input.

**PDF export is browser print.** The "Download PDF" button calls `window.print()`; `@media print` in `resume.css` hides the toolbar. `break-inside: avoid` on jobs, list items, and stack lines is what keeps entries from splitting across pages — preserve those when touching layout.

## Tailored resumes

`.claude/skills/tailor-resume/` generates job-targeted variants into `tailored/<job-slug>/resume.json` (gitignored). Read `SKILL.md` before doing tailoring work — it encodes hard guardrails: **the title is the only prose that may be written**; the summary is *chosen* from the base's `summaries` variants and copied verbatim; job/project bullets and paragraphs may only be selected and reordered, never reworded; nothing may be fabricated; the base `resume.json`, `render.js`, `resume.css`, and `index.html` are never modified by tailoring.

The reason the summary is selected rather than generated: a per-job rewrite reads as keyword stuffing and drifts from the truth one plausible sentence at a time. Add a new hand-written variant instead of relaxing this.

`Vinay Shenoy - Engineering Lead.md` is a legacy markdown copy of the resume, not wired into anything.
