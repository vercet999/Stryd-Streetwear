# STRYD Streetwear

> High-converting, minimal streetwear footwear eCommerce for STRYD GH — built with React, TypeScript, and powered by Gemini AI.

---

## Overview

STRYD Streetwear is a modern, fast eCommerce storefront for STRYD GH, a streetwear footwear brand based in Accra, Ghana. The frontend is a React SPA served through a lightweight Express server that also proxies live product data from a WooCommerce backend. Gemini AI is integrated for intelligent product features, and Paystack handles payments for the Ghanaian market.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS v4, tailwind-merge, clsx |
| Routing | React Router DOM v7 |
| State | Zustand |
| Animation | Motion (Framer Motion v12) |
| Backend/Proxy | Express (Node.js), tsx |
| AI | Google Gemini (`@google/genai`) |
| Payments | Paystack (`react-paystack`) |
| Icons | Lucide React |
| Build | Vite, TypeScript compiler |

---

## Project Structure

```
Stryd-Streetwear/
├── public/               # Static assets
├── src/                  # React application source
├── index.html            # SPA entry point
├── server.ts             # Express server — API proxy + static serving
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── metadata.json         # App metadata (AI Studio)
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variable template
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A WooCommerce store with REST API enabled
- A Gemini API key
- A Paystack account (for payment integration)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vercet999/Stryd-Streetwear.git
cd Stryd-Streetwear

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your credentials:

```env
# Google Gemini AI — required for AI-powered features
GEMINI_API_KEY="your_gemini_api_key"

# The URL where this app is hosted (used for callbacks and self-referential links)
APP_URL="http://localhost:3000"

# WooCommerce REST API credentials
WC_URL="https://your-woocommerce-store.com"
WC_KEY="ck_your_consumer_key"
WC_SECRET="cs_your_consumer_secret"
```

> **Note:** `WC_KEY` and `WC_SECRET` are your WooCommerce REST API consumer key and secret. Generate them under **WooCommerce → Settings → Advanced → REST API** in your WordPress dashboard.

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server (Express + Vite HMR) |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run start` | Start the production server (serves built `dist/`) |
| `npm run lint` | Type-check with TypeScript compiler |
| `npm run clean` | Remove the `dist/` build directory |

---

## How It Works

### Server (`server.ts`)

The Express server does two things:

**In development** — it spins up Vite in middleware mode alongside the Express routes, giving you full HMR while the API proxy is live.

**In production** — it serves the compiled `dist/` folder as static files and falls back to `index.html` for client-side routing.

### WooCommerce API Proxy

The server exposes a `/api/products` endpoint that proxies requests to your WooCommerce store using Basic Auth (consumer key + secret). This keeps your WooCommerce credentials server-side and away from the browser.

Supported query parameters:
- `page` — pagination page number (default: 1)
- `per_page` — results per page (default: 20)
- `slug` — fetch a specific product by slug

### Gemini AI

The Gemini API key is injected at build time via Vite's `define` config and is available at `process.env.GEMINI_API_KEY` in the client bundle.

---

## Deployment

This project is configured for deployment on **Google AI Studio** (Cloud Run). The `metadata.json` file provides the app name and description to the AI Studio environment, which automatically injects `GEMINI_API_KEY` and `APP_URL` at runtime.

For any other hosting platform (Railway, Render, Fly.io, etc.):

```bash
npm run build
npm run start
```

Make sure all environment variables are set in your hosting platform's secrets/environment config before deploying.

---

## WooCommerce Setup

1. Log into your WordPress admin dashboard.
2. Go to **WooCommerce → Settings → Advanced → REST API**.
3. Click **Add key** and set permissions to **Read**.
4. Copy the **Consumer Key** and **Consumer Secret** into your `.env.local` as `WC_KEY` and `WC_SECRET`.
5. Set `WC_URL` to your store's root URL (no trailing slash).

---

## Related

- **STRYD Naming Assistant (WordPress Plugin)** — the companion WooCommerce plugin that powers AI product naming, SEO content generation, bulk mode, pricing suggestions, SEO audits, and restock alerts directly inside the WordPress admin. See the plugin repository for setup instructions.

---

## License

Private — all rights reserved. This project is proprietary to STRYD GH.
