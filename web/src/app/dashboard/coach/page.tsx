import type { Metadata } from "next";
import { ProfileForm } from "@/features/profiles/ProfileForm";

export const metadata: Metadata = {
  title: "Coach Profile",
  description: "Create and manage your coach profile on Turfing.",
};

export default function CoachProfilePage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Coach profile</h1>
      <ProfileForm  />
    </main>
  );
}
