import "server-only";
import { log } from "@repo/observability/log";
import { cookies } from "next/headers";

export { getToken } from "@convex-dev/better-auth/nextjs";

/**
 * Reads userId from the Convex JWT cookie without re-validation.
 * Use only for non-security-critical reads like analytics or feature flags
 * (the middleware already validates auth before these are reached).
 */
export async function getSessionInfo(): Promise<{
  userId: string | null;
  orgId: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-better-auth.convex_jwt"
        : "better-auth.convex_jwt";
    const jwt = cookieStore.get(cookieName)?.value;
    if (!jwt) return { userId: null, orgId: null };

    const [, payloadB64] = jwt.split(".");
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString()
    ) as { sub?: string };

    return { userId: payload.sub ?? null, orgId: null };
  } catch (error) {
    log.error("getSessionInfo: failed to parse JWT", { error: String(error) });
    return { userId: null, orgId: null };
  }
}
