import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { betterAuth } from "better-auth";
import { organization, apiKey } from "better-auth/plugins";
import { ac, owner, admin, member } from "../../auth/permissions";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

// Initialize Stripe client only when API key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-09-30.clover" })
  : null;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
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
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
      // Organization plugin for multi-tenant workspaces with RBAC
      organization({
        allowUserToCreateOrganization: true,
        ac,
        roles: { owner, admin, member },
      }),
      // API key plugin for programmatic access (org-scoped)
      apiKey({
        rateLimit: {
          enabled: true,
          maxRequests: 100,
          timeWindow: 60,
        },
      }),
      // Stripe plugin for subscriptions and payments
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

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

/** Returns user display info for a list of Convex user document IDs. */
export const getUsersByIds = query({
  args: { userIds: v.array(v.string()) },
  handler: async (ctx, { userIds }) => {
    const users = await Promise.all(
      userIds.map((id) => authComponent.getAnyUserById(ctx, id))
    );
    return users.filter((u): u is NonNullable<typeof u> => u != null);
  },
});

/** Searches users by name prefix for collaboration member lookup. */
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
