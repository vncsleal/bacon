import { Resend } from "resend";
import { createElement } from "react";
import type { ReactElement } from "react";
import { log } from "@repo/observability/log";
import { keys } from "./keys";
import { VerifyEmailTemplate } from "./templates/verify-email";

const token = keys().RESEND_TOKEN;

export const resend = token ? new Resend(token) : null;

type SendEmailParams = {
  to: string;
  subject: string;
  react: ReactElement;
};

type SendEmailResult = {
  success: boolean;
  error?: string;
};

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailParams): Promise<SendEmailResult> {
  if (!resend) {
    log.warn("[email] Email service not configured — skipping", { to, subject });
    return { success: false, error: "Email service not configured" };
  }

  const from = keys().RESEND_FROM;
  if (!from) {
    log.warn("[email] RESEND_FROM not configured — skipping", { to });
    return { success: false, error: "RESEND_FROM not configured" };
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    react,
  });

  if (error) {
    log.error("[email] Failed to send email", { to, error: error.message });
    return { success: false, error: error.message };
  }

  return { success: true };
}

// The `sendVerificationOTP` callback from better-auth's emailOTP plugin
// only provides { email, otp, type } — no user name. The name is hardcoded
// to "there" because the user record may not be accessible at this point.
export async function sendVerificationOTPEmail(
  email: string,
  otp: string
): Promise<SendEmailResult> {
  return await sendEmail({
    to: email,
    subject: "Your verification code",
    react: createElement(VerifyEmailTemplate, {
      name: "there",
      otp,
    }),
  });
}
