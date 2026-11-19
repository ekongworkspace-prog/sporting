import { Profile } from "@/types/profile.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProfileByRole = async (
  userRole: string
): Promise<Profile> => {
  const response = await fetch(
    `${API_URL}/api/profiles/${userRole}/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile");
  }

  return result;
};


export const updateProfileByRole = async (
  body: Profile,
  userRole: string
): Promise<Profile> => {
  const response = await fetch(
    `${API_URL}/api/profiles/${userRole}/me`,
    {
     method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile");
  }

  return result;
};

