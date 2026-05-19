"use server";

import { proxmoxClient, waitForTask } from "@/lib/proxmox";
import type { Key } from "./schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkSession } from "@/lib/utils-server";

export async function proxmoxVmAction(vmid: number, node: string, action: Key) {
  const { success, user } = await checkSession();
  if (!success) redirect("/auth/signin");

  const vm = await prisma.vm.findUnique({
    where: {
      id: vmid
    }
  });

  if (!vm) throw new Error("VM not found");
  if (vm.userId !== user.id) redirect("/");

  switch (action) {
    case "start":
      const result = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.start.$post();
      const waitedStart = await waitForTask(node, result);
      if (!waitedStart.success) throw new Error(waitedStart.error);
      await prisma.vm.update({
        where: {
          id: vmid
        },
        data: {
          status: "running"
        }
      });
      revalidatePath(`/vm/${vmid}`);
      return waitedStart;
    case "shutdown":
      const shutdownResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.shutdown.$post();
      const waitedShutdown = await waitForTask(node, shutdownResult);
      if (!waitedShutdown.success) throw new Error(waitedShutdown.error);
      await prisma.vm.update({
        where: {
          id: vmid
        },
        data: {
          status: "stopped"
        }
      });
      revalidatePath(`/vm/${vmid}`);
      return waitedShutdown;
    case "reboot":
      const rebootResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.reboot.$post();
      const waitedReboot = await waitForTask(node, rebootResult);
      if (!waitedReboot.success) throw new Error(waitedReboot.error);
      await prisma.vm.update({
        where: {
          id: vmid
        },
        data: {
          status: "running"
        }
      });
      revalidatePath(`/vm/${vmid}`);
      return waitedReboot;
    case "stop":
      const stopResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.stop.$post();
      const waitedStop = await waitForTask(node, stopResult);
      if (!waitedStop.success) throw new Error(waitedStop.error);
      await prisma.vm.update({
        where: {
          id: vmid
        },
        data: {
          status: "stopped"
        }
      });
      revalidatePath(`/vm/${vmid}`);
      return waitedStop;
    case "terminate":
      const terminateStopResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .status.stop.$post();
      const waitedStopTerminate = await waitForTask(node, terminateStopResult);
      if (!waitedStopTerminate.success)
        throw new Error(waitedStopTerminate.error);
      await prisma.vm.update({
        where: {
          id: vmid
        },
        data: {
          status: "stopped"
        }
      });
      revalidatePath(`/vm/${vmid}`);
      const deleteResult = await proxmoxClient.nodes
        .$(node)
        .qemu.$(vmid)
        .$delete({ "destroy-unreferenced-disks": true, purge: true });
      const waitedDelete = await waitForTask(node, deleteResult);
      if (!waitedDelete.success) throw new Error(waitedDelete.error);
      await prisma.vm.delete({
        where: {
          id: vmid
        }
      });
      revalidatePath("/");
      redirect("/");
  }
}
