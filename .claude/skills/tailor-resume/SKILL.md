---
name: tailor-resume
description: Generate a job-tailored PDF resume from resume.json. Use when the user provides a job description (a job posting URL, pasted job-description text, or a path to a saved job HTML file) and wants a resume tailored to it. Produces a tagged, ATS-friendly PDF.
---

# Tailor Resume

Generate a resume tailored to a specific job, rendered to a tagged (ATS-friendly) PDF.
The base `resume.json` at the repo root is the **source of truth** and is never modified;
each tailored resume is a separate derived artifact.

## Inputs (one of)
- A **job posting URL** → run `./fetch-jd.sh <url>` first. It does a direct fetch with a
  browser user agent (many careers sites `403` the default `WebFetch`) and prints the JobPosting
  JSON-LD or the page's visible text. Only if it exits non-zero (blocked), fall back to `WebFetch`,
  then a headless-Chrome render (`--headless=new --dump-dom`).
- **Pasted job-description text** → use it directly.
- A **path to a saved HTML file** of the posting → read it and extract the visible text (strip tags/nav/boilerplate).

## Steps

1. **Get the JD text** from whichever input was given (above). For a URL, `./fetch-jd.sh <url>` is the first attempt.
2. **Read the base `resume.json`** at the repo root.
3. **Analyze the JD**: target role/title, seniority, core responsibilities, and the concrete
   skills/technologies/keywords it emphasizes.
4. **Produce a tailored data object** with the same JSON schema as `resume.json`:
   - **Summary**: this is the ONLY prose you may rewrite. Rewrite it to target the role using the JD's language,
     grounded only in real experience.
   - **Title** (headline): adjust to match the target role if appropriate.
   - **Skills**: reorder/filter so the JD-relevant technologies surface first. Only include skills already present.
   - **Each role's / project's body (intro paragraphs AND bullet items)**: keep the text **verbatim**. You may
     only **select** (keep the relevant ones, drop the irrelevant ones) and **reorder** them to surface what
     matches the JD. Do NOT reword, rephrase, merge, shorten, or otherwise edit any bullet or paragraph.
   - Keep `company`, `role`, `dates`, `location`, and `education` **verbatim** (factual anchors).
5. **Write the tailored JSON** to `tailored/<job-slug>/resume.json` (create the folder; slug from company+role).
6. **Render the PDF**:
   ```
   .claude/skills/tailor-resume/generate.sh tailored/<job-slug>/resume.json "tailored/<job-slug>/<Name> - <Role>.pdf"
   ```
   This uses the shared `buildResumeHtml` template + headless Chrome, producing a tagged PDF that matches the
   live site's styling and page density.
7. **Report** the output path and a short note on what was emphasized/added/dropped for this job.

## Guardrails (do not violate)
- **Do not edit job/project content.** Bullet items and their intro paragraphs must stay **verbatim** from
  `resume.json`. Tailoring them means only **picking** the bullets/paragraphs that fit the role (keep or drop)
  and **reordering** them — never rewording, rephrasing, merging, shortening, or otherwise editing them.
- **The summary is the only prose you may rewrite** (the title/headline may also be adjusted). Everything else is
  select / reorder / filter of existing content only.
- **Never fabricate.** Do not invent companies, roles, titles, dates, degrees, metrics, skills, technologies, or
  achievements that are not already in `resume.json`.
- **Keep factual anchors verbatim**: company names, role titles, employment dates, locations, and education.
- Only the derived files under `tailored/` change. Never edit the base `resume.json`, `render.js`,
  `resume.css`, or `index.html` as part of tailoring.

## Notes
- The pipeline requires Node and Google Chrome (installed on this machine).
- `build.js` turns a data JSON into standalone print-ready HTML; `generate.sh` renders that HTML to a tagged PDF.
- To preview a tailored version in the browser instead of PDF, temporarily point the live site at the tailored
  JSON, or just open the generated HTML.
