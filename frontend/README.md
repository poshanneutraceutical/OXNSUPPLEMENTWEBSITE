# OXN Supplements Frontend

This frontend uses the existing Ironmass React/Vite component architecture as the engineering foundation while applying an OXN-specific visual theme.

## Important

- The component structure, cart flow, checkout flow, verification flow, API layer, animations, smooth scrolling, hover interactions, product carousel and responsive behavior are retained from the source frontend.
- Brand colors, logo references, visible brand text, product fallback data and product imagery have been changed for OXN.
- The supplied OXN product images are in `public/products/oxn/`.
- The supplied OXN logo is in `public/oxn-logo.png`.
- No `node_modules` or generated `dist` directory is included. Run `npm install` before building.

## OXN product fallback collection

The supplied product images are mapped as:

- Birthday Cake
- Cookies and Cream
- Chocolate Hazelnut
- Double Rich Chocolate
- Strawberry Cheesecake

The frontend still treats the backend as the source of truth for product/flavour IDs, prices, stock, descriptions, weights and backend-provided images when available.

The current fallback parent product uses ID `10`. Change that ID if the OXN backend uses a different product ID.

## First setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Configuration to update before production

1. Set `VITE_API_URL` to the OXN backend API URL.
2. Replace `YOUR-OXN-DOMAIN` in `index.html`, `public/robots.txt`, and `public/sitemap.xml` with the real OXN domain.
3. Replace placeholder contact information in the footer/contact UI with the actual OXN business details.
4. Confirm the OXN backend product ID and flavour IDs.
