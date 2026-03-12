import axios, { AxiosError, AxiosRequestConfig } from "axios";

import type { RefreshTokenResponse } from "@/types/auth";
import type { AuthSession } from "@/types/auth-session";
import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { env } from "@/env";

import { cookie } from "@/lib/cookie-client";

interface ApiErrorMessage {
  path?: string;
  message?: string;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errorMessages?: ApiErrorMessage[];
}

interface RetriableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json"
  }
});

let refreshPromise: Promise<AuthSession | null> | null = null;

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!axios.isAxiosError<ApiErrorResponse>(err)) {
      return Promise.reject(new AxiosError("Unknown error"));
    }

    const originalRequest = err.config as RetriableAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(err);
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(err);
    }

    if (originalRequest._retry || !isInvalidTokenError(err)) {
      return Promise.reject(err);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAuthSession().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshedSession = await refreshPromise;

    if (!refreshedSession?.accessToken) {
      return Promise.reject(err);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${refreshedSession.accessToken}`;

    return api(originalRequest);
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
  return cookie.get(name);
};

const setCookieValue = (name: string, value: string): void => {
  cookie.set(name, value);
};

const removeCookieValue = (name: string): void => {
  cookie.remove(name);
};

const isInvalidTokenError = (error: AxiosError<ApiErrorResponse>): boolean => {
  const message = error.response?.data?.message?.toLowerCase();
  if (message === "invalid token") {
    return true;
  }

  return (
    error.response?.data?.errorMessages?.some(
      (errorMessage) => errorMessage.message?.toLowerCase() === "invalid token"
    ) ?? false
  );
};

const refreshAuthSession = async (): Promise<AuthSession | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = getCookieValue(AUTH_SESSION_COOKIE);
  if (!rawSession) {
    return null;
  }

  const session = parseSession(rawSession);
  if (!session?.refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      { refreshToken: session.refreshToken },
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    const accessToken = response.data.data?.accessToken;
    const refreshToken = response.data.data?.refreshToken;

    if (!response.data.success || !accessToken || !refreshToken) {
      removeCookieValue(AUTH_SESSION_COOKIE);
      return null;
    }

    const nextSession: AuthSession = {
      accessToken,
      refreshToken
    };

    setCookieValue(AUTH_SESSION_COOKIE, JSON.stringify(nextSession));
    return nextSession;
  } catch {
    removeCookieValue(AUTH_SESSION_COOKIE);
    return null;
  }
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
