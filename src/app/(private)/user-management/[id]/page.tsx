"use client";

import { useParams } from "next/navigation";

import UserDetailsClient from "./components/user-details-client";

export default function UserDetailsPage() {
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!userId) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <UserDetailsClient userId={userId} />
    </section>
  );
}
