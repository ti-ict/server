import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  allowedRam: z.coerce
    .number()
    .min(0, "RAM must be at least 0 GiB")
    .max(24576, "You can only allocate up to 24 GiB.")
    .refine((val) => Number.isInteger(val), "RAM must be an integer"),
  allowedCpus: z.coerce
    .number()
    .min(1, "vCPUs must be at least 1")
    .max(16, "You can only allocate up to 16 vCPUs.")
    .refine((val) => Number.isInteger(val), "vCPUs must be an integer"),
  role: z.enum(["user", "admin"], {
    message: "Invalid role"
  })
});

export type ProfileSchema = z.Infer<typeof profileSchema>;
