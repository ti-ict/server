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

export default async function Page() {
  const session = await checkSession();
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

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalUsers}</div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/users" className={buttonVariants()}>
              View Users
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total VMs</CardTitle>
            <CardDescription>Virtual machines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalVms}</div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/vms" className={buttonVariants()}>
              View VMs
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RAM Used</CardTitle>
            <CardDescription>Total allocated RAM</CardDescription>
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
            <CardTitle>vCPUs Used</CardTitle>
            <CardDescription>Total used vCPUs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{cpusUsed?.cpu ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System CPU</CardTitle>
            <CardDescription>Current system CPU usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{systemCpu}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Memory</CardTitle>
            <CardDescription>Current system memory usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {systemMemory.percent}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
