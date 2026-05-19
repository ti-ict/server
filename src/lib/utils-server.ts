import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { Session } from "better-auth";
import { User } from "@/generated/prisma/client";

export async function checkSession(): Promise<
  | {
      success: true;
      user: User;
      session: Session;
    }
  | {
      success: false;
      user: undefined;
      session: undefined;
    }
> {
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
