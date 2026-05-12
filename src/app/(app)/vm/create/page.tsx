import { prisma } from "@/lib/prisma";
import { CreateForm } from "./create-form";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vms: true
    }
  });

  if (!user) redirect("/auth/signin");

  const ramUsed = user?.vms.reduce((total, vm) => total + vm.ram, 0);
  if (user.allowedRam - ramUsed <= 512) {
    return (
      <div className="mt-20 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">No RAM available</h1>
        <p className="text-sm text-balance text-muted-foreground">
          You have used all of your available RAM. Please delete some VMs or
          contact support to increase your RAM limit.
        </p>
        <Link href="/" className={buttonVariants()}>
          Go back to dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center md:p-10">
      <div className="w-full max-w-sm rounded-lg border bg-popover p-6">
        <CreateForm allowedRam={user.allowedRam} ramUsed={ramUsed} />
      </div>
    </div>
  );
}
