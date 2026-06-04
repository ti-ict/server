"use server";

import { proxmoxClient, waitForTask } from "@/lib/proxmox";
import { shareSchema, type Key, type ShareSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkSession } from "@/lib/utils-server";
import { ShareVMTemplate } from "@/components/email/share-vm";
import { resend } from "@/lib/resend";

export async function proxmoxVmAction(vmid: number, node: string, action: Key) {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  const vm = await prisma.vm.findUnique({
    where: {
      id: vmid
    }
  });

  if (!vm) throw new Error("VM not found");
  if (
    (!vm || vm.userId !== session.data.user.id) &&
    (!vm || session.data.user.role !== "admin")
  )
    redirect("/");

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

export async function inviteAction(
  data: ShareSchema & { vmId: number }
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  const result = shareSchema.safeParse(data);

  if (!result.success)
    return { success: false, error: "Invalid email address" };

  const { email } = result.data;

  if (!email.endsWith(`@${process.env.USER_DOMAIN}`))
    return {
      success: false,
      error:
        "This user is not part of the organization and cannot be shared with"
    };

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) return { success: false, error: "User not found" };
  if (user.id === session.data.user.id)
    return { success: false, error: "You cannot share a VM with yourself" };

  const vm = await prisma.vm.findUnique({
    where: { id: data.vmId }
  });

  if (!vm) return { success: false, error: "VM not found" };

  if (vm.userId !== session.data.user.id && session.data.user.role !== "admin")
    return {
      success: false,
      error: "You do not have permission to share this VM"
    };

  const { id: sharedVmId } = await prisma.sharedVm.create({
    data: {
      vmId: data.vmId,
      userId: user.id
    }
  });

  try {
    const { error } = await resend.emails.send({
      from: "TI-ICT VMs <noreply@ti-ict.be>",
      to: [email],
      subject: "You've been invited to access a VM",
      react: ShareVMTemplate({
        name: user.name,
        sharedBy: session.data.user.name,
        vmName: vm.name,
        acceptId: sharedVmId
      })
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send invitation email" };
  }
}
