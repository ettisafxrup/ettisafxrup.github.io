// Shared helpers for every page.

export async function loadJSON(name) {
  // Resolve relative to this module so pages work from any base path.
  const url = new URL(`../data/${name}`, import.meta.url)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to load ${name} (${response.status})`)
  return response.json()
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ESCAPES[ch])
}

// Markup that is already safe; interpolating it into html`` skips escaping.
class SafeHTML {
  constructor(value) {
    this.value = value
  }
  toString() {
    return this.value
  }
}

export const raw = (value) => new SafeHTML(value)

function toHTML(value) {
  if (value instanceof SafeHTML) return value.value
  if (Array.isArray(value)) return value.map(toHTML).join("")
  if (value === false || value == null) return ""
  return escapeHTML(value)
}

// Tagged template: escapes interpolated values; nested html`` and arrays of
// them are inserted as-is. The result can be assigned to innerHTML directly.
export function html(strings, ...values) {
  return raw(strings.reduce((out, str, i) => out + toHTML(values[i - 1]) + str))
}

export function showError(container, message) {
  container.innerHTML = html`<p class="status">${message}</p>`
}

// ===== Theme toggle =====
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

function currentTheme() {
  return document.documentElement.dataset.theme || (darkQuery.matches ? "dark" : "light")
}

function renderToggle(button) {
  const dark = currentTheme() === "dark"
  button.textContent = dark ? "☀" : "☾"
  button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme")
}

export function initThemeToggle() {
  const button = document.querySelector(".theme-toggle")
  if (!button) return
  renderToggle(button)
  darkQuery.addEventListener("change", () => renderToggle(button))
  button.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem("theme", next)
    } catch {}
    renderToggle(button)
  })
}

export function initFooter() {
  const year = document.getElementById("year")
  if (year) year.textContent = new Date().getFullYear()
}

// ===== Icons (Simple Icons / Material paths, 24x24 viewBox) =====
export const ICONS = {
  github:
    "M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.112.82-.258.82-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.107-.775.42-1.304.763-1.604-2.665-.3-5.466-1.337-5.466-5.933 0-1.31.467-2.38 1.236-3.22-.124-.303-.536-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.654.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.609-2.807 5.628-5.479 5.922.431.371.815 1.104.815 2.227v3.301c0 .321.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.039-1.851-3.039-1.852 0-2.135 1.445-2.135 2.939v5.669H9.352V9h3.414v1.561h.049c.476-.9 1.637-1.851 3.37-1.851 3.603 0 4.268 2.37 4.268 5.451v6.291zM5.337 7.433a2.07 2.07 0 110-4.139 2.07 2.07 0 010 4.139zm1.776 13.019H3.56V9h3.553v11.452zM22.225 0H1.771C.792 0 0 .77 0 1.723v20.554C0 23.23.792 24 1.771 24h20.451C23.2 24 24 23.23 24 22.277V1.723C24 .77 23.2 0 22.225 0z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  facebook:
    "M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.121V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  discord:
    "M20.317 4.369a19.791 19.791 0 00-4.885-1.515.07.07 0 00-.073.035c-.211.375-.444.864-.608 1.248a18.368 18.368 0 00-5.487 0 12.15 12.15 0 00-.617-1.248.077.077 0 00-.073-.035A19.736 19.736 0 003.684 4.37a.064.064 0 00-.03.025C.533 9.045-.32 13.578.099 18.057a.085.085 0 00.031.058 19.978 19.978 0 006.073 3.058.07.07 0 00.075-.027c.468-.64.884-1.319 1.245-2.03a.076.076 0 00-.041-.106 13.224 13.224 0 01-1.884-.9.077.077 0 01-.008-.13c.127-.094.254-.188.377-.285a.07.07 0 01.073-.01c3.927 1.793 8.18 1.793 12.061 0a.07.07 0 01.074.01c.123.097.25.191.377.285a.077.077 0 01-.006.13c-.6.364-1.23.676-1.883.9a.076.076 0 00-.042.106c.36.711.776 1.39 1.245 2.03a.07.07 0 00.075.027 19.933 19.933 0 006.077-3.058.085.085 0 00.03-.058c.5-5.177-.838-9.673-3.548-13.663a.06.06 0 00-.03-.027zM8.02 15.331c-1.183 0-2.155-1.085-2.155-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.095 2.156 2.419 0 1.333-.955 2.419-2.156 2.419zm7.965 0c-1.183 0-2.155-1.085-2.155-2.419 0-1.333.955-2.419 2.155-2.419 1.21 0 2.176 1.095 2.156 2.419 0 1.333-.946 2.419-2.156 2.419z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  email:
    "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z",
  preview:
    "M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z",
}

export const BRAND_COLORS = {
  linkedin: "#0a66c2",
  youtube: "#ff0000",
  facebook: "#1877f2",
  instagram: "#e4405f",
  discord: "#5865f2",
  whatsapp: "#25d366",
  email: "#d44638",
}

export function icon(id, size = 16) {
  const path = ICONS[id]
  if (!path) return raw("")
  return raw(
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`
  )
}

initThemeToggle()
initFooter()
