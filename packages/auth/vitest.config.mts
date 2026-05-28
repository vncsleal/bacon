import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["*.ts", "*.tsx", "better-auth/**/*.ts", "components/**/*.tsx"],
      exclude: [
        "__tests__/**",
        "node_modules/**",
        "vitest.config.*",
        "tsconfig.json",
      ],
      thresholds: {
        statements: 10,
        branches: 8,
        functions: 3,
        lines: 10,
      },
    },
  },
});
