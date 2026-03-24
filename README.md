# bettercone-starter · Convex Edition

**Production-grade Turborepo starter for Next.js SaaS — Convex + Better Auth + Stripe.**

## Overview

`bettercone-starter` is the Convex edition of the [Bettercone](https://bettercone.dev) assembly engine starter. Fork it directly, or let the assembly engine generate a configured version with your chosen database/payments adapter.

Forked from [next-forge](https://github.com/vercel/next-forge) v5.2.4, extended with:

- **Authentication** — [Better Auth](https://better-auth.com) (email/password + OAuth + organization plugin)
- **Database** — [Convex](https://convex.dev) (real-time, serverless, no migrations)
- **Payments** — [Stripe](https://stripe.com) subscriptions via `@better-auth/stripe`
- **Adapter pattern** — Switch to Prisma/Drizzle edition by swapping `packages/database/index.ts`

### Core principles

- **Fast** — Quick to build, run, deploy, and iterate on
- **Cheap** — Free to start with services that scale with you
- **Opinionated** — Integrated tooling designed to work together
- **Modern** — Latest stable features with healthy community support
- **Safe** — End-to-end type safety and robust security posture

## Quick Start

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io)
- A [Convex](https://convex.dev) account
- A [Stripe](https://stripe.com) account (optional for dev)

### Steps

```sh
# 1. Install dependencies
pnpm install

# 2. Set up env vars
cp .env.example .env.local
# fill in NEXT_PUBLIC_CONVEX_URL, BETTER_AUTH_SECRET, STRIPE_SECRET_KEY, etc.

# 3. Push schema and start Convex dev server
cd packages/database && npx convex dev

# 4. Start all apps
pnpm dev
```

## Structure

```
bettercone-starter/
├── apps/
│   ├── app/        # Main application (port 3000) — auth, org, dashboard
│   ├── web/        # Marketing site (port 3001)
│   ├── api/        # API server (port 3002)
│   ├── docs/       # Documentation
│   ├── email/      # Email templates
│   └── storybook/  # Component library
└── packages/
    ├── auth/                 # Better Auth client + server helpers
    ├── database/             # Convex adapter (index.ts = active edition)
    │   └── convex/           # Convex functions, schema, betterAuth component
    ├── design-system/        # shadcn/ui component library
    ├── payments/             # Stripe integration
    ├── email/                # Resend transactional email
    ├── collaboration/        # Liveblocks real-time features
    ├── notifications/        # Knock in-app notifications
    ├── feature-flags/        # Vercel feature flags
    ├── webhooks/             # Svix webhook handling
    ├── analytics/            # PostHog + Google Analytics
    ├── observability/        # Sentry + BetterStack
    └── security/             # Arcjet rate limiting + secure headers
```

## Adapter Pattern

The active database edition is determined by `packages/database/index.ts`:

```ts
// Convex edition (current)
export * from "./convex";

// Prisma edition (switch by changing the line above)
// export * from "./prisma";
```

The Bettercone assembly engine writes this file when generating a configured starter.

## Features

- ✅ Better Auth — email/password, OAuth (GitHub), organization plugin, API keys
- ✅ Convex — real-time backend, schema-first, no migrations
- ✅ Stripe subscriptions — free + pro plans, webhook handling
- ✅ Organization switcher — create, switch, invite members
- ✅ Transactional email — Resend + React Email
- ✅ Real-time collaboration — Liveblocks cursors + avatar stack
- ✅ Feature flags — Vercel flags SDK
- ✅ Observability — Sentry + BetterStack
- ✅ Security — Arcjet rate limiting, secure headers
- ✅ Dark mode — system/light/dark via next-themes

## License

MIT

