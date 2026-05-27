import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/api/auth",
];

/** Secure-prefix is applied in production (https). */
const getJwtCookieName = (request: NextRequest) => {
  const isSecure = request.url.startsWith("https");
  const base = "better-auth.convex_jwt";
  return isSecure ? `__Secure-${base}` : base;
};

export const authMiddleware =
  (handler: () => Promise<Response>) =>
  async (request: NextRequest): Promise<Response> => {
    const { pathname } = request.nextUrl;

    if (publicPaths.some((p) => pathname.startsWith(p))) {
      return await handler();
    }

    const cookieName = getJwtCookieName(request);
    const session = request.cookies.get(cookieName);

    if (!session?.value) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return await handler();
  };
