"use client";

import { useRouter } from "next/navigation";

export default function CourseEditPage() {
  const router = useRouter();
  router.push("/courses");
}
