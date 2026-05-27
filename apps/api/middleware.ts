import {
  apiNoseconeOptions,
  securityMiddleware,
} from "@repo/security/middleware";
const securityHeaders = securityMiddleware(apiNoseconeOptions);

export default function middleware(): Promise<Response> {
  return securityHeaders();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|ingest|favicon.ico).*)"],
  runtime: "nodejs",
};
