"use server";
import { createAuth } from "@repo/database/convex/auth";
import { api } from "@repo/database/convex/_generated/api";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";

const COLORS = [
  "var(--color-red-500)",
  "var(--color-orange-500)",
  "var(--color-amber-500)",
  "var(--color-yellow-500)",
  "var(--color-blue-500)",
  "var(--color-indigo-500)",
  "var(--color-violet-500)",
  "var(--color-purple-500)",
];

export const getUsers = async (
  userIds: string[]
): Promise<
  | {
      data: Liveblocks["UserMeta"]["info"][];
    }
  | {
      error: unknown;
    }
> => {
  try {
    const token = await getToken(createAuth);
    if (!token) return { data: [] };

    const users = await fetchQuery(
      api.auth.getUsersByIds,
      { userIds },
      { token }
    );

    return {
      data: users.map((user, i) => ({
        name: user.name ?? user.email ?? "",
        avatar: user.image ?? undefined,
        color: COLORS[i % COLORS.length],
      })),
    };
  } catch (error) {
    return { error };
  }
};
