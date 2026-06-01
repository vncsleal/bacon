"use client";

import { AuthView } from "@bettercone/ui";

export function ForgotPassword() {
  return <AuthView redirectTo="/sign-in" view="FORGOT_PASSWORD" />;
}
