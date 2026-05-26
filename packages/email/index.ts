import { Resend } from "resend";
import { keys } from "./keys";

const token = keys().RESEND_TOKEN;

export const resend = token ? new Resend(token) : null;
