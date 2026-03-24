"use server";

import { headers } from "next/headers";

export const createOrganization = async (name: string, slug: string) => {
  const siteUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const response = await fetch(`${siteUrl}/api/auth/organization/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: (await headers()).get("cookie") ?? "",
    },
    body: JSON.stringify({ name, slug }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create organization: ${error}`);
  }

  return response.json() as Promise<{ id: string; name: string; slug: string }>;
};
