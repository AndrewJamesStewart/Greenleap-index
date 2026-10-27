# GreenLeap site — notes for Claude

- Static site for greenleapesg.com. No build tooling; keep it dependency-free unless the user asks otherwise.
- Brand: colours are CSS custom properties in `css/styles.css` `:root`. Font is Figtree (Google Fonts). Tagline "Measure. Report. Transform."
- Icons are inline SVG `<symbol>`s at the top of `index.html` (24px grid, 1.75 stroke). Reuse them with `<svg class="icon"><use href="#i-name"/></svg>`.
- No inline `onclick` handlers; behaviour lives in `js/main.js`.
- Contact email appears once in the pilot form's mailto link; `js/main.js` reads it from there.
- Pilot form: `FORM_ENDPOINT` in `js/main.js` (empty = mailto fallback).
- Test: serve with `python3 -m http.server` and check desktop (1280px) and mobile (375px) for horizontal scroll, menu, pledge and form validation.
