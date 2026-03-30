"use client";

import { useMutation } from "@tanstack/react-query";

import type { ResetPasswordRequest, ResetPasswordResponse } from "@/types/auth";

import { api as instance } from "@/lib/api";

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordRequest) => {
      const response = await instance.post<ResetPasswordResponse>("/auth/reset-password", payload);
      return response.data;
    }
  });
}
