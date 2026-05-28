import { H1 } from "@/components/typography";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { cap } from "@/lib/utils";
import { checkSession } from "@/lib/utils-server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      allowedRam: true,
      allowedCpus: true
    },
    take: 100,
    orderBy: { role: "asc" }
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative flex w-full max-w-4xl items-center justify-center">
        <H1>User Management</H1>
      </div>

      <Table className="mx-auto w-full max-w-4xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Allowed RAM</TableHead>
            <TableHead className="ml-auto text-right">Allowed vCPUs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <Link
                  className="font-bold hover:underline"
                  href={`/admin/users/${user.id}`}
                >
                  {user.email}
                </Link>
              </TableCell>

              <TableCell>{cap(user.role)}</TableCell>
              <TableCell className="text-right">
                {user.allowedRam / 1024} GiB
              </TableCell>
              <TableCell className="text-right">{user.allowedCpus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
