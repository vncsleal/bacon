import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "apps/*/vitest.config.mts",
  "packages/*/vitest.config.mts",
]);
