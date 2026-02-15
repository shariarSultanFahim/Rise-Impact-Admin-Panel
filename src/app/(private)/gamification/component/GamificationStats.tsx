import type { GamificationStat } from "@/types/gamification";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GamificationStatsProps = {
  stats: GamificationStat[];
};

export default function GamificationStats({ stats }: GamificationStatsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Gamification Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.id} className="space-y-1">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
