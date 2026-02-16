"use client";

import { useState } from "react";

import { BrainIcon, CoinsIcon, MicIcon, TimerIcon } from "lucide-react";

import type { GamificationBadge } from "@/types/gamification";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import CreateBadgeModal from "./CreateBadgeModal";

type BadgesAchievementsProps = {
  badges: GamificationBadge[];
};

const badgeIcons = {
  mic: MicIcon,
  timer: TimerIcon,
  coins: CoinsIcon,
  brain: BrainIcon
};

export default function BadgesAchievements({ badges }: BadgesAchievementsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Badges & Achievements</CardTitle>
          <CardDescription className="text-xs">
            Reward students for meaningful milestones.
          </CardDescription>
        </div>
        <CardAction>
          <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
            Create Badge
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {badges.map((badge) => {
          const Icon = badgeIcons[badge.icon];

          return (
            <Card key={badge.id} className="border-muted/60 bg-white">
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Criteria:</span>{" "}
                      {badge.criteria}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("self-start sm:self-center", "bg-emerald-100 text-emerald-700")}
                  >
                    {badge.awarded} awarded
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
      <CreateBadgeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </Card>
  );
}
