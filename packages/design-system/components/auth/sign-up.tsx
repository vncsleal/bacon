"use client";

import { AuthView } from "@bettercone/ui";

export function SignUp() {
  return (
    <AuthView
      view="SIGN_UP"
      redirectTo="/dashboard"
    />
  );
}
