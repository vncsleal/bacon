"use client";

import type { ReactNode } from "react";

interface AuthProviderProperties {
  children: ReactNode;
  helpUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
}

export const AuthProvider = ({ children }: AuthProviderProperties) => (
  <>{children}</>
);
