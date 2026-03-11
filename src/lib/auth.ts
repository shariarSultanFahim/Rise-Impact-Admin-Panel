import { cookies } from "next/headers";

import type { AuthSession } from "@/types/auth-session";
import { AUTH_SESSION_COOKIE } from "@/constants/auth";

const normalizeSession = (raw: unknown): AuthSession | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const value = raw as Partial<AuthSession>;

  if (typeof value.accessToken !== "string" || typeof value.refreshToken !== "string") {
    return null;
  }

  return {
    accessToken: value.accessToken,
    refreshToken: value.refreshToken
  };
};

const parseSessionCookie = (sessionCookie: string): AuthSession | null => {
  try {
    const parsed = JSON.parse(sessionCookie) as unknown;
    return normalizeSession(parsed);
  } catch {
    // js-cookie can store encoded values; Next server cookies may expose them encoded.
    try {
      const decoded = decodeURIComponent(sessionCookie);
      const parsed = JSON.parse(decoded) as unknown;
      return normalizeSession(parsed);
    } catch {
      return null;
    }
  }
};

export const getAuthSession = async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  return parseSessionCookie(sessionCookie);
};
