import type { GamificationData } from "@/types/gamification";

import BadgesAchievements from "./BadgesAchievements";
import CertificateTemplates from "./CertificateTemplates";
import GamificationStats from "./GamificationStats";
import Leaderboard from "./Leaderboard";

type GamificationContentProps = {
  data: GamificationData;
};

export default function GamificationContent({ data }: GamificationContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{data.heading.title}</h1>
        <p className="text-muted-foreground">{data.heading.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <BadgesAchievements badges={data.badges} />
          <CertificateTemplates templates={data.certificates} />
        </div>
        <div className="flex flex-col gap-6">
          <Leaderboard entries={data.leaderboard} />
          <GamificationStats stats={data.stats} />
        </div>
      </div>
    </div>
  );
}
