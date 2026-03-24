/**
 * Drizzle edition adapter stub.
 *
 * The assembly engine activates this adapter by writing:
 *   packages/database/index.ts → export * from "./drizzle";
 *
 * To implement this edition:
 * 1. pnpm add drizzle-orm @auth/drizzle-adapter postgres
 * 2. Define your schema in ./schema.ts mirroring the Convex app tables
 * 3. Export a `db` client pointing at your DATABASE_URL
 * 4. Re-export whatever @repo/database consumers expect (db, etc.)
 *
 * See packages/database/prisma/index.ts for a complete reference implementation.
 */

throw new Error(
  "[bettercone-starter] Drizzle adapter is not yet implemented. " +
    "Set packages/database/index.ts to export * from './convex' (default) " +
    "or implement this stub to activate the Drizzle edition."
);

export {};
