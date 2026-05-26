import { describe, expect, it } from "vitest";

const UNKNOWN_RESOURCE_PATTERN = /doesNotExist/;
import { ac, member, admin, owner } from "../permissions";

type Role = ReturnType<typeof ac.newRole>;
type AuthorizeResult = ReturnType<Role["authorize"]>;

function allow(result: AuthorizeResult): void {
  expect(result.success).toBe(true);
}

function deny(result: AuthorizeResult): void {
  expect(result.success).toBe(false);
  expect(result.error).toBeTypeOf("string");
}

function authorize(
  role: Role,
  resource: string,
  action: string,
): AuthorizeResult {
  return (role.authorize as unknown as (request: Record<string, string[]>) => AuthorizeResult)({ [resource]: [action] });
}

const MATRIX: Record<string, Record<string, Record<string, boolean>>> = {
  member: {
    project: { create: false, read: true, update: false, delete: false },
    apiKey: { create: false, read: false, delete: false },
    auditLog: { read: false },
  },
  admin: {
    project: { create: true, read: true, update: true, delete: false },
    apiKey: { create: true, read: true, delete: false },
    auditLog: { read: true },
  },
  owner: {
    project: { create: true, read: true, update: true, delete: true },
    apiKey: { create: true, read: true, delete: true },
    auditLog: { read: true },
  },
};

const ROLES: Record<string, Role> = { member, admin, owner };

describe("RBAC Permissions", () => {
  describe("exhaustive permission matrix", () => {
    for (const [roleName, role] of Object.entries(ROLES)) {
      describe(`${roleName} role`, () => {
        for (const [resource, actions] of Object.entries(
          MATRIX[roleName],
        )) {
          describe(resource, () => {
            for (const [action, expected] of Object.entries(actions)) {
              it(`${expected ? "allows" : "denies"} ${action}`, () => {
                const result = authorize(role, resource, action);
                if (expected) {
                  allow(result);
                } else {
                  deny(result);
                }
              });
            }
          });
        }
      });
    }
  });

  describe("edge cases", () => {
    it("unknown role with empty statements denies everything", () => {
      const unknown = ac.newRole({ project: [] });
      deny(authorize(unknown, "project", "read"));
      deny(authorize(unknown, "project", "create"));
      deny(authorize(unknown, "project", "update"));
      deny(authorize(unknown, "project", "delete"));
    });

    it("unknown resource returns denied with specific error", () => {
      const result = authorize(member, "doesNotExist" as string, "read");
      deny(result);
      expect(result.error).toMatch(UNKNOWN_RESOURCE_PATTERN);
    });

    it("unknown action on known resource returns denied", () => {
      deny(authorize(member, "project", "delete"));
    });

    it("role has expected statements shape", () => {
      expect(member.statements).toEqual({ project: ["read"] });

      expect(admin.statements).toMatchObject({
        project: ["create", "read", "update"],
        apiKey: ["create", "read"],
        auditLog: ["read"],
      });
      expect(admin.statements.organization).toBeDefined();
      expect(admin.statements.member).toBeDefined();

      expect(owner.statements).toMatchObject({
        project: ["create", "read", "update", "delete"],
        apiKey: ["create", "read", "delete"],
        auditLog: ["read"],
      });
      expect(owner.statements.organization).toBeDefined();
      expect(owner.statements.member).toBeDefined();
    });

    it("authorize with empty request returns not authorized", () => {
      deny(member.authorize({} as Record<string, string[]>));
    });

    it("owner has strictly more access than admin on project and apiKey", () => {
      deny(admin.authorize({ project: ["delete"] }));
      allow(owner.authorize({ project: ["delete"] }));

      deny(admin.authorize({ apiKey: ["delete"] }));
      allow(owner.authorize({ apiKey: ["delete"] }));
    });
  });
});
