import { Ratelimit, type RatelimitConfig } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { keys } from "./keys";

const url = keys().UPSTASH_REDIS_REST_URL;
const token = keys().UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export const createRateLimiter = (props: Omit<RatelimitConfig, "redis">) => {
  if (!redis) {
    return {
      limit: async () => ({ success: true, limit: 0, remaining: 0, reset: 0 }),
    };
  }

  return new Ratelimit({
    redis,
    limiter: props.limiter ?? Ratelimit.slidingWindow(10, "10 s"),
    prefix: props.prefix ?? "bacon",
  });
};

export const { slidingWindow } = Ratelimit;
