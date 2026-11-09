import type { Metadata } from "next";
import { ProfileForm } from "@/features/profiles/ProfileForm";

export const metadata: Metadata = {
  title: "Referee Profile",
  description: "Create and manage your referee profile on Turfing.",
};

export default function RefereeProfilePage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Referee profile</h1>
      <ProfileForm  />
    </main>
  );
}
