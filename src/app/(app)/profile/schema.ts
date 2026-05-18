import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email must be 255 characters or less")
});

export type ProfileSchema = typeof profileSchema;
