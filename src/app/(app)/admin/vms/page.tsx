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

export default async function Page() {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const vms = await prisma.vm.findMany();

  if (vms.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Computer />
          </EmptyMedia>
          <EmptyTitle>No VMs</EmptyTitle>
          <EmptyDescription>
            You currently don&apos;t have any VMs in your account.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/vms/create">
            <Button>Create your first VM</Button>
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
