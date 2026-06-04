import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { Vm } from "@/generated/prisma/client";

export async function checkSession(): Promise<
  | {
      success: true;
      data: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
    }
  | {
      success: false;
      data: undefined;
    }
> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) return { success: false, data: undefined };

  return { success: true, data: session };
}
export async function resolveVm(
  vmId: number,
  user: { id: string; role?: string | null },
  options?: { noShared?: boolean; onlyAdmin?: boolean }
): Promise<(Vm & { shared: boolean }) | null> {
  if (options?.onlyAdmin && user.role !== "admin") return null;

  if (user.role === "admin") {
    const vm = await prisma.vm.findUnique({
      where: { id: vmId },
      include: {
        sharedVms: {
          where: { userId: user.id, accepted: true },
          take: 1
        }
      }
    });
    if (!vm) return null;
    const { sharedVms, ...rest } = vm;
    return { ...rest, shared: sharedVms.length > 0 };
  }

  if (options?.noShared) {
    const vm = await prisma.vm.findFirst({
      where: { id: vmId, userId: user.id }
    });
    return vm ? { ...vm, shared: false } : null;
  }

  const vm = await prisma.vm.findFirst({
    where: {
      id: vmId,
      OR: [
        { userId: user.id },
        { sharedVms: { some: { userId: user.id, accepted: true } } }
      ]
    },
    include: {
      sharedVms: {
        where: { userId: user.id, accepted: true },
        take: 1
      }
    }
  });

  if (!vm) return null;
  const { sharedVms, ...rest } = vm;
  return { ...rest, shared: sharedVms.length > 0 };
}
