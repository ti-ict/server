import { H1 } from "@/components/typography";
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

export default async function Page({ params }: { params: { vm: string } }) {
  const { vm } = await params;

  const dbVm = await prisma.vm.findUnique({
    where: {
      id: vm
    }
  });

  if (!dbVm) redirect("/");

  return (
    <div className="px-20 md:min-w-full">
      <div className="flex flex-row items-center justify-items-center gap-4">
        <H1>{dbVm.name}</H1>
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
                    vmid={dbVm.proxmoxId}
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
                vmid={dbVm.proxmoxId}
                node={dbVm.node}
              />
            ))}
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
