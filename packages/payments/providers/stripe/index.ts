// Stripe payments provider — active by default.
// packages/payments/index.ts exports from this file when Stripe is the active provider.
import "server-only";

import Stripe from "stripe";
import { keys } from "../../keys";

const secretKey = keys().STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

export type { Stripe } from "stripe";
