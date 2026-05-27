import { expect, test } from "@playwright/test";

const WEB_URL = `http://localhost:${process.env.WEB_PORT || "3001"}`;

const WELCOME_BACK = /welcome back/i;
const CREATE_ACCOUNT = /create an account/i;
const SIGN_IN_PATH = /\/sign-in/;
const EMAIL_LABEL = /email/i;
const PASSWORD_LABEL = /password/i;
const FULL_NAME_LABEL = /full name/i;

test.describe("unauthenticated smoke tests", () => {
  test("marketing site homepage loads", async ({ page }) => {
    await page.goto(WEB_URL);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("app sign-in page renders", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(
      page.getByRole("heading", { name: WELCOME_BACK })
    ).toBeVisible();
    await expect(page.getByLabel(EMAIL_LABEL)).toBeVisible();
    await expect(page.getByLabel(PASSWORD_LABEL)).toBeVisible();
  });

  test("app sign-up page renders", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(
      page.getByRole("heading", { name: CREATE_ACCOUNT })
    ).toBeVisible();
    await expect(page.getByLabel(FULL_NAME_LABEL)).toBeVisible();
    await expect(page.getByLabel(EMAIL_LABEL)).toBeVisible();
    await expect(page.getByLabel(PASSWORD_LABEL)).toBeVisible();
  });

  test("unauthenticated access to dashboard redirects to sign-in", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(SIGN_IN_PATH, { timeout: 10_000 });
  });

  test("unauthenticated access to settings redirects to sign-in", async ({
    page,
  }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(SIGN_IN_PATH, { timeout: 10_000 });
  });
});
