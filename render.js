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
          <span class="role">${escapeHtml(job.role)}</span>
        </div>
        <span class="meta">${escapeHtml(job.dates)} · ${escapeHtml(job.location)}</span>
      </div>
      ${renderBody(job.body)}
      ${renderStack(job.stack || [])}
    </div>
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
          <span class="company">${escapeHtml(edu.institution)} — ${escapeHtml(edu.degree)}</span>
          <span class="meta">${escapeHtml(edu.dates)} · ${escapeHtml(edu.location)}</span>
        </div>
      `
        )
        .join("")}
    </section>
  `;
}

function setUpPdfButton(data) {
  const button = document.getElementById("pdf-button");
  const defaultLabel = button.textContent;

  button.addEventListener("click", () => {
    button.disabled = true;
    button.textContent = "Generating…";

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${data.name} - Resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css"] },
      })
      .from(document.getElementById("app"))
      .save()
      .finally(() => {
        button.disabled = false;
        button.textContent = defaultLabel;
      });
  });
}

function render(data) {
  document.title = `${data.name} — ${data.title}`;

  document.getElementById("app").innerHTML = `
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

    ${data.sections.map(renderSection).join("")}

    ${renderEducation(data.education)}
  `;

  setUpPdfButton(data);
}

fetch("resume.json")
  .then((res) => {
    if (!res.ok) throw new Error(`Failed to load resume.json (${res.status})`);
    return res.json();
  })
  .then(render)
  .catch((err) => {
    document.getElementById("app").innerHTML = `
      <div style="padding:2rem;font-family:sans-serif;color:#c0392b;">
        <strong>Couldn't load resume.json.</strong><br/>
        ${escapeHtml(err.message)}<br/><br/>
        If you opened this file directly (file://), browsers block loading local JSON via fetch.
        Serve the folder instead, e.g.:<br/>
        <code>cd "${escapeHtml(location.pathname.replace(/\/[^/]*$/, ""))}" &amp;&amp; python3 -m http.server</code>
        then open <code>http://localhost:8000</code>.
      </div>
    `;
  });
