"use client";

import Link from "next/link";

import { GitBranch, Rocket } from "lucide-react";
import { Balancer } from "react-wrap-balancer";

import { useCopy } from "@/hooks";
import { stackData } from "@/data";

import { StackList } from "@/widgets";
import { Button } from "@/ui";

export function Dashboard() {
  const { rich, t } = useCopy("Dashboard");

  return (
    <section className="container py-16">
      <div className="flex flex-col items-center justify-center gap-6">
        <Balancer
          as="h1"
          className="text-center text-2xl font-bold text-black lg:text-5xl dark:text-white"
        >
          {t("title")}
        </Balancer>

        <Balancer as="p" className="max-w-3xl px-3 text-center text-base">
          {rich("description", {
            react: (chunks) => <strong className="font-semibold">{chunks}</strong>,
            typescript: (chunks) => <strong className="font-semibold">{chunks}</strong>,
            tailwind: (chunks) => <strong className="font-semibold">{chunks}</strong>,
            tanstack: (chunks) => <strong className="font-semibold">{chunks}</strong>
          })}
        </Balancer>
      </div>

      <StackList data={stackData} />

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link
            href="https://vercel.com/new/clone?repository-url=https://github.com/omergulcicek/nizam"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rocket className="h-4 w-4" aria-hidden="true" />
            {t("deployToVercel")}
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href="https://github.com/omergulcicek/nizam/generate"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            {t("useTemplate")}
          </Link>
        </Button>
      </div>
    </section>
  );
}
