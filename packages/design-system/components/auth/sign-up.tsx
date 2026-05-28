"use client";

import { AuthView } from "@bettercone/ui";

export function SignUp() {
  return <AuthView redirectTo="/dashboard" view="SIGN_UP" />;
}
