"use client";

import type { ReactNode } from "react";

type AuthProviderProperties = {
  children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const AuthProvider = ({ children }: AuthProviderProperties) => (
  <>{children}</>
);
