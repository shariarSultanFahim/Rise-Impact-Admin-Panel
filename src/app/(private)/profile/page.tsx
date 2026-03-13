"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useGetUsersProfile } from "@/lib/api/profile/get-profile";

import { UserProfileForm, UserProfileSkeleton } from "./components";

export default function ProfilePage() {
  const getUsersProfileQuery = useGetUsersProfile();

  useEffect(() => {
    if (getUsersProfileQuery.isError) {
      toast.error("Unable to load profile data.");
    }
  }, [getUsersProfileQuery.isError]);

  return (
    <div className="space-y-6">
      <header className="text-navy flex items-center gap-2">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </header>

      {getUsersProfileQuery.isPending && <UserProfileSkeleton />}
      {!getUsersProfileQuery.isPending && getUsersProfileQuery.data && (
        <UserProfileForm initialValues={getUsersProfileQuery.data} />
      )}
    </div>
  );
}
