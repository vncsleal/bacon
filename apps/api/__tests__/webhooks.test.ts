import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const HTTP_OK = 200;
const HTTP_INTERNAL_ERROR = 500;

process.env.STRIPE_SECRET_KEY = "sk_test_mock_key_for_testing";

vi.mock("@/env", () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: "whsec_test_secret",
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("@repo/analytics/server", () => ({
  analytics: {
    capture: vi.fn(),
    shutdown: vi.fn(),
  },
}));

vi.mock("@repo/observability/log", () => ({
  log: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("@repo/payments", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(() => {
        throw new Error("Invalid signature");
      }),
    },
  },
}));

import { headers } from "next/headers";
import { POST as paymentsPOST } from "../app/webhooks/payments/route";

describe("Payments Webhook", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test_secret");
    vi.mocked(headers).mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns Not configured when STRIPE_WEBHOOK_SECRET is not set", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");

    const request = new Request("http://localhost:3002", { method: "POST" });
    const response = await paymentsPOST(request);
    const body = await response.json();

    expect(response.status).toBe(HTTP_OK);
    expect(body).toEqual({ message: "Not configured", ok: false });
  });

  it("returns error when stripe-signature header is missing", async () => {
    vi.mocked(headers).mockResolvedValue(new Headers());

    const request = new Request("http://localhost:3002", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });
    const response = await paymentsPOST(request);
    const body = await response.json();

    expect(response.status).toBe(HTTP_INTERNAL_ERROR);
    expect(body.message).toContain("stripe-signature");
    expect(body.ok).toBe(false);
  });

  it("returns error on invalid signature", async () => {
    vi.mocked(headers).mockResolvedValue(
      new Headers({ "stripe-signature": "bad_signature" })
    );

    const request = new Request("http://localhost:3002", {
      method: "POST",
      headers: { "stripe-signature": "bad_signature" },
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });
    const response = await paymentsPOST(request);
    const body = await response.json();

    expect(response.status).toBe(HTTP_INTERNAL_ERROR);
    expect(body.message).toContain("Invalid signature");
    expect(body.ok).toBe(false);
  });
});

describe("Auth Webhook", () => {
  it("returns ok", async () => {
    const { POST } = await import("../app/webhooks/auth/route");
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(HTTP_OK);
    expect(body).toEqual({ message: "ok" });
  });
});
