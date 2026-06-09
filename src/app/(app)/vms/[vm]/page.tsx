import { H1, H2 } from "@/components/typography";
import { ButtonGroup } from "@/components/ui/button-group";
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
import { checkSession, resolveVm } from "@/lib/utils-server";
import ShareButton from "./share-button";
import { prisma } from "@/lib/prisma";

export default async function Page({
  params
}: {
  params: Promise<{ vm: string }>;
}) {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  const { vm: vmId } = await params;

  const numberVm = parseInt(vmId);

  if (isNaN(numberVm)) redirect("/");

  const vm = await resolveVm(numberVm, session.data.user);
  if (!vm) redirect("/");

  const owner = vm.shared
    ? await prisma.user.findUnique({ where: { id: vm.userId } })
    : session.data.user;

  const sshCommand = `ssh ${vm.username}@${vm.ip}`;

  const sshConfig = `Host ${vm.name}
    HostName ${vm.ip}
    User ${vm.username}`;

  return (
    <div className="px-64 md:min-w-full">
      <div className="flex flex-row items-end gap-4">
        <H1>{vm.name}</H1>
        <span className="pb-1 text-muted-foreground">{vm.status}</span>
        <div className="ml-auto flex items-center gap-4">
          {vm.allowActions && (
            <>
              {/* Mobile */}
              <div className="flex md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="outline">Actions</Button>}
                  ></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {vmActions.map((action) => (
                      <ActionButton
                        key={action.key}
                        vmAction={action}
                        vmid={vm.id}
                        node={vm.node}
                        shared={vm.shared}
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
                    vmid={vm.id}
                    node={vm.node}
                    shared={vm.shared}
                  />
                ))}
              </ButtonGroup>
            </>
          )}
        </div>
      </div>
      <H2 className="mt-5 flex w-full flex-row items-center gap-4">
        Details
        {vm.shared ? (
          <p className="ml-auto text-sm text-muted-foreground">
            Shared by: {owner?.name}
          </p>
        ) : (
          <ShareButton vmId={vm.id} domain={process.env.USER_DOMAIN!} />
        )}
      </H2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">RAM</h3>
          <p className="text-muted-foreground">{vm.ram / 1024} GiB</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">vCPUs</h3>
          <p className="text-muted-foreground">{vm.cpu}</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">Username</h3>
          <div className="flex items-center">
            <p className="text-muted-foreground">{vm.username}</p>{" "}
            <CopyButton
              variant="outline"
              className="ml-auto text-muted-foreground"
              size="icon-sm"
              text={vm.username}
            />
          </div>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-medium">IP Address</h3>
          <div className="flex items-center">
            <p className="text-muted-foreground">{vm.ip}</p>{" "}
            <CopyButton
              variant="outline"
              className="ml-auto text-muted-foreground"
              size="icon-sm"
              text={vm.ip}
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
