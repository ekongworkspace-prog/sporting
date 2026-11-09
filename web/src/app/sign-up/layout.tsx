import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a Turfing account to connect with clubs, organise football and follow competitions.",
};

export default function SignUpLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
