import type { Vm } from "@/generated/prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "./ui/card";
import Link from "next/link";

type Props = {
  vm: Vm;
};

export default function VMCard({ vm }: Props) {
  return (
    <Card>
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
    </Card>
  );
}
