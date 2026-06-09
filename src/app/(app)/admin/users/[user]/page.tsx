import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./profile-form";
import ClientButtons from "./client-buttons";
import { prisma } from "@/lib/prisma";

export default async function Page({
  params
}: {
  params: Promise<{ user: string }>;
}) {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const { user } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { id: user }
  });

  if (!dbUser) redirect("/admin/users");

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm rounded-lg p-6 sm:border sm:bg-popover">
        <EditProfileForm user={dbUser} className="mb-4" />

        <ClientButtons userId={dbUser.id} />
      </div>
    </div>
  );
}
