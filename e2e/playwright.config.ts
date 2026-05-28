import { defineConfig, devices } from "@playwright/test";

const APP_PORT = process.env.APP_PORT || "3000";
const WEB_PORT = process.env.WEB_PORT || "3001";

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  outputDir: "playwright-results",
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "smoke",
      testMatch: "smoke.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.CI
    ? [
        {
          command: `pnpm --filter=web exec next start -p ${WEB_PORT}`,
          url: `http://localhost:${WEB_PORT}`,
          reuseExistingServer: true,
          timeout: 30_000,
        },
        {
          command: `pnpm --filter=app exec next start -p ${APP_PORT}`,
          url: `http://localhost:${APP_PORT}`,
          reuseExistingServer: true,
          timeout: 30_000,
        },
      ]
    : [],
});
