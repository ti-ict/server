import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Computer } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/auth/signin");

  const vms = await prisma.vm.findMany({
    where: {
      userId: session.user.id
    }
  });

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
          <Link href="/vm/create">
            <Button>Create your first VM</Button>
          </Link>
        </EmptyContent>
      </Empty>
    );
}
