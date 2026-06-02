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
import VMSearch from "./search";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ user?: string }>;
}) {
  const { user } = await searchParams;
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const vms = await prisma.vm.findMany({
    include: {
      user: { select: { name: true } }
    },
    where: user ? { userId: user } : undefined
  });

  console.log(vms);

  const users = await prisma.user.findMany({});

  if (vms.length === 0)
    return (
      <div>
        <VMSearch users={users} />
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Computer />
            </EmptyMedia>
            <EmptyTitle>No VMs</EmptyTitle>
            <EmptyDescription>
              {user ? "This user " : "The server "} currently don&apos;t have
              any VMs {user ? "in their their account" : "."}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/vms/create">
              <Button>Create your first VM</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <VMSearch users={users} />
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        {vms.map((vm) => (
          <VMCard key={vm.id} vm={vm} ownerName={vm.user.name} />
        ))}
      </div>
    </div>
  );
}
