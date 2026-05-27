import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("payments", () => {
  beforeAll(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_xxxxxxxxxxxxxxxxxxxx";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_xxxxxxxxxxxxxxxx";
  });

  describe("stripe instance", () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it("creates a Stripe instance with expected methods", async () => {
      const { stripe } = await import("..");
      expect(stripe).not.toBeNull();
      expect(typeof stripe?.customers).toBe("object");
    });

    it("stripe instance has expected methods", async () => {
      const { stripe } = await import("..");
      expect(stripe).not.toBeNull();
      expect(typeof stripe?.customers).toBe("object");
      expect(typeof stripe?.subscriptions).toBe("object");
      expect(typeof stripe?.checkout?.sessions).toBe("object");
    });

    it("stripe is null when STRIPE_SECRET_KEY is not set", async () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete process.env.STRIPE_SECRET_KEY;
      const { stripe } = await import("../providers/stripe");
      expect(stripe).toBeNull();
    });
  });

  describe("keys validation", () => {
    let keys: () => {
      STRIPE_SECRET_KEY?: string;
      STRIPE_WEBHOOK_SECRET?: string;
    };

    beforeAll(async () => {
      const mod = await import("../keys");
      keys = mod.keys;
    });

    beforeEach(() => {
      // Set back before each test so isolation works
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

    it("throws when STRIPE_SECRET_KEY is set but does not start with sk_", () => {
      process.env.STRIPE_SECRET_KEY = "invalid_key";
      expect(() => keys()).toThrow();
    });

    it("returns undefined when STRIPE_SECRET_KEY is not set", () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete process.env.STRIPE_SECRET_KEY;
      const result = keys();
      expect(result.STRIPE_SECRET_KEY).toBeUndefined();
    });

    it("handles optional STRIPE_WEBHOOK_SECRET when not set", () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
