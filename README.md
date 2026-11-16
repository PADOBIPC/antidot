# ANTIDOT — Kyiv streetwear storefront

The repository contains a small React + TypeScript storefront built with Vite. The app files live in the repository root (not in `src/`).

## Run locally

Requirements: Node.js 22.12+ and pnpm 10.34.3 (or a recent Corepack-enabled Node installation).

```bash
corepack enable
corepack prepare pnpm@10.34.3 --activate
pnpm install
pnpm dev
```

Open <http://localhost:5173>. Keep the terminal open while using the site; stop the server with `Ctrl+C`.

If Corepack is unavailable, install pnpm with `npm install -g pnpm@10.34.3`, then run `pnpm install` and `pnpm dev`.

## Build and preview

```bash
pnpm build
pnpm preview
```

The production-ready static site is generated in `dist/`; the preview is available at <http://localhost:4173>.

## Important note about checkout

The cart and checkout are a front-end demonstration. Cart and last-order data are saved in this browser's local storage; orders are not sent to a store, payment processor, or delivery service. Connect a backend/payment provider before accepting real orders.
