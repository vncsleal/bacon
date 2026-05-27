import { internationalizationMiddleware } from "@repo/internationalization/middleware";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/middleware";
import type { NextRequest } from "next/server";
import { env } from "@/env";

export const config = {
  matcher: ["/((?!_next/static|_next/image|ingest|favicon.ico).*)"],
  runtime: "nodejs",
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

/**
 * Marketing site middleware:
 * 1. i18n middleware rewrites "/" to the default locale (e.g. "/en")
 * 2. Security headers are merged onto the response
 *
 * No auth middleware — the marketing site is public.
 */
export default async function middleware(
  request: NextRequest
): Promise<Response> {
  const response = await internationalizationMiddleware(request);
  const securityResponse = await securityHeaders();

  for (const [key, value] of securityResponse.headers.entries()) {
    response.headers.set(key, value);
  }

  return response;
}
