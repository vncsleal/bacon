# bacon — Production-Ready v1 PRD

> **bacon** = **B**2B + **A**uth + **C**onvex + **O**rganizations + **N**ext.js

---

## 1. Product Overview

### What It Is

A standalone, production-grade B2B SaaS starter kit. Fork it, configure env vars, deploy. No assembly engine, no generator.

### Who It's For

Experienced TypeScript developers who need a head start on a B2B SaaS. Teams that value type safety, real-time data, and opinionated tooling over drag-and-drop builders.

### Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Monorepo | Turborepo 2 + pnpm |
| Language | TypeScript strict mode |
| Database | Convex (serverless, real-time, no migrations) |
| Auth | Better Auth (email/password, OAuth, orgs, API keys) |
| Payments | Stripe subscriptions via `@better-auth/stripe` |
| Email | Resend + React Email |
| UI | shadcn/ui + Tailwind CSS v4 |
| Collaboration | Liveblocks |
| Notifications | Knock |
| Feature flags | Vercel Flags SDK |
| Observability | Sentry + BetterStack |
| Security | Arcjet + nosecone |
| Analytics | PostHog + Google Analytics |
| Webhooks | Svix |
| i18n | next-international (en, pt, fr, de, es, zh) |

### Core Principles

- **Fast** — Quick to build, run, deploy, iterate
- **Cheap** — Free to start, services that scale with you
- **Opinionated** — Integrated tooling, not a box of parts
- **Modern** — Latest stable features, healthy community
- **Safe** — End-to-end type safety, robust security

### Workspace Structure

```
apps/
  app/            # Main application (port 3000) — authenticated dashboard
  web/            # Marketing site (port 3001)
  api/            # API server (port 3002) — webhooks, cron
  docs/           # Mintlify documentation (in pnpm workspace)
  email/          # React Email previews
  storybook/      # Component library
packages/
  analytics/      # PostHog + Google Analytics
  auth/           # Better Auth client + server helpers + RBAC permissions
  cms/            # BaseHub CMS integration (build-gated)
  collaboration/  # Liveblocks
  database/       # Convex adapter (active) — index.ts = active edition
  design-system/  # shadcn/ui component library
  email/          # Resend transactional email
  feature-flags/  # Vercel flags SDK
  internationalization/ # next-international dictionaries
  next-config/    # Next.js configuration helpers, bundle analyzer
  notifications/  # Knock
  observability/  # Sentry + BetterStack
  payments/       # Stripe integration
  rate-limit/     # Upstash rate limiting (complements Arcjet)
  security/       # Arcjet (rate limiting, bot detection) + nosecone (secure headers)
  seo/            # SEO metadata, JSON-LD structured data
  storage/        # Vercel Blob file storage
  typescript-config/ # Shared TS configs (base, nextjs, react-library)
  webhooks/       # Svix
```

---

## 2. Current State Summary

### What Works Today

- Auth flows: sign-in, sign-up, OAuth (GitHub), org create/switch, invite members, API keys
- Stripe subscriptions: free + pro plans, webhook handling
- RBAC: owner/admin/member per org, server + client checks
- Transactional email: React Email templates, Resend send
- Real-time collaboration: Liveblocks cursors + avatar stack
- Feature flags: Vercel Flags SDK integration
- Observability: Sentry error tracking, BetterStack uptime
- Security: Arcjet rate limiting, nosecone secure headers
- Analytics: PostHog event capture, Google Analytics
- i18n: next-international dictionaries for 6 locales
- Webhooks: Svix inbound handling
- Health endpoint at `/api/health`
- CLI tool (`bacon`) built with tsup

### Known Gaps

| Gap | Severity | Details | Status |
|-----|----------|---------|--------|
| Incomplete test coverage | **HIGH** | 5 test files, 450+ lines. RBAC matrix, JWT parsing, payment keys, webhook errors covered. Auth flows, plan mapping missing. | Open |
| No e2e tests | **MEDIUM** | No Playwright/Cypress. Critical user paths never verified. | Open |
| No Docker/self-hosting | **MEDIUM** | No Dockerfile, no docker-compose. Single-region Vercel-only by default. | Open |
| No deployment guide | **MEDIUM** | No documented deploy process for apps/web/api. Convex deploy is manual. | Open |
| No migration from starter docs | **LOW** | No guide for renaming, re-styling, replacing content. | Open |
| No error boundaries | **LOW** | App root lacks React error boundaries. API routes lack global error handlers. | Open |
| No loading states skeleton | **LOW** | No `loading.tsx` at dashboard root. | Open |
| Build broken | — | `@repo/cms#build` skips gracefully without `BASEHUB_TOKEN` (no longer blocks). | ✅ Resolved |
| CI doesn't build apps | — | Both CI workflows build all apps via `turbo build --filter '!storybook'`. | ✅ Resolved |
| No PR-level CI | — | `ci.yml` exists on `pull_request` with typecheck + lint + build. | ✅ Resolved |
| No typecheck in CI | — | Both CI workflows run `pnpm -r typecheck`. | ✅ Resolved |
| `turbo build` depends on `test` | — | `turbo.json` build no longer depends on test. | ✅ Resolved |
| `apps/studio/` empty stub | — | Directory deleted. | ✅ Resolved |
| `packages/ai/` incomplete stub | — | Directory deleted. | ✅ Resolved |

