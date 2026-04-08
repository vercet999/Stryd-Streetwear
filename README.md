# STRYD GH — Streetwear Footwear

A modern, headless e-commerce storefront for STRYD GH, built with React, Vite, and Tailwind CSS. This application uses WooCommerce as a headless CMS/backend for managing products and orders, and integrates with Paystack for secure payments.

## 🚀 Features

- **Headless WooCommerce Integration**: Fetches products, categories, and handles order creation securely via the WooCommerce REST API.
- **Modern UI/UX**: Built with Tailwind CSS for sleek, responsive, and customizable styling. Includes smooth animations using Framer Motion.
- **Secure API Routes**: Uses Vercel Serverless Functions (`/api/*`) to securely communicate with WooCommerce and Paystack without exposing API keys to the client.
- **Custom Routing**: Clean, SEO-friendly URLs (e.g., `/piece/:slug` for product details).
- **Shopping Cart & State Management**: Efficient client-side state management for the shopping cart experience.
- **Social Sharing**: Built-in social media sharing capabilities for products.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router DOM
- **Backend/API**: Express (Local Dev), Vercel Serverless Functions (Production)
- **E-commerce Platform**: WooCommerce (Headless)
- **Payments**: Paystack

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A WooCommerce store with REST API enabled
- WooCommerce API Keys (Consumer Key & Consumer Secret)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stryd-gh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Create a `.env` file in the root directory and add your WooCommerce credentials:
   ```env
   VITE_WC_URL=https://your-woocommerce-store.com
   VITE_WC_KEY=ck_your_consumer_key
   VITE_WC_SECRET=cs_your_consumer_secret
   
   # For Serverless Functions / Express Server
   WC_URL=https://your-woocommerce-store.com
   WC_KEY=ck_your_consumer_key
   WC_SECRET=cs_your_consumer_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:3000`.

## 📂 Project Structure

- `/src`: Contains the React frontend code (Components, Pages, Services, Store).
- `/api`: Vercel Serverless Functions for secure backend operations (e.g., fetching products, creating orders).
- `/public`: Static assets like favicons and loaders.
- `server.ts`: Express server used for local development to mimic Vercel's serverless environment.
- `vercel.json`: Configuration for Vercel deployment and routing.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the following Environment Variables in your Vercel project settings:
   - `WC_URL`
   - `WC_KEY`
   - `WC_SECRET`
4. Deploy! Vercel will automatically detect the Vite setup and the `/api` serverless functions.

## 📄 License

This project is proprietary and created for STRYD GH.
