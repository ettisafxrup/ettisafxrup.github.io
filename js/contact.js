import { loadJSON, html, icon, showError, BRAND_COLORS } from "./common.js"

const grid = document.getElementById("contact-links")

// Human-friendly handle shown under each platform name.
function handle(link) {
  if (link.url.startsWith("mailto:")) return link.url.slice("mailto:".length)
  if (link.id === "whatsapp") return "+" + link.url.replace(/\D/g, "")
  if (link.id === "discord") return "Join my server"
  const path = new URL(link.url).pathname.replace(/^\/(in\/)?|\/$/g, "")
  return path.startsWith("@") ? path : `@${path}`
}

const renderLink = (link) => {
  const external = !link.url.startsWith("mailto:")
  return html`
    <a
      class="card contact-card"
      href="${link.url}"
      ${external && html`target="_blank" rel="noopener noreferrer"`}
      style="--brand: ${BRAND_COLORS[link.id] || "var(--text)"}"
    >
      ${icon(link.id, 26)}
      <span>${link.label}<small>${handle(link)}</small></span>
    </a>
  `
}

try {
  const { links } = await loadJSON("profile.json")
  grid.innerHTML = html`${links.map(renderLink)}`
} catch (error) {
  console.error(error)
  showError(grid, "Couldn't load contact links. Please refresh the page.")
} finally {
  grid.setAttribute("aria-busy", "false")
}
