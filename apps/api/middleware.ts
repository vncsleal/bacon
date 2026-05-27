import {
  apiNoseconeOptions,
  securityMiddleware,
} from "@repo/security/middleware";
import type { NextRequest } from "next/server";

const securityHeaders = securityMiddleware(apiNoseconeOptions);

export default function middleware(
  request: NextRequest
): Promise<Response> {
  const result = securityHeaders(request);
  return result instanceof Promise ? result : Promise.resolve(result);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|ingest|favicon.ico).*)"],
  runtime: "nodejs",
};
