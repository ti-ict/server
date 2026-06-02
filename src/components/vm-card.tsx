import type { Vm } from "@/generated/prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "./ui/card";
import Link from "next/link";

type Props = {
  vm: Vm;
  ownerName?: string;
};

export default async function VMCard({ vm, ownerName }: Props) {
  return (
    <Card className="max-w-64 min-w-64">
      <CardHeader>
        <CardTitle>
          <Link href={`/vms/${vm.id}`} className="hover:underline">
            {vm.name}
          </Link>
        </CardTitle>
        <CardDescription>{vm.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>IP: {vm.ip}</p>
        <p>RAM: {vm.ram / 1024} GiB</p>
        <p>vCPUs: {vm.cpu}</p>
      </CardContent>
      {ownerName && (
        <CardFooter>
          <Link className="hover:underline" href={`/admin/users/${vm.userId}`}>
            {ownerName}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
