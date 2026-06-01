"use client";

import { authClient } from "@repo/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (result.error) {
      setError(result.error.message ?? "Sign in failed. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-sm" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-sm" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <button
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-muted-foreground text-sm">
        Don&apos;t have an account?{" "}
        <a className="font-medium text-primary hover:underline" href="/sign-up">
          Sign up
        </a>
      </p>
    </form>
  );
};
