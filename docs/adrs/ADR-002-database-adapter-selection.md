# ADR-002: Database Adapter Selection

## Status

Accepted

## Context

bacon needed a database solution for a B2B SaaS starter targeting experienced TypeScript developers. The requirements were:

1. **Serverless-friendly** — deploy on Vercel without managing infrastructure
2. **Real-time capable** — support live multi-user collaboration without managing WebSocket infrastructure
3. **No migration overhead** — schema changes should not require migration scripts or downtime
4. **Reactivity** — data changes should propagate to connected clients automatically
5. **Type-safe** — end-to-end TypeScript types from database to UI
6. **Free to start** — the starter should be usable at zero cost during development

We evaluated three categories of database solutions:

**Traditional ORMs (Prisma, Drizzle, TypeORM)** — mature, well-understood, but require PostgreSQL/MySQL infrastructure, manual migrations, and have no built-in real-time capabilities. Require a separate server or connection pooling service.

**BaaS (Supabase, Firebase)** — serverless-friendly with real-time support, but require managing two systems (auth + database separately), have vendor-specific APIs, and typically lack first-class monorepo support.

**Serverless real-time databases (Convex, Neon, PlanetScale)** — purpose-built for the serverless paradigm. Convex stood out in this category.

## Decision

We chose **Convex as the primary database** and maintain **Prisma and Drizzle adapter stubs** as documented alternatives for consumers who prefer traditional SQL databases.

### Why Convex

1. **Real-time by default** — Convex mutations automatically push updates to all connected clients via subscriptions. No WebSocket setup, no polling, no WebSocket server infrastructure.

2. **No migrations** — Convex uses a schema-first approach with automatic schema inference. Add a field, deploy, and it's immediately available. No `ALTER TABLE`, no downtime.

3. **Type-safe from database to UI** — Convex generates TypeScript types for queries, mutations, and schema. The `_generated/` directory is regenerated on every deploy, keeping types in sync with the actual data shape.

4. **Serverless by design** — Convex functions run on Convex's infrastructure, co-located with the database. No connection pooling, no cold starts for database access, no VPC configuration.

5. **Function-based query model** — Business logic lives in Convex functions (queries and mutations), not as raw SQL or ORM calls in the application layer. This enforces a clean separation between data access and presentation.

6. **Zero-cost development** — Convex's free tier is generous enough for development, prototyping, and low-traffic production use.

### Adapter pattern

The database adapter is selected in `packages/database/index.ts`:

```ts
// Convex edition (active)
export * from "./convex";

// Prisma edition (switch by uncommenting)
// export * from "./prisma";

// Drizzle edition (switch by uncommenting)
// export * from "./drizzle";
```

Each edition is a full implementation of the database layer:

- `convex/` — Active. Convex schema, auth component, queries, mutations
- `prisma/` — Stub. Schema and client configuration for PostgreSQL consumers
- `drizzle/` — Stub. Schema and client configuration for SQLite/PostgreSQL consumers

The stubs exist so that consumers who prefer SQL databases have a starting point. They are not actively maintained and may lag behind the Convex edition.

## Consequences

### Positive

- **Real-time collaboration** — Liveblocks integration is complemented by Convex's native push-based data flow for shared state
- **No DevOps overhead** — no database server to provision, no connection pooling, no migration scripts
- **Fast iteration** — schema changes are hot-deployed without migration steps
- **Type-safe queries** — Convex's codegen ensures frontend queries match backend schema at compile time

### Negative

- **Vendor lock-in** — moving away from Convex requires rewriting all data access functions. The adapter stubs (Prisma, Drizzle) mitigate this but are not drop-in replacements
- **No raw SQL** — complex analytical queries that would be natural in SQL require Convex function composition
- **Limited to Convex's runtime** — Convex functions run in a constrained JavaScript environment; not all npm packages work there
- **Cold start on function invocation** — infrequently used queries may have a brief delay while the Convex function warms up

### Mitigations

- The adapter pattern at `packages/database/index.ts` provides a clear migration path
- Convex's function-based model encourages domain logic encapsulation, making it easier to port to a different backend if needed
- The Prisma and Drizzle stubs serve as documentation and starting points for the migration
