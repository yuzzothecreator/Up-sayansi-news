# Pulse

**Pulse** is a modern publishing platform for thoughtful writers and curious readers. It combines a rich TipTap editor, role-based access control, social engagement features, and an admin console — built on Next.js 16, PostgreSQL, Better Auth, and Supabase Storage.

---

## Overview

Pulse is a full-stack blog and publishing platform inspired by Medium-style reading experiences. Authors draft and publish stories; editors review and curate content; administrators manage users, ads, and platform settings. Readers can follow authors, bookmark posts, comment, and subscribe to the newsletter.

---

## Features

### Content & Publishing
- TipTap rich-text editor with code blocks, images, tables, and YouTube embeds
- Draft, scheduled, published, archived, and pending-review post workflows
- Categories, tags, SEO fields, reading time, and featured/pinned posts
- RSS feed, sitemap, Open Graph images, and dynamic metadata

### Authentication & Authorization
- Email/password auth with verification and password reset (Better Auth)
- Optional Google and GitHub OAuth
- Four-tier RBAC: Reader → Author → Editor → Administrator
- Permission helpers for posts, comments, and admin actions

### Engagement
- Likes, threaded comments, bookmarks, and bookmark collections
- Author follows and in-app notifications
- Post view tracking and author analytics

### Admin & Moderation
- User management, role assignment, and ban controls
- Comment moderation and content reports
- Category/tag management, ads, newsletter subscribers, audit logs

