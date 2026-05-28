import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

/**
 * Extends better-auth's default org statements with app-specific resources.
 * Used in both packages/database/convex/auth.ts and server-side permission checks.
 */
const statement = {
  ...defaultStatements,
  project: ["create", "read", "update", "delete"],
  apiKey: ["create", "read", "delete"],
  auditLog: ["read"],
} as const;

export const ac = createAccessControl(statement);

/** Read-only project access. Default role for org members. */
export const member = ac.newRole({
  project: ["read"],
});

/** Manages projects and API keys. Cannot delete projects or audit logs. */
export const admin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "read", "update"],
  apiKey: ["create", "read"],
  auditLog: ["read"],
});

/** Full access. Only role that can delete projects and API keys. */
export const owner = ac.newRole({
  ...adminAc.statements,
  project: ["create", "read", "update", "delete"],
  apiKey: ["create", "read", "delete"],
  auditLog: ["read"],
});
