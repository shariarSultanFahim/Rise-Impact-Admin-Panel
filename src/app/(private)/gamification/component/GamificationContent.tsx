"use client";

import { useMemo, useState } from "react";

import { SearchIcon } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import { useGetGamificationBadges } from "@/lib/api/gamification/get-gamification-badges";
import { useGetGamificationLeaderboard } from "@/lib/api/gamification/get-gamification-leaderboard";

import Pagination from "@/components/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GamificationBadgeItem,
  GamificationBadgeQueryParams,
  GamificationLeaderboardQueryParams
} from "@/types";

import BadgeEditDialog from "./BadgeEditDialog";
import BadgesAchievements from "./BadgesAchievements";
import Leaderboard from "./Leaderboard";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

export default function GamificationContent() {
  const [badgeParams, setBadgeParams] = useState<GamificationBadgeQueryParams>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT
  });
  const [leaderboardParams, setLeaderboardParams] = useState<GamificationLeaderboardQueryParams>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const [selectedBadge, setSelectedBadge] = useState<GamificationBadgeItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const badgeQueryParams = useMemo(
    () => ({
      ...badgeParams,
      searchTerm: debouncedSearchTerm || undefined
    }),
    [badgeParams, debouncedSearchTerm]
  );

  const {
    data: badgeResponse,
    isPending: isBadgePending,
    isError: isBadgeError
  } = useGetGamificationBadges(badgeQueryParams);
  const {
    data: leaderboardResponse,
    isPending: isLeaderboardPending,
    isError: isLeaderboardError
  } = useGetGamificationLeaderboard(leaderboardParams);

  const badges = badgeResponse?.data ?? [];
  const leaderboard = useMemo(() => leaderboardResponse?.data ?? [], [leaderboardResponse?.data]);
  const badgePagination = badgeResponse?.pagination;
  const leaderboardPagination = leaderboardResponse?.pagination;
  const leaderboardEntries = useMemo(() => {
    return leaderboard.map((item, index) => {
      const rank =
        ((leaderboardPagination?.page ?? DEFAULT_PAGE) - 1) *
          (leaderboardPagination?.limit ?? DEFAULT_LIMIT) +
        index +
        1;

      return {
        ...item,
        rank
      };
    });
  }, [leaderboard, leaderboardPagination?.limit, leaderboardPagination?.page]);

  const handleBadgePageChange = (page: number) => {
    setBadgeParams((prev) => ({
      ...prev,
      page
    }));
  };

  const handleLeaderboardPageChange = (page: number) => {
    setLeaderboardParams((prev) => ({
      ...prev,
      page
    }));
  };

  const handleBadgeEditOpen = (badge: GamificationBadgeItem) => {
    setSelectedBadge(badge);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Gamification Management</h1>
        <p className="text-muted-foreground">
          Monitor student ranking and manage seeded badge rules.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent>
              <div className="relative w-full sm:max-w-sm">
                <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setBadgeParams((prev) => ({
                      ...prev,
                      page: DEFAULT_PAGE
                    }));
                  }}
                  placeholder="Search badges by name"
                  className="bg-white pl-9"
                  aria-label="Search badges"
                />
              </div>
            </CardContent>
          </Card>

          {isBadgePending ? (
            <Card>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={`badge-loading-${index}`} className="h-20 w-full" />
                ))}
              </CardContent>
            </Card>
          ) : isBadgeError ? (
            <Card>
              <CardContent className="text-sm text-destructive">
                Unable to load badges right now.
              </CardContent>
            </Card>
          ) : (
            <BadgesAchievements badges={badges} onEditBadge={handleBadgeEditOpen} />
          )}

          <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {badges.length} of {badgePagination?.total ?? 0} badges
            </span>
            <Pagination
              currentPage={badgePagination?.page ?? DEFAULT_PAGE}
              totalPages={badgePagination?.totalPage ?? 1}
              onPageChange={handleBadgePageChange}
              iconOnly={false}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isLeaderboardPending ? (
            <Card>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`leaderboard-loading-${index}`} className="h-14 w-full" />
                ))}
              </CardContent>
            </Card>
          ) : isLeaderboardError ? (
            <Card>
              <CardContent className="text-sm text-destructive">
                Unable to load leaderboard right now.
              </CardContent>
            </Card>
          ) : (
            <Leaderboard entries={leaderboardEntries} />
          )}

          <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground">
            <span>
              Showing {leaderboard.length} of {leaderboardPagination?.total ?? 0} students
            </span>
            <Pagination
              currentPage={leaderboardPagination?.page ?? DEFAULT_PAGE}
              totalPages={leaderboardPagination?.totalPage ?? 1}
              onPageChange={handleLeaderboardPageChange}
              iconOnly={false}
            />
          </div>
        </div>
      </div>

      <BadgeEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        badge={selectedBadge}
      />
    </div>
  );
}
