"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserBlockResponse } from "@/types/user-block";

import { api as instance } from "@/lib/api";

interface BlockUserPayload {
  userId: string;
}

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: BlockUserPayload) => {
      const response = await instance.patch<UserBlockResponse>(`/users/${userId}/block`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users-manage"] });
      queryClient.invalidateQueries({ queryKey: ["user-details", variables.userId] });
    }
  });
};
