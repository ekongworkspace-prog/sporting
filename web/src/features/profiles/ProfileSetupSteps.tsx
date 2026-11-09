"use client";

import type { ChangeEvent } from "react";
import { Avatar, Input, Label, TextArea, TextField } from "@heroui/react";
import { UserRound } from "lucide-react";
import { ProfileSelect } from "./ProfileSelect";
import { localGovernments, nigerianStates } from "./profile.constants";
import type { CloudinaryImage, ProfileRole } from "./profile.types";

interface StepProps {
  values: Record<string, string>;
  setValue: (name: string, value: string) => void;
}

const inputClassName = "rounded-lg border border-zinc-300 px-3 py-2";

export function IdentityStep({
  values,
  setValue,
  role,
  sessionEmail,
  profilePicture,
  uploadImage,
}: StepProps & {
  role: ProfileRole;
  sessionEmail?: string;
  profilePicture: CloudinaryImage;
  uploadImage: (event: ChangeEvent<HTMLInputElement>, clubImage?: boolean) => void;
}) {
  return (
    <div className="grid gap-4">
      <Avatar size="lg">
        {profilePicture.url ? <Avatar.Image src={profilePicture.url} alt="Profile" /> : null}
        <Avatar.Fallback><UserRound /></Avatar.Fallback>
      </Avatar>
      <ProfileSelect label="Role" value={role} isDisabled options={[
        { value: "player", label: "Player" }, { value: "coach", label: "Coach" },
        { value: "owner", label: "Club owner" }, { value: "referee", label: "Referee" },
      ]} />
      <TextField><Label>Profile picture</Label><Input className={inputClassName} type="file" accept="image/*" onChange={(event) => uploadImage(event)} /></TextField>
      <TextField isRequired><Label>Full name</Label><Input className={inputClassName} value={values.fullName ?? ""} onChange={(event) => setValue("fullName", event.target.value)} /></TextField>
      <TextField isRequired><Label>Email</Label><Input className={inputClassName} type="email" value={values.email || sessionEmail || ""} onChange={(event) => setValue("email", event.target.value)} /></TextField>
      <TextField isRequired><Label>Country</Label><Input className={inputClassName} value={values.country ?? ""} onChange={(event) => setValue("country", event.target.value)} /></TextField>
    </div>
  );
}

export function LocationStep({ values, setValue }: StepProps) {
  return (
    <div className="grid gap-4">
      <ProfileSelect label="State" value={values.state ?? ""} options={nigerianStates.map((state) => ({ value: state, label: state }))} onChange={(value) => { setValue("state", value); setValue("localGovernment", ""); }} />
      {localGovernments[values.state ?? ""] ? (
        <ProfileSelect label="Local government area" value={values.localGovernment ?? ""} options={localGovernments[values.state ?? ""].map((lga) => ({ value: lga, label: lga }))} onChange={(value) => setValue("localGovernment", value)} />
      ) : (
        <TextField isRequired><Label>Local government area</Label><Input className={inputClassName} value={values.localGovernment ?? ""} onChange={(event) => setValue("localGovernment", event.target.value)} /></TextField>
      )}
      <TextField isRequired><Label>Address</Label><TextArea className={inputClassName} rows={3} value={values.address ?? ""} onChange={(event) => setValue("address", event.target.value)} /></TextField>
    </div>
  );
}

export function VerificationStep({ values, setValue }: StepProps) {
  return (
    <div className="grid gap-4">
      <ProfileSelect label="Valid credential" value={values.credentialType ?? "nin"} options={[
        { value: "nin", label: "National Identification Number (NIN)" },
        { value: "passport", label: "International passport" },
        { value: "driver_license", label: "Driver's licence" },
        { value: "voters_card", label: "Voter's card" },
      ]} onChange={(value) => setValue("credentialType", value)} />
      <TextField isRequired>
        <Label>Credential number</Label>
        <Input className={inputClassName} inputMode={values.credentialType === "nin" ? "numeric" : "text"} pattern={values.credentialType === "nin" ? "[0-9]{11}" : undefined} value={values.nin || values.credentialNumber || ""} onChange={(event) => setValue(values.credentialType === "nin" ? "nin" : "credentialNumber", event.target.value)} />
      </TextField>
    </div>
  );
}

export function RoleDetailsStep({
  role,
  values,
  setValue,
  clubImagesCount,
  uploadImage,
}: StepProps & {
  role: ProfileRole;
  clubImagesCount: number;
  uploadImage: (event: ChangeEvent<HTMLInputElement>, clubImage?: boolean) => void;
}) {
  if (role === "player") {
    return (
      <div className="grid gap-4">
        <TextField isRequired><Label>Age</Label><Input className={inputClassName} type="number" min={5} max={120} value={values.age ?? ""} onChange={(event) => setValue("age", event.target.value)} /></TextField>
        <ProfileSelect label="Position" value={values.position ?? ""} options={[
          { value: "goalkeeper", label: "Goalkeeper" }, { value: "defender", label: "Defender" },
          { value: "midfielder", label: "Midfielder" }, { value: "forward", label: "Forward" },
        ]} onChange={(value) => setValue("position", value)} />
        <ProfileSelect label="Strong foot" value={values.strongFoot ?? "right"} options={[
          { value: "right", label: "Right" }, { value: "left", label: "Left" }, { value: "both", label: "Both" },
        ]} onChange={(value) => setValue("strongFoot", value)} />
        <TextField isRequired><Label>Height (cm)</Label><Input className={inputClassName} type="number" min={100} max={230} value={values.heightCm ?? ""} onChange={(event) => setValue("heightCm", event.target.value)} /></TextField>
        <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600">Goals, assists, ratings and market value are generated from confirmed match data and remain read-only.</p>
      </div>
    );
  }

  if (role === "coach") {
    return (
      <div className="grid gap-4">
        <TextField><Label>Teams coached (comma-separated)</Label><Input className={inputClassName} value={values.teamsCoached ?? ""} onChange={(event) => setValue("teamsCoached", event.target.value)} /></TextField>
        <TextField><Label>Club/location</Label><Input className={inputClassName} value={values.clubLocation ?? ""} onChange={(event) => setValue("clubLocation", event.target.value)} /></TextField>
      </div>
    );
  }

  if (role === "owner") {
    return (
      <div className="grid gap-4">
        <TextField isRequired><Label>Club name</Label><Input className={inputClassName} value={values.clubName ?? ""} onChange={(event) => setValue("clubName", event.target.value)} /></TextField>
        <TextField isRequired><Label>Club location</Label><Input className={inputClassName} value={values.clubLocation ?? ""} onChange={(event) => setValue("clubLocation", event.target.value)} /></TextField>
        <TextField><Label>Club images</Label><Input className={inputClassName} multiple type="file" accept="image/*" onChange={(event) => uploadImage(event, true)} /></TextField>
        {!!clubImagesCount && <p className="text-sm text-emerald-700">{clubImagesCount} club image(s) uploaded.</p>}
        <TextField><Label>Invite players by email</Label><TextArea className={inputClassName} rows={3} placeholder="player@example.com, another@example.com" value={values.invitedPlayerEmails ?? ""} onChange={(event) => setValue("invitedPlayerEmails", event.target.value)} /></TextField>
      </div>
    );
  }

  return (
    <TextField>
      <Label>License number</Label>
      <Input className={inputClassName} value={values.licenseNumber ?? ""} onChange={(event) => setValue("licenseNumber", event.target.value)} />
    </TextField>
  );
}
