import { AwardIcon, CrownIcon, TrophyIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GamificationLeaderboardItem } from "@/types";

type LeaderboardEntry = GamificationLeaderboardItem & {
  rank: number;
};

type LeaderboardProps = {
  entries: LeaderboardEntry[];
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
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-md border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
            No leaderboard records found.
          </div>
        ) : null}

        {entries.map((entry) => {
          const Icon = rankIcons[entry.rank as keyof typeof rankIcons];

          return (
            <Card
              key={entry.studentId}
              className={cn("border-muted/60", entry.rank <= 3 && "bg-amber-50/70")}
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
                      src={
                        entry.profilePicture ??
                        `https://api.dicebear.com/9.x/pixel-art/svg?seed=${entry.name}`
                      }
                      alt={entry.name}
                    />
                    <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.totalPoints} pts • {entry.badgeCount} badges
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
