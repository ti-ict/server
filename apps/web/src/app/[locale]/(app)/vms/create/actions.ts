"use server";

import { CreateVmSchema, createVmSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { proxmoxClient, waitForTask } from "@/lib/proxmox";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/utils-server";
import { getTranslations } from "next-intl/server";

export async function createVmAction(
  data: CreateVmSchema
): Promise<
  { success: false; error: string } | { success: true; vmId: number }
> {
  const session = await checkSession();
  const t = await getTranslations("vm.errors");
  const tc = await getTranslations("common.errors");

  if (!session.success) return { success: false, error: tc("unauthorized") };

  const user = await prisma.user.findUnique({
    where: { id: session.data.user.id },
    include: {
      vms: true
    }
  });

  if (!user) {
    console.error("User not found in database");
    return { success: false, error: tc("user_not_found") };
  }

  const ramUsed = user?.vms.reduce((total, vm) => total + vm.ram, 0);
  const cpuUsed = user?.vms.reduce((total, vm) => total + vm.cpu, 0);

  const result = createVmSchema(
    user?.allowedRam,
    ramUsed,
    user?.allowedCpus,
    cpuUsed
  ).safeParse(data);

  if (!result.success)
    return { success: false, error: tc("invalid_form_data") };
  const { hostname, sshKey, ram, cpu } = result.data;

  if (user.allowedRam - ramUsed < ram || user.allowedCpus - cpuUsed < cpu)
    return { success: false, error: t("not_enough_resources") };

  const newid = await prisma.vm
    .findFirst({
      orderBy: {
        id: "desc"
      },
      select: {
        id: true
      }
    })
    .then((vm) => (vm ? vm.id + 1 : 100));

  const usedIps = new Set(
    (
      await prisma.vm.findMany({
        select: { ip: true }
      })
    )
      .map((vm) => vm.ip)
      .filter(Boolean)
  );

  let ip: string | null = null;
  for (let third = 100; third <= 103 && !ip; third++) {
    for (let fourth = 2; fourth <= 254 && !ip; fourth++) {
      const candidate = `172.16.${third}.${fourth}`;
      if (!usedIps.has(candidate)) {
        ip = candidate;
      }
    }
  }

  if (!ip) {
    return {
      success: false,
      error: t("no_ips_available", { range: "172.16.100.2-172.16.103.254" })
    };
  }

  try {
    await prisma.vm.create({
      data: {
        id: newid,
        name: hostname,
        ram,
        cpu,
        ip,
        status: "provisioning",
        node: "proxmox-1",
        username: "debian",
        userId: user.id
      }
    });

    const cloneTask = await proxmoxClient.nodes
      .$("proxmox-1")
      .qemu.$(9000)
      .clone.$post({
        newid,
        name: hostname,
        full: true,
        storage: "local-lvm"
      });

    const cloneResult = await waitForTask("proxmox-1", cloneTask);

    if (!cloneResult.success) throw new Error(cloneResult.error);

    await proxmoxClient.nodes.$("proxmox-1").qemu.$(newid).resize.$put({
      disk: "scsi0",
      size: "+20G"
    });

    // 3. apply cloud-init
    await proxmoxClient.nodes
      .$("proxmox-1")
      .qemu.$(newid)
      .config.$post({
        memory: ram.toString(),
        cores: cpu,
        ciuser: "debian",
        sshkeys: encodeURIComponent(sshKey.trim()),
        net0: "virtio,bridge=vmbr0,tag=30",
        ipconfig0: `ip=${ip}/22,gw=172.16.100.1`,
        agent: "enabled=1",
        onboot: true
      });

    // 4. start
    await proxmoxClient.nodes
      .$("proxmox-1")
      .qemu.$(newid)
      .status.start.$post({});

    await prisma.vm.update({
      where: { id: newid },
      data: { status: "running" }
    });
  } catch (error) {
    console.error("Error creating VM:", error);
    await prisma.vm.delete({
      where: { id: newid }
    });

    return { success: false, error: t("create_failed") };
  }

  revalidatePath(`/vms/${newid}`);

  return { success: true, vmId: newid };
}
