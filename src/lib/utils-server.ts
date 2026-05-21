import { headers } from "next/headers";
import { auth } from "./auth";

export async function checkSession(): Promise<
  | {
      success: true;
      data: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
    }
  | {
      success: false;
      data: undefined;
    }
> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) return { success: false, data: undefined };

  return { success: true, data: session };
}
