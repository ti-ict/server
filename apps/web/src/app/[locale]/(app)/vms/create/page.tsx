import { prisma } from "@/lib/prisma";
import { CreateForm } from "./create-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { checkSession } from "@/lib/utils-server";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const session = await checkSession();
  const t = await getTranslations("vm.create");

  if (!session.success) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.data.user.id },
    include: {
      vms: true
    }
  });

  if (!user) redirect("/auth/signin");

  const ramUsed = user?.vms.reduce((total, vm) => total + vm.ram, 0);
  const cpuUsed = user?.vms.reduce((total, vm) => total + vm.cpu, 0);

  if (user.allowedRam - ramUsed <= 512 || user.allowedCpus - cpuUsed <= 0) {
    return (
      <div className="mt-20 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">{t("no_resources")}</h1>
        <p className="text-sm text-balance text-muted-foreground">
          {t("no_resources_description")}
        </p>
        <Link href="/" className={buttonVariants()}>
          {t("go_back")}
        </Link>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm rounded-lg p-6 sm:border sm:bg-popover">
        <CreateForm
          allowedRam={user.allowedRam}
          ramUsed={ramUsed}
          allowedCpus={user.allowedCpus}
          cpuUsed={cpuUsed}
        />
      </div>
    </div>
  );
}
