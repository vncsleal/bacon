import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { betterAuth } from "better-auth";
import { organization, apiKey, emailOTP } from "better-auth/plugins";
import { ac, owner, admin, member } from "../../auth/permissions";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { sendVerificationOTPEmail } from "@repo/email";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

// Initialize Stripe client only when API key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-09-30.clover" })
  : null;

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  }
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    plugins: [
      convex(),
      organization({
        allowUserToCreateOrganization: true,
        ac,
        roles: { owner, admin, member },
      }),
      apiKey({
        rateLimit: {
          enabled: true,
          maxRequests: 100,
          timeWindow: 60,
        },
      }),
      // Email OTP plugin — sends OTP code on sign-up for email verification
      emailOTP({
        sendVerificationOTP: async ({ email, otp, type }) => {
          if (type !== "email-verification") {
            return;
          }
          const { success, error } = await sendVerificationOTPEmail(
            email,
            otp
          );
          if (!success) {
            // Keeping raw console.error here — adding the full
            // @repo/observability dependency just for this one-off
            // error log is unnecessary overhead for a Convex function.
            console.error(
              "[auth] Failed to send verification OTP to",
              email,
              error
            );
          }
        },
        sendVerificationOnSignUp: true,
        otpLength: 6,
        storeOTP: "hashed",
        expiresIn: 300,
        allowedAttempts: 5,
      }),
      ...(stripeClient
        ? [
            stripe({
              stripeClient,
              stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
              createCustomerOnSignUp: true,
              subscription: {
                enabled: true,
                plans: [
                  {
                    name: "free",
                    priceId: process.env.STRIPE_FREE_PRICE_ID || "price_free",
                    limits: {
                      projects: 1,
                    },
                  },
                  {
                    name: "pro",
                    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
                    limits: {
                      projects: 10,
                    },
                    freeTrial: {
                      days: 14,
                    },
                  },
                ],
              },
            }),
          ]
        : []),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

export const getUsersByIds = query({
  args: { userIds: v.array(v.string()) },
  handler: async (ctx, { userIds }) => {
    const users = await Promise.all(
      userIds.map((id) => authComponent.getAnyUserById(ctx, id))
    );
    return users.filter((u): u is NonNullable<typeof u> => u != null);
  },
});

export const searchUsersByName = query({
  args: { query: v.string() },
  handler: async (ctx, { query: searchQuery }) => {
    const result = await ctx.runQuery(components.betterAuth.adapter.findMany, {
      model: "user",
      where: [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ],
      paginationOpts: { numItems: 20, cursor: null },
    });
    return (result.page as Array<{ _id: string; name: string; email: string; image?: string | null }>);
  },
});
