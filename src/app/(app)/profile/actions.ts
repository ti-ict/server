"use server";

import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { profileSchema } from "./schema";
import { prisma } from "@/lib/prisma";

export async function editProfileAction(data: {
  email: string;
  name: string;
}): Promise<{ success: false; error: string } | { success: true }> {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) return { success: false, error: "Invalid form data" };

  const { name, email } = parsed.data;

  await prisma.user
    .findUnique({
      where: { email },
      select: { id: true }
    })
    .then((existingUser) => {
      if (existingUser && existingUser.id !== session.data.user.id) {
        return { success: false, error: "Email already in use" };
      }
    });

  await prisma.user.update({
    where: { id: session.data.user.id },
    data: {
      name,
      email
    }
  });

  return { success: true };
}
