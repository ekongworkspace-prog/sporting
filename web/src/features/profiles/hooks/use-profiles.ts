import { getProfileByRole, updateProfileByRole } from "@/lib/api/profile";
import { Profile } from "@/types/profile.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetProfileByRole = (userRole: string) => {
  return useQuery({
    queryKey: ["profiles", userRole],
    queryFn: () => getProfileByRole(userRole),
    enabled: Boolean(userRole),
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      body,
      userRole,
    }: {
      body: Profile;
      userRole: string;
    }) => updateProfileByRole(body, userRole),

    onSuccess: (_profile, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.body._id],
      });
    },
  });
};


