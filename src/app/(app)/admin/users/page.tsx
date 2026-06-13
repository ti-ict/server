import { H1 } from "@/components/typography";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cap } from "@/lib/utils";
import { checkSession } from "@/lib/utils-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10) || 1;
  const pageSize = 10;
  const search = searchParam?.trim() || undefined;

  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const where = search
    ? { email: { contains: search, mode: "insensitive" as const } }
    : {};

  const totalUsers = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      role: true,
      allowedRam: true,
      allowedCpus: true
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { role: "asc" }
  });

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4">
      <div className="relative flex w-full max-w-4xl items-center justify-center">
        <H1>User Management</H1>
      </div>

      {/* Search */}
      <form
        method="get"
        action="/admin/users"
        className="flex w-full max-w-4xl items-center gap-2"
      >
        <div className="relative flex-1">
          <InputGroup>
            <InputGroupInput
              name="search"
              type="search"
              placeholder="Search by email..."
              defaultValue={search}
            />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
            {search && (
              <InputGroupAddon align="inline-end">
                <Link href="/admin/users">
                  <X className="size-4" />
                  Clear
                </Link>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
      </form>

      {users.length === 0 && (
        <div className="flex w-full max-w-4xl items-center justify-center py-12 text-muted-foreground">
          <span className="text-sm font-medium">
            {search ? "No users match your search." : "No users found."}
          </span>
        </div>
      )}

      {/* Mobile Card Layout */}
      <div className="flex w-full max-w-4xl flex-col gap-3 md:hidden">
        {users.map((user) => (
          <Card key={user.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-1">
                <Link
                  className="text-base font-bold break-all text-primary hover:underline"
                  href={`/admin/users/${user.id}`}
                >
                  {user.email}
                </Link>
                <div className="text-xs text-muted-foreground">
                  Role:{" "}
                  <span className="font-semibold text-foreground">
                    {cap(user.role)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-3">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">
                  Allowed RAM
                </span>
                <span className="text-sm font-semibold">
                  {user.allowedRam / 1024} GiB
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">
                  Allowed vCPUs
                </span>
                <span className="text-sm font-semibold">
                  {user.allowedCpus} vCPUs
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden w-full max-w-4xl md:block">
        <Table className="mx-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Allowed RAM</TableHead>
              <TableHead className="ml-auto text-right">
                Allowed vCPUs
              </TableHead>
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

      {/* Pagination Controls */}
      <div className="mt-2 flex w-full max-w-4xl flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-4 sm:flex-row">
        <span className="text-center text-xs font-medium text-muted-foreground sm:text-left">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(totalUsers, currentPage * pageSize)}
          </span>{" "}
          of <span className="font-semibold text-foreground">{totalUsers}</span>{" "}
          users
        </span>

        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Button
              variant="outline"
              render={
                <Link
                  href={`/admin/users?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                />
              }
            >
              Previous
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Previous
            </Button>
          )}

          <span className="px-2 text-xs font-medium text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Button
              variant="outline"
              render={
                <Link
                  href={`/admin/users?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                />
              }
            >
              Next
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
