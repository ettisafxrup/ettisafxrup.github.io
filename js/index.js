async function fetchData() {
  const response = await fetch("../data/index.json")
  const data = await response.json()
  return data
}

const data = await fetchData()

const mobile = document.getElementById("mobile")
const email = document.getElementById("email")
const address = document.getElementById("address")
mobile.textContent = data.contact.mobile
email.textContent = data.contact.email
address.textContent = data.contact.address

const referenceList = document.getElementById("reference-list")
data.references.forEach((reference) => {
  const referenceItem = document.createElement("li")
  referenceItem.innerHTML = `
    <strong>${reference.name}</strong><br />
    <small>${reference.position}, ${reference.company}</small>
    <p style="margin-top: -3px"></p>
    <small>${reference.contact}</small>
    <p style="margin-top: -3px"></p>
    <small>${reference.email}</small>
  `
  referenceList.appendChild(referenceItem)
})

const about = document.getElementById("about")
about.textContent = data.about

const workExperience = document.getElementById("work-experience")
data.experience.forEach((experience) => {
  const experienceItem = document.createElement("div")
  experienceItem.innerHTML = `
    <p><strong>${experience.title}</strong>, ${experience.company}</p>
    <p>${experience.jobspan}</p>
    <p>${experience.responsibilites}</p>
    <br />
  `
  workExperience.appendChild(experienceItem)
})

const educationBox = document.getElementById("education")
data.education.forEach((education) => {
  const educationItem = document.createElement("div")
  educationItem.innerHTML = `
    <small style="font-size: 12px"><i>${education.status}</i></small>
    <p><strong>${education.focus}</strong>, ${education.institute} | ${education.span}</p>
    <p style="margin-top: 10px"></p>
  `
  educationBox.appendChild(educationItem)
})

const skillsBox = document.getElementsByClassName("skills")[0]
data.skills.forEach((skill) => {
  const skillItem = document.createElement("div")
  skillItem.innerHTML = `
    <p class="skills-card">${skill}</p>
  `
  skillsBox.appendChild(skillItem)
})

const hobbiesBox = document.getElementsByClassName("hobbies")[0]
data.hobbies.forEach((hobby) => {
  const hobbyItem = document.createElement("div")
  hobbyItem.innerHTML = `
              <div><br /><p style="margin-left: 10px; margin-right: 10px; font-weight: bold">${hobby}</p></div>

  `
  hobbiesBox.appendChild(hobbyItem)
})
