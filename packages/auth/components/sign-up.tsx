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
  const [verificationError, setVerificationError] = useState<string | null>(null);
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
      setState({ phase: "error", message: result.error.message ?? "Sign up failed. Please try again." });
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
      setVerificationError(result.error.message ?? "Invalid code. Please try again.");
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
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{state.email}</span>.
            Enter the code below to activate your account.
          </p>
          <form onSubmit={handleVerify} className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              autoFocus
              className="mx-auto w-40 rounded-md border bg-background px-3 py-2 text-center font-mono text-lg tracking-widest outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
            {verificationError && (
              <p className="text-sm text-destructive">{verificationError}</p>
            )}
            <button
              type="submit"
              disabled={verifying || otp.length !== OTP_LENGTH}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {verifying ? "Verifying…" : "Verify email"}
            </button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              disabled={resending}
              onClick={handleResend}
              className="font-medium text-primary underline"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Already verified?{" "}
          <a href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          required
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={8}
          required
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {state.phase === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
};
