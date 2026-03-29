"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { UpdateGamificationBadgePayload, UpdateGamificationBadgeResponse } from "@/types";

interface UpdateBadgeMutationPayload {
  badgeId: string;
  payload: UpdateGamificationBadgePayload;
}

export const useUpdateGamificationBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ badgeId, payload }: UpdateBadgeMutationPayload) => {
      const response = await instance.patch<UpdateGamificationBadgeResponse>(
        `/gamification/badges/${badgeId}`,
        payload
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification-badges"] });
      queryClient.invalidateQueries({ queryKey: ["gamification-leaderboard"] });
    }
  });
};
