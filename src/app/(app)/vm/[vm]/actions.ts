"use server";

import { proxmoxClient, waitForTask } from "@/lib/proxmox";
import type { Key } from "./schema";

export async function proxmoxVmAction(vmid: number, node: string, action: Key) {
  switch (action) {
    case "start":
      const result = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.start.$post();
      const waitedStart = await waitForTask(node, result);
      if (!waitedStart.success) throw new Error(waitedStart.error);
      return waitedStart;
    case "shutdown":
      const shutdownResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.shutdown.$post();
      const waitedShutdown = await waitForTask(node, shutdownResult);
      if (!waitedShutdown.success) throw new Error(waitedShutdown.error);
      return waitedShutdown;
    case "reboot":
      const rebootResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.reboot.$post();
      const waitedReboot = await waitForTask(node, rebootResult);
      if (!waitedReboot.success) throw new Error(waitedReboot.error);
      return waitedReboot;
    case "stop":
      const stopResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.stop.$post();
      const waitedStop = await waitForTask(node, stopResult);
      if (!waitedStop.success) throw new Error(waitedStop.error);
      return waitedStop;
  }
}
