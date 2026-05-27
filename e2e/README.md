# E2E Tests

Playwright smoke tests covering the critical user paths.

## Prerequisites

Both apps must be running:

```sh
# Terminal 1: marketing site
pnpm --filter=web dev

# Terminal 2: dashboard
pnpm --filter=app dev
```

## Run

```sh
pnpm test:e2e
```

In CI, Playwright auto-starts the production servers (`next start`) after build.
