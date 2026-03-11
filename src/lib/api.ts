import axios, { AxiosError, AxiosRequestConfig } from "axios";

import type { AuthSession } from "@/types/auth-session";
import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { env } from "@/env";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  // FIXME: Inject your auth token/header if required
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) return Promise.reject(err);

    return Promise.reject(new AxiosError("Bilinmeyen hata"));
  }
);

type Cfg = AxiosRequestConfig & { signal?: AbortSignal };

export const get = async <T>(url: string, config?: Cfg) => (await api.get<T>(url, config)).data;

export const post = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.post<T>(url, body, config)).data;

export const put = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.put<T>(url, body, config)).data;

export const del = async <T>(url: string, config?: Cfg) => (await api.delete<T>(url, config)).data;

const parseSession = (raw: string): AuthSession | null => {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const value = parsed as Partial<AuthSession>;
    if (typeof value.accessToken !== "string" || typeof value.refreshToken !== "string") {
      return null;
    }

    return {
      accessToken: value.accessToken,
      refreshToken: value.refreshToken
    };
  } catch {
    try {
      const decoded = decodeURIComponent(raw);
      const parsed = JSON.parse(decoded) as unknown;

      if (!parsed || typeof parsed !== "object") {
        return null;
      }

      const value = parsed as Partial<AuthSession>;
      if (typeof value.accessToken !== "string" || typeof value.refreshToken !== "string") {
        return null;
      }

      return {
        accessToken: value.accessToken,
        refreshToken: value.refreshToken
      };
    } catch {
      return null;
    }
  }
};

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!found) {
    return null;
  }

  return found.slice(prefix.length);
};

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = getCookieValue(AUTH_SESSION_COOKIE);
  if (!rawSession) {
    return null;
  }

  const session = parseSession(rawSession);
  const token = session?.accessToken ?? null;
  return token;
}
