import arcjet, {
  type ArcjetBotCategory,
  type ArcjetWellKnownBot,
  detectBot,
  fixedWindow,
  request,
  shield,
} from "@arcjet/next";
import { keys } from "./keys";

const arcjetKey = keys().ARCJET_KEY;

interface RateLimitOptions {
  max: number;
  mode?: "LIVE" | "DRY_RUN";
  window: string;
}

const base = arcjetKey
  ? arcjet({
      key: arcjetKey,
      characteristics: ["ip.src"],
      rules: [shield({ mode: "LIVE" })],
    })
  : null;

export const secure = async (
  allow: (ArcjetWellKnownBot | ArcjetBotCategory)[],
  sourceRequest?: Request
) => {
  if (!base) {
    return;
  }

  const req = sourceRequest ?? (await request());
  const aj = base.withRule(detectBot({ mode: "LIVE", allow }));
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      throw new Error("No bots allowed");
    }

    if (decision.reason.isRateLimit()) {
      throw new Error("Rate limit exceeded");
    }

    throw new Error("Access denied");
  }
};

export const rateLimit = async (
  options: RateLimitOptions,
  sourceRequest?: Request
) => {
  if (!base) {
    return;
  }

  const req = sourceRequest ?? (await request());
  const aj = base.withRule(
    fixedWindow({
      mode: options.mode ?? "LIVE",
      max: options.max,
      window: options.window,
    })
  );
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Access denied");
  }
};

const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_FORBIDDEN = 403;

/** Wraps rateLimit() and returns a Response on denial with proper HTTP status,
 * or null when the request is allowed. Use at the top of route handlers. */
export const withRateLimit = async (
  options: RateLimitOptions,
  sourceRequest?: Request
): Promise<Response | null> => {
  try {
    await rateLimit(options, sourceRequest);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Access denied";
    const status =
      message === "Rate limit exceeded"
        ? HTTP_TOO_MANY_REQUESTS
        : HTTP_FORBIDDEN;
    return new Response(message, { status });
  }
};
