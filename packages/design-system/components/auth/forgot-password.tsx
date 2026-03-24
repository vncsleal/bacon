"use client";

import { AuthView } from "@bettercone/ui";

export function ForgotPassword() {
  return (
    <AuthView
      view="FORGOT_PASSWORD"
      redirectTo="/sign-in"
    />
  );
}
