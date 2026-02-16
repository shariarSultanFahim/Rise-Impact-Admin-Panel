import type { LessonType } from "@/types/course-form";

const RESOURCE_BASE_URL = "https://cdn.riseimpact.io/course-resources";
const MAX_RESOURCE_SIZE = 50 * 1024 * 1024;

const RESOURCE_FOLDERS: Record<LessonType, string> = {
  video: "videos",
  reading: "reading",
  assignment: "assignments"
};

const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

export async function uploadLessonResource(file: File, type: LessonType): Promise<string> {
  if (!file) {
    throw new Error("Select a file before uploading.");
  }

  if (file.size > MAX_RESOURCE_SIZE) {
    throw new Error("File size exceeds 50MB. Upload a smaller file.");
  }

  await sleep(700);

  const extension = file.name.split(".").pop() ?? "bin";
  const fileKey = `${crypto.randomUUID()}.${extension}`;

  return `${RESOURCE_BASE_URL}/${RESOURCE_FOLDERS[type]}/${fileKey}`;
}
