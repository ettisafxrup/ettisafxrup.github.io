import { loadJSON, html } from "./common.js"

const $ = (id) => document.getElementById(id)
const render = (id, markup) => ($(id).innerHTML = markup)

const newTab = (url, label) =>
  html`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`

function renderContact({ contact }) {
  const phoneHref = `tel:${contact.mobile.replace(/[^\d+]/g, "")}`
  render(
    "contact",
    html`
      <li><span aria-hidden="true">📞</span><a href="${phoneHref}">${contact.mobile}</a></li>
      <li><span aria-hidden="true">📧</span><a href="mailto:${contact.email}">${contact.email}</a></li>
      <li><span aria-hidden="true">🏡</span><span>${contact.address}</span></li>
    `
  )
}

function renderLinks({ links }) {
  render(
    "links",
    html`${links
      .filter((link) => link.id !== "email")
      .map((link) => html`<li>${newTab(link.url, link.label)}</li>`)}`
  )
}

function renderReferences({ references }) {
  if (!references.length) return
  render(
    "references",
    html`${references.map(
      (ref) => html`
        <li class="timeline-item">
          <strong>${ref.name}</strong>
          <div class="timeline-meta">${ref.position}, ${ref.company}</div>
          <div class="timeline-meta">${ref.contact}</div>
          <div class="timeline-meta">${ref.email}</div>
        </li>
      `
    )}`
  )
  $("references-section").hidden = false
}

function renderLanguages({ languages }) {
  render(
    "languages",
    html`${languages.map(
      (lang) => html`<li>${lang.name} <small class="muted"><i>(${lang.level})</i></small></li>`
    )}`
  )
}

function renderExperience({ experience }) {
  render(
    "experience",
    html`${experience.map(
      (job) => html`
        <li class="timeline-item">
          <div class="timeline-head">
            <span>
              <strong>${job.title}</strong>, ${job.url ? newTab(job.url, job.company) : job.company}
              <span class="badge">${job.type}</span>
            </span>
            <span class="timeline-meta">${job.span}</span>
          </div>
          <p>${job.summary}</p>
        </li>
      `
    )}`
  )
}

function renderEducation({ education }) {
  render(
    "education",
    html`${education.map(
      (edu) => html`
        <li class="timeline-item">
          <div class="timeline-head">
            <span><strong>${edu.degree}</strong><span class="badge">${edu.status}</span></span>
            <span class="timeline-meta">${edu.span}</span>
          </div>
          <p>${edu.institute}</p>
        </li>
      `
    )}`
  )
}

function renderSkills({ skills }) {
  render(
    "skills",
    html`${Object.entries(skills).map(
      ([group, items]) => html`
        <div class="skill-group">
          <h3>${group}</h3>
          <div class="chips">${items.map((skill) => html`<span class="chip">${skill}</span>`)}</div>
        </div>
      `
    )}`
  )
}

function renderHobbies({ hobbies }) {
  render("hobbies", html`${hobbies.map((hobby) => html`<span>${hobby}</span>`)}`)
}

try {
  const profile = await loadJSON("profile.json")
  $("name").textContent = profile.name.toUpperCase()
  $("headline").textContent = profile.headline
  $("about").textContent = profile.about
  renderContact(profile)
  renderLinks(profile)
  renderReferences(profile)
  renderLanguages(profile)
  renderExperience(profile)
  renderEducation(profile)
  renderSkills(profile)
  renderHobbies(profile)
} catch (error) {
  console.error(error)
  $("about").textContent = "Couldn't load profile data. Please refresh the page."
}
