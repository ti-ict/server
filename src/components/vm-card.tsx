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
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  vm: Vm & { ownerName?: string };
  ownerName?: string;
};

export default async function VMCard({ vm, ownerName }: Props) {
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>
          <span className="flex- flex flex-row items-center gap-2">
            <Link href={`/vms/${vm.id}`} className="hover:underline">
              {vm.name}
            </Link>
            {vm.ownerName && (
              <Tooltip>
                <TooltipContent>
                  <p>Shared by {vm.ownerName}</p>
                </TooltipContent>
                <TooltipTrigger
                  render={
                    <Info
                      className="text-sm text-muted-foreground"
                      width={16}
                      height={16}
                    />
                  }
                ></TooltipTrigger>
              </Tooltip>
            )}
          </span>
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
