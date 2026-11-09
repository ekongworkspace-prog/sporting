"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailVerification, setEmailVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const submittedEmail = String(form.get("email"));
    const result = await authClient.signUp.email({
      name: String(form.get("name")),
      email: submittedEmail,
      password: String(form.get("password")),
    });

    if (result.error) {
      setError(result.error.message ?? "Unable to create account");
      return;
    }

    setEmail(submittedEmail);
    setEmailVerification(true);
  }

  async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setVerifying(true);
    try {
      const result = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });

      if (result.error) {
        setError(result.error.message ?? "Invalid or expired verification code");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Unable to verify your email");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setResending(true);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to resend verification code");
      }
    } catch {
      setError("Unable to resend verification code");
    } finally {
      setResending(false);
    }
  }

  async function handleGoogleSignUp() {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
        errorCallbackURL: `${window.location.origin}/sign-up`,
      });

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
      <h1 className="text-3xl font-bold">
        {emailVerification ? "Verify your email" : "Create account"}
      </h1>
      {emailVerification ? (
        <>
          <p className="mt-3 text-sm text-zinc-600">
            Enter the 6-digit code sent to {email}.
          </p>
          <form className="mt-8 grid gap-4" onSubmit={handleVerifyEmail}>
            <label className="grid gap-2 text-sm font-medium">
              Verification code
              <input
                className="rounded-lg border px-3 py-2 text-center text-lg tracking-[0.5em]"
                inputMode="numeric"
                maxLength={6}
                minLength={6}
                name="otp"
                pattern="[0-9]{6}"
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              className="rounded-lg bg-zinc-950 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={verifying || otp.length !== 6}
              type="submit"
            >
              {verifying ? "Verifying..." : "Verify email"}
            </button>
          </form>
          <button
            className="mt-4 text-sm underline disabled:opacity-60"
            disabled={resending}
            type="button"
            onClick={handleResendOtp}
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
          <button
            className="ml-4 text-sm underline"
            type="button"
            onClick={() => {
              setEmailVerification(false);
              setOtp("");
              setError("");
            }}
          >
            Change email
          </button>
        </>
      ) : (
        <>
      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input className="rounded-lg border px-3 py-2" name="name" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input className="rounded-lg border px-3 py-2" name="email" type="email" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Password
          <input className="rounded-lg border px-3 py-2" minLength={8} name="password" type="password" required />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-lg bg-zinc-950 px-4 py-3 font-semibold text-white" type="submit">
          Create account
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
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
          >
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </>
   
      <p className="mt-5 text-sm">
        Already registered? <Link className="underline" href="/sign-in">Sign in</Link>
      </p>
        </>
      )}
    </main>
  );
}
