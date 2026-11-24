import type { Metadata } from "next";
import { ProfileForm } from "@/components/profiles/ProfileForm";

export const metadata: Metadata = {
  title: "Club Owner Profile",
  description: "Create and manage your club owner profile on Turfing.",
};

export default function OwnerProfilePage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Club owner profile</h1>
      <ProfileForm role="owner" />
    </main>
  );
}
