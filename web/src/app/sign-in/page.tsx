"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (result.error) {
      setError(result.error.message ?? "Unable to sign in");
      return;
    }

    router.push("/");
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
       callbackURL: `${window.location.origin}/dashboard`,
        errorCallbackURL: "/sign-in",
      });

      console.log("Google sign-in result:", result);
      if (result.error) {
        setError(result.error.message ?? "Unable to continue with Google");
      }
    } catch {
      setError("Unable to continue with Google");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input className="rounded-lg border px-3 py-2" name="email" type="email" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Password
          <input className="rounded-lg border px-3 py-2" name="password" type="password" required />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-lg bg-zinc-950 px-4 py-3 font-semibold text-white" type="submit">
          Sign in
        </button>
      </form>

        <>
          <div className="my-5 flex items-center gap-3 text-sm text-zinc-500">
            <span className="h-px flex-1 bg-zinc-200" />
            or
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <button
            className="w-full hover:cursor-pointer rounded-lg border px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </>
     
      <p className="mt-5 text-sm">
        New here? <Link className="underline" href="/sign-up">Create an account</Link>
      </p>
    </main>
  );
}
