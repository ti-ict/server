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
    .max(255, "Email must be 255 characters or less"),
  allowedRam: z.coerce
    .number()
    .min(1024, "RAM must be at least 1 GiB")
    .max(24576, "You can only allocate up to 24 GiB.")
    .refine((val) => Number.isInteger(val), "RAM must be an integer")
});

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password must be 255 characters or less"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password must be 255 characters or less"),
    destroySessions: z.boolean().default(false)
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type ProfileSchema = z.Infer<typeof profileSchema>;
export type PasswordSchema = z.Infer<typeof passwordSchema>;
