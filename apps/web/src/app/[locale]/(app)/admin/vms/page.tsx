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
import { getTranslations } from "next-intl/server";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ user?: string; page?: string }>;
}) {
  const { user, page: pageParam } = await searchParams;
  const t = await getTranslations("admin.vms");
  const page = parseInt(pageParam || "1", 10) || 1;
  const pageSize = 12;

  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const whereClause = user ? { userId: user } : undefined;

  const totalVms = await prisma.vm.count({
    where: whereClause
  });

  const totalPages = Math.ceil(totalVms / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const vms = await prisma.vm.findMany({
    include: {
      user: { select: { name: true } }
    },
    where: whereClause,
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { id: "asc" }
  });

  const users = await prisma.user.findMany({});

  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (user) params.set("user", user);
    params.set("page", String(pageNumber));
    return `/admin/vms?${params.toString()}`;
  };

  if (totalVms === 0)
    return (
      <div>
        <VMSearch users={users} />
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Computer />
            </EmptyMedia>
            <EmptyTitle>{t("no_vms")}</EmptyTitle>
            <EmptyDescription>
              {user ? t("this_user") : t("server")}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/vms/create">
              <Button>{t("create_first")}</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4">
      <VMSearch users={users} />
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        {vms.map((vm) => (
          <VMCard key={vm.id} vm={vm} ownerName={vm.user.name} />
        ))}
      </div>

      <div className="mt-4 flex w-full max-w-4xl flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-4 sm:flex-row">
        <span className="text-center text-xs font-medium text-muted-foreground sm:text-left">
          {t("showing", {
            from: totalVms === 0 ? 0 : (currentPage - 1) * pageSize + 1,
            to: Math.min(totalVms, currentPage * pageSize),
            total: totalVms
          })}
        </span>

        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Button
              variant="outline"
              render={<Link href={buildPageUrl(currentPage - 1)} />}
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
              render={<Link href={buildPageUrl(currentPage + 1)} />}
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
