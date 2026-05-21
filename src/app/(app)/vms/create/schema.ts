import { sshPublicKeySchema } from "@/lib/zods";
import { z } from "zod";

const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

export const createVmSchema = (
  maxRam: number,
  ramUsed: number,
  maxCpu: number,
  cpuUsed: number
) =>
  z.object({
    hostname: z
      .string()
      .min(1, "Hostname is required")
      .max(63, "Hostname must be 63 characters or less")
      .regex(
        hostnameRegex,
        "Hostname must only contain letters, numbers, and hyphens, and cannot start or end with a hyphen"
      ),
    sshKey: sshPublicKeySchema,
    ram: z.coerce
      .number()
      .min(512, "RAM must be at least 512 MiB")
      .max(maxRam - ramUsed, `You can only allocate ${maxRam - ramUsed} MiB.`)
      .refine((val) => Number.isInteger(val), "RAM must be an integer"),
    cpu: z.coerce
      .number()
      .min(1, "You must allocate at least 1 vCPU")
      .max(maxCpu - cpuUsed, `You can only allocate ${maxCpu - cpuUsed} vCPUs.`)
      .refine((val) => Number.isInteger(val), "vCPU must be an integer")
  });

export type CreateVmSchema = typeof createVmSchema;
