"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/types/user.types";
import {
  Alert,
  Avatar,
  Button,
  Form,
  Input,
  Label,
  ListBox,
  ProgressBar,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import { ProfileSummary } from "./ProfileSummary";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import type { CloudinaryImage, Profile, ProfileRole } from "@/types/profile.types";
import { useGetProfileByRole, useUpdateProfile } from "@/features/profiles/hooks/use-profiles";
import { updateProfileByRole } from "@/lib/api/profile";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const localGovernments: Record<string, string[]> = {
  FCT: ["Abaji", "AMAC", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  Lagos: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  Kano: ["Dala", "Fagge", "Gwale", "Kano Municipal", "Kumbotso", "Nasarawa", "Tarauni", "Ungogo"],
  Kaduna: ["Chikun", "Igabi", "Kaduna North", "Kaduna South", "Zaria"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre", "Oyigbo"],
  Oyo: ["Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ogbomosho North"],
};

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "include", ...init });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

function ProfileSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  isDisabled = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}) {
  return (
    <Select
      selectedKey={value || null}
      isDisabled={isDisabled}
      placeholder={placeholder}
      onSelectionChange={(key) => onChange?.(String(key ?? ""))}
      fullWidth

    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value}>{option.label}</ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

export function ProfileForm({ role }: { role: ProfileRole }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedProfile, setSavedProfile] = useState<Profile | null>(null);
  const [profilePicture, setProfilePicture] = useState<CloudinaryImage>({ url: "", publicId: "" });
  const [clubImages, setClubImages] = useState<CloudinaryImage[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }
  }, [isPending, session, router]);

  

 
  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetProfileByRole(role);

 

  useEffect(() => {
    if (!profile) return;
    const timer = window.setTimeout(() => {
      setSavedProfile(profile);
      setSaved(true);
      setValues({
        email: profile.email ?? session?.user?.email ?? "",
        fullName: profile.fullName ?? session?.user?.name ?? "",
        country: profile.country ?? "Nigeria",
        age: profile.age?.toString() ?? "",
        nin: "",
        state: profile.state ?? "",
        localGovernment: profile.localGovernment ?? "",
        address: profile.address ?? "",
        credentialType: profile.credentialType ?? "nin",
        credentialNumber: "",
        position: profile.position ?? "",
        strongFoot: profile.strongFoot ?? "right",
        heightCm: profile.heightCm?.toString() ?? "",
        teamsCoached: profile.teamsCoached?.join(", ") ?? "",
        licenseNumber: profile.licenseNumber ?? "",
        clubName: profile.clubName ?? "",
        clubLocation: profile.clubLocation ?? "",
        invitedPlayerEmails: profile.invitedPlayerEmails?.join(", ") ?? "",
      });
      setProfilePicture(profile.profilePicture ?? { url: "", publicId: "" });
      setClubImages(profile.clubImages ?? []);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [profile]);

    function setValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

 const saveMutation = useMutation({
  mutationFn: (body: Record<string, unknown>) =>
    updateProfileByRole(body, role),

  onSuccess: (data) => {
    setSaved(true);

    setSavedProfile((current) => ({
      ...current,
      ...profile,
      ...data,
      nin: data?.nin ?? profile?.nin ?? "",
      credentialNumber:
        data?.credentialNumber ?? profile?.credentialNumber,
    }));

    setError("");

    void queryClient.invalidateQueries({
      queryKey: ["profiles", role],
    });

    if (role === "owner") {
      const emails =
        values.invitedPlayerEmails
          ?.split(",")
          .map((email) => email.trim())
          .filter(Boolean) ?? [];

      if (emails.length) {
          void apiFetch("/api/profiles/club-invitations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              clubName: values.clubName,
              ownerName: values.fullName,
              emails,
            }),
          }).catch((inviteError: Error) => setError(inviteError.message));
        }
    }
  },

  onError: (mutationError: Error) => {
    setError(mutationError.message);
  },
});

 

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    const credentialNumber = values.credentialNumber || profile?.credentialNumber || (role === "player" ? values.nin : "");
    const body: Record<string, unknown> = {

      fullName: values.fullName || profile?.fullName,
      country: values.country || profile?.country || "Nigeria",
      age: values.age ? Number(values.age) : profile?.age,
      state: values.state || profile?.state,
      localGovernment: values.localGovernment || profile?.localGovernment,
      address: values.address || profile?.address,
      credentialType: values.credentialType || "nin",
      credentialNumber: credentialNumber || undefined,

    };
    if (profilePicture.url && profilePicture.publicId) body.profilePicture = profilePicture;
    if (role === "player") {
      body.position = values.position || undefined;
      body.strongFoot = values.strongFoot || undefined;
      body.heightCm = values.heightCm ? Number(values.heightCm) : undefined;
    }
    if (role === "coach") body.teamsCoached = values.teamsCoached?.split(",").map((item) => item.trim()).filter(Boolean);
    if (role === "referee") body.licenseNumber = values.licenseNumber;
    if (role === "owner") {
      body.clubName = values.clubName;
      body.clubLocation = values.clubLocation;
      body.clubImages = clubImages;
      body.invitedPlayerEmails = values.invitedPlayerEmails?.split(",").map((item) => item.trim()).filter(Boolean);
    }
    saveMutation.mutate(Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined)));
  }

 

  const needsSetup = profile === null;
  const isClubRole = role === "coach" || role === "owner";
  const steps = ["Role & identity", "Location", "Verification", ...(role === "player" ? ["Football details"] : isClubRole ? ["Club setup"] : ["Professional details"])];

  if (profileLoading || isPending) return <p>Loading profile...</p>;
  if (profileError) return <p className="text-sm text-red-600">{profileError}</p>;

  const requiredStepOneComplete = Boolean(
    (values.fullName || profile?.fullName) &&
    (values.country || profile?.country) &&
    role,
  );
  const requiredStepTwoComplete = Boolean(
    (values.localGovernment
      || profile?.localGovernment) &&
    (values.address || profile?.address) &&
    role,
  );

  if (saved && savedProfile) {
    return (
      <ProfileSummary
        profile={savedProfile}
        role={role}
        profilePicture={profilePicture}
        onEdit={() => {
          setSaved(false);
          setSavedProfile(null);
        }}
      />
    );
  }

  function nextStep() {
    setError("");
    if (step === 0 && !requiredStepOneComplete) {
      setError("Complete your full name, country and role before continuing.");
      return;
    }
    if (step === 1 && !requiredStepTwoComplete) {
      setError("Complete your local govt and address before continuing.");
      return;
    }


    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  return (
    <div className="grid gap-5">

      {needsSetup && (
        <Alert status="warning">
          <Alert.Indicator><CircleAlert size={18} /></Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Set up your football profile</Alert.Title>
            <Alert.Description>Your account is ready, but a profile has not been created yet. Complete the steps below to finish setup.</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <ProgressBar value={(step / (steps.length - 1)) * 100} aria-label="Profile setup progress" color="accent" size="sm">
        <ProgressBar.Track><ProgressBar.Fill className="bg-green-700" /></ProgressBar.Track>
      </ProgressBar>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Profile setup steps">
        {steps.map((label, index) => (
          <div key={label} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${index === step ? "border-zinc-950 bg-zinc-950 text-white" : index < step ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "text-zinc-500"}`}>
            <span>{index < step ? <Check size={14} /> : index + 1}</span>{label}
          </div>
        ))}
      </div>

      <Form className="w-full flex px-2 bg-zinc-100 rounded-lg sm:px-6 px-2 py-2 sm:py-4 flex-col gap-4 overflow-hidden" onSubmit={handleSubmit}>
        {step === 0 && (
          <div className="flex flex-col gap-4 ">
            <Avatar size="lg">
              {profilePicture.url ? <Avatar.Image src={profilePicture.url} alt="Profile" /> : session?.user.image ? <Avatar.Image src={session.user.image} alt="Profile" /> : null}
              <Avatar.Fallback><UserRound /></Avatar.Fallback>
            </Avatar>
            <ProfileSelect label="Role" value={role} isDisabled options={[
              { value: "player", label: "Player" },
              { value: "coach", label: "Coach" },
              { value: "owner", label: "Club owner" },
              { value: "referee", label: "Referee" },
            ]} />
            <TextField>
              <Label>Profile picture</Label>
              <ProfilePictureUpload
                label="Change Avatar"
                onUploadSuccess={(image) => setProfilePicture(image)}
              />

            </TextField>
            <TextField isRequired>
              <Label>Full name</Label>
              <Input className="ring-green-600" value={values.fullName ?? ""} onChange={(event) => setValue("fullName", event.target.value)} />
            </TextField>

            <TextField isRequired>
              <Label>Country</Label>
              <Input value={values.country ?? ""} onChange={(event) => setValue("country", event.target.value)} className="ring-green-600" />
            </TextField>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4">
            <ProfileSelect label="State" value={values.state ?? ""} options={nigerianStates.map((state) => ({ value: state, label: state }))} onChange={(value) => { setValue("state", value); setValue("localGovernment", ""); }} />
            {localGovernments[values.state ?? ""] ? (
              <ProfileSelect label="Local government area" value={values.localGovernment ?? ""} options={(localGovernments[values.state ?? ""] ?? []).map((lga) => ({ value: lga, label: lga }))} onChange={(value) => setValue("localGovernment", value)} />
            ) : (
              <TextField isRequired  >
                <Label>Local government area</Label>
                <Input value={values.localGovernment ?? ""} onChange={(event) => setValue("localGovernment", event.target.value)} className="ring-green-500" />
              </TextField>
            )}
            <TextField isRequired>
              <Label>Address</Label>
              <TextArea rows={3} value={values.address ?? ""} onChange={(event) => setValue("address", event.target.value)} className="ring-green-500" />
            </TextField>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <ProfileSelect label="Valid credential" value={values.credentialType ?? "nin"} options={[
              { value: "nin", label: "National Identification Number (NIN)" },
              { value: "passport", label: "International passport" },
              { value: "driver_license", label: "Driver's licence" },
              { value: "voters_card", label: "Voter's card" },
            ]} onChange={(value) => setValue("credentialType", value)} />
            <TextField isRequired>
              <Label>Credential number</Label>
              <Input className="ring-green-600" inputMode={values.credentialType === "nin" ? "numeric" : "text"} pattern={values.credentialType === "nin" ? "[0-9]{11}" : undefined} maxLength={values.credentialType === "nin" ? 10 : 200} value={values.nin || values.credentialNumber || ""} onChange={(event) => { setValue(values.credentialType === "nin" ? "nin" : "credentialNumber", event.target.value); }} />
            </TextField>
          </div>
        )}

        {step === 3 && role === "player" && (
          <div className="grid gap-4">
            <TextField isRequired>
              <Label>Age</Label>
              <Input className="ring-green-600" type="number" min={5} max={120} value={values.age ?? ""} onChange={(event) => setValue("age", event.target.value)} />
            </TextField>
            <ProfileSelect label="Position" value={values.position ?? ""} options={[
              { value: "goalkeeper", label: "Goalkeeper" },
              { value: "defender", label: "Defender" },
              { value: "midfielder", label: "Midfielder" },
              { value: "forward", label: "Forward" },
            ]} onChange={(value) => setValue("position", value)} />
            <ProfileSelect label="Strong foot" value={values.strongFoot ?? "right"} options={[
              { value: "right", label: "Right" },
              { value: "left", label: "Left" },
              { value: "both", label: "Both" },
            ]} onChange={(value) => setValue("strongFoot", value)} />
            <TextField >
              <Label>Height (cm)</Label>
              <Input className="ring-green-600" type="number" min={100} max={230} value={values.heightCm ?? ""} onChange={(event) => setValue("heightCm", event.target.value)} />
            </TextField>
            <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600">Goals, assists, ratings and market value are generated from confirmed match data and remain read-only.</p>
          </div>
        )}

        {step === 3 && role === "coach" && (
          <div className="grid gap-4">
            <TextField>
              <Label>Teams coached (comma-separated)</Label>
              <Input className="ring-green-600" value={values.teamsCoached ?? ""} onChange={(event) => setValue("teamsCoached", event.target.value)} />
            </TextField>
            <TextField>
              <Label>Club/location</Label>
              <Input className="ring-green-600" value={values.clubLocation ?? ""} onChange={(event) => setValue("clubLocation", event.target.value)} />
            </TextField>
          </div>
        )}

        {step === 3 && role === "owner" && (
          <div className="grid gap-4">
            <TextField isRequired>
              <Label>Club name</Label>
              <Input className="ring-green-600" value={values.clubName ?? ""} onChange={(event) => setValue("clubName", event.target.value)} />
            </TextField>
            <TextField isRequired>
              <Label>Club location</Label>
              <Input className="ring-green-600" value={values.clubLocation ?? ""} onChange={(event) => setValue("clubLocation", event.target.value)} />
            </TextField>
            <TextField>
              <Label>Club images</Label>
              <ProfilePictureUpload
                label="Change Avatar"
                onUploadSuccess={(image) => setProfilePicture(image)}
              />

            </TextField>
            {!!clubImages.length && <p className="text-sm text-emerald-700">{clubImages.length} club image(s) uploaded.</p>}
            <TextField>
              <Label>Invite players by email</Label>
              <TextArea rows={3} placeholder="player@example.com, another@example.com" value={values.invitedPlayerEmails ?? ""} onChange={(event) => setValue("invitedPlayerEmails", event.target.value)} />
            </TextField>
          </div>
        )}

        {step === 3 && role === "referee" && (
          <TextField>
            <Label>License number</Label>
            <Input className="ring-green-600" value={values.licenseNumber ?? ""} onChange={(event) => setValue("licenseNumber", event.target.value)} />
          </TextField>
        )}

        {error && <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              {error}
            </Alert.Description>
          </Alert.Content>
        </Alert>}
        {saved && <p className="text-sm text-green-700">Profile setup saved.</p>}
        <div className="flex justify-between gap-3">
          <Button variant="secondary" isDisabled={step === 0} onPress={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={16} /> Back</Button>
          {step < steps.length - 1 ? (
            <Button onPress={nextStep} className="bg-green-700 hover:bg-green-600 text-white">
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button type="submit" isDisabled={saveMutation.isPending}>
              {saveMutation.isPending ? <LoaderCircle className="animate-spin" size={16} /> : <BadgeCheck size={16} />}
              {saveMutation.isPending ? "Saving..." : "Complete setup"}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
