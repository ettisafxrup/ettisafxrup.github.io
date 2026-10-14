# ettisafxrup.github.io

Personal portfolio and resume of **Ettisaf Rup**, live at <https://ettisafxrup.github.io>.

A static site with no build step: plain HTML, CSS, and ES modules, served by GitHub Pages.

## Structure

```
index.html          Resume (about, experience, education, skills, …)
works.html          Project gallery
contact.html        Contact links
favicon.svg
css/style.css       Shared styles (light/dark theme tokens)
js/common.js        Shared helpers: JSON loading, HTML escaping, icons, theme toggle
js/index.js         Renders the resume
js/works.js         Renders the project gallery
js/contact.js       Renders the contact cards
data/profile.json   Resume content, contact info, and social links
data/projects.json  Projects shown on the works page
```

## Updating content

Almost everything is data-driven, so edits usually only touch `data/`:

- **Experience, education, skills, languages, hobbies** → `data/profile.json`
- **Social / contact links** → `links` in `data/profile.json` (used by both the resume and the contact page; `id` picks the icon)
- **Projects** → `data/projects.json` (`preview` is optional; omit it to hide the Preview button)

SEO meta tags and structured data live in the `<head>` of `index.html` — update them when the headline or role changes.

## Running locally

ES modules need to be served over HTTP:

```sh
python -m http.server 8000
# then open http://localhost:8000
```
