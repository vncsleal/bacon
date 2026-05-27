import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("page").collect(),
});

export const search = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    const all = await ctx.db.query("page").collect();
    return all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  },
});

// Used by the keep-alive cron to verify the Convex deployment is reachable.
export const keepAlive = mutation({
  args: {},
  handler: async (ctx) => {
    const id = await ctx.db.insert("page", { name: "__keepalive__" });
    await ctx.db.delete(id);
    return true;
  },
});
