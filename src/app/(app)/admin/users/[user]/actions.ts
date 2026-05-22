"use server";

import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { profileSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function editProfileAction(data: {
  email: string;
  name: string;
  allowedRam: number;
  id: string;
}): Promise<{ success: false; error: string } | { success: true }> {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) return { success: false, error: "Invalid form data" };

  const { name, email, allowedRam } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (existingUser && existingUser.id !== data.id)
    return { success: false, error: "Email already in use" };

  await prisma.user.update({
    where: { id: data.id },
    data: {
      name,
      email,
      allowedRam
    }
  });

  revalidatePath("/admin/users");

  return { success: true };
}
