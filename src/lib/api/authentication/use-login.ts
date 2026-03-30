"use client";

import { useMutation } from "@tanstack/react-query";

import type { LoginRequest, LoginResponse } from "@/types/auth";
import type { AuthSession } from "@/types/auth-session";

import { api as instance } from "@/lib/api";

export const buildSessionFromLoginResponse = (data: LoginResponse): AuthSession => {
  const accessToken = data.data?.accessToken;
  const refreshToken = data.data?.refreshToken;

  if (!data.success || !accessToken || !refreshToken) {
    throw new Error(data.message || "Login failed.");
  }
  return {
    accessToken,
    refreshToken
  };
};

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await instance.post<LoginResponse>("/auth/login", payload);
      return response.data;
    }
  });
}
