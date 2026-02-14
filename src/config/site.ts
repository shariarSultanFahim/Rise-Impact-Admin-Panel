import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

// FIXME: Update site branding, theme color, social links, and OG image
export const siteConfig: SiteConfig = {
  name: "Next.js 16 Boilerplate",
  description: "Production-ready Next.js 16+ starter built with Tailwind CSS 4 and TypeScript.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "",
  locale: "en",
  themeColor: "#ffffff",
  keywords: ["nextjs", "typescript", "tailwindcss", "boilerplate", "starter"],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/og.jpg"
} as const;
