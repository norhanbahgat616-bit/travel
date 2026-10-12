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
