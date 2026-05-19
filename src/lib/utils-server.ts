import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

export async function checkSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user)
    return { success: false, user: undefined, session: undefined };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vms: true
    }
  });

  if (!user) return { success: false, user: undefined, session: undefined };
  return { success: true, user, session: session.session };
}
