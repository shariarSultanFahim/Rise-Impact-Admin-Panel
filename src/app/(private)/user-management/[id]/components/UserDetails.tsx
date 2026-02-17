"use client";

import { AlertCircle, Calendar, Mail, Phone } from "lucide-react";

import type { UserDetailsData } from "@/types/user-details";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserDetailsProps {
  data: UserDetailsData;
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
  return "bg-muted text-muted-foreground";
}

function courseBadgeClass(status: string) {
  const normalized = status.toLowerCase().replace(" ", "-");
  if (normalized === "completed") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (normalized === "in-progress") {
    return "bg-blue-100 text-blue-700";
  }
  return "bg-slate-100 text-slate-600";
}

export default function UserDetails({ data }: UserDetailsProps) {
  const { info, stats, courses, recentActivity } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* User Profile Card */}
      <Card className="shadow-sm">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-start gap-4 rounded-md bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-muted">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${info.name.split(" ")[0]}`}
                  alt={info.name}
                />
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(info.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{info.name}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(
                      info.status
                    )}`}
                  >
                    {info.status}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{info.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${info.email}`} className="hover:underline">
                  {info.email}
                </a>
              </div>
            </div>
            {info.phone && (
              <div className="space-y-1 rounded-lg bg-white p-3">
                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${info.phone}`} className="hover:underline">
                    {info.phone}
                  </a>
                </div>
              </div>
            )}
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Joined</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {info.joinDate}
              </div>
            </div>
            <div className="space-y-1 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Last Active</p>
              <p className="text-sm text-foreground">{info.lastActive}</p>
            </div>
          </div>

          {/* Bio */}
          {info.bio && (
            <div className="space-y-2 rounded-lg bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Bio</p>
              <p className="text-sm text-foreground">{info.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enrolled Courses */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              No courses enrolled yet
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="space-y-2 rounded-lg border border-muted/40 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{course.title}</h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${courseBadgeClass(
                      course.status
                    )}`}
                  >
                    {course.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
                  <span>Enrolled: {course.enrolledDate}</span>
                  {course.grade !== undefined && <span>Grade: {course.grade}%</span>}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                No recent activity
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-md border-b border-muted/40 bg-white p-4 pb-3 last:border-0"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
