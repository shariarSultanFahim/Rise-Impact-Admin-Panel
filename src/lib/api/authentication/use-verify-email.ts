"use client";

import { useMutation } from "@tanstack/react-query";

import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/auth";

import { api as instance } from "@/lib/api";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (payload: VerifyEmailRequest) => {
      const response = await instance.post<VerifyEmailResponse>("/auth/verify-email", payload);
      return response.data;
    }
  });
}
