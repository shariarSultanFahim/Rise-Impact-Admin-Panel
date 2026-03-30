"use client";

import { useMutation } from "@tanstack/react-query";

import type { ForgetPasswordRequest, ForgetPasswordResponse } from "@/types/auth";

import { api as instance } from "@/lib/api";

export function useForgetPassword() {
  return useMutation({
    mutationFn: async (payload: ForgetPasswordRequest) => {
      const response = await instance.post<ForgetPasswordResponse>(
        "/auth/forget-password",
        payload
      );
      return response.data;
    }
  });
}
