# ADR-005: Security Approach

## Status

Accepted

## Context

bacon is a B2B SaaS starter that will be deployed in production environments handling user data and authentication. We needed a security strategy that covers:

1. **API protection** — rate limiting to prevent abuse and brute-force attacks
2. **Bot detection** — prevent automated scraping, credential stuffing, and malicious bots
3. **HTTP security headers** — Content Security Policy (CSP), HSTS, X-Frame-Options, and other standard protections
4. **Authentication security** — secure cookie handling, CSRF protection, proper session management
5. **Graceful degradation** — when security services are unavailable (local dev, CI), the application should still function without crashing

We evaluated three approaches:

**Self-implemented** — writing custom rate limiting with in-memory stores or Redis. Full control but high maintenance burden. Easy to get wrong (race conditions, memory leaks, incorrect bucket semantics).

**Single vendor solution** — using one provider for all security needs. Simpler integration but creates a single point of failure and may result in paying for features you don't need.

**Composed layered approach** — using specialized tools for specific concerns. More services to configure but best-of-breed at each layer and the ability to start with minimal configuration.

## Decision

We adopted a **composed security approach** with two primary tools and a zero-dependency fallback mode:

### Security layers

```
┌─────────────────────────────────────────────────────┐
│                  nosecone (headers)                   │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Arcjet (rate limit + bot)           │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │        Better Auth (auth security)           │ │ │
│  │  │  ┌─────────────────────────────────────────┐ │ │ │
│  │  │  │    Next.js (framework-level security)    │ │ │ │
│  │  │  └─────────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Tool selection

**Arcjet** — rate limiting, bot detection, and shield (SQL injection / suspicious payload detection).
- Chosen for its Next.js-native integration and edge runtime support
- Works as a middleware layer or inline in route handlers
- Falls back gracefully when `ARCJET_KEY` is not configured (returns `null` client, operations become no-ops)
- Provides `withRateLimit()` utility that returns a `Response` on denial or `null` on allow, making route handler integration trivial

**nosecone** — HTTP security headers.
- Chosen for its Next.js middleware integration, CSP builder, and Vercel toolbar compatibility
- Generates strict defaults with self-only directives, extended dynamically based on enabled features
- The CSP is built from environment variables — only add origins for services that are actually configured
- Separated into two profiles:
  - Full CSP for HTML-rendering apps (app, web)
  - CSP-disabled for the API app (JSON responses don't execute scripts)
  - See `packages/security/middleware.ts`

**Better Auth** — authentication security.
- Handles password hashing, session management, CSRF protection, and JWT signing
- Rate-limited independently via Arcjet at the auth route handler level
- Email OTP verification with configurable expiry, length, and max attempts

**Next.js** — framework-level protections.
- Built-in CSRF protection for Server Actions
- Middleware-based route protection via custom `authMiddleware`
- Secure cookie configuration via Next.js response API

### How security is applied per app

| App | Arcjet | nosecone | Auth Middleware |
|-----|--------|----------|-----------------|
| `app/` (dashboard) | Auth routes only | Full CSP | Global |
| `web/` (marketing) | Inbound routes | Full CSP | None (public) |
| `api/` (API server) | All routes | No CSP (JSON) | Per-route |

### Graceful degradation

All security services follow the **service adapter pattern** (see ADR-001):

```ts
// packages/security/index.ts
const base = arcjetKey
  ? arcjet({ key: arcjetKey, rules: [shield({ mode: "LIVE" })] })
  : null;

export const withRateLimit = async (options, request) => {
  if (!base) return null; // Graceful skip when unconfigured
  // ... actual rate limiting
};
```

This means:
- Local development works without any security keys configured
- CI builds and tests pass without Arcjet or other security services
- In production, configure `ARCJET_KEY` and security activates automatically

## Consequences

### Positive

- **Layered defense** — no single point of failure in the security model
- **Zero-config dev** — security services skip gracefully when unconfigured
- **Best-of-breed** — each layer uses the tool optimized for its purpose
- **Feature-aware CSP** — CSP directives are built dynamically based on which services are enabled
- **Edge-compatible** — both Arcjet and nosecone run at the edge (Vercel Edge Functions / Middleware)

### Negative

- **Multiple vendors** — Arcjet and nosecone are separate services from different providers. Two accounts, two dashboards, two integration points
- **Per-request latency** — Arcjet's rate limiting adds a network round-trip for each protected request. The fixed window strategy minimizes overhead but is not zero
- **CSP maintenance** — as new services are added, CSP directives must be extended. The current env-var-driven approach helps but is not fully automatic

### Mitigations

- Both Arcjet and nosecone are from the same parent company (Arcjet), sharing a single dashboard
- Arcjet's `shield` rule handles common attack patterns without requiring per-endpoint configuration
- The CSP builder in `packages/security/middleware.ts` is centralized — adding a new source means one file change
- Rate limiting is applied per-route with appropriate limits (e.g., auth POST: 5/min, auth GET: 20/min)
