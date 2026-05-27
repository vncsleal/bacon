# syntax=docker.io/docker/dockerfile:1
# bacon – apps/api Dockerfile
# Multi-stage: pruner → deps-dev → builder → runner
# Uses Turborepo prune for minimal build context.

# ── Base stage ─────────────────────────────────────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NEXT_TELEMETRY_DISABLED="1"

# ── Pruner stage ───────────────────────────────────────────
# Extract only the files needed to build apps/api via turbo prune.
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@^2.5.8
COPY . .
RUN turbo prune api --docker

# ── Dependencies (dev) stage ───────────────────────────────
# Install all dependencies (including dev) needed for build.
FROM base AS deps-dev
WORKDIR /app
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# ── Builder stage ──────────────────────────────────────────
# Build the Next.js standalone output.
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY --from=pruner /app/out/full/ .
COPY --from=deps-dev /app/node_modules ./node_modules

# Build-time args — only NEXT_PUBLIC_* vars are inlined by Next.js.
ARG NEXT_PUBLIC_CONVEX_URL
ARG BETTER_AUTH_SECRET

RUN --mount=type=secret,id=better-auth-secret \
    BETTER_AUTH_SECRET_B64=$(cat /run/secrets/better-auth-secret 2>/dev/null && echo "") \
    BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-$(echo "$BETTER_AUTH_SECRET_B64" | base64 -d)} \
    pnpm build --filter=api

# ── Runner stage ───────────────────────────────────────────
# Minimal production image with standalone server.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install health check utility.
RUN apk add --no-cache wget

# Create non-root user for security.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone output — Next.js creates apps/api/server.js inside
# .next/standalone/ to preserve monorepo structure. This places it at
# /app/apps/api/server.js in the runner, matching the CMD path.
COPY --from=builder /app/apps/api/.next/standalone ./

# Copy static assets separately (not bundled in standalone).
COPY --from=builder /app/apps/api/.next/static ./apps/api/.next/static

# Copy public assets.
COPY --from=builder /app/apps/api/public ./apps/api/public

USER nextjs

EXPOSE 3002
ENV PORT=3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/api/health || exit 1

CMD ["node", "apps/api/server.js"]
