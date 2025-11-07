# LiveAdda — Live Streaming App

A full‑stack live streaming app built with Next.js (App Router), featuring RTMP/WHIP ingest, OBS integration, authentication, real‑time chat, following/blocking, stream dashboard, and webhooks to sync data.

> Status: Work in progress. This repo already includes authentication (Clerk), Prisma database wiring, initial UI, and webhook scaffolding.

## Features

- 📡 Streaming via RTMP / WHIP (ingress generation, OBS integration)
- 🌐 Generate ingress endpoints for streamers
- 🔗 Connect OBS (or your favorite encoder) to the app
- 🔐 Authentication (Clerk)
- 📸 Thumbnail upload for streams
- 👀 Live viewer count and 🚦 live/offline statuses
- 💬 Real‑time chat (per‑viewer unique colors, slow mode, followers‑only, enable/disable)
- 👥 Follow system, 🚫 block users, 👢 kick participants in real‑time
- 🎛️ Streamer dashboard and controls
- 📚 Sidebar with following and recommendations
- 🏠 Home page prioritizing live streams; 🔍 search page with dedicated layout
- 🔄 Webhooks to sync user and live status to the DB
- ⚡ Fast, SSR‑ready, grouped routes and layouts
- 🚀 Deployable to Vercel

## Tech Stack

- Framework: Next.js (App Router)
- UI: Tailwind CSS v4, Radix, Lucide Icons
- Auth: Clerk
- DB/ORM: PostgreSQL + Prisma
- Realtime: WebSockets (planned)
- Webhooks: Clerk → API route via Svix signature verification

## Project Structure

```
app/
	(auth)/
		layout.tsx
		_components/
			logo.tsx
		sign-in/[[...sign-in]]/page.tsx
		sign-up/[[...sign-up]]/page.tsx
	(browse)/
		layout.tsx
		_components/navbar/index.tsx
		(home)/page.tsx
	api/webhooks/clerk/route.ts
components/
	ui/button.tsx
lib/
	db.ts
	utils.ts
	generated/prisma/* (generated client)
prisma/
	schema.prisma
	migrations/*
public/
	pizza.svg (logo)
```

## Prerequisites

- Node.js 18+ (recommended 20+)
- PostgreSQL database (Neon/Local/Cloud)
- Clerk account and application (for keys and webhooks)

## Quick Start (Windows)

1) Clone and install deps

```cmd
cd "D:\2nd year\liveadda"
npm install
```

2) Configure environment variables in a `.env` file (root):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

Notes:
- Avoid wrapping `DATABASE_URL` in quotes.
- Ensure your DB is reachable from your machine (Neon/Cloud typically requires SSL).

3) Generate Prisma client and run migrations

```cmd
npx prisma generate
npx prisma migrate dev --name init
```

4) Run the dev server

```cmd
npm run dev
```

Then open http://localhost:3000

## Authentication (Clerk)

- Set your Clerk keys in `.env`.
- Public auth routes live under `app/(auth)`.
- Route protection is handled by Clerk middleware. Place middleware at the project root as `middleware.ts` and use Clerk’s `clerkMiddleware`. Example:

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/api/webhooks(.*)",
]);

export default clerkMiddleware((auth, req) => {
	if (!isPublicRoute(req)) auth().protect();
});

export const config = {
	matcher: [
		"/((?!.+\\.[\\w]+$|_next).*)",
		"/(api|trpc)(.*)",
	],
};
```

## Database (Prisma)

- Prisma config is in `prisma.config.ts` and `prisma/schema.prisma`.
- Ensure `DATABASE_URL` is set before running Prisma commands.
- Common commands:

```cmd
npx prisma generate
npx prisma migrate dev --name <change>
npx prisma studio
```

## Webhooks

- Clerk webhook handler: `app/api/webhooks/clerk/route.ts`.
- Set `CLERK_WEBHOOK_SIGNING_SECRET` in `.env` and configure your webhook in the Clerk Dashboard to point to `/api/webhooks/clerk`.
- The route verifies signatures using Svix under the hood.

## Streaming (RTMP / WHIP) & OBS

This app is designed to accept live streams via RTMP or WHIP using a third‑party ingress provider (e.g., Livepeer, Cloudflare Stream). High‑level flow:

1. Creator requests an ingress from the dashboard.
2. Backend returns an ingest URL (RTMP) or WHIP endpoint + credentials.
3. In OBS:
	 - RTMP: Settings → Stream → Service: Custom → Server: rtmp://... → Stream Key: <key>
	 - WHIP: Install WHIP plugin or use compatible encoder; set WHIP URL and credentials.
4. Start streaming; the app marks the stream as live, updates viewer counts, and shows chat.

Implementation details (provider‑specific) can be wired into your server routes and UI as you integrate.

## Scripts

```json
{
	"dev": "next dev",
	"build": "next build",
	"start": "next start",
	"lint": "eslint"
}
```

## Deployment

- Vercel recommended for Next.js.
- Add all required environment variables in Vercel Project Settings.
- Use a managed Postgres (e.g., Neon). Run migrations during deploy (or via CI):

```cmd
npx prisma migrate deploy
```

## Troubleshooting

- PrismaConfigEnvError: Missing `DATABASE_URL`
	- Ensure `.env` exists at the repo root and `DATABASE_URL` is set without quotes.
	- Run commands from the project root: `cd "D:\\2nd year\\liveadda"`.
	- Restart the dev server after updating environment variables.
- Clerk middleware not running
	- File must be named `middleware.ts` in the repo root; Next.js won’t execute a differently named file.
- Tailwind token utilities not applied
	- Colors are defined in `app/globals.css` via `@theme`; ensure you use classes like `bg-background`, `text-foreground`, `border-border`.

## License

MIT — see LICENSE if provided.

## Acknowledgements

- Clerk for auth
- Prisma for ORM
- Tailwind CSS v4
- The open‑source streaming community (OBS, RTMP/WHIP standards)

