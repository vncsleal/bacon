import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["*.ts", "*.tsx", "better-auth/**/*.ts", "components/**/*.tsx"],
      exclude: ["__tests__/**", "node_modules/**", "vitest.config.*", "tsconfig.json"],
      thresholds: {
        statements: 14,
        branches: 12,
        functions: 5,
        lines: 14,
      },
    },
  },
});
