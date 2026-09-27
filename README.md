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

Add optimized WebP files under `public\images\`. The current site uses:

- `gallery-01.webp` through `gallery-12.webp` for the rotating hero gallery
- `makayla-headshot.webp` for the producer credit
- `makayla-headshot-square.webp` for the About section
- `last-event-side-04.webp` for the My Last Event banner

Keep replacement images compressed and preserve the existing filenames unless the paths in
`src\App.jsx` are updated at the same time.

## Connect the inquiry form

The quote calculator runs entirely in the browser. Its final contact step automatically includes
the calculated range and all saved quote answers. The separate “Let’s work together” form sends
direct inquiries without requiring someone to complete the calculator.

To receive every submission by email:

1. Create a form at Formspree and choose the email address that should receive inquiries.
2. Copy the form endpoint.
3. Create a `.env` file in the project root:

```text
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

4. Restart the local development server or rebuild the site.

Formspree handles email notifications, spam filtering, and submission history without exposing
the destination email address in the website source.

For the hosted GitHub Pages site, add the endpoint as a repository variable:

1. Open the GitHub repository’s **Settings**.
2. Go to **Secrets and variables → Actions → Variables**.
3. Create a repository variable named `FORMSPREE_ENDPOINT`.
4. Paste the same Formspree endpoint as its value.
5. Run the **Deploy to GitHub Pages** workflow again.

The deployment workflow passes that variable to Vite as `VITE_FORMSPREE_ENDPOINT` during the
production build.

## GitHub Pages

The site uses hash-based routing and relative build assets so it can run from a GitHub project
page. The included workflow deploys `dist` whenever the `main` branch is updated.
