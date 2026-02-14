"use client";

import type { ReactNode } from "react";

import type { MessageDictionary } from "@/types/messages";

import { CopyProvider, CounterProvider, QueryProvider, ThemeProvider } from "@/providers";

export function Providers({
  children,
  messages
}: {
  children: ReactNode;
  messages: MessageDictionary;
}) {
  return (
    <ThemeProvider>
      <CopyProvider messages={messages}>
        <CounterProvider>
          <QueryProvider>{children}</QueryProvider>
        </CounterProvider>
      </CopyProvider>
    </ThemeProvider>
  );
}
