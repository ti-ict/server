"use server";

import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { addUserSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function addUserAction(data: {
  email: string;
  name: string;
  allowedRam: number;
}): Promise<{ success: false; error: string } | { success: true }> {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const parsed = addUserSchema.safeParse(data);

  if (!parsed.success) return { success: false, error: "Invalid form data" };

  const { name, email, allowedRam, password } = parsed.data;

  const { user } = await auth.api.createUser({
    body: { name, email, password }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      allowedRam
    }
  });

  revalidatePath("/admin/users");

  return { success: true };
}
