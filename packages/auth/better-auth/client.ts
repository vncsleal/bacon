import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { organizationClient, apiKeyClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    convexClient(),
    organizationClient(),
    apiKeyClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
