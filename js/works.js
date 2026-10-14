import { loadJSON, html, icon, showError } from "./common.js"

const grid = document.getElementById("works")

const renderProject = (project) => html`
  <article class="card work-card">
    <img src="${project.image}" alt="${project.title} preview" loading="lazy" />
    <div class="work-body">
      <div>
        <h2 class="work-title">${project.title}</h2>
        <p class="work-tagline">${project.tagline}</p>
      </div>
      <p class="work-desc">${project.description}</p>
      <div class="chips">${project.tags.map((tag) => html`<span class="chip">${tag}</span>`)}</div>
      <div class="btn-row">
        <a class="btn btn--ghost" href="${project.github}" target="_blank" rel="noopener noreferrer">
          ${icon("github", 14)} Source
        </a>
        ${project.preview &&
        html`
          <a class="btn" href="${project.preview}" target="_blank" rel="noopener noreferrer">
            ${icon("preview", 14)} Preview
          </a>
        `}
      </div>
    </div>
  </article>
`

try {
  const projects = await loadJSON("projects.json")
  grid.innerHTML = html`${projects.map(renderProject)}`
  // Swap broken images (e.g. rate-limited GitHub previews) for a placeholder.
  grid.querySelectorAll(".work-card img").forEach((img) => {
    img.addEventListener("error", () => {
      const placeholder = document.createElement("div")
      placeholder.className = "work-placeholder"
      placeholder.textContent = img.alt.replace(/ preview$/, "")
      img.replaceWith(placeholder)
    })
  })
} catch (error) {
  console.error(error)
  showError(grid, "Couldn't load projects. Please refresh the page.")
} finally {
  grid.setAttribute("aria-busy", "false")
}
