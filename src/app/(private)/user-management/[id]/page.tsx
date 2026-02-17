import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getUserDetails } from "@/data/user-details";

import { UserDetails, UserDetailsSkeleton } from "./components";

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function UserDetailsContent({ userId }: { userId: string }) {
  const data = await getUserDetails(userId);

  if (!data) {
    notFound();
  }

  return <UserDetails data={data} />;
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;

  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<UserDetailsSkeleton />}>
        <UserDetailsContent userId={id} />
      </Suspense>
    </section>
  );
}
