import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["*.ts", "providers/**/*.ts"],
      exclude: ["__tests__/**", "node_modules/**", "vitest.config.*", "tsconfig.json"],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 80,
        lines: 60,
      },
    },
  },
});
