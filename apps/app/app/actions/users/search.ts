"use server";
import { createAuth } from "@repo/database/convex/auth";
import { api } from "@repo/database/convex/_generated/api";
import { getToken } from "@convex-dev/better-auth/nextjs";
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
  try {
    const token = await getToken(createAuth);
    if (!token) return { data: [] };

    const users = await fetchQuery(
      api.auth.searchUsersByName,
      { query },
      { token }
    );

    return {
      data: users.map((user) => user._id),
    };
  } catch (error) {
    return { error };
  }
};
