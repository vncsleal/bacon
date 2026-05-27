import { withRateLimit } from "@repo/security";
import { nextJsHandler } from "@convex-dev/better-auth/nextjs";

const handlers = nextJsHandler();

export const GET = async (request: Request) => {
  const denied = await withRateLimit({ max: 20, window: "1m" }, request);
  if (denied) return denied;
  return handlers.GET(request);
};

export const POST = async (request: Request) => {
  const denied = await withRateLimit({ max: 5, window: "1m" }, request);
  if (denied) return denied;
  return handlers.POST(request);
};
