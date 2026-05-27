"use client";

import { AuthView } from "@bettercone/ui";

export function SignIn() {
  return <AuthView redirectTo="/dashboard" view="SIGN_IN" />;
}
