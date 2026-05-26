import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const basehubToken = process.env.BASEHUB_TOKEN;
const parsedToken = basehubToken && basehubToken.length > 0 ? basehubToken : undefined;

export const keys = () =>
  createEnv({
    server: {
      BASEHUB_TOKEN: z.string().startsWith("bshb_pk_").optional(),
    },
    runtimeEnv: {
      BASEHUB_TOKEN: parsedToken,
    },
  });
