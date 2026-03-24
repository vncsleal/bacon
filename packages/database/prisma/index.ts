// Prisma edition stub for packages/database adapter pattern.
// This file is populated by the assembly engine when the Prisma edition is selected.
// To activate: change packages/database/index.ts to `export * from "./prisma";`
//
// Setup:
//   1. Set DATABASE_URL in your environment
//   2. Run: pnpm --filter @repo/database prisma migrate dev

import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for the Prisma edition");
}

const adapter = new PrismaNeon({ connectionString });

export const database =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

export * from "../generated/client";
