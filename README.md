# Kastor Product Information

Public website: https://kastor-product.pages.dev
Demo catalog: https://kastor-product.pages.dev/demo

## Build

Requires Node.js 22+. Run npm ci, npm run build, then npm test. Output: dist/.

## Content

- source/products.tsx: original Iris record and template. Preserve its existing slug.
- data/demo-products.json: ten fictional records; IDs must never change or be reused.
- assets/demo: AI-generated product illustrations, not official product photographs.
- assets/iris-product.jpg: user-provided original Iris image.
- assets/brand: logo artwork extracted from the supplied Kastor GSM, Sora font, and brand stylesheet. The complete GSM PDF is not included.
- scripts/build-demo.cjs: catalog and shared demo page template.
- assets/qr: QR images whose destinations must remain valid.

Brand colors: #573d3e, #bbab8a, #7f392e. Typography: Sora Medium and Bold.

## Publishing

This is a Cloudflare Pages Direct Upload project named kastor-product. After an authenticated Wrangler login, deploy dist using: npx wrangler@4.92.0 pages deploy dist --project-name kastor-product --branch main

GitHub automatic deployment is NOT configured. Pushing this repository alone does not update the live website. No admin backend or database is included.

Do not commit credentials, OAuth tokens, the full brand PDF, or local environment files. Product data and static assets in this repository are public.
