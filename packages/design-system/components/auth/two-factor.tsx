"use client";

import { AuthView } from "@bettercone/ui";

export function TwoFactor() {
  return (
    <AuthView
      view="TWO_FACTOR"
      redirectTo="/dashboard"
    />
  );
}
