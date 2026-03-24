// Stripe payments provider — active by default.
// packages/payments/index.ts exports from this file when Stripe is the active provider.
import "server-only";

import Stripe from "stripe";
import { keys } from "../../keys";

export const stripe = new Stripe(keys().STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export type { Stripe } from "stripe";
