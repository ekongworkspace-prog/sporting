import { ProfileForm } from "@/features/profiles/ProfileForm";

export default function CoachProfilePage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Coach profile</h1>
      <ProfileForm  />
    </main>
  );
}
