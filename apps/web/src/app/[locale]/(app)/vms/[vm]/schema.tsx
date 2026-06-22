import { Play, Power, RotateCw, Square, Trash } from "lucide-react";
import { z } from "zod";

export const vmActions: {
  key: string;
  icon: React.ReactNode;
  happening: string;
  completed: string;
  popOver?: boolean;
  notShowWhenShared?: boolean;
}[] = [
  {
    key: "start",
    icon: <Play />,
    happening: "starting",
    completed: "started"
  },
  {
    key: "shutdown",
    icon: <Power />,
    happening: "shutting down",
    completed: "shut down"
  },
  {
    key: "reboot",
    icon: <RotateCw />,
    happening: "rebooting",
    completed: "rebooted"
  },
  {
    key: "stop",
    icon: <Square />,
    happening: "stopping",
    completed: "stopped"
  },
  {
    key: "terminate",
    icon: <Trash />,
    happening: "terminating",
    completed: "terminated",
    popOver: true,
    notShowWhenShared: true
  }
] as const;

export const shareSchema = z.object({
  email: z
    .email()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
  allowActions: z.boolean().optional()
});

export type VmAction = (typeof vmActions)[number];

export type Key = (typeof vmActions)[number]["key"];

export type ShareSchema = z.infer<typeof shareSchema>;
