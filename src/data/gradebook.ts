import type { GradebookData } from "@/types/gradebook";

import gradebookData from "./gradebook.json";

export async function getGradebookData(): Promise<GradebookData> {
  return gradebookData as GradebookData;
}
