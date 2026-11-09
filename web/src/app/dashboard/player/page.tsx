import type { Metadata } from "next";
import { ProfileForm } from "@/features/profiles/ProfileForm";

export const metadata: Metadata = {
  title: "Player Profile",
  description: "Create and manage your player profile on Turfing.",
};

export default function PlayerProfilePage() {
  return (
    <main className="mx-auto sm:max-w-xl w-full px-4 sm:py-12 py-6">
      <ProfileForm />
    </main>
  );
}
