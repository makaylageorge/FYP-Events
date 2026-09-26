# FYP Events

Static React and Vite website for FYP Events, designed for GitHub Pages.

## Run locally

```powershell
npm install
npm run dev
```

## Production build

```powershell
npm run build
```

## Add event photos

The current gradient cards are intentional placeholders. Add optimized WebP files under
`public\events\` and connect them in `src\App.jsx`.

Suggested filenames:

- `love-island-01.webp`
- `pop-the-balloon-01.webp`
- `ask-a-masc-01.webp`
- `makayla-headshot.webp`

Keep hero video below 5 MB and use a short muted WebM or MP4 loop.

## Connect the inquiry form

Create a Formspree form and add its endpoint to `.env`:

```text
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

## GitHub Pages

The site uses hash-based routing and relative build assets so it can run from a GitHub project
page. The included workflow deploys `dist` whenever the `main` branch is updated.
