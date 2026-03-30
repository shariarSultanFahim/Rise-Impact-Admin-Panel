"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { post } from "@/lib/api";

import type { SendNotificationPayload, SendNotificationResponse } from "@/types";

export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendNotificationPayload) =>
      post<SendNotificationResponse>("/notifications/admin/send", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sent-notifications"] });
    }
  });
};
