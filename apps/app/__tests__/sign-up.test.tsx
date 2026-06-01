import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../app/(better-auth)/sign-up/page";

test("Sign Up Page", () => {
  const { container } = render(<Page />);
  expect(container).toBeDefined();
});
