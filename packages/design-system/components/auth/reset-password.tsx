"use client";

import { AuthView } from "@bettercone/ui";

export function ResetPassword() {
  return <AuthView redirectTo="/sign-in" view="RESET_PASSWORD" />;
}
