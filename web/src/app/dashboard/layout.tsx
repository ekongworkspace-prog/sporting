import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your Turfing football profile, activity and account from your dashboard.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
