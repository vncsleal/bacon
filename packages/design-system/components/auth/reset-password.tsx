"use client";

import { AuthView } from "@bettercone/ui";

export function ResetPassword() {
  return (
    <AuthView
      view="RESET_PASSWORD"
      redirectTo="/sign-in"
    />
  );
}
