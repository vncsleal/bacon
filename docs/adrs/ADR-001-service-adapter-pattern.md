# ADR-001: Service Adapter Pattern

## Status

Accepted

## Context

bacon integrates with multiple external services: Convex (database), Better Auth (authentication), BaseHub (CMS), Resend (email), Stripe (payments), and more. Each of these services requires API keys or tokens that must be configured via environment variables.

The starter should work out of the box without requiring every consumer to configure every service on day one. A developer cloning bacon for evaluation should be able to run `pnpm dev` and see a working application without signing up for 15 different services.

Additionally, CI/CD pipelines and e2e tests should run without external service dependencies. External API calls introduce flakiness, rate limiting, and cost into automated test suites.

We needed a pattern that satisfies three constraints:

1. **Zero-config onboarding** — the starter builds and runs with no environment variables configured
2. **Deterministic testing** — tests run against predictable local data, not live APIs
3. **Graceful degradation** — when a service key is missing, the feature degrades silently (returns empty data, uses fixture content, or skips the integration)

## Decision

We adopted a **service adapter pattern** for all external service integrations. Each service has:

**A port (interface)** — a TypeScript type or interface in a `port.ts` file that defines the contract between the application and the external service. The port lives in the package and contains only domain types — no framework imports, no SDK types.

**Multiple implementations:**
- A **remote adapter** that wraps the real SDK (BaseHub client, Stripe SDK, etc.)
- A **local adapter** that provides fixture/test data without any external dependency

**A singleton selector** (typically `adapters/index.ts`) that reads an environment variable or other runtime signal to decide which implementation to return. The selector is called once at module load and caches the result.

### Concrete example: CMS (BaseHub)

```
packages/cms/
  adapters/
    port.ts       # CmsDataPort, CmsUiComponents types
    local.tsx     # createLocalCmsUi() — fixtures with hardcoded blog posts
    index.ts      # getCmsAdapter() — reads BASEHUB_TOKEN, returns local or remote
  index.ts        # BaseHub SDK integration (used by remote adapter)
```

The `getCmsAdapter()` function checks `process.env.BASEHUB_TOKEN`. If set, it returns the remote adapter that uses the real BaseHub SDK. If absent, it returns the local adapter that renders fixture blog posts from hardcoded data. The rest of the application never knows which implementation is active.

### How it's applied across the codebase

| Package | Port | Env Signal | Local Impl | Remote Impl |
|---------|------|------------|------------|-------------|
| `@repo/cms` | `adapters/port.ts` | `BASEHUB_TOKEN` | Fixture posts + local rich text renderer | BaseHub SDK (`basehub/react-pump`, `basehub/next-image`) |
| `@repo/email` | N/A (already guards) | `RESEND_TOKEN` | Returns `{ success: false }` | Resend SDK |
| `@repo/payments` | N/A (already guards) | `STRIPE_SECRET_KEY` | Stripe client is `null` | Stripe SDK |
| `@repo/security` | N/A (already guards) | `ARCJET_KEY` | Arcjet client is `null` | Arcjet SDK |

## Consequences

### Positive

- **Build succeeds with zero env vars** — the starter builds and runs with no configuration beyond `pnpm install`
- **E2E tests are deterministic** — tests run against fixture data, not live API responses
- **Fast local development** — no need to set up every service before running the app
- **Clear separation of concerns** — port types are the boundary; remote and local implementations are swappable
- **No runtime fallback chains** — the selector picks one implementation at init time, not cascading try/catch

### Negative

- **Slightly more boilerplate** — each service needs a port definition plus at least two implementations
- **Fixture maintenance** — local fixtures must be updated when the data model changes
- **Remote adapter indirection** — the remote adapter typically wraps the SDK's own API, so there's a thin layer of indirection

### Mitigations

- The port files are small (types only) and co-located with the adapter implementations
- Local fixtures are typed against the same port types, so TypeScript catches schema drift
- Remote adapter wrapping is minimal — typically just re-exporting SDK functions through the port interface
