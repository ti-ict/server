import { Play, Power, RotateCw, Square, Trash } from "lucide-react";

export const vmActions: {
  key: string;
  icon: React.ReactNode;
  happening: string;
  completed: string;
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
    completed: "terminated"
  }
] as const;

export type VmAction = (typeof vmActions)[number];

export type Key = (typeof vmActions)[number]["key"];