---

## 3. Production-Ready v1 Definition

A "production-ready v1" of bacon means:

1. **Build succeeds** in CI and locally with zero manual env setup for the build step
2. **CI checks all apps** — build, typecheck, lint, test — every push and every PR
3. **Test infrastructure exists** — vitest workspace configured, tests exist for every core function (auth, RBAC, payments)
4. **E2E smoke passes** — create account → create org → subscribe → see dashboard
5. **Docker self-hosting** is documented and works for at least the API app
6. **Every module has a test** — unit for pure logic, integration for adapters
7. **Zero runtime `console.log`** in production paths — structured logging via observability package
8. **All empty stubs are removed** — `apps/studio` and `packages/ai` deleted in M0
9. **Deployment documented** — step-by-step from fork to production for all 4 deploy targets (Vercel apps, Convex, Stripe, Resend)
10. **Upgrade path documented** — how to keep up with bacon releases

---

## 4. Phase Plan

### Milestone 0: Foundation Fix (pre-v1 gate)

Fix the blockers so the project builds and CI is meaningful.

| Req | Description |
|-----|-------------|
| REQ-BUILD-001 | `@repo/cms#build` skips gracefully when `BASEHUB_TOKEN` is absent. CI sets an empty token so the build always proceeds in automation. |
| REQ-CI-001 | CI must run `turbo build`, `turbo typecheck`, `turbo check` (lint) on every push to main. |
| REQ-CI-002 | CI must build all deployable apps (`app`, `web`, `api`), not just the CLI. |
| REQ-CI-003 | Add `ci.yml` triggered on `pull_request` that gates PRs with build + typecheck + lint. |
| REQ-CI-004 | Enforce Biome's `noAny` rule (via `ultracite` / `pnpm check`) at error level in CI lint step. |
| REQ-TEST-001 | `turbo.json` must not gate `build` behind `test` until tests are reliable. |
| REQ-BUILD-002 | Delete `apps/studio` empty stub from workspace. |
| REQ-BUILD-003 | Delete or integrate `packages/ai` stub. |

**Tasks:**

1. **Fix `@repo/cms` build** — Make CMS build skip gracefully when `BASEHUB_TOKEN` is absent. Add `BASEHUB_TOKEN` to `.env.example` with a comment explaining where to get it.
2. **Add typecheck CI step** — Add `pnpm -r typecheck` to `ci.yml` and `release.yml`.
3. **Add lint CI step** — Add `pnpm check` to `ci.yml` and `release.yml`.
4. **Add PR-level CI** — Create `.github/workflows/ci.yml` with `pull_request` trigger, running build, typecheck, lint.
5. **Build all apps in CI** — Replace `npx tsup` with `turbo build --filter '!storybook'` in `ci.yml` and `release.yml`.
6. **Decouple test from build** — Remove `test` from build `dependsOn` in `turbo.json`.
7. **Add env validation** — Ensure CI can run with only the env vars available in GitHub Actions (no external service deps for build).
8. **Delete apps/studio** — Remove the directory and any references in turbo.json.
9. **Delete packages/ai** — Remove the directory and any references.
10. **Add no-explicit-any lint rule** — Ensure Biome's `noAny` rule (via `ultracite`) is enforced in CI. Fix existing violations before enforcement lands.

---

### Milestone 1: Testing Foundation

Build a comprehensive test suite that catches regressions.

