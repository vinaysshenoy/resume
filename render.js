function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Content fields (paragraphs, list items) intentionally allow raw <a> tags
// so links can be embedded directly in resume.json.
function renderBody(body) {
  return body
    .map((block) => {
      if (block.type === "paragraph") {
        return `<p class="intro">${block.text}</p>`;
      }
      if (block.type === "list") {
        const items = block.items.map((item) => `<li>${item}</li>`).join("");
        return `<ul class="highlights">${items}</ul>`;
      }
      return "";
    })
    .join("");
}

function renderStack(stack) {
  return stack
    .map(
      (entry) =>
        `<p class="stack"><strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}</p>`
    )
    .join("");
}

function renderJob(job) {
  return `
    <div class="job">
      <div class="job-header">
        <div class="job-title-block">
          <span class="company">${escapeHtml(job.company)}</span>
          ${job.role ? `<span class="role">${escapeHtml(job.role)}</span>` : ""}
        </div>
        ${job.dates ? `<span class="meta">${escapeHtml(job.dates)}</span>` : ""}
        ${job.location ? `<span class="meta">${escapeHtml(job.location)}</span>` : ""}
      </div>
      ${renderBody(job.body)}
      ${renderStack(job.stack || [])}
    </div>
  `;
}

function renderSkills(skills) {
  if (!skills || !skills.length) return "";
  return `
    <section class="skills">
      <h2 class="section-title">Skills</h2>
      ${skills
        .map(
          (entry) =>
            `<p class="stack"><strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}</p>`
        )
        .join("")}
    </section>
  `;
}

function renderSection(section) {
  return `
    <section class="experience">
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      ${section.jobs.map(renderJob).join("")}
    </section>
  `;
}

function renderEducation(education) {
  return `
    <section class="education">
      <h2 class="section-title">Education</h2>
      ${education
        .map(
          (edu) => `
        <div class="edu-item">
          <span class="company">${escapeHtml(edu.institution)}</span>
          <span class="role">${escapeHtml(edu.degree)}</span>
          <span class="meta">${escapeHtml(edu.dates)}</span>
          <span class="meta">${escapeHtml(edu.location)}</span>
        </div>
      `
        )
        .join("")}
    </section>
  `;
}

// Render a data object into the preview and update the page title.
function loadData(data) {
  document.title = `${data.name} — ${data.title}`;
  document.getElementById("app").innerHTML = buildResumeHtml(data);
}

// Wire up the toolbar: load a resume JSON file to preview, and print to PDF.
function setUpToolbar() {
  const fileInput = document.getElementById("file-input");

  document
    .getElementById("load-button")
    .addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        loadData(JSON.parse(reader.result));
      } catch (err) {
        window.alert(`Couldn't parse ${file.name}: ${err.message}`);
      }
    };
    reader.readAsText(file);
    fileInput.value = ""; // let the same file be re-selected later
  });

  // Print styles (@media print) hide the toolbar and lay out the page for PDF;
  // the user saves as PDF from the browser's print dialog.
  document
    .getElementById("pdf-button")
    .addEventListener("click", () => window.print());
}

// Pure: build the resume markup from a data object. No DOM/fetch access, so it
// is safe to require() from Node (the tailoring skill uses it to render HTML).
function buildResumeHtml(data) {
  return `
    <div class="top-bar"></div>
    <header class="hero">
      <h1>${escapeHtml(data.name)}</h1>
      <p class="title">${escapeHtml(data.title)}</p>
      <div class="contact">
        <span><span class="contact-label">Current location:</span> ${escapeHtml(data.location)}</span>
        <span><span class="contact-label">Contact number:</span> ${escapeHtml(data.phone)}</span>
        <span><span class="contact-label">Email:</span> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></span>
        <span><span class="contact-label">Qualification:</span> ${escapeHtml(data.qualification)}</span>
      </div>
    </header>

    <section class="summary">
      <h2 class="section-title">Summary</h2>
      <p>${escapeHtml(data.summary)}</p>
    </section>

    ${renderSkills(data.skills)}

    ${data.sections.map(renderSection).join("")}

    ${renderEducation(data.education)}
  `;
}

// Browser bootstrap: wire the toolbar, then load the default resume.json.
// Only runs in a page, so require() in Node is side-effect free.
if (typeof document !== "undefined") {
  setUpToolbar();
  fetch("resume.json")
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load resume.json (${res.status})`);
      return res.json();
    })
    .then(loadData)
    .catch((err) => {
      document.getElementById("app").innerHTML = `
        <div style="padding:2rem;font-family:sans-serif;color:#c0392b;">
          <strong>Couldn't auto-load resume.json.</strong><br/>
          ${escapeHtml(err.message)}<br/><br/>
          Use <strong>Load resume</strong> in the toolbar to pick a resume JSON file,
          or serve the folder so fetch works, e.g.:<br/>
          <code>cd "${escapeHtml(location.pathname.replace(/\/[^/]*$/, ""))}" &amp;&amp; python3 -m http.server</code>
          then open <code>http://localhost:8000</code>.
        </div>
      `;
    });
}

// Node export for the tailoring skill's build step.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    buildResumeHtml,
    escapeHtml,
    renderBody,
    renderStack,
    renderJob,
    renderSkills,
    renderSection,
    renderEducation,
  };
}
