import { prisma } from "@/lib/prisma";
import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (!id || typeof id !== "string") redirect("/vms");

  const sharedVm = await prisma.sharedVm.findUnique({
    where: {
      id: id
    }
  });

  if (!sharedVm) redirect("/vms?error=This+invite+does+not+exist");
  if (sharedVm.accepted) redirect("/vms?error=VM+already+accepted");
  if (sharedVm.userId !== session.data.user.id)
    redirect("/vms?error=You+are+not+authorized+to+accept+this+VM");

  try {
    await prisma.sharedVm.update({
      where: {
        id: id
      },
      data: {
        accepted: true
      }
    });
  } catch {
    redirect("/vms?error=Invalid+accept+id");
  }

  redirect("/vms?message=VM+accepted+successfully");
}
