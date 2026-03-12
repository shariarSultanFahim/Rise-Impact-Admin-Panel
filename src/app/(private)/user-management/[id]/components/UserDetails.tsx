"use client";

import { Calendar, Mail, Trophy } from "lucide-react";

import type { UserManageDetailsItem } from "@/types/user-manage-details";

import { formatDate, timeAgo } from "@/lib/date";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserDetailsProps {
  data: UserManageDetailsItem;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "active") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (normalized === "inactive") {
    return "bg-slate-100 text-slate-600";
  }
  if (normalized === "restricted") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-muted text-muted-foreground";
}

export default function UserDetails({ data }: UserDetailsProps) {
  const user = data;

  return (
    <div className="flex flex-col gap-6">
      {/* User Profile Card */}
      <Card className="shadow-sm">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-start gap-4 rounded-md bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-muted">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User user Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${user.email}`} className="hover:underline">
                  {user.email}
                </a>
              </div>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Date of Birth</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(user.dateOfBirth)}
              </div>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Joined</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(user.createdAt)}
              </div>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Last Active</p>
              <p className="text-sm text-foreground">
                {user.lastActiveDate ? timeAgo(user.lastActiveDate) : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{user.totalPoints}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {user.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">{user.ratingsCount} ratings</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{user.streak.current} days</div>
            <p className="text-xs text-muted-foreground">Longest: {user.streak.longest}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{user.achievements.length}</div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Stats */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Trophy className="h-5 w-5" />
            Course Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Total Enrolled</p>
              <p className="text-2xl font-semibold text-foreground">{user.courseStats.total}</p>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold text-foreground">{user.courseStats.active}</p>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Completed / Dropped</p>
              <p className="text-sm font-semibold text-foreground">
                {user.courseStats.completed} / {user.courseStats.dropped}
              </p>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3 sm:col-span-3">
              <p className="text-xs font-medium text-muted-foreground">Average Completion</p>
              <div className="flex items-center justify-between">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${user.courseStats.averageCompletion}%` }}
                  />
                </div>
                <span className="ml-3 text-sm font-semibold text-foreground">
                  {user.courseStats.averageCompletion}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
