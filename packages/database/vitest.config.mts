import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["*.ts", "convex/**/*.ts"],
      exclude: [
        "__tests__/**",
        "node_modules/**",
        "vitest.config.*",
        "tsconfig.json",
        "convex/**/_generated/**",
        "drizzle/**",
        "prisma/**",
      ],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
  },
});
