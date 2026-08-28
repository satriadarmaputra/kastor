# Kastor Product Information

Public website: https://kastor-product.pages.dev
QR collection: https://kastor-product.pages.dev/qr/

## Current storefront

`scripts/storefront.cjs` is the active builder. It generates Home with search/series filters, a separate public QR collection, and 11 isolated customer detail pages. Customer HTML, image filenames and new QR URLs omit internal product IDs. The QR collection is not linked from customer pages, but is PUBLIC, not authenticated. This repository is also public; do not store confidential data here.

The fixed descriptive slugs in the builder must be preserved after labels are printed. Old `/demo/p/KST-DEMO-xxxx` URLs redirect to their new product pages. `/demo/` redirects to Home. Old QR files and raw demo JSON are not copied to the new deployment. Historical deployments/repository history are not erased by this update.

QR PNGs use high error correction, a four-module quiet zone and a small official logo. `npm test` decodes every QR at native and 300px sizes; physically test a printed label before a production print run. New printable files and ZIP are generated in `dist/qr/`.

`source/site.css` and `source/site.js` implement the current design and interactions. `data/site.json` configures the owner-provided contact number and greeting. The Contact Us dialog displays the greeting and service choices; WhatsApp links prefill a customer inquiry, do not send messages, and do not configure automatic WhatsApp Business replies.

## Build

Requires Node.js 22+. Run npm ci, npm run build, then npm test. Output: dist/.

## Content

- source/products.tsx: original Iris record and template. Preserve its existing slug.
- data/demo-products.json: ten fictional records; IDs must never change or be reused.
- assets/demo: AI-generated product illustrations, not official product photographs.
- assets/iris-product.jpg: user-provided original Iris image.
- assets/brand: logo artwork extracted from the supplied Kastor GSM, Sora font, and brand stylesheet. The complete GSM PDF is not included.
- scripts/build-demo.cjs and scripts/build.cjs: legacy builders, no longer used by npm build.
- assets/qr: legacy QR images (not published); their destination routes are redirected.

Brand colors: #573d3e, #bbab8a, #7f392e. Typography: Sora Medium and Bold.

## Publishing

This is a Cloudflare Pages Direct Upload project named kastor-product. After an authenticated Wrangler login, deploy dist using: npx wrangler@4.92.0 pages deploy dist --project-name kastor-product --branch main

GitHub automatic deployment is NOT configured. Pushing this repository alone does not update the live website. No admin backend or database is included.

Do not commit credentials, OAuth tokens, the full brand PDF, or local environment files. Product data and static assets in this repository are public.
