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
import { getTranslations } from "next-intl/server";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const t = await getTranslations("admin.users");
  const tc = await getTranslations("common");
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
        <H1>{t("title")}</H1>
      </div>

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
              placeholder={t("search")}
              defaultValue={search}
            />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
            {search && (
              <InputGroupAddon align="inline-end">
                <Link href="/admin/users">
                  <X className="size-4" />
                  {tc("clear")}
                </Link>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
      </form>

      {users.length === 0 && (
        <div className="flex w-full max-w-4xl items-center justify-center py-12 text-muted-foreground">
          <span className="text-sm font-medium">
            {search ? t("no_match") : t("none")}
          </span>
        </div>
      )}

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
                  {t("role", { role: cap(user.role) })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-3">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {t("allowed_ram")}
                </span>
                <span className="text-sm font-semibold">
                  {user.allowedRam / 1024} GiB
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {t("allowed_vcpus")}
                </span>
                <span className="text-sm font-semibold">
                  {user.allowedCpus} vCPUs
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden w-full max-w-4xl md:block">
        <Table className="mx-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">{t("email")}</TableHead>
              <TableHead>{t("role_heading")}</TableHead>
              <TableHead className="text-right">{t("allowed_ram")}</TableHead>
              <TableHead className="ml-auto text-right">
                {t("allowed_vcpus")}
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

      <div className="mt-2 flex w-full max-w-4xl flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-4 sm:flex-row">
        <span className="text-center text-xs font-medium text-muted-foreground sm:text-left">
          {t("showing", {
            from: totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1,
            to: Math.min(totalUsers, currentPage * pageSize),
            total: totalUsers
          })}
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
              {t("previous")}
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {t("previous")}
            </Button>
          )}

          <span className="px-2 text-xs font-medium text-muted-foreground">
            {t("page", { current: currentPage, total: totalPages })}
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
              {t("next")}
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {t("next")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
