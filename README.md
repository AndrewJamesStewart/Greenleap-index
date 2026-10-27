# GreenLeap — greenleapesg.com

Landing page and founding-partner waitlist for GreenLeap, ESG and carbon reporting for South Africa's mid-market.

Plain static site: no build step, no framework, no dependencies. Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel).

## Structure

| Path | What it is |
|---|---|
| `index.html` | The landing page |
| `css/styles.css` | All styles; brand colours are the tokens at the top (Brand Guide 2026) |
| `js/main.js` | Mobile menu, GreenPledge, pilot application form |
| `assets/` | Logo, icons, favicon, social share image |
| `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest` | Hosting and SEO support files |

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Collecting pilot sign-ups

By default the pilot form opens the visitor's email app with a pre-filled application.
To store sign-ups instead, create a form at a form service (for example Formspree) and paste its URL into
`FORM_ENDPOINT` at the top of `js/main.js`. The form posts `name`, `email`, `company`, `role`, `need` and `pledge`.
If the service is unreachable the page falls back to email.
