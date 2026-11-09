import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Turfing team for help with your account, clubs, tournaments, payments or partnerships.",
};

export default function ContactLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
