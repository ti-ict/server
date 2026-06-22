import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import VMCard from "@/components/vm-card";
import { prisma } from "@/lib/prisma";
import { checkSession } from "@/lib/utils-server";
import { Computer } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const session = await checkSession();
  const t = await getTranslations("vm.list");

  if (!session.success) redirect("/auth/signin");

  const ownVms = await prisma.vm.findMany({
    where: {
      userId: session.data.user.id
    }
  });

  const sharedVms = await prisma.sharedVm.findMany({
    where: {
      userId: session.data.user.id,
      accepted: true
    },
    include: {
      vm: { include: { user: true } }
    }
  });

  const vms = [
    ...ownVms,
    ...sharedVms.map((share) => ({
      ...share.vm,
      ownerName: share.vm.user.name
    }))
  ];

  if (vms.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Computer />
          </EmptyMedia>
          <EmptyTitle>{t("no_vms")}</EmptyTitle>
          <EmptyDescription>{t("no_vms_description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/vms/create">
            <Button>{t("create_first")}</Button>
          </Link>
        </EmptyContent>
      </Empty>
    );

  return (
    <div className="flex flex-row gap-4">
      {vms.map((vm) => (
        <VMCard key={vm.id} vm={vm} />
      ))}
    </div>
  );
}
