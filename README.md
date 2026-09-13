# Abid Shahriar — A different dimension

A responsive 3D portfolio built with Three.js, semantic HTML, CSS, and Vite. A procedural orbital workspace pairs a floating computer with geometric satellites, soft lighting, and pointer parallax. No external models, textures, or 3D CDN are needed.

## Local development

Use Node.js 22.12+ or 24+. Run `npm ci`, then `npm run dev` and open http://127.0.0.1:4173. Vite refreshes changes automatically.

## Production

Run `npm run build`, then `npm run check`. `npm run preview` serves the production build at http://127.0.0.1:4174. Deploy the `dist` directory as a static site. The existing `public/` asset URLs are retained for downloads, and Vite fingerprints imported assets.

Edit content in `index.html`, responsive styles in `styles.css`, navigation behavior in `script.js`, the hero in `world.js`, and section sculptures in `accents.js`. Shared play/pause and reduced-motion state lives in `motion.js`. The local `data.json` remains ignored by Git and excluded from production output.

The scene loads separately after the page is usable. Mobile and coarse-pointer devices use a 1.25 pixel-ratio cap, simplified geometry, and a 30 fps target; desktop uses a 1.75 cap and 60 fps target. Rendering stops offscreen, in hidden tabs, or when paused. Reduced-motion users start with a static scene. WebGL failure or context loss reveals a CSS fallback while all content remains available. Touch swipes scroll normally over the canvas.

The section sculptures share one additional viewport-sized renderer with scissored views, rather than a WebGL context per object. It renders only visible sculptures, at 30 fps / 1× pixel ratio on mobile and 60 fps / 1.5× on desktop. A globe, journey knot, database stack, interface layers, AI atom, and contact portal extend 3D through the page. Fine-pointer card tilt and lightweight CSS animation add depth; touch scrolling remains native. The fixed navigation contracts without changing the page layout, and its icon-only control pauses both renderers and all decorative CSS animation.

The site includes native expandable experience entries, accessible mobile navigation with current-section highlighting, a resume download, and a Bangladesh clock. Experience descriptions and employer spelling follow the bundled résumé. DM Sans, Space Grotesk, and DM Mono load from Google Fonts with system fallbacks.

## Browser verification

With the development server running, use `npm run test:browser`. On Windows this uses installed Microsoft Edge; on other systems install Chromium with `npx playwright install chromium`. Set `PORTFOLIO_URL` to check the production preview instead. Checks cover 320px and 390px phones, tablet and desktop layouts, touch scrolling, navigation, downloads, rendering pause/resume, offscreen suspension, reduced motion, WebGL fallback, and no-JavaScript content. Screenshots go to ignored `test-results/`.

## Visual reference

[Bruno Simon](https://bruno-simon.com/) inspired the idea of a personal interactive world. This implementation uses an original orbital workstation composition and conventional, mobile-friendly document navigation.
