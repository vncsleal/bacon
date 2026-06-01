"use client";

import { AuthView } from "@bettercone/ui";

export function TwoFactor() {
  return <AuthView redirectTo="/dashboard" view="TWO_FACTOR" />;
}
