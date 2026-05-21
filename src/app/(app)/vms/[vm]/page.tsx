import { H1, H2 } from "@/components/typography";
import { ButtonGroup } from "@/components/ui/button-group";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ActionButton } from "./action-button";
import { vmActions } from "./schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/copy-button";
import { checkSession } from "@/lib/utils-server";

export default async function Page({
  params
}: {
  params: Promise<{ vm: string }>;
}) {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  const { vm } = await params;

  const numberVm = parseInt(vm);

  if (isNaN(numberVm)) redirect("/");

  const dbVm = await prisma.vm.findUnique({
    where: {
      id: numberVm
    }
  });

  if (!dbVm) redirect("/");

  const sshCommand = `ssh ${dbVm.username}@${dbVm.ip}`;

  const sshConfig = `Host ${dbVm.name}
    HostName ${dbVm.ip}
    User ${dbVm.username}`;

  return (
    <div className="px-64 md:min-w-full">
      <div className="flex flex-row items-end gap-4">
        <H1>{dbVm.name}</H1>
        <span className="pb-1 text-muted-foreground">{dbVm.status}</span>
        <div className="ml-auto flex items-center gap-4">
          {/* Mobile */}
          <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {vmActions.map((action) => (
                  <ActionButton
                    key={action.key}
                    vmAction={action}
                    vmid={dbVm.id}
                    node={dbVm.node}
                    mobile
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop */}
          <ButtonGroup className="hidden md:flex">
            {vmActions.map((action) => (
              <ActionButton
                key={action.key}
                vmAction={action}
                vmid={dbVm.id}
                node={dbVm.node}
              />
            ))}
          </ButtonGroup>
        </div>
      </div>
      <H2 className="mt-5">Details</H2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">RAM</h3>
          <p className="text-muted-foreground">{dbVm.ram / 1024} GiB</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">vCPUs</h3>
          <p className="text-muted-foreground">{dbVm.cpu}</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">Username</h3>
          <div className="flex items-center">
            <p className="text-muted-foreground">{dbVm.username}</p>{" "}
            <CopyButton
              variant="outline"
              className="ml-auto text-muted-foreground"
              size="icon-sm"
              text={dbVm.username}
            />
          </div>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">IP Address</h3>
          <div className="flex items-center">
            <p className="text-muted-foreground">{dbVm.ip}</p>{" "}
            <CopyButton
              variant="outline"
              className="ml-auto text-muted-foreground"
              size="icon-sm"
              text={dbVm.ip}
            />
          </div>
        </div>
        <div className="hidden rounded-md border p-4 md:block">
          <h3 className="text-lg font-medium">SSH Command</h3>
          <div className="flex">
            <pre className="text-muted-foreground">{sshCommand}</pre>
            <CopyButton
              variant="outline"
              className="ml-auto text-muted-foreground"
              size="icon-sm"
              text={sshCommand}
            />
          </div>
        </div>
        <div className="hidden rounded-md border p-4 md:block">
          <h3 className="text-lg font-medium">SSH Config</h3>
          <div className="flex">
            <pre className="text-muted-foreground">{sshConfig}</pre>
            <CopyButton
              variant="outline"
              className="ml-auto text-muted-foreground"
              size="icon-sm"
              text={sshConfig}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
