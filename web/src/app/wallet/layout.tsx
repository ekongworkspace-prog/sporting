import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Wallet",
  description:
    "View your Turfing wallet balance, fund your account and review transaction history.",
};

export default function WalletLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
