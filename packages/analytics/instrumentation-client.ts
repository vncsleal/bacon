import posthog from "posthog-js";
import { keys } from "./keys";

export const initializeAnalytics = () => {
  const k = keys();
  if (!k.NEXT_PUBLIC_POSTHOG_KEY || !k.NEXT_PUBLIC_POSTHOG_HOST) return;
  posthog.init(k.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: k.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-05-24",
  });
};
