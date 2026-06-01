"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@repo/auth/better-auth/client";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

interface Properties {
  readonly children: ReactNode;
}

export function ConvexClientProvider({ children }: Properties) {
  if (!convex) {
    return <>{children}</>;
  }

  return (
    <ConvexBetterAuthProvider authClient={authClient} client={convex}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
