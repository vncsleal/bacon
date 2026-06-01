import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
      STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
      STRIPE_FREE_PRICE_ID: z.string().min(1).optional(),
      STRIPE_PRO_PRICE_ID: z.string().min(1).optional(),
    },
    runtimeEnv: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_FREE_PRICE_ID: process.env.STRIPE_FREE_PRICE_ID,
      STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
    },
  });
