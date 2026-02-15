import { AwardIcon, CrownIcon, RotateCcwIcon, TrophyIcon } from "lucide-react";

import type { GamificationLeaderboardEntry } from "@/types/gamification";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type LeaderboardProps = {
  entries: GamificationLeaderboardEntry[];
};

const rankIcons = {
  1: CrownIcon,
  2: TrophyIcon,
  3: AwardIcon
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Leaderboard</CardTitle>
          <CardDescription className="text-xs">Top students by points.</CardDescription>
        </div>
        <CardAction>
          <ButtonReset />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => {
          const Icon = rankIcons[entry.rank as keyof typeof rankIcons];

          return (
            <Card
              key={entry.id}
              className={cn("border-muted/60", entry.highlight && "bg-amber-50/70")}
            >
              <CardContent className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="h-7 w-7 justify-center rounded-full bg-muted text-xs text-muted-foreground"
                  >
                    {entry.rank}
                  </Badge>
                  <Avatar size="sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${entry.name}`}
                      alt={entry.name}
                    />
                    <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.points} pts • {entry.badges} badges
                    </p>
                  </div>
                </div>
                {Icon ? <Icon className="h-4 w-4 text-amber-600" /> : null}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ButtonReset() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 gap-2 rounded-full border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-600"
    >
      <RotateCcwIcon className="size-3.5" />
      Reset
    </Button>
  );
}
