# bacon — Agent Context

> **Global rules apply:** `~/.config/opencode/AGENTS.md` — hardening principles (strong typing, no workarounds, no bypasses, fail loud, no fallback chains) and architecture mandate (domain-grouped packages, dependency inversion).

This file gives AI coding agents (Cursor, Claude Code, Copilot) accurate context about the bacon stack — so they can write code that actually compiles and runs.

**bacon** = **B**2B + **A**uth + **C**onvex + **O**rganizations + **N**ext.js
A production-grade, standalone B2B SaaS starter. No assembly engine. No generator. Fork it and ship.

---

## What This Project Is

A production-grade Next.js SaaS monorepo. Turborepo + pnpm. TypeScript strict mode throughout.

**Active modules:**
- Authentication — Better Auth (email/password + OAuth + organization plugin + apiKey plugin)
- Database — Convex (real-time, serverless, no migrations required)
- Payments — Stripe subscriptions via `@better-auth/stripe`
- Organizations — multi-tenant with RBAC (owner / admin / member)
- API Keys — programmatic access keys, org-scoped
- Email — Resend + React Email
- Collaboration — Liveblocks (cursors, avatar stack)
- Notifications — Knock
- Feature flags — Vercel flags SDK
- Observability — Sentry + BetterStack
- Security — Arcjet rate limiting + nosecone secure headers
- Analytics — PostHog + Google Analytics
- i18n — next-international (en, pt, fr, de, es, zh)

---

## Monorepo Structure

```
apps/
  app/          # Main application (port 3000) — authenticated dashboard
  web/          # Marketing site (port 3001)
  api/          # API server (port 3002) — webhooks, cron
  docs/         # Mintlify documentation
  email/        # React Email previews
  storybook/    # Component library
packages/
  auth/         # Better Auth client + server helpers + RBAC permissions
  database/     # Convex adapter (active) — index.ts = active edition
  design-system/ # shadcn/ui component library
  payments/     # Stripe integration
  email/        # Resend transactional email
  collaboration/ # Liveblocks
  notifications/ # Knock
  feature-flags/ # Vercel flags
  webhooks/     # Svix
  analytics/    # PostHog + Google Analytics
  observability/ # Sentry + BetterStack
  security/     # Arcjet + nosecone
  i18n/         # next-international dictionaries
```

---

## Critical Import Patterns

**Server components / RSC (needs auth context):**
```ts
import { getToken } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@repo/database/convex/auth";
import { api } from "@repo/database/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

const token = await getToken(createAuth);
const user = token ? await fetchQuery(api.auth.getCurrentUser, {}, { token }) : null;
```

**Client components:**
```ts
import { authClient } from "@repo/auth/client";

// Current user
const { data: session } = authClient.useSession();

// Organization
const { data: activeOrg } = authClient.useActiveOrganization();
await authClient.organization.list();
await authClient.organization.setActive({ organizationId: id });
await authClient.organization.create({ name, slug });

// API keys
await authClient.apiKey.create({ name });
await authClient.apiKey.list();
await authClient.apiKey.delete({ keyId });

// Sign out
await authClient.signOut();
```

**Permission checks (server, RSC-safe):**
```ts
import { createAuth } from "@repo/database/convex/auth";
// auth.api.hasPermission({ ... }) — checks against owner/admin/member roles
```

**Convex queries (from RSC):**
```ts
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@repo/database/convex/_generated/api";

const pages = await fetchQuery(api.pages.listAll, {}, { token });
```

**Convex functions (define new ones in packages/database/convex/):**
```ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => { ... },
});
```

**Payments:**
```ts
import { stripe } from "@repo/payments";
```

**Email:**
```ts
import { sendEmail } from "@repo/email";
```

**Feature flags:**
```ts
import { getFlags } from "@repo/feature-flags";
```

---

## Auth Architecture

Better Auth runs as a Next.js route handler at `apps/app/app/api/auth/[...all]/route.ts`. It is NOT a separate server.

The Convex plugin (`@convex-dev/better-auth`) issues a short-lived JWT cookie (`better-auth.convex_jwt` / `__Secure-better-auth.convex_jwt` in production). This cookie is checked by the middleware at `packages/auth/middleware.ts` and consumed by `getToken(createAuth)` in RSC.

**Auth flow:**
1. User signs in at `/sign-in` → better-auth sets the Convex JWT cookie
2. Middleware checks cookie presence → redirects to `/sign-in` if missing
3. RSC calls `getToken(createAuth)` to get the JWT
4. RSC passes JWT to `fetchQuery` as `{ token }` — Convex validates it server-side

**Public paths** (no redirect): `/sign-in`, `/sign-up`, `/api/auth`

---

## Database: Convex

Schema lives at `packages/database/convex/betterAuth/schema.ts` (auth tables) and `packages/database/convex/schema.ts` (app tables).

**Tables:**
- Auth: `user`, `session`, `account`, `verification`, `jwks`, `subscription`, `organization`, `member`, `invitation`, `apikey`
- App: `page` (example table — replace or extend as needed)

To add a new table:
1. Add it to `packages/database/convex/schema.ts`
2. Define queries/mutations in a new file under `packages/database/convex/`
3. Run `npx convex dev` in `packages/database/` to regenerate `_generated/`

**Do NOT** use `packages/database/drizzle/` or `packages/database/prisma/` — they are stubs for alternate editions. The active adapter is always `packages/database/convex/`.

---

## RBAC Roles

Defined in `packages/auth/permissions.ts`. Three roles per organization:

| Role | project | apiKey | auditLog |
|------|---------|--------|----------|
| owner | CRUD | CRD | R |
| admin | CRU | CR | R |
| member | R | — | — |

Server permission check: `auth.api.hasPermission({ userId, organizationId, permission: { project: ['delete'] } })`
Client permission check: `authClient.organization.hasPermission({ permission: { project: ['delete'] } })`

---

## Environment Variables

Required to run:
```
NEXT_PUBLIC_CONVEX_URL=          # from Convex dashboard
BETTER_AUTH_SECRET=              # random 32-char string
STRIPE_SECRET_KEY=               # Stripe dashboard → Developers → API keys
STRIPE_WEBHOOK_SECRET=           # Stripe dashboard → Webhooks
```

See `.env.example` at the root for the full list.

---

## What NOT to Do

- **Do not import from `@clerk/nextjs`** — Clerk has been removed entirely.
- **Do not use `next-auth` / `NextAuth`** — this project uses Better Auth, a completely different package.
- **Do not write SQL** — there is no SQL database. All data access is via Convex queries/mutations.
- **Do not call `database.xxx.findMany()`** — that's Prisma syntax. Use `fetchQuery(api.xxx.yyy, ...)`.
- **Do not add Prisma or Drizzle dependencies** — they are adapter stubs, not active packages.
- **Do not import `createAuth` in client components** — it is a server-only factory.
- **Do not modify `packages/database/convex/betterAuth/`** — those are generated files managed by `@convex-dev/better-auth`. Add app tables to `packages/database/convex/schema.ts` instead.

---

## Adapter Note

The `packages/database/index.ts` selects the active database adapter. The Convex edition is active by default. Prisma and Drizzle stubs exist for alternate editions — edit `index.ts` to switch. Do not remove the stubs.
