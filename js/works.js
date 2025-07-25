async function getProjectData() {
  const result = await fetch("./data/works.json")
  return result.json()
}

const data = await getProjectData()

console.log(data)
const worksGrid = document.getElementsByClassName("works-grid")[0]

data.forEach((work) => {
  const workCard = document.createElement("div")
  workCard.className = "work-card"
  workCard.innerHTML = `
         <div class="work-card">
  <img src="${work.image}" alt="${work.title}" />
  <div class="content">
    <div class="title">${work.title}</div>
    <small class="desc">${work.description}</small>

    <div class="buttons">
      <a href="${work.github}" class="btn github" target="_blank" aria-label="GitHub Link">
         <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.776.42-1.304.763-1.604-2.665-.304-5.466-1.335-5.466-5.931 0-1.31.468-2.38 1.235-3.22-.124-.304-.536-1.524.117-3.177 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016.003 0c2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.243 2.873.12 3.177.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.628-5.48 5.93.431.37.815 1.1.815 2.222v3.301c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
      </a>
      <a href="${work.preview}" class="btn preview" target="_blank" aria-label="Live Preview">
        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/>
        </svg>
      </a>
    </div>
  </div>
</div>
  `
  worksGrid.appendChild(workCard)
})
