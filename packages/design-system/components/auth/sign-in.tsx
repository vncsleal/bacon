"use client";

import { AuthView } from "@bettercone/ui";

export function SignIn() {
  return (
    <AuthView
      view="SIGN_IN"
      redirectTo="/dashboard"
    />
  );
}
