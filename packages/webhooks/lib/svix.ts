import "server-only";
import { getSessionInfo } from "@repo/auth/server";
import { Svix } from "svix";
import { keys } from "../keys";

const svixToken = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);
  const { userId } = await getSessionInfo();

  if (!userId) {
    return;
  }

  // TODO: Replace userId with orgId once organization plugin is fully set up
  return svix.message.create(userId, {
    eventType,
    payload: {
      eventType,
      ...payload,
    },
    application: {
      name: userId,
      uid: userId,
    },
  });
};

export const getAppPortal = async () => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);
  // TODO: Replace with orgId once organization plugin is fully set up
  const { userId } = await getSessionInfo();

  if (!userId) {
    return;
  }

  return svix.authentication.appPortalAccess(userId, {
    application: {
      name: userId,
      uid: userId,
    },
  });
};
