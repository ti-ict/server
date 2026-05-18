import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { User } from "@/generated/prisma/client";

export async function checkSession(): Promise<
  { success: false; user: undefined } | { success: true; user: User }
> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return { success: false, user: undefined };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vms: true
    }
  });

  if (!user) return { success: false, user: undefined };
  return { success: true, user };
}
