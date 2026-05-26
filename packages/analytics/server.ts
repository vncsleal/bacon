import "server-only";
import { PostHog } from "posthog-node";
import { log } from "@repo/observability/log";
import { keys } from "./keys";

const k = keys();

// Guard: export a no-op stub when PostHog credentials are absent so the app
// boots cleanly from a fresh ZIP without any env vars configured yet.
export const analytics = k.NEXT_PUBLIC_POSTHOG_KEY && k.NEXT_PUBLIC_POSTHOG_HOST
  ? new PostHog(k.NEXT_PUBLIC_POSTHOG_KEY, {
      host: k.NEXT_PUBLIC_POSTHOG_HOST,
      // Don't batch events and flush immediately - we're running in a serverless environment
      flushAt: 1,
      flushInterval: 0,
    })
  : ({
      capture: () => {
        log.warn("Analytics: PostHog not configured, event dropped");
      },
      identify: () => {},
      isFeatureEnabled: async (_key: string, _distinctId: string) => null as null,
      shutdown: async () => {},
    } as unknown as PostHog);
