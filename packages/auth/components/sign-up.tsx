"use client";

import { authClient } from "@repo/auth/client";
import { useState } from "react";

type SignUpState =
  | { phase: "form" }
  | { phase: "verification-sent"; email: string }
  | { phase: "error"; message: string };

const OTP_LENGTH = 6;

export const SignUp = () => {
  const [state, setState] = useState<SignUpState>({ phase: "form" });
  const [name, setName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await authClient.signUp.email({
      name,
      email: formEmail,
      password,
      callbackURL: "/",
    });

    setLoading(false);

    if (result.error) {
      setState({
        phase: "error",
        message: result.error.message ?? "Sign up failed. Please try again.",
      });
      return;
    }

    const signedIn = !!result.data?.token;
    if (signedIn) {
      // Full page reload to pick up the Convex JWT cookie set by the sign-in
      window.location.href = "/";
      return;
    }

    setState({ phase: "verification-sent", email: formEmail });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setVerificationError(null);

    if (state.phase !== "verification-sent") {
      return;
    }

    const result = await authClient.emailOtp.verifyEmail({
      email: state.email,
      otp,
    });

    setVerifying(false);

    if (result.error) {
      setVerificationError(
        result.error.message ?? "Invalid code. Please try again."
      );
      return;
    }

    // Full page reload to pick up the Convex JWT cookie set on verification
    window.location.href = "/";
  };

  const handleResend = async () => {
    if (state.phase !== "verification-sent") {
      return;
    }
    setResending(true);
    setVerificationError(null);
    await authClient.emailOtp.sendVerificationOtp({
      email: state.email,
      type: "email-verification",
    });
    setResending(false);
  };

  if (state.phase === "verification-sent") {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="rounded-md bg-muted p-6">
          <h2 className="font-semibold text-lg">Check your email</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{state.email}</span>.
            Enter the code below to activate your account.
          </p>
          <form className="mt-4 flex flex-col gap-3" onSubmit={handleVerify}>
            <input
              autoFocus
              className="mx-auto w-40 rounded-md border bg-background px-3 py-2 text-center font-mono text-lg tracking-widest outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              pattern="[0-9]*"
              placeholder="000000"
              type="text"
              value={otp}
            />
            {verificationError && (
              <p className="text-destructive text-sm">{verificationError}</p>
            )}
            <button
              className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
              disabled={verifying || otp.length !== OTP_LENGTH}
              type="submit"
            >
              {verifying ? "Verifying…" : "Verify email"}
            </button>
          </form>
          <p className="mt-4 text-muted-foreground text-xs">
            Didn&apos;t receive the code?{" "}
            <button
              className="font-medium text-primary underline"
              disabled={resending}
              onClick={handleResend}
              type="button"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          Already verified?{" "}
          <a
            className="font-medium text-primary hover:underline"
            href="/sign-in"
          >
            Sign in
          </a>
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-sm" htmlFor="name">
          Full name
        </label>
        <input
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          id="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          required
          type="text"
          value={name}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-sm" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          id="email"
          onChange={(e) => setFormEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={formEmail}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-sm" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          id="password"
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
      </div>
      {state.phase === "error" && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}
      <button
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <a className="font-medium text-primary hover:underline" href="/sign-in">
          Sign in
        </a>
      </p>
    </form>
  );
};
