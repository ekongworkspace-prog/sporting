import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Turfing account and get back to the game.",
};

export default function SignInLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
