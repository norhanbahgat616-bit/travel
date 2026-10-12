# Travel Golf Tours

A responsive Egypt travel site built with React, Vite, Tailwind CSS v4, and React Router.

## Run locally

```powershell
npm install
npm run dev
```

Build and lint:

```powershell
npm run build
npm run lint
```

## Deploy to GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys
the site to GitHub Pages whenever changes are pushed to `main`, or when manually
run from the Actions tab. In the repository settings, set **Pages → Build and
deployment → Source** to **GitHub Actions**. The workflow configures the Vite
base path for the repository and supports direct navigation to app routes.

For this repository, the published URL is
`https://norhanbahgat616-bit.github.io/travel/`.

## Routes

- `/` — home
- `/destinations` — Egypt destinations
- `/services` and `/services/:slug` — service listings and guides
- `/visas` and `/visas/:slug` — visa support and destination guides
- `/tours`, `/about`, `/gallery`, `/contact`, `/booking`
- `/signin`, `/signup`, `/dashboard` — local demo authentication and request dashboard

## Images

Place `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif` photos in `src/assets/images/`. They are discovered automatically by `src/utils/images.js`. Descriptive filenames such as `sharm.jpg`, `turkey-visa.webp`, or `about-egypt.png` are matched to the relevant sections. Unmatched filenames are used as fallback images; if the folder is empty, image frames render with a brand gradient.

## Demo data

Bookings and visa requests are stored in browser `localStorage`. Authentication is a front-end demo and does not use a backend; do not use real passwords or personal data.
