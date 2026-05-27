# ADR-006: Rate Limiting Composition

## Status

Accepted

## Context

bacon needs rate limiting across multiple call sites — form submissions, auth endpoints, and API routes. Two services are available: Arcjet (application-layer, edge-deployed, bot detection) and Upstash Redis (infrastructure-layer, sliding window counters). A single solution was not prescribed — each service has distinct strengths and this ADR records how they compose.

## Decision

Two complementary layers.

### Layer 1: Arcjet (application-layer)

- Handles per-route rate limiting with bot detection and shield protection
- Configured in `packages/security/index.ts`
- Exports `rateLimit()`, `secure()`, and `withRateLimit()` for route handlers
- Guarded by `ARCJET_KEY` — when absent, all functions return silently (no-op)
- **Currently deployed nowhere** — available for callers to adopt per route

### Layer 2: Upstash Redis (infrastructure-layer)

- Handles sliding window rate limits
- Configured in `packages/rate-limit/index.ts`
- Exports `createRateLimiter()` for creating limiters
- Guarded internally — when `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` is absent, `createRateLimiter()` returns a no-op limiter (`limit` always returns `{ success: true }`)
- The `redis` instance is internal (not exported) — consumers must use `createRateLimiter()`
- **Active in:** contact form (`apps/web/app/[locale]/contact/actions/contact.tsx`)

### When to use which

| Scenario | Recommended layer | Note |
|----------|------------------|------|
| Auth endpoints | Arcjet `rateLimit()` | Arcjet handles these today in the security package |
| Bot protection | Arcjet `secure()` | Not yet deployed on any route |
| Form spam / per-IP limits | Upstash `createRateLimiter()` | Currently active on the contact form |
| High-throughput API limits | Either | Arcjet for edge-deployed, Upstash for Redis-backed |

## Alternatives Considered

1. **Arcjet-only** — Arcjet supports both fixed window and sliding window. Single env var, simpler setup. Rejected because Arcjet's sliding window is server-side (not Redis-backed), making it less portable outside Vercel's edge.

2. **Upstash-only** — Single Redis dependency. Rejected because Arcjet's bot detection and shield rules provide value that Upstash cannot replace.

3. **In-memory only (no service)** — Simplest, zero deps. Rejected because in-memory counters reset on every server restart and don't scale across instances.

## Consequences

1. **Two env var sets to configure** — Users who want rate limiting must set both `ARCJET_KEY` and `UPSTASH_REDIS_*` vars. Both layers no-op when unconfigured (Arcjet returns silently; Upstash returns a no-op limiter).

2. **Redis constructed only when configured** — The `redis` instance is created lazily when `url` and `token` are present. No `console.warn` noise on cold starts. No broken client at module load.

3. **Arcjet edge latency** — Each Arcjet-protected route incurs a network round-trip (~5-20ms). Acceptable for auth and forms; not recommended for high-throughput read endpoints.

4. **Error handling not unified** — Arcjet's `withRateLimit()` catches denials and returns HTTP 429. Upstash callers must implement their own error handling (the contact form uses a generic try/catch with `parseError()`). A unified `withRateLimit`-equivalent for Upstash is future work.

5. **`redis` kept internal** — The Redis client is no longer exported from `@repo/rate-limit`. All access goes through `createRateLimiter()`, which self-guards against missing configuration. This removes the risk of callers importing a broken Redis client directly.

---

*Date: 2026-05-27*
