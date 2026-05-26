"use client";

import { ErrorPage } from "@/components/error-page";
import type { ErrorPageProperties } from "@/components/error-page";

const PageError = (props: ErrorPageProperties) => (
  <ErrorPage {...props} />
);

export default PageError;
