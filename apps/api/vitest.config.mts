import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["app/**/*.ts", "app/**/*.tsx"],
      exclude: ["__tests__/**", "node_modules/**", ".next/**"],
      thresholds: {
        statements: 44,
        branches: 35,
        functions: 27,
        lines: 45,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@repo": path.resolve(__dirname, "../../packages"),
    },
  },
});
