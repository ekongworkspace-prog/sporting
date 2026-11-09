"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button } from "@heroui/react";
import { CheckCircle2, CircleAlert, LockKeyhole, Pencil, Star, UserRound } from "lucide-react";

interface CloudinaryImage {
  url: string;
  publicId: string;
}

interface Profile {
  email?: string;
  fullName?: string;
  country?: string;
  age?: number;
  nin?: string;
  state?: string;
  localGovernment?: string;
  address?: string;
  credentialType?: string;
  credentialNumber?: string;
  position?: string;
  strongFoot?: string;
  heightCm?: number;
  teamsCoached?: string[];
  licenseNumber?: string;
  clubName?: string;
  clubLocation?: string;
  club?: string;
  transferStatus?: string;
  goals?: number;
  assists?: number;
  tournaments?: number;
  starRating?: number;
  marketValue?: number;
  weakFoot?: number;
  strength?: number;
  stamina?: number;
  contractLength?: number;
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function InfoItem({ label, value, pending = false }: { label: string; value?: string | number; pending?: boolean }) {
  const complete = pending ? false : hasValue(value);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 py-3 last:border-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
        <p className={`mt-1 text-sm font-semibold ${complete ? "text-zinc-900" : "text-amber-700"}`}>
          {complete ? value : "Pending"}
        </p>
      </div>
      {complete ? (
        <CheckCircle2 className="shrink-0 text-emerald-600" size={20} aria-label="Complete" />
      ) : (
        <CircleAlert className="shrink-0 text-amber-500" size={20} aria-label="Pending" />
      )}
    </div>
  );
}

export function ProfileSummary({
  profile,
  role,
  profilePicture,
  onEdit,
}: {
  profile: Profile;
  role: string;
  profilePicture: CloudinaryImage;
  onEdit: () => void;
}) {
  const { data: session, isPending } = authClient.useSession();
   
  const requiredFields = [
    ["Full name", profile.fullName],
    ["Country", profile.country],
    ["Age", profile.age],
    ["State", profile.state],
    ["Local government", profile.localGovernment],
    ["Address", profile.address],
    ["Profile picture", profilePicture.url ? "Uploaded" : session?.user?.image ? "Uploaded" : undefined],
    ["Credential", profile.nin || profile.credentialNumber],
  ];

  const roleFields = role === "player"
    ? [
        ["Position", profile.position],
        ["Strong foot", profile.strongFoot],
        ["Height", profile.heightCm ? `${profile.heightCm} cm` : undefined],
      ]
    : role === "coach"
      ? [["Teams coached", profile.teamsCoached?.join(", ")]]
      : role === "referee"
        ? [["License number", profile.licenseNumber]]
        : [["Club name", profile.clubName], ["Club location", profile.clubLocation]];

  const completed = [...requiredFields, ...roleFields].filter(([, value]) => hasValue(value)).length;
  const total = requiredFields.length + roleFields.length;
  const completion = Math.round((completed / total) * 100);

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-emerald-950 to-green-700 px-5 py-6 text-white sm:px-8">
          <div className="flex items-start sm:flex-row flex-col justify-between gap-4">
            <div className="flex sm:flex-row flex-col sm:items-center gap-4">
              <Avatar size="lg" className="ring-4 ring-white/20">
                {profilePicture.url || session?.user?.image ? (
                  <Avatar.Image src={profilePicture.url || session?.user?.image || undefined} alt={profile.fullName ?? "Player"} />
                ) : (
                  <Avatar.Fallback><UserRound /></Avatar.Fallback>
                )}
              </Avatar>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">{role}</p>
                <h2 className="mt-1 text-2xl font-bold">{profile.fullName || "Unnamed profile"}</h2>
                <p className="mt-1 text-sm text-emerald-100">{profile.position || "Football profile"}</p>
              </div>
            </div>

            <div className="flex flex-col-reverse items-end  w-full sm:w-auto gap-2 sm:flex-col sm:items-end sm:gap-4">
            <Button variant="secondary" className="border-white/30 bg-white/10 text-white" onPress={onEdit}>
              <Pencil size={16} /> Edit
            </Button>
             
             <div className="mt-2 text-sm text-emerald-100">Market value : {profile.marketValue ? `₦${profile.marketValue.toLocaleString()}` : "₦0"}</div>
            </div>
          </div>
        </div>

        {role === "player" && (
          <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-5 sm:divide-y-0">
            <Stat label="Goals" value={profile.goals ?? 0} />
            <Stat label="Assists" value={profile.assists ?? 0} />
            <Stat label="Rating" value={(profile.starRating ?? 0).toFixed(1)} icon={<Star size={14} className="fill-amber-400 text-amber-400" />} />
           
            <Stat label="TNMT" value={profile.tournaments ?? 0} />
            <Stat label="Club" value={!profile?.club?.length ? "N/A" : profile.club} />
          </div>
        )}
      </section>

      <section className="grid sm:grid-cols-1 gap-4 ">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-zinc-950">Profile information</h3>
              <p className="text-sm text-zinc-500">{completed} of {total} items completed</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{completion}%</span>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-x-6">
            {[...requiredFields, ...roleFields].map(([label, value]) => (
              <InfoItem key={String(label)} label={String(label)} value={typeof value === "number" ? String(value) : value} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-zinc-950">Football details</h3>
          {role === "player" ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ReadOnlyMetric label="Club" value={profile.club || "Free agent"} />
              <ReadOnlyMetric label="Transfer status" value={profile.transferStatus || "Pending"} />
              <ReadOnlyMetric label="Weak foot" value={profile.weakFoot ? `${profile.weakFoot}/5` : "Not assessed"} />
              <ReadOnlyMetric label="Strength" value={profile.strength ? `${profile.strength}/100` : "Not assessed"} />
              <ReadOnlyMetric label="Stamina" value={profile.stamina ? `${profile.stamina}/100` : "Not assessed"} />
              <ReadOnlyMetric label="Contract" value={profile.contractLength ? `${profile.contractLength} months` : "None"} />
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-3 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600">
              <LockKeyhole size={18} className="mt-0.5 shrink-0" />
              <span>Role-specific details are read-only here.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="flex min-h-24 flex-col justify-center px-5 py-4 text-center">
      <div className="flex items-center justify-center gap-1 text-xl font-bold text-zinc-950">{icon}{value}</div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
    </div>
  );
}

function ReadOnlyMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <LockKeyKeyholeIcon />
      </div>
      <p className="mt-1 text-sm font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function LockKeyKeyholeIcon() {
  return <LockKeyhole size={14} className="text-zinc-400" aria-label="Read-only" />;
}
