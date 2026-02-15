export interface GamificationHeading {
  title: string;
  subtitle: string;
}

export interface GamificationBadge {
  id: string;
  title: string;
  description: string;
  criteria: string;
  awarded: number;
  icon: "mic" | "timer" | "coins" | "brain";
}

export interface GamificationLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  points: number;
  badges: number;
  highlight: boolean;
}

export interface GamificationCertificateTemplate {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface GamificationStat {
  id: string;
  label: string;
  value: string;
}

export interface GamificationData {
  heading: GamificationHeading;
  badges: GamificationBadge[];
  leaderboard: GamificationLeaderboardEntry[];
  certificates: GamificationCertificateTemplate[];
  stats: GamificationStat[];
}
