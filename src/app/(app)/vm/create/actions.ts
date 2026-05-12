"use server";

import { headers } from "next/headers";
import { createVmSchema } from "./schema";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { proxmoxClient, waitForTask } from "@/lib/proxmox";
import { generateId } from "better-auth";

export async function createVmAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vms: true,
    },
  });

  if (!user) {
    console.error("User not found in database");
    return;
  }

  const ramUsed = user?.vms.reduce((total, vm) => total + vm.ram, 0);

  const result = createVmSchema(user?.allowedRam, ramUsed).safeParse(
    Object.fromEntries(formData),
  );

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const { hostname, sshKey, ram } = result.data;

  console.log(hostname, sshKey, ram);

  const newid = await prisma.vm
    .findFirst({
      orderBy: {
        proxmoxId: "desc",
      },
      select: {
        proxmoxId: true,
      },
    })
    .then((vm) => (vm ? vm.proxmoxId + 1 : 100));

  const ip = `172.16.100.${newid}`;

  const dbVm = await prisma.vm.create({
    data: {
      id: generateId(),
      name: hostname,
      ram,
      ip,
      proxmoxId: newid,
      status: "provisioning",
      node: "proxmox-1",
      username: "ubuntu",
      userId: user.id,
    },
  });

  (async () => {
    const cloneTask = await proxmoxClient.nodes
      .$("proxmox-1")
      .qemu.$(9000)
      .clone.$post({
        newid,
        name: hostname,
        full: true,
        storage: "local-lvm",
      });

    await waitForTask("proxmox-1", cloneTask);

    await proxmoxClient.nodes.$("proxmox-1").qemu.$(newid).resize.$put({
      disk: "scsi0",
      size: "+20G",
    });

    // 3. apply cloud-init
    await proxmoxClient.nodes
      .$("proxmox-1")
      .qemu.$(newid)
      .config.$post({
        ciuser: "ubuntu",
        cipassword: "password",
        sshkeys: encodeURIComponent(sshKey.trim()),
        net0: "virtio,bridge=vmbr0,tag=30",
        ipconfig0: `ip=${ip}/22,gw=172.16.100.1`,
        agent: "enabled=1",
      });

    // 4. start
    await proxmoxClient.nodes
      .$("proxmox-1")
      .qemu.$(newid)
      .status.start.$post({});

    await prisma.vm.update({
      where: { id: dbVm.id },
      data: { status: "running" },
    });
  })();

  return redirect(`/vm/${newid}`);
}
