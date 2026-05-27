# ADR-003: Auth Architecture

## Status

Accepted

## Context

bacon needed an authentication system that supports:

1. **Multi-tenant organizations** — users belong to organizations with role-based access control (RBAC)
2. **Multiple auth methods** — email/password and OAuth (GitHub) on day one, extensible to more
3. **API key authentication** — programmatic access to the API for server-to-server communication
4. **Server-side rendering compatible** — auth state must be available in React Server Components without client-side JavaScript
5. **Framework-native** — integrate naturally with Next.js App Router's architecture
6. **Production-grade security** — proper JWT handling, cookie security, CSRF protection

We evaluated several auth solutions:

**Clerk** — popular, feature-rich, but has a controversial history of breaking changes, aggressive pricing at scale, and vendor lock-in. The original starter (next-forge) used Clerk.

**Auth.js (NextAuth)** — mature and widely adopted, but its database adapter model requires a SQL database, and its session strategy (database sessions or JWT) adds complexity. No first-class organization/RBAC support.

**Better Auth** — a newer framework by the creator of the "Be Real" app. Designed specifically as a server-first auth library for frameworks like Next.js. Has first-class plugins for organizations, API keys, and Stripe subscriptions. Integrates with Convex via an official plugin.

## Decision

We chose **Better Auth** as the authentication framework, paired with the **Convex plugin** for session storage and JWT validation.

### Architecture overview

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App Router                 │
│                                                      │
│  Route Handler (apps/app/api/auth/[...all])          │
│    └── Better Auth instance (createAuth)             │
│         └── Convex adapter (session storage)         │
│                                                      │
│  Middleware (packages/auth/middleware.ts)             │
│    └── Checks Convex JWT cookie on protected routes  │
│         └── Redirects to /sign-in if missing         │
│                                                      │
│  RSC / Server Components                             │
│    └── getToken(createAuth) → Convex fetchQuery      │
│         with token in options                        │
│                                                      │
│  Client Components                                   │
│    └── authClient.useSession() etc.                  │
└─────────────────────────────────────────────────────┘
```

### Key design decisions

**1. Route handler, not separate server** — Better Auth runs as a Next.js route handler at `apps/app/app/api/auth/[...all]/route.ts`. No separate auth server to deploy. The route handler is rate-limited via `@repo/security`.

**2. Convex JWT plugin** — The `@convex-dev/better-auth` plugin issues a short-lived JWT stored in a cookie (`better-auth.convex_jwt` in development, `__Secure-better-auth.convex_jwt` in production). This JWT is:
- Set by Better Auth on sign-in
- Validated by Convex server-side on every `fetchQuery`/`fetchMutation` call
- Passed from RSC to Convex via the `{ token }` option

**3. Middleware-level protection** — `packages/auth/middleware.ts` checks for the JWT cookie on all routes except public paths (`/sign-in`, `/sign-up`, `/verify-email`, `/api/auth`). Missing cookie → redirect to `/sign-in` with `callbackUrl`.

**4. RBAC via organization plugin** — Better Auth's organization plugin provides built-in roles (owner, admin, member) with custom permissions defined in `packages/auth/permissions.ts`. The access control extends Better Auth's default statements with app-specific resources (`project`, `apiKey`, `auditLog`).

**5. API keys** — Better Auth's `apiKey` plugin provides programmatic authentication. API keys are scoped to organizations, with configurable rate limiting.

**6. Stripe subscriptions** — The `@better-auth/stripe` plugin syncs subscription state with Convex. Plans (free/pro) are defined in the auth configuration with limits per plan.

**7. Email verification** — Email OTP verification is handled by Better Auth's `emailOTP` plugin, using Resend for delivery. Verification is required for sign-in (configured via `requireEmailVerification: true`).

## Consequences

### Positive

- **Single framework** — Better Auth handles email/password, OAuth, organizations, API keys, and Stripe subscriptions in one system
- **RSC-native** — the Convex JWT pattern works naturally with React Server Components and `fetchQuery`
- **No separate auth service** — no separate deployment, no additional infrastructure
- **Rate-limit ready** — the auth route handler is wrapped with Arcjet rate limiting out of the box
- **Permission checks everywhere** — RBAC works identically in server components and client components

### Negative

- **Newer ecosystem** — Better Auth has a smaller community than Clerk or Auth.js. Fewer tutorials, fewer OAuth provider integrations out of the box
- **Tight coupling to Convex** — the session store is Convex-specific. Switching to a different database requires rewriting the auth configuration
- **JWT size** — the Convex JWT includes user and session data; very large organization counts could approach cookie size limits
- **No built-in admin UI** — user management requires building custom admin pages or using Convex's admin panel directly

### Mitigations

- Better Auth's plugin architecture is extensible — adding OAuth providers is straightforward
- The JWT is short-lived (and Convex's `fetchQuery` validates it on every call), so the cookie size is less of a concern
- The Convex dashboard serves as an admin panel for user and session management during development
