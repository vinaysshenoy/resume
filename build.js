#!/usr/bin/env node
// Build a standalone, print-ready resume HTML from a data JSON, using the same
// buildResumeHtml template the live site uses and the site's stylesheet.
// Usage: node build.js <data.json> <out.html>
const fs = require("fs");
const path = require("path");

const REPO = __dirname; // build.js lives at the repo root, alongside render.js
const { buildResumeHtml } = require(path.join(REPO, "render.js"));

const [, , dataPath, outPath] = process.argv;
if (!dataPath || !outPath) {
  console.error("usage: build.js <data.json> <out.html>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const css = fs.readFileSync(path.join(REPO, "resume.css"), "utf8");
const title = `${data.name} — ${data.title}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
${css}
</style>
</head>
<body>
<div class="resume" id="app">${buildResumeHtml(data)}</div>
</body>
</html>
`;

fs.writeFileSync(outPath, html);
console.log("wrote", outPath);
