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
        statements: 40,
        branches: 27,
        functions: 22,
        lines: 40,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
      "@repo": path.resolve(import.meta.dirname, "../../packages"),
    },
  },
});
