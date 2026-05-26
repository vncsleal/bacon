import { vi, describe, expect, it, beforeAll, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

describe("payments", () => {
  beforeAll(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_xxxxxxxxxxxxxxxxxxxx";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_xxxxxxxxxxxxxxxx";
  });

  describe("stripe instance", () => {
    it("creates a Stripe instance with the correct apiVersion", async () => {
      const { stripe } = await import("..");
      expect(stripe).toBeDefined();
      expect(stripe.getApiField("version")).toBe("2025-09-30.clover");
    });

    it("stripe instance has expected methods", async () => {
      const { stripe } = await import("..");
      expect(typeof stripe.customers).toBe("object");
      expect(typeof stripe.subscriptions).toBe("object");
      expect(typeof stripe.checkout?.sessions).toBe("object");
    });
  });

  describe("keys validation", () => {
    let keys: () => {
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET?: string;
    };

    beforeAll(async () => {
      const mod = await import("../keys");
      keys = mod.keys;
    });

    beforeEach(() => {
      process.env.STRIPE_SECRET_KEY = "sk_test_xxxxxxxxxxxxxxxxxxxx";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_xxxxxxxxxxxxxxxx";
    });

    it("returns expected shape with valid env vars", () => {
      const result = keys();
      expect(result).toHaveProperty("STRIPE_SECRET_KEY");
      expect(result).toHaveProperty("STRIPE_WEBHOOK_SECRET");
      expect(result.STRIPE_SECRET_KEY).toBe("sk_test_xxxxxxxxxxxxxxxxxxxx");
      expect(result.STRIPE_WEBHOOK_SECRET).toBe("whsec_test_xxxxxxxxxxxxxxxx");
    });

    it("throws when STRIPE_SECRET_KEY does not start with sk_", () => {
      process.env.STRIPE_SECRET_KEY = "invalid_key";
      expect(() => keys()).toThrow();
    });

    it("throws when STRIPE_SECRET_KEY is not set", () => {
      delete process.env.STRIPE_SECRET_KEY;
      expect(() => keys()).toThrow();
    });

    it("handles optional STRIPE_WEBHOOK_SECRET when not set", () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;
      const result = keys();
      expect(result.STRIPE_SECRET_KEY).toBe("sk_test_xxxxxxxxxxxxxxxxxxxx");
      expect(result.STRIPE_WEBHOOK_SECRET).toBeUndefined();
    });

    it("throws when STRIPE_WEBHOOK_SECRET is set but does not start with whsec_", () => {
      process.env.STRIPE_WEBHOOK_SECRET = "invalid_webhook";
      expect(() => keys()).toThrow();
    });
  });
});
