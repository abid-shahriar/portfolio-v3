# Abid Shahriar — Portfolio

A responsive editorial portfolio using semantic HTML, CSS, and dependency-free JavaScript.

## Local development

Run `npm run dev` and open http://localhost:4173. Refresh after editing. Node.js 20 or newer is recommended.

## Production

Run `npm run build`, then `npm run check`. Deploy the `dist` directory as a static site. The existing `public/` asset URLs are retained so the portrait and resume work both locally and in production.

Edit portfolio content in `index.html`, design tokens and responsive styles in `styles.css`, and navigation behavior in `script.js`. The local `data.json` remains ignored by Git and is not included in the production output.

The design includes native expandable experience entries, a mobile menu with keyboard support, reduced-motion styles, and a Bangladesh local clock. DM Sans, DM Mono, and Instrument Serif load through Google Fonts with system fallbacks.
