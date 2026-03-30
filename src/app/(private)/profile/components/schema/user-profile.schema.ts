import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.email("Enter a valid email"),
  role: z.string(),
  status: z.string(),
  verified: z.boolean(),
  phone: z.string().min(6, "Enter a valid phone number"),
  location: z.string().min(3, "Enter a valid location"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  profilePicture: z.string().optional(),
  avatarFile: z.instanceof(File).optional()
});
