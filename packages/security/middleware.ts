import { defaults, type Options, withVercelToolbar } from "@nosecone/next";
import type { Source } from "nosecone";

// biome-ignore lint/performance/noBarrelFile: "re-exporting"
export { createMiddleware as securityMiddleware } from "@nosecone/next";

// ── Content Security Policy ───────────────────────────────
// Builds CSP directives conditionally based on which bacon
// features are enabled. Sources are added only when the
// corresponding environment variable is configured.
//
// Nosecone defaults (self-only): https://docs.arcjet.com/nosecone/reference
// CSP Evaluator: https://csp-evaluator.withgoogle.com/

const defaultCsp = defaults.contentSecurityPolicy as {
  directives: Record<string, unknown>;
};

type CspValue = Source | (() => Source);

/** Safely extract a mutable array from a Nosecone CSP directive,
 * throwing early if the nosecone API changes unexpectedly. */
function asCspArray(value: unknown, directiveName: string): CspValue[] {
  if (Array.isArray(value)) {
    return [...value] as CspValue[];
  }
  throw new Error(
    `[packages/security] CSP directive "${directiveName}" expected array, got ${typeof value}. ` +
      "This may indicate a breaking change in nosecone defaults."
  );
}

function buildCspDirectives() {
  const d = defaultCsp.directives;

  const connectSrc = asCspArray(
    d["connect-src"] ?? d.connectSrc,
    "connect-src"
  );
  const scriptSrc = asCspArray(d["script-src"] ?? d.scriptSrc, "script-src");
  const imgSrc = asCspArray(d["img-src"] ?? d.imgSrc, "img-src");
  const fontSrc = asCspArray(d["font-src"] ?? d.fontSrc, "font-src");
  const workerSrc = asCspArray(d["worker-src"] ?? d.workerSrc, "worker-src");
  const frameSrc = asCspArray(d["frame-src"] ?? d.frameSrc, "frame-src");

  // ── Convex ─────────────────────────────────────────────
  if (process.env.NEXT_PUBLIC_CONVEX_URL) {
    try {
      const { host } = new URL(process.env.NEXT_PUBLIC_CONVEX_URL);
      connectSrc.push(
        `https://${host}` as CspValue,
        `wss://${host}` as CspValue
      );
    } catch {
      // Malformed URL — skip.
    }
  }

  // ── Google Analytics (GA4) ─────────────────────────────
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    scriptSrc.push("https://www.googletagmanager.com");
    connectSrc.push(
      "https://www.google-analytics.com",
      "https://analytics.google.com"
    );
  }

  // ── BaseHub CMS ────────────────────────────────────────
  if (process.env.BASEHUB_TOKEN) {
    imgSrc.push("https://assets.basehub.com");
    connectSrc.push("https://basehub.com", "https://api.basehub.com");
  }

  // ── PostHog ────────────────────────────────────────────
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    connectSrc.push(
      "https://us.i.posthog.com",
      "https://us-assets.i.posthog.com"
    );
  }

  // ── Vercel Analytics ───────────────────────────────────
  if (process.env.VERCEL) {
    connectSrc.push("https://va.vercel.com");
  }

  // ── Upgrade insecure requests ──────────────────────────
  const upgradeInsecureRequests = process.env.NODE_ENV === "production";

  return {
    ...d,
    connectSrc,
    scriptSrc,
    imgSrc,
    fontSrc,
    workerSrc,
    frameSrc,
    upgradeInsecureRequests,
  };
}

// Nosecone security headers configuration (full — used by web/app middleware)
export const noseconeOptions: Options = {
  ...defaults,
  contentSecurityPolicy: {
    directives: buildCspDirectives(),
  },
};

// API-specific options — no CSP (JSON responses don't execute scripts).
// Saves per-request nonce generation and avoids misleading directive values
// that have no effect on non-HTML responses.
export const apiNoseconeOptions: Options = {
  ...defaults,
  contentSecurityPolicy: false,
};

export const noseconeOptionsWithToolbar: Options =
  withVercelToolbar(noseconeOptions);
