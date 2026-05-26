"use client";

import type { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@repo/auth/better-auth/client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

type Properties = {
  readonly children: ReactNode;
};

export function ConvexClientProvider({ children }: Properties) {
  if (!convex) {
    return <>{children}</>;
  }

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
