"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

type ErrorPageProperties = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly description?: string;
};

export const ErrorPage = ({
  error,
  reset,
  description,
}: ErrorPageProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="font-semibold text-lg">Something went wrong</h1>
      <p className="max-w-md text-center text-muted-foreground text-sm">
        {description ??
          "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
};
