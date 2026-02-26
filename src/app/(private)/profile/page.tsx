import { Suspense } from "react";

import { UserProfileData } from "@/types/user-profile";

import { UserProfileForm, UserProfileSkeleton } from "./components";
import profileData from "./data/profile.json";

export default function ProfilePage() {
  const userProfile = (profileData as UserProfileData).userProfile;

  return (
    <div className="space-y-6">
      <header className="text-navy flex items-center gap-2">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </header>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileForm initialValues={userProfile} />
      </Suspense>
    </div>
  );
}
