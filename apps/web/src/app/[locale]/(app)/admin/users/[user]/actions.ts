"use server";

import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { profileSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

export async function editProfileAction(data: {
  name: string;
  allowedRam: number;
  allowedCpus: number;
  id: string;
  role: string;
}): Promise<{ success: false; error: string } | { success: true }> {
  const session = await checkSession();
  const t = await getTranslations("admin.errors");

  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) return { success: false, error: t("invalid_form") };

  const { name, allowedRam, allowedCpus, role } = parsed.data;

  await prisma.user.update({
    where: { id: data.id },
    data: {
      name,
      allowedRam,
      allowedCpus,
      role
    }
  });

  revalidatePath("/admin/users");

  return { success: true };
}
