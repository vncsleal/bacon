import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Application schema — add your own tables here.
// betterAuth tables (user, session, account, etc.) live in the betterAuth component.
const schema = defineSchema({
  page: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
});

export default schema;
