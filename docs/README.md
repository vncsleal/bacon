# Documentation

Two documentation directories exist in this monorepo:

## `apps/docs/` (active)

**Mintlify** — lightweight, no build step. Run with `mintlify dev --port 3004`.
Used for project documentation: deployment guide, setup instructions.
See `apps/docs/mint.json` for navigation.

## `docs/` (reference)

**Fumadocs + Next.js** — the original next-forge documentation site.
Heavier dependency tree (`fumadocs-core`, `fumadocs-ui`, `next`).
Kept for reference; not actively maintained.
