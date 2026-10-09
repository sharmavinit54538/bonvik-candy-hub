# Bonvik Candy Hub

The official web platform for **Bonvik Foods** — a premium Indian candy brand based in Ludhiana, Punjab. This application serves as the brand's digital storefront, product catalog, partner onboarding portal, and internal lead management system.

## Tech Stack

| Layer         | Technology                                                                              |
| ------------- | --------------------------------------------------------------------------------------- |
| Framework     | [TanStack Start](https://tanstack.com/start) (React 19, SSR)                            |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/)                                             |
| UI Components | [Radix UI](https://radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)                 |
| Animations    | [Framer Motion](https://www.framer.com/motion/)                                         |
| Charts        | [Recharts](https://recharts.org/)                                                       |
| Forms         | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)               |
| State         | [Zustand](https://zustand.docs.pmnd.rs/)                                                |
| Backend       | [Supabase](https://supabase.com/) (PostgreSQL, Auth)                                    |
| Deployment    | [Cloudflare Workers](https://workers.cloudflare.com/) via [Nitro](https://nitro.build/) |
| Build Tool    | [Vite 7](https://vite.dev/)                                                             |

## Features

- **Product Catalog** — 9 SKU showcase with images, pricing and flavor details
- **Partner Application** — Multi-step form with validation, auto-save drafts and Supabase submission
- **Lead Management** — Local-first CRM dashboard with filtering, sorting, CSV export and status tracking
- **Contact Form** — Inquiry capture that feeds directly into the lead pipeline
- **About & Brand Story** — Company timeline, mission/vision and certifications

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm (or bun)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Install & Run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── assets/              # Product images and brand assets
├── components/
│   ├── leads/           # Lead management components (table, filters, drawer, chart)
│   └── ui/              # Shared UI primitives (Radix/shadcn)
├── hooks/               # Custom React hooks
├── integrations/
│   └── supabase/        # Supabase client, auth middleware and types
├── lib/
│   ├── leads/           # Lead store, types, export and storage
│   └── products.ts      # Product catalog data
├── routes/              # TanStack file-based routes
│   ├── __root.tsx        # Root layout (header, footer, meta)
│   ├── index.tsx         # Home page
│   ├── products.tsx      # Product catalog
│   ├── about.tsx         # About page
│   ├── contact.tsx       # Contact form
│   ├── partner.tsx       # Partner application form
│   ├── partner.success.tsx
│   └── admin.leads.tsx   # Lead management dashboard
├── router.tsx           # Router configuration
├── server.ts            # SSR error handling entry
├── start.ts             # TanStack Start middleware setup
└── styles.css           # Global styles and design tokens
```

## Deployment

This project is configured for **Cloudflare Workers** deployment via Nitro. The `wrangler.jsonc` config is included. Run:

```bash
npx wrangler deploy
```

## License

Proprietary — © Bonvik Foods. All rights reserved.
