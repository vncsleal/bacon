# ADR-004: Monorepo Structure

## Status

Accepted

## Context

bacon is a B2B SaaS starter containing multiple deployable applications (dashboard, marketing site, API server, documentation, email previews, storybook) and shared packages (auth, database, design system, payments, etc.). We needed a build system and workspace structure that:

1. **Supports independent deployment** — each app deploys separately to its own URL/domain
2. **Shares code efficiently** — packages are consumed by multiple apps without duplication
3. **Scales with team size** — clear boundaries between packages prevent dependency tangling
4. **Fast builds** — incremental builds, caching, parallel execution
5. **Type-safe** — end-to-end TypeScript across package boundaries

We evaluated three approaches:

**No monorepo (separate repos)** — maximum independence but significant overhead managing cross-cutting changes, shared TypeScript configurations, and consistent tooling across repos.

**Nx** — powerful, mature monorepo tool with advanced computation caching, distributed task execution, and code generation. Rich plugin ecosystem but significant configuration overhead and a steeper learning curve.

**Turborepo** — simpler, purpose-built monorepo tool by Vercel. First-class Next.js support, zero-config for many patterns, and a minimal API surface.

## Decision

We chose **Turborepo 2 + pnpm workspaces** as the monorepo foundation.

### Why Turborepo

1. **Next.js-native** — built by Vercel for Next.js. Turborepo understands Next.js build outputs, automatically caches `.next/` directories, and integrates with the Vercel deployment platform.

2. **Minimal configuration** — `turbo.json` is simple and intuitive. The task pipeline (`build`, `dev`, `test`) is defined in ~30 lines with clear dependency declarations.

3. **Remote caching** — Turborepo supports remote caching via Vercel's infrastructure, dramatically speeding up CI builds.

4. **Task boundaries** — Turborepo's boundary system (`pnpm boundaries`) enforces that packages only import from declared workspace dependencies, preventing dependency tangling.

5. **Community standard** — Turborepo is the de facto monorepo standard for Next.js projects. Documentation, tutorials, and community patterns are abundant.

### Why not Nx

- Nx is more powerful but also more complex. For bacon's scope (~6 apps, ~15 packages), Turborepo's simplicity is a net positive
- Nx's plugin system adds configuration files and code generation that would increase the maintenance surface

### Why pnpm workspaces

1. **Strict dependency isolation** — pnpm's strict `node_modules` structure prevents packages from importing undeclared dependencies
2. **Disk efficiency** — content-addressable storage means shared dependencies are stored once
3. **Workspace protocol** — `workspace:*` references ensure packages always use the local version during development

### Workspace layout

```
bacon/
├── apps/              # Deployable applications
│   ├── app/           # Main dashboard (port 3000)
│   ├── web/           # Marketing site (port 3001)
│   ├── api/           # API server (port 3002)
│   ├── docs/          # Documentation site (port 3004)
│   ├── email/         # React Email previews (port 3003)
│   └── storybook/     # Component library (port 6006)
├── packages/          # Shared libraries
│   ├── auth/          # Better Auth client/server + RBAC
│   ├── database/      # Convex adapter (active) + Prisma/Drizzle stubs
│   ├── design-system/ # shadcn/ui components
│   ├── payments/      # Stripe integration
│   ├── email/         # Resend transactional email
│   ├── cms/           # BaseHub CMS (with adapter pattern)
│   ├── security/      # Arcjet rate limiting + nosecone headers
│   ├── observability/ # Sentry + BetterStack
│   ├── ...            # (see full list in structure diagram)
└── turbo.json         # Task pipeline configuration
```

### Key configuration

`turbo.json` defines a simple pipeline:
- `build` — depends on `^build` (upstream dependencies build first), outputs `.next/` and `generated/`
- `test` — depends on `^test` (upstream tests pass first)
- `dev` — persistent, no caching
- `envMode: "loose"` — allows env vars without explicit declaration (necessary for the dynamic env var pattern across packages)

## Consequences

### Positive

- **Parallel builds** — Turbo's topological task execution means independent packages build concurrently
- **Incremental builds** — cache hits skip work in CI, reducing build times significantly
- **Clear boundaries** — `pnpm boundaries` enforces package dependency rules
- **Standard tooling** — pnpm's strict `node_modules` catches undeclared imports at install time
- **Simple configuration** — `turbo.json` is ~40 lines and self-documenting

### Negative

- **No distributed task execution** — Turborepo's cloud caching is available, but distributed execution requires Vercel's enterprise tier
- **Cache invalidation** — stale caches can produce false positives; periodic `--force` builds may be needed
- **pnpm strictness** — occasionally requires explicit `package.json` entries for transitive dependencies that would resolve automatically in npm/Yarn

### Mitigations

- CI includes a full `--force` build periodically to catch cache inconsistencies
- pnpm's strictness catches more bugs at install time than it causes in practice
- The workspace layout follows Turborepo conventions, making it easy to adopt new Turborepo features as they ship
