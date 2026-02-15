"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui";
import { QueryProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
