import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockCookies = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@repo/observability/log", () => ({
  log: {
    error: vi.fn(),
  },
}));
vi.mock("next/headers", () => ({
  cookies: () => mockCookies(),
}));

const { getSessionInfo } = await import("../server");

function createJWT(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString(
    "base64url"
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = "fake-signature";
  return `${header}.${body}.${signature}`;
}

describe("getSessionInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when no cookie exists", async () => {
    mockCookies.mockReturnValue({
      get: () => ({}),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: null, orgId: null });
  });

  it("returns userId from JWT payload when valid cookie is present", async () => {
    const jwt = createJWT({ sub: "user_123" });
    mockCookies.mockReturnValue({
      get: () => ({ value: jwt }),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: "user_123", orgId: null });
  });

  it("uses better-auth.convex_jwt name in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    mockCookies.mockReturnValue({
      get: (name: string) => {
        if (name === "better-auth.convex_jwt") {
          return { value: createJWT({ sub: "user_dev" }) };
        }
        return;
      },
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: "user_dev", orgId: null });
  });

  it("uses __Secure-better-auth.convex_jwt name in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mockCookies.mockReturnValue({
      get: (name: string) => {
        if (name === "__Secure-better-auth.convex_jwt") {
          return { value: createJWT({ sub: "user_prod" }) };
        }
        return;
      },
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: "user_prod", orgId: null });
  });

  it("returns null userId when JWT has no sub claim", async () => {
    const jwt = createJWT({ iss: "convex" });
    mockCookies.mockReturnValue({
      get: () => ({ value: jwt }),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: null, orgId: null });
  });

  it("returns null values on malformed JWT", async () => {
    mockCookies.mockReturnValue({
      get: () => ({ value: "only-one-part" }),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: null, orgId: null });
  });

  it("returns null values on invalid JSON in payload", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString(
      "base64url"
    );
    const body = Buffer.from("not-json").toString("base64url");
    mockCookies.mockReturnValue({
      get: () => ({ value: `${header}.${body}.fake-sig` }),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: null, orgId: null });
  });

  it("handles valid JWT with extra claims gracefully", async () => {
    const jwt = createJWT({
      sub: "user_456",
      iss: "convex",
      iat: 1000,
      exp: 4000,
      email: "user@example.com",
    });
    mockCookies.mockReturnValue({
      get: () => ({ value: jwt }),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: "user_456", orgId: null });
  });

  it("returns null values when cookie exists but has no value", async () => {
    mockCookies.mockReturnValue({
      get: () => ({ value: undefined }),
    });

    const result = await getSessionInfo();

    expect(result).toEqual({ userId: null, orgId: null });
  });
});
