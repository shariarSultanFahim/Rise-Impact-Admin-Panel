"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserBlockResponse } from "@/types/user-block";

import { api as instance } from "@/lib/api";

interface UnblockUserPayload {
  userId: string;
}

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: UnblockUserPayload) => {
      const response = await instance.patch<UserBlockResponse>(`/users/${userId}/unblock`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users-manage"] });
      queryClient.invalidateQueries({ queryKey: ["user-details", variables.userId] });
    }
  });
};