| Req | Description |
|-----|-------------|
| REQ-TEST-100 | Core auth flows have integration tests (sign-up, sign-in, org create, invite member). |
| REQ-TEST-101 | Payment orchestration has unit tests (plan mapping, webhook event handlers). |
| REQ-TEST-102 | API endpoints have request-response tests (health, webhooks with mock payloads). |
| REQ-TEST-103 | RBAC permission logic has exhaustive unit tests. |
| REQ-TEST-104 | E2E smoke test covers: sign-up → email verification → create org → subscribe → dashboard. |
| REQ-TEST-105 | Test infrastructure operational: vitest workspace configured, tests exist for every core function. |

**Tasks:**

1. **Set up test infrastructure** — Configure vitest workspace across monorepo. Add `@testing-library/jest-dom` matchers. Set up coverage reporting (v8/istanbul).
2. **Add auth integration tests** — Test sign-up flow, sign-in flow, org creation, member invitation, API key CRUD.
3. **Add RBAC unit tests** — Exhaustive tests for `permissions.ts`: owner/admin/member permissions matrix, edge cases.
4. **Add payment unit tests** — Test plan mapping (free → pro), Stripe webhook event parsing, subscription status transitions.
5. **Add API route tests** — Test health endpoint (existing, deepen), webhook auth, webhook payments with mock Svix payloads.
6. **Add e2e smoke test** — Set up Playwright. Test: visit marketing site → sign up → verify email → create org → visit dashboard → visit settings.
7. **Add test to CI** — Re-add `test` to `turbo build` dependencies once tests are reliable.
8. **Add coverage thresholds** — Once test infrastructure is proven, set 60%+ line/function/branch thresholds for core packages. Fail CI below threshold.

---

### Milestone 2: Operational Readiness

Make bacon deployable, observable, and recoverable outside of Vercel.

| Req | Description |
|-----|-------------|
| REQ-OPS-001 | Dockerfile exists for `apps/api` (webhook/cron server). |
| REQ-OPS-002 | `docker-compose.yml` orchestrates `api` + Convex dev setup. |
| REQ-OPS-003 | Structured logging replaces all ad-hoc `console.log`/`console.error` calls. |
| REQ-OPS-004 | All API routes have Arcjet rate limiting applied. |
| REQ-OPS-005 | Error boundaries wrap app root and dashboard routes. |
| REQ-OPS-006 | Global error handler for API routes returns structured JSON errors. |

**Tasks:**

1. **Add Dockerfile for api** — Multi-stage Node.js Dockerfile for `apps/api`. Health check, non-root user, production build.
2. **Add docker-compose.yml** — Root-level compose file. Service for API. Document how to run.
3. **Audit and replace console.log** — Search all production source files for `console.log`/`console.error`. Replace with structured logger (via `@repo/observability`).
4. **Add rate limiting to all API routes** — Ensure Arcjet middleware or per-route protection covers `apps/api` endpoints.
5. **Add error boundaries** — Add React error boundary at `app/(authenticated)/layout.tsx`. Add API global error handler middleware.
6. **Add loading states** — Add `loading.tsx` at dashboard root and settings routes. Add Suspense boundaries around data-fetching components.
7. **Document deployment** — Write step-by-step deploy guide covering: Vercel (app, web, api), Convex, Stripe webhooks, Resend, environment setup.

---

### Milestone 3: Developer Experience & Docs

Make the project easy to adopt and maintain.

| Req | Description |
|-----|-------------|
| REQ-CLEAN-003 | No dead code, no empty exports, no unused dependencies. |
| REQ-CLEAN-004 | Documentation exists for replacing the starter's demo content. |
| REQ-DX-001 | Onboarding from git clone to running dev takes < 5 min with clear docs. |
| REQ-DX-002 | Upgrade strategy is documented (how to merge upstream bacon releases). |
| REQ-DX-003 | All env vars have documented sources (where to get each value). |
| REQ-DX-004 | Architecture decision records (ADRs) exist for major choices, including rate limiting strategy. |

**Tasks:**

1. **Dead code sweep** — Run knip or manually audit for unused exports, dangling files, duplicate dependencies.
2. **Write migration guide** — Document how to: rename the project, change brand colors, replace demo pages, swap the logo, set custom domain.
3. **Write onboarding guide** — Update README.md with exact steps from `git clone` to `pnpm dev`. Include Convex setup, Stripe test keys, Resend verification.
4. **Write upgrade guide** — Document the fork-upstream pattern. How to rebase or cherry-pick bacon updates.
5. **Document env sources** — For each variable in `.env.example`, add a comment with the exact URL/command to get the value.
6. **Write ADRs** — ADR-001: Why Convex (vs Postgres). ADR-002: Why Better Auth (vs Clerk/Auth.js). ADR-003: Why Turborepo (vs Nx). ADR-004: Rate limiting strategy composition (Upstash vs Arcjet).
7. **Document docs/ directory** — Explain why `apps/docs` (Mintlify) is in the pnpm workspace and how it relates to the monorepo.

