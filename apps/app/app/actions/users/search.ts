"use server";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/database/convex/_generated/api";
import { createAuth } from "@repo/database/convex/auth";
import { fetchQuery } from "convex/nextjs";

export const searchUsers = async (
  query: string
): Promise<
  | {
      data: string[];
    }
  | {
      error: unknown;
    }
> => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return { data: [] };
  }

  try {
    const token = await getToken(createAuth);
    if (!token) return { data: [] };

    const users = await fetchQuery(
      api.auth.searchUsersByName,
      { query },
      { token }
    );

    return {
      data: users.map((user: { _id: string }) => user._id),
    };
  } catch (error) {
    return { error };
  }
};
