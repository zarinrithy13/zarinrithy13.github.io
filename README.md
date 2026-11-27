# zarinrithy13.github.io

Personal portfolio of **Zarin Saima Rithy**, M.A. student in Philosophy at Jahangirnagar University,
researching environmental philosophy, deep ecology and Spinoza.

Live: https://zarinrithy13.github.io

## Stack

Plain HTML, CSS and JavaScript. No build step.

- Fonts: [Inter](https://fonts.google.com/specimen/Inter), [Lora](https://fonts.google.com/specimen/Lora) (quotations)
- Icons: Font Awesome 6
- Theme: Ice Blue (light) and deep sky-blue (dark), toggle saved in `localStorage`
- Hosting: GitHub Pages

## Structure

```
index.html          single-page site
css/style.css       theme tokens (light/dark), layout, components
js/main.js          theme toggle, mobile nav, scroll reveal, counters, typing effect, 3D tilt cards
assets/
  favicon.svg
  img/
    headshot.webp/.png   hero portrait (background removed)
    thesis.webp/.jpg     research section photo
    og-image.png         link preview (1200x630)
    logos/               institution logos (WebP, square)
```

## Adding institution logos

Education and experience cards show a text monogram (`org__logo--mono`) until a logo file exists.
To swap one in, save a square WebP in `assets/img/logos/` and replace the monogram span, e.g.:

```html
<span class="org__logo org__logo--sm"><img src="assets/img/logos/ju.webp" alt="Jahangirnagar University logo" width="56" height="56" loading="lazy"></span>
```

In place: `ju.webp` (Jahangirnagar University), `shk.webp` (Shamsul Haque Khan School and College),
`chatkhil.webp` (Chatkhil Pachgaon Government High School), `deef.webp` (Deep Ecology Environmental Forum).

## Run locally

Open `index.html` in a browser, or use the VS Code "Live Server" extension.

## Deploy

Push to the `main` branch of the `zarinrithy13.github.io` repository. GitHub Pages serves the root.
