<p align="center">
  <h1 align="center">🥓 bacon · B2B SaaS Starter</h1>
  <p align="center">A production-grade, opinionated B2B SaaS monorepo — fork it and ship.</p>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/status-production--ready-brightgreen" alt="Status"></a>
  <a href="license.md"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.0-black" alt="Next.js 16"></a>
  <a href="https://turborepo.com"><img src="https://img.shields.io/badge/Turborepo-2-EF4444" alt="Turborepo 2"></a>
  <a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-10-F69220" alt="pnpm 10"></a>
  <a href="https://convex.dev"><img src="https://img.shields.io/badge/Convex-1.30-FBBC04" alt="Convex"></a>
  <a href="https://better-auth.com"><img src="https://img.shields.io/badge/Better%20Auth-1.0-7C3AED" alt="Better Auth"></a>
</p>

---

**bacon** = **B**2B + **A**uth + **C**onvex + **O**rganizations + **N**ext.js

Bacon is a complete, production-ready B2B SaaS monorepo built with Next.js 16, Convex, Better Auth, and Stripe. It includes real-time collaboration, multi-tenant organizations, API keys, transactional email, feature flags, observability, security, and analytics — all integrated and working out of the box.

Forked from [next-forge](https://github.com/vercel/next-forge) v5.2.4, extended with Better Auth, the Convex database adapter, and additional service integrations.

---

## Table of Contents

- [Why bacon?](#why-bacon)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## Why bacon?

### The problem

Building a B2B SaaS from scratch means wiring up the same 15 services every time: auth, database, payments, email, analytics, collaboration, feature flags, security, webhooks, internationalization, and more. Each integration has its own SDK, its own setup ritual, and its own sharp edges.

Existing starters either:
- **Assemble from parts** — "choose your stack" generators leave you with a scaffold and 50 open decisions
- **Lock you into a single vendor** — tightly coupled to one auth provider or database, making it hard to switch
- **Skip the hard parts** — no real-time, no organizations/RBAC, no API keys, no webhooks

### What bacon gives you

A **complete, integrated B2B SaaS** with 19 packages and 6 apps — dashboard, marketing site, API server, documentation, email previews, and storybook — all wired together and ready to deploy.

### Stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Monorepo | [Turborepo 2](https://turborepo.com) + [pnpm](https://pnpm.io) 10 |
| Language | TypeScript strict mode |
| Database | [Convex](https://convex.dev) (serverless, real-time, no migrations) |
| Auth | [Better Auth](https://better-auth.com) (email/password, OAuth, orgs, API keys) |
| Payments | [Stripe](https://stripe.com) subscriptions |
| Email | [Resend](https://resend.com) + React Email |
| UI | [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS v4 |
| Design | [Lucide](https://lucide.dev) icons, [next-themes](https://github.com/pacocoursey/next-themes) dark mode |
| Collaboration | [Liveblocks](https://liveblocks.io) (cursors, presence) |
| Notifications | [Knock](https://knock.app) (in-app feed) |
| Feature flags | [Vercel Flags SDK](https://vercel.com/docs/workflow-collaboration/feature-flags) |
| Observability | [Sentry](https://sentry.io) + [BetterStack](https://betterstack.com) |
| Security | [Arcjet](https://arcjet.com) (rate limiting) + [nosecone](https://docs.arcjet.com/nosecone) (headers) |
| Analytics | [PostHog](https://posthog.com) + Google Analytics |
| Webhooks | [Svix](https://svix.com) |
| i18n | [next-international](https://next-international.vercel.app) (6 locales) |

### Core principles

- **Fast** — Quick to build, run, deploy, and iterate on
- **Cheap** — Free to start with services that scale with you
- **Opinionated** — Integrated tooling designed to work together, not a box of parts
- **Modern** — Latest stable features with healthy community support
- **Safe** — End-to-end type safety and robust security posture

### What makes bacon different

| Feature | bacon |
|---------|-------|
| Real-time by default | Convex + Liveblocks, not bolted on |
| Multi-tenant orgs | Better Auth org plugin with RBAC |
| API keys | Built-in, org-scoped, rate-limited |
| Service adapter pattern | Graceful fallback when services are unconfigured |
| Zero-assembly | Fork, configure env vars, deploy — no generator step |

---

## Quick Start

You can go from zero to running in about 5 minutes.

### Prerequisites

| Tool | Required | Notes |
|------|----------|-------|
| [Node.js 20+](https://nodejs.org) | Yes | Earlier versions not supported |
| [pnpm 10](https://pnpm.io/installation) | Yes | Corepack: `corepack enable pnpm` |
| [Git](https://git-scm.com) | Yes | — |
| [Convex account](https://convex.dev) | Recommended | Free tier for dev. App runs without it, but with limited functionality |
| [Stripe account](https://stripe.com) | Optional | Free in test mode. Needed for subscriptions |

### Step 1: Clone and install

```sh
git clone https://github.com/vncsleal/bacon.git my-saas
cd my-saas
pnpm install
```

### Step 2: Configure environment variables

```sh
cp .env.example .env.local
```

Open `.env.local` and fill in the required values. The **minimum** to see a working app:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
BETTER_AUTH_SECRET=your-generated-secret
SITE_URL=http://localhost:3000
```

Generate `BETTER_AUTH_SECRET`:
```sh
openssl rand -base64 32
```

See the [Environment Variables](#environment-variables) section for the full list and where to get each value.

### Step 3: Start Convex

Convex provides the database, auth state, and real-time backend.

```sh
cd packages/database
npx convex dev
```

This command:
1. Prompts you to log in to your Convex account (browser opens)
2. Creates a development deployment
3. Pushes the schema (auth + app tables)
4. Regenerates TypeScript types in `_generated/`
5. Starts a long-running process that hot-reloads schema changes

Leave this terminal running and open a new one for the next step.

> If you skip Convex setup, the app will still build and serve pages, but auth and data features will be unavailable. See the [service adapter pattern](docs/adrs/ADR-001-service-adapter-pattern.md) for details.

### Step 4: Start the development servers

```sh
# From the repository root
pnpm dev
```

This starts all apps concurrently via Turborepo:

| App | URL | Purpose |
|-----|-----|---------|
| `app` | http://localhost:3000 | Main dashboard (auth, org, settings) |
| `web` | http://localhost:3001 | Marketing site and blog |
| `api` | http://localhost:3002 | API server (webhooks, cron, health) |
| `email` | http://localhost:3003 | React Email template previews |
| `docs` | http://localhost:3004 | Documentation site |
| `storybook` | http://localhost:6006 | Component library |

Visit http://localhost:3000 — you should see the sign-in page. Create an account, create an organization, and explore the dashboard.

### Step 5: (Optional) Configure Stripe

To enable subscriptions:

1. Get your [Stripe secret key](https://dashboard.stripe.com/apikeys) (test mode)
2. Set up a [webhook endpoint](https://dashboard.stripe.com/webhooks) pointing to `http://localhost:3002/webhooks/payments` (use Stripe CLI for local dev)
3. Create free and pro [price IDs](https://dashboard.stripe.com/prices) in test mode
4. Add these to `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_FREE_PRICE_ID=price_free
   STRIPE_PRO_PRICE_ID=price_pro
   ```

Then run the API server with Stripe webhook forwarding:
```sh
pnpm dev:app   # or cd apps/api && pnpm dev (which runs stripe listen automatically)
```

---

## Environment Variables

All environment variables are documented in [`.env.example`](.env.example). Required vs optional breakdown:

### Required for core functionality

| Variable | How to Get |
|----------|------------|
| `NEXT_PUBLIC_CONVEX_URL` | `npx convex dev` output (or Convex dashboard) |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |

### Required per feature

| Feature | Variables | How to Get |
|---------|-----------|------------|
| **Payments** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_FREE_PRICE_ID`, `STRIPE_PRO_PRICE_ID` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| **Email** | `RESEND_FROM`, `RESEND_TOKEN` | [Resend Dashboard](https://resend.com/api-keys) |
| **Observability** | `BETTERSTACK_API_KEY`, `BETTERSTACK_URL` | [BetterStack](https://logs.betterstack.com) |
| **Security** | `ARCJET_KEY` | [Arcjet Dashboard](https://app.arcjet.com) |
| **Webhooks** | `SVIX_TOKEN` | [Svix Dashboard](https://dashboard.svix.com) |
| **Collaboration** | `LIVEBLOCKS_SECRET` | [Liveblocks Dashboard](https://liveblocks.io/dashboard) |
| **Notifications** | `KNOCK_SECRET_API_KEY`, `NEXT_PUBLIC_KNOCK_API_KEY`, `NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID` | [Knock Dashboard](https://dashboard.knock.app) |
| **CMS** | `BASEHUB_TOKEN` | [BaseHub Settings](https://basehub.com/dashboard/settings) |
| **Analytics** | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | PostHog project / Google Analytics |
| **Feature flags** | `FLAGS_SECRET` | Vercel project settings |

### App URLs (for development)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3004
SITE_URL=http://localhost:3000
```

> **Important:** bacon uses a **graceful degradation** approach via the [service adapter pattern](docs/adrs/ADR-001-service-adapter-pattern.md). Most features degrade safely when their env vars are missing — no crashes, no runtime errors. This lets you start development with minimal configuration and add services as needed.

---

## Project Structure

```
├── apps/
│   ├── app/          # Main dashboard (port 3000) — auth, orgs, settings
│   ├── web/          # Marketing site (port 3001) — landing, blog, legal
│   ├── api/          # API server (port 3002) — webhooks, cron, health
│   ├── docs/         # Documentation (port 3004) — Fumadocs
│   ├── email/        # React Email (port 3003) — template previews
│   └── storybook/    # Component library (port 6006)
├── packages/
│   ├── analytics/    # PostHog + Google Analytics
│   ├── auth/         # Better Auth client/server + RBAC permissions
│   ├── cms/          # BaseHub CMS integration (adapter pattern)
│   ├── collaboration/# Liveblocks real-time features
│   ├── database/     # Convex adapter (active) + Prisma/Drizzle stubs
│   ├── design-system/# shadcn/ui component library
│   ├── email/        # Resend transactional email + React Email templates
│   ├── feature-flags/# Vercel Flags SDK
│   ├── i18n/         # next-international dictionaries (6 locales)
│   ├── next-config/  # Next.js configuration helpers
│   ├── notifications/# Knock in-app notifications
│   ├── observability/# Sentry + BetterStack logging
│   ├── payments/     # Stripe integration
│   ├── rate-limit/   # Upstash rate limiting (complements Arcjet)
│   ├── security/     # Arcjet + nosecone (rate limiting, CSP, headers)
│   ├── seo/          # SEO metadata, JSON-LD structured data
│   ├── storage/      # Vercel Blob file storage
│   ├── typescript-config/ # Shared TS configs
│   └── webhooks/     # Svix webhook handling
├── docs/
│   └── adrs/         # Architecture Decision Records
├── .github/
│   └── workflows/    # CI/CD pipelines
├── e2e/              # Playwright end-to-end tests
├── turbo.json        # Turborepo task pipeline
└── pnpm-workspace.yaml
```

---

## Development

### Running specific apps

```sh
# Run the dashboard only
pnpm dev:app

# Run the marketing site only
pnpm dev --filter=web

# Run the API only (with Stripe webhook forwarding)
cd apps/api && pnpm dev
```

### Testing

```sh
# Run all tests across the monorepo
pnpm test

# Run e2e smoke tests (Playwright)
pnpm test:e2e

# Run tests for a specific package
pnpm test --filter=@repo/auth
```

The project uses [Vitest](https://vitest.dev) with a workspace configuration. Tests are co-located with source files (`__tests__/` directories or `*.test.ts` files).

### Other useful commands

```sh
pnpm build          # Build all apps and packages
pnpm check          # Run linting (Biome via ultracite)
pnpm fix            # Auto-fix lint issues
pnpm -r typecheck   # TypeScript check across all packages
pnpm clean          # Remove all build artifacts
pnpm boundaries     # Verify Turborepo dependency boundaries
pnpm bump-deps      # Upgrade all dependencies
pnpm bump-ui        # Upgrade shadcn/ui components
pnpm migrate        # Deploy Convex schema changes (alias for convex deploy)
```

---

## Architecture

Bacon follows a **ports-and-adapters (hexagonal) architecture** where the core domain never imports framework types. Key architectural decisions:

| Decision | Document |
|----------|----------|
| Service adapter pattern | [ADR-001](docs/adrs/ADR-001-service-adapter-pattern.md) |
| Database (Convex) | [ADR-002](docs/adrs/ADR-002-database-adapter-selection.md) |
| Auth architecture | [ADR-003](docs/adrs/ADR-003-auth-architecture.md) |
| Monorepo structure | [ADR-004](docs/adrs/ADR-004-monorepo-structure.md) |
| Security approach | [ADR-005](docs/adrs/ADR-005-security-approach.md) |

### Service adapter pattern

Bacon uses a **service adapter pattern** for all external service integrations. Each service has:

- A **port** (TypeScript interface) defining the contract
- A **local adapter** with fixture data for development and testing
- A **remote adapter** wrapping the real SDK
- A **selector** that picks the right implementation based on environment variables

This means:
- **Zero-config onboarding** — the starter works without configuring every service
- **Deterministic tests** — fixture data makes tests reliable and fast
- **Graceful degradation** — missing API keys don't cause crashes

For details, see [ADR-001](docs/adrs/ADR-001-service-adapter-pattern.md).

### Database adapter

The active database adapter is selected in `packages/database/index.ts`:

```ts
// Convex edition (active)
export * from "./convex";

// Prisma edition (switch by uncommenting)
// export * from "./prisma";

// Drizzle edition (switch by uncommenting)
// export * from "./drizzle";
```

### Auth flow

1. User signs in → Better Auth sets a Convex JWT cookie
2. Middleware checks cookie → redirects to `/sign-in` if missing
3. Server components call `getToken(createAuth)` to retrieve the JWT
4. Convex queries receive the JWT as `{ token }` → server-side validation

---

## Features

| Feature | Status | Package |
|---------|--------|---------|
| Email/password auth | ✅ | `@repo/auth` + Better Auth |
| OAuth (GitHub) | ✅ | `@repo/auth` + Better Auth |
| Multi-tenant organizations | ✅ | Better Auth org plugin |
| RBAC (owner/admin/member) | ✅ | `@repo/auth/permissions` |
| API keys (org-scoped) | ✅ | Better Auth apiKey plugin |
| Stripe subscriptions | ✅ | `@repo/payments` + `@better-auth/stripe` |
| Email verification | ✅ | `@repo/email` + Resend |
| Transactional email | ✅ | `@repo/email` + React Email |
| Real-time collaboration | ✅ | `@repo/collaboration` + Liveblocks |
| In-app notifications | ✅ | `@repo/notifications` + Knock |
| Feature flags | ✅ | `@repo/feature-flags` + Vercel Flags SDK |
| Webhook handling | ✅ | `@repo/webhooks` + Svix |
| Rate limiting | ✅ | `@repo/security` + Arcjet |
| Security headers (CSP) | ✅ | `@repo/security` + nosecone |
| Error tracking | ✅ | `@repo/observability` + Sentry |
| Structured logging | ✅ | `@repo/observability` + BetterStack |
| Product analytics | ✅ | `@repo/analytics` + PostHog |
| Google Analytics | ✅ | `@repo/analytics` |
| Internationalization | ✅ | `@repo/i18n` (6 locales) |
| SEO / JSON-LD | ✅ | `@repo/seo` |
| File storage | ✅ | `@repo/storage` + Vercel Blob |
| Dark mode | ✅ | next-themes |
| Docker (API) | ✅ | `apps/api/Dockerfile` |
| E2E tests | ✅ | Playwright |
| CI/CD | ✅ | GitHub Actions |

---

## Upgrading

If you've forked bacon and want to keep up with upstream changes, see [UPGRADING.md](UPGRADING.md) for detailed guidance on rebasing, cherry-picking, and conflict resolution.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

### Quick contribution workflow

1. Check for existing issues or open a new one
2. Fork the repo and create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes, following existing code style
4. Add or update tests
5. Run `pnpm check` and `pnpm -r typecheck`
6. Submit a pull request

### Documentation

- Architecture decisions: [docs/adrs/](docs/adrs/)
- Detailed documentation: [apps/docs](apps/docs/) (Fumadocs site)

---

## License

MIT — see [license.md](license.md)

bacon is a fork of [next-forge](https://github.com/vercel/next-forge) by Hayden Bleasel, licensed under MIT. Additional modifications and extensions are also MIT.
