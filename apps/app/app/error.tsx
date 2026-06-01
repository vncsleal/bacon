"use client";

import type { ErrorPageProperties } from "@/components/error-page";
import { ErrorPage } from "@/components/error-page";

const RootError = (props: ErrorPageProperties) => (
  <ErrorPage
    {...props}
    description="An unexpected error occurred. Try again, or contact support if the problem persists."
  />
);

export default RootError;
