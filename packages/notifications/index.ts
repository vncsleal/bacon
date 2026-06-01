import { Knock } from "@knocklabs/node";
import { keys } from "./keys";

const key = keys().KNOCK_SECRET_API_KEY;

let client: Knock | null = null;

export const getNotificationsClient = (): Knock => {
  if (client) {
    return client;
  }

  if (!key) {
    throw new Error(
      "Knock notifications not configured: set KNOCK_SECRET_API_KEY"
    );
  }

  client = new Knock({ apiKey: key });
  return client;
};

// Direct export for backwards compatibility — callers must null-check.
// Prefer getNotificationsClient() for a clear error when unconfigured.
export const notifications = key ? new Knock({ apiKey: key }) : null;
