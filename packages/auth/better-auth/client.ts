import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { organizationClient, apiKeyClient, emailOTPClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    convexClient(),
    organizationClient(),
    apiKeyClient(),
    emailOTPClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
