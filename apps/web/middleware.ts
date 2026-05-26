import { authMiddleware } from "@repo/auth/middleware";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/middleware";
import {
  type NextMiddleware,
} from "next/server";
import { env } from "@/env";

export const config = {
  matcher: ["/((?!_next/static|_next/image|ingest|favicon.ico).*)"],
  runtime: "nodejs",
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

export default authMiddleware(() =>
  securityHeaders()
) as unknown as NextMiddleware;
