import { authMiddleware } from "@repo/auth/middleware";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/middleware";
import type { NextMiddleware } from "next/server";
import { env } from "./env";

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// authMiddleware checks for the better-auth Convex JWT cookie and redirects
// to /sign-in for unauthenticated requests. Security headers are applied as
// the inner handler. Public paths (/sign-in, /sign-up, /api/auth) are allowed through.
export default authMiddleware(async () => securityHeaders()) as unknown as NextMiddleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
