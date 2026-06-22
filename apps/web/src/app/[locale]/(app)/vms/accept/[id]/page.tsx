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

  if (!sharedVm) redirect("/vms?error=invite_not_found");
  if (sharedVm.accepted) redirect("/vms?error=already_accepted");
  if (sharedVm.userId !== session.data.user.id)
    redirect("/vms?error=not_authorized");

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
    redirect("/vms?error=invalid_id");
  }

  redirect("/vms?message=accepted");
}
