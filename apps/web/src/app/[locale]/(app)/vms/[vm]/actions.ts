"use server";

import { proxmoxClient, waitForTask } from "@/lib/proxmox";
import { shareSchema, type Key, type ShareSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkSession, resolveVm } from "@/lib/utils-server";
import { ShareVMTemplate } from "@/components/email/share-vm";
import { resend } from "@/lib/resend";
import { getTranslations } from "next-intl/server";

export async function proxmoxVmAction(vmid: number, node: string, action: Key) {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  const vm = await resolveVm(vmid, session.data.user);

  if (!vm) throw new Error("VM not found");
  if (vm.userId !== session.data.user.id && !vm.allowActions)
    throw new Error("Action not allowed");

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
      if (vm.shared) throw new Error("Cannot terminate a shared VM");
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

  const te = await getTranslations("vm.errors");
  const temail = await getTranslations("email");

  const result = shareSchema.safeParse(data);

  if (!result.success) return { success: false, error: te("email_invalid") };

  const { email, allowActions } = result.data;

  if (!email.endsWith(`@${process.env.USER_DOMAIN}`))
    return {
      success: false,
      error: te("not_org")
    };

  const invitedUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!invitedUser) return { success: false, error: te("user_not_found") };

  const vm = await resolveVm(data.vmId, session.data.user, { noShared: true });

  if (!vm) return { success: false, error: te("cant_share") };

  // prevent sharing with yourself, admins can share other's vms with themselves
  if (
    invitedUser.id === session.data.user.id &&
    vm.userId === session.data.user.id
  )
    return { success: false, error: te("cant_share_self") };

  const { id: sharedVmId } = await prisma.sharedVm.create({
    data: {
      vmId: data.vmId,
      userId: invitedUser.id,
      allowActions
    }
  });

  try {
    const { error } = await resend.emails.send({
      from: temail("from"),
      to: [email],
      subject: temail("subject"),
      react: ShareVMTemplate({
        name: invitedUser.name,
        sharedBy: session.data.user.name,
        vmName: vm.name,
        acceptId: sharedVmId,
        locale: "en" // default to English for email
      })
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: te("email_failed") };
  }
}
