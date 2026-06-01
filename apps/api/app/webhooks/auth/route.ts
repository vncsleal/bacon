import { NextResponse } from "next/server";

// This route previously handled Clerk authentication webhooks (svix-verified).
// With better-auth, auth lifecycle events are handled via server-side hooks
// configured in packages/database/convex/auth.ts using betterAuth({ hooks: {} }).
//
// Analytics events for user creation, updates, and org changes should be wired
// directly in the better-auth hooks config rather than through a webhook.
//
// TODO: Add analytics calls to betterAuth hooks in packages/database/convex/auth.ts:
//   hooks: {
//     after: [
//       { matcher: (ctx) => ctx.path === "/sign-up/email", handler: async (ctx) => { ... } },
//     ],
//   }

export const POST = async (): Promise<Response> =>
  NextResponse.json({ message: "ok" });
