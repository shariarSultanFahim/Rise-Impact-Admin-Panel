"use client";

import { AlertCircle } from "lucide-react";

import { useGetUserDetails } from "@/lib/api/user/get-user-details";

import UserDetails from "./UserDetails";
import UserDetailsSkeleton from "./UserDetailsSkeleton";

interface UserDetailsClientProps {
  userId: string;
}

export default function UserDetailsClient({ userId }: UserDetailsClientProps) {
  const { data, isPending, error } = useGetUserDetails(userId);

  if (isPending) {
    return <UserDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>Failed to load user details. Please try again.</span>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>User not found.</span>
      </div>
    );
  }

  const user = data.data;

  return <UserDetails data={user} />;
}
