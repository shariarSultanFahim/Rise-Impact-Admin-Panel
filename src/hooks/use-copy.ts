"use client";

import { useContext, useMemo, type ReactNode } from "react";

import { CopyContext } from "@/providers/CopyProvider";

export function useCopy(namespace?: string) {
  const context = useContext(CopyContext);

  if (!context) {
    throw new Error("useCopy must be used within CopyProvider");
  }

  return useMemo(() => {
    const prefix = namespace ? `${namespace}.` : "";

    return {
      t: (key: string) => context.t(`${prefix}${key}`),
      rich: (key: string, map: Record<string, (chunks: string) => ReactNode>) =>
        context.rich(`${prefix}${key}`, map)
    };
  }, [context, namespace]);
}