### Platform
- Supabase Storage for avatars, covers, and post images
- Resend-powered transactional email
- Dark/light theme, responsive layout, PWA offline shell
- Vitest unit tests for core utilities and validators

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI, Framer Motion |
| Database | PostgreSQL via [Prisma](https://www.prisma.io) |
| Auth | [Better Auth](https://www.better-auth.com) |
| Storage | [Supabase Storage](https://supabase.com/docs/guides/storage) |
| Email | [Resend](https://resend.com) |
| Editor | [TipTap](https://tiptap.dev) |
| Validation | Zod |
| Testing | Vitest, Testing Library |

---

## Prerequisites

- **Node.js** 20+
- **npm** (or pnpm/yarn)
- **PostgreSQL** 14+ (local, Docker, or [Supabase](https://supabase.com))
- Optional: Supabase project (storage), Resend account (email), Google/GitHub OAuth apps

---

## Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd blog-sport
npm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled, for app runtime) |
| `DIRECT_URL` | Direct PostgreSQL connection (migrations / `db push`) |
| `BETTER_AUTH_SECRET` | Secret key (min 32 chars). Generate: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | App base URL for auth callbacks (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (same as above in dev) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server uploads) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Sender address, e.g. `Pulse <hello@yourdomain.com>` |

Optional OAuth variables (leave blank to disable):

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials |

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose to the client)
5. Create storage buckets (or let the app create them on first upload):
   - `avatars`
   - `covers`
   - `post-images`
   - `media`

For the database, you can either:
- Use Supabase PostgreSQL (recommended): copy the **Connection pooling** URI to `DATABASE_URL` and the **Direct** URI to `DIRECT_URL`
- Use a separate local PostgreSQL instance

### 4. Better Auth setup

1. Set `BETTER_AUTH_SECRET` to a strong random string (32+ characters).
2. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your app origin.
3. In production, both must match your deployed domain (e.g. `https://pulse.app`).

Better Auth exposes routes at `/api/auth/*`. Session cookies are managed automatically via the `nextCookies` plugin.

### 5. Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an OAuth 2.0 Client ID (Web application).
3. Add authorized redirect URI:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://your-domain.com/api/auth/callback/google`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 6. GitHub OAuth (optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps.
2. Set callback URL:
   - Dev: `http://localhost:3000/api/auth/callback/github`
   - Prod: `https://your-domain.com/api/auth/callback/github`
3. Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

OAuth providers are registered automatically when both client ID and secret are present.

### 7. Database push and seed

**Option A — Prisma db push (recommended for local dev)**

```bash
npm run db:push
npm run db:seed
```

**Option B — SQL migration**

An initial migration is included at `prisma/migrations/0_init/migration.sql`. Apply it with:

```bash
npx prisma migrate deploy
npm run db:seed
```

Or run the SQL directly against your PostgreSQL database, then:

```bash
npm run db:generate
npm run db:seed
```

### 8. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database (no migration files) |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

---

## Demo Accounts

After running `npm run db:seed`, use these accounts (password for all: **`Password123!`**):

| Email | Role |
|-------|------|
| `admin@pulse.app` | Administrator |
| `editor@pulse.app` | Editor |
| `maya@pulse.app` | Author |
| `marcus@pulse.app` | Author |
| `sam@pulse.app` | Author |
| `reader@pulse.app` | Reader |
| `riley@pulse.app` | Reader |

The seed also creates sample posts, comments, likes, bookmarks, notifications, categories, tags, and newsletter subscribers.

---

## Project Structure

```
blog-sport/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Demo data seeder
│   └── migrations/
│       └── 0_init/
│           └── migration.sql  # Initial SQL migration
├── public/
│   └── sw.js                  # PWA service worker (offline shell)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Login, register, password reset
│   │   ├── (marketing)/       # Public blog, authors, search
│   │   ├── (dashboard)/       # Author dashboard
│   │   ├── (admin)/           # Admin console
│   │   ├── api/               # API routes (auth, posts, upload, …)
│   │   ├── layout.tsx
│   │   └── manifest.ts        # PWA web manifest
│   ├── components/            # Shared UI and blog components
│   │   └── pwa/               # Service worker registration
│   ├── config/                # Site and navigation config
│   ├── features/              # Feature modules (editor, admin, dashboard)
│   ├── lib/                   # Utilities, auth, prisma, validators
│   │   └── __tests__/         # Unit tests
│   ├── providers/             # React context providers
│   ├── services/              # Data access layer
│   └── types/                 # Shared TypeScript types
├── .env.example
├── vercel.json
├── vitest.config.ts
└── package.json
```

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set all environment variables from `.env.example` in the Vercel dashboard.
4. Use Supabase **pooled** connection string for `DATABASE_URL` and **direct** for `DIRECT_URL`.
5. Set production URLs:
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
   - `BETTER_AUTH_URL=https://your-domain.com`
6. Update OAuth redirect URIs to your production domain.
7. Deploy. Vercel detects Next.js automatically; `vercel.json` adds service worker headers.

**Post-deploy checklist:**
- Run `npx prisma migrate deploy` (or `db push`) against production DB
- Run seed only on staging, not production
- Verify Resend domain and `EMAIL_FROM` sender
- Add PWA icons at `public/icon-192.png` and `public/icon-512.png`

---

## Architecture Notes

### Request flow

```
Browser → Next.js Middleware (session cookie check for /dashboard, /admin)
       → App Router (RSC + Server Actions)
       → Services layer (Prisma queries)
       → PostgreSQL
```

### Authentication

- **Better Auth** handles sessions, credentials, OAuth, and email verification.
- Server components use `getServerSession()` / `getCurrentUser()` from `src/lib/auth.ts`.
- Client components use the auth provider and Better Auth client.
- Middleware protects `/dashboard/*` and `/admin/*` routes via session cookie.

### Authorization

- Roles and permissions are defined in `src/types/auth.ts`.
- `src/lib/permissions.ts` exposes `can()`, `canEditPost()`, `requireRole()`, etc.
- Admin routes should enforce administrator permissions in page/action code.

### Data layer

- **Prisma** is the ORM; schema includes Better Auth tables plus Pulse domain models.
- **Services** in `src/services/` encapsulate database operations.
- JSON columns store TipTap document content; `contentHtml` stores sanitized HTML for rendering.

### Storage

- File uploads go through `/api/upload` using Supabase Storage with the service role key.
- Buckets: `avatars`, `covers`, `post-images`, `media`.

### Email

- **Resend** sends verification, password reset, welcome, and newsletter emails via `src/lib/email.ts`.
- Requires `RESEND_API_KEY` and verified `EMAIL_FROM` domain in production.

### PWA

- `src/app/manifest.ts` defines the web app manifest.
- `public/sw.js` caches the app shell for offline navigation fallback.
- `RegisterServiceWorker` in `AppProviders` registers the SW on the client.

### Testing

- Vitest tests cover utilities, slug generation, permissions, reading time, and Zod validators.
- Run with `npm run test` or `npm run test:watch`.

---

## License

Private — all rights reserved unless otherwise specified.
