"use client";

import { createContext, useMemo, type ReactNode } from "react";

import type { CopyContextValue } from "@/types/copy";
import type { MessageDictionary } from "@/types/messages";

import { getMessage, renderRichText } from "@/helpers/messages";

export const CopyContext = createContext<CopyContextValue | null>(null);

export function CopyProvider({
  children,
  messages
}: {
  children: ReactNode;
  messages: MessageDictionary;
}) {
  const value = useMemo<CopyContextValue>(() => {
    return {
      t: (key) => getMessage(messages, key),
      rich: (key, map) => renderRichText(getMessage(messages, key), map)
    };
  }, [messages]);

  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
}