---

## 5. Out of Scope for v1

- PostgreSQL/Prisma/Drizzle as primary adapter (Convex is the active edition)
- Mobile apps (React Native/Expo)
- Multi-region deployment
- SSO / SAML / enterprise auth
- Audit log persistence
- Admin dashboard for user management
- Marketplace/plugin system
- GraphQL API

---

## 6. Success Criteria

The v1 milestone is achieved when:

```
[x] CI passes on every push and every PR: build + typecheck + lint (test deferred)
[x] vitest workspace configured, tests exist for RBAC, JWT, payment keys, webhook errors
[x] All stubs removed (apps/studio, packages/ai)
[ ] turbo build succeeds with zero env vars beyond pnpm install
[ ] E2E smoke passes in CI (Playwright)
[ ] Dockerfile + docker-compose for api app
[ ] Error boundaries visible in app, no console.log in production paths
[ ] Deployment guide works for a first-time user
[ ] No "any" types — enforced by Biome's noAny rule in CI
[ ] No silent catch blocks, no bypass flags
```

---

## 7. Project Requirements (openplan)

See linked requirements:
- REQ-BUILD-001 through REQ-BUILD-003, REQ-CI-001 through REQ-CI-004, REQ-TEST-001 (Foundation)
- REQ-TEST-100 through REQ-TEST-105 (Testing)
- REQ-OPS-001 through REQ-OPS-006 (Operations)
- REQ-CLEAN-003, REQ-CLEAN-004 (Cleanup)
- REQ-DX-001 through REQ-DX-004 (Developer Experience)

---

## 8. Product Positioning

### 8.1 What Makes Bacon Different

There are 50+ Next.js SaaS starters. Bacon is the only one built on **Better Auth + Convex + Stripe** as an integrated, production-grade monorepo — not a scaffold, not a generator, not a box of parts you assemble yourself.

| Starter | Auth | Database | Real-time | Payments | Monorepo |
|---------|------|----------|-----------|----------|----------|
| create-t3-app | NextAuth | Prisma | No | No | No |
| next-forge | Clerk | PostgreSQL | No | Stripe | Turborepo |
| ShipFast | Magic Links | MongoDB | No | Stripe | No |
| SaaS Pegasus | Custom | PostgreSQL | No | Stripe | No |
| **bacon** | **Better Auth** | **Convex** | **Liveblocks** | **Stripe** | **Turborepo** |

Key differentiators:

- **Real-time by default** — Convex gives you live multi-user collaboration without managing WebSocket infrastructure. Presence, cursors, and data sync are built in, not bolted on.
- **Better Auth ecosystem** — The first and only starter that integrates Better Auth's organization plugin, API keys, RBAC, and Stripe subscription plugin out of the box.
- **Zero assembly** — Fork, configure env vars, deploy. No generator step, no "choose your stack" prompts, no scripts to run.
- **Opinionated and complete** — 19 packages, 6 apps, 15+ integrations (Liveblocks, Knock, Sentry, Arcjet, PostHog, Svix, etc.). The opinion is "this is how you build B2B SaaS" — you can deviate, but the default path works.

### 8.2 Who It's Specifically NOT For

- Solo devs building a simple CRUD app or landing page — bacon is overkill
- Teams using Prisma/PostgreSQL as their primary database — Convex is the active edition
- Enterprise procurement requiring SSO/SAML — explicitly out of scope for v1
- Developers who want a "choose your stack" generator — bacon is opinionated and opinionated by design

### 8.3 Business Model

- **Open source (MIT)** — free to fork and use for any purpose
- **Revenue via:**
  - GitHub Sponsors
  - Paid add-ons (Enterprise SSO module, audit log persistence, multi-region deployment)
  - Consulting/services for custom deployments and migrations
- **Not:** paid license, SaaS, hosted platform, or feature gating of core functionality

### 8.4 Adoption Path

| Stage | Action |
|-------|--------|
| **Try** | `git clone && pnpm install && pnpm dev` — see working dashboard with auth + orgs in 5 minutes |
| **Configure** | Set Stripe keys, deploy Convex, configure Resend, customize branding |
| **Ship** | Deploy to Vercel (app + web + api), configure Convex production, invite first users |
| **Extend** | Add your product logic, swap demo pages, integrate your own data models
