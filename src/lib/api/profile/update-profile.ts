"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateProfilePayload, UpdateProfileResponse } from "@/types/user-profile";

import { api as instance } from "@/lib/api";

export const useUpdateUsersProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      dateOfBirth,
      gender,
      location,
      phone,
      profilePicture
    }: UpdateProfilePayload) => {
      const body = new FormData();

      if (name) {
        body.append("name", name);
      }

      if (dateOfBirth) {
        body.append("dateOfBirth", dateOfBirth);
      }

      if (gender) {
        body.append("gender", gender);
      }

      if (location) {
        body.append("location", location);
      }

      if (phone) {
        body.append("phone", phone);
      }

      if (profilePicture) {
        body.append("profilePicture", profilePicture);
      }

      const response = await instance.patch<UpdateProfileResponse>("/users/profile", body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-manage"] });
    }
  });
};
