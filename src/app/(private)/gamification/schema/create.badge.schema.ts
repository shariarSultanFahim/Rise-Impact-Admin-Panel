import zod from "zod";

const MAX_FILE_SIZE = 5000000; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreateBadgeSchema = zod.object({
  name: zod.string().min(1, "Badge name is required"),
  description: zod.string().min(1, "Badge description is required"),
  criteria: zod.string().min(1, "Unlock criteria is required"),
  icon: zod
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 1MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
});

export type CreateBadgeFormData = zod.infer<typeof CreateBadgeSchema>;
