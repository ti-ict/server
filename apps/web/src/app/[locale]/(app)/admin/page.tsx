import { prisma } from "@/lib/prisma";
import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSystemStats } from "@/lib/resource-monitor";
import Loop from "./loop";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const session = await checkSession();
  const t = await getTranslations("admin");

  if (!session.success) redirect("/auth/signin");
  if (session.data.user.role !== "admin") redirect("/");

  const { _sum: ramUsed } = await prisma.vm.aggregate({
    _sum: {
      ram: true
    }
  });

  const totalUsers = await prisma.user.count();
  const totalVms = await prisma.vm.count();

  const ramMiB = ramUsed?.ram ?? 0;
  const ramGiB = (ramMiB / 1024).toFixed(2);

  const { _sum: cpusUsed } = await prisma.vm.aggregate({
    _sum: {
      cpu: true
    }
  });

  const { cpu: systemCpu, memory: systemMemory } = await getSystemStats();

  const buildDate = process.env.BUILD_DATE
    ? new Date(process.env.BUILD_DATE).toLocaleString()
    : "unknown";

  return (
    <div className="flex flex-col p-6">
      <h1 className="mb-6 text-2xl font-bold">{t("dashboard")}</h1>
      <div className="grow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("users.total")}</CardTitle>
              <CardDescription>{t("users.total_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{totalUsers}</div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/users" className={buttonVariants()}>
                {t("users.view")}
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("vms.total")}</CardTitle>
              <CardDescription>{t("vms.total_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{totalVms}</div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/vms" className={buttonVariants()}>
                {t("vms.view")}
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("ram_used")}</CardTitle>
              <CardDescription>{t("ram_used_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{ramGiB} GiB</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {ramMiB} MiB
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("vcpus_used")}</CardTitle>
              <CardDescription>{t("vcpus_used_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{cpusUsed?.cpu ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("system_cpu")}</CardTitle>
              <CardDescription>{t("system_cpu_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{systemCpu}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("system_memory")}</CardTitle>
              <CardDescription>{t("system_memory_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {systemMemory.percent}%
              </div>
            </CardContent>
          </Card>
        </div>
        <Loop />
      </div>
      <footer className="mt-auto p-4 text-center text-sm text-muted-foreground">
        {t("git_footer", {
          sha: process.env.GIT_COMMIT_SHA || "unknown",
          date: buildDate
        })}
      </footer>
    </div>
  );
}
