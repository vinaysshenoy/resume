---
name: tailor-resume
description: Generate a job-tailored resume.json from the base resume.json. Use when the user provides a job description (a job posting URL, pasted job-description text, or a path to a saved job HTML file) and wants a resume tailored to it. The skill's only output is the tailored resume.json.
---

# Tailor Resume

Generate a resume tailored to a specific job. **The skill's only output is the tailored `resume.json`** — it
writes the file and stops.
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
   **This is the final step — the skill's only output is this file.**
6. **Report a review card** (not a prose summary):
   - **Output:** the tailored `tailored/<job-slug>/resume.json` path.
   - **What changed** from base and why — which JD keywords drove the summary/title rewrite and the bullet
     selection/reordering.
   - **Keyword coverage:** the JD's top terms now **truthfully present** in the resume, and the terms the JD
     wants that are **genuinely absent** from the base (so the user decides whether to stretch or skip). Never
     invent coverage to close a gap — a missing term is a signal, not a hole to paper over.
   - **To verify before sending:** any number, claim, or link worth a second look.

## ATS note (the one lever tailoring controls)

The rendered resume is already ATS-safe (single column, real bullets, standard headers) — that's fixed by the
template, not by this skill. The only ATS lever the tailored **data** controls is **section-header wording**
(from `sections[].title` in the JSON). Keep headers parser-standard — `Work Experience`, `Skills`, `Education`,
`Projects` are all safe; never rename a section to something creative ("My Journey", "What I've Built"), which
stops a parser from finding the section.

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
- `fetch-jd.sh` handles job-posting URLs (browser-UA fetch + JSON-LD extraction).
