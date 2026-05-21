"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { KeyRound, VenetianMask } from "lucide-react";
import { PasswordForm } from "./password-form";
import { useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import PopoverWarning from "@/components/popover-warning";

export default function ClientButtons({
  userId,
  allowImpersonate
}: {
  userId: string;
  allowImpersonate: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  async function handleImpersonate() {
    const promise = authClient.admin.impersonateUser({ userId });
    toast.promise(
      promise.then((result) => {
        if (result.error) throw new Error(result.error.message);
        router.push("/");
        router.refresh();
        return result;
      }),
      {
        loading: "Impersonating user...",
        success: "Now impersonating user!",
        error: (err) => err?.message ?? "Failed to impersonate user"
      }
    );
  }

  async function handleDelete() {
    const promise = authClient.admin.removeUser({ userId });
    toast.promise(
      promise.then((result) => {
        if (result.error) throw new Error(result.error.message);
        router.push("/admin/users");
        router.refresh();
        return result;
      }),
      {
        loading: "Deleting user...",
        success: "User deleted!",
        error: (err) => err?.message ?? "Failed to delete user"
      }
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ButtonGroup className="w-full">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <KeyRound />
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <PasswordForm setDialogOpen={setDialogOpen} userId={userId} />
          </DialogContent>
        </Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              data-slot="button"
              className="inline-flex flex-1 [&>button]:rounded-l-none [&>button]:rounded-r-md [&>button]:border-l-0"
            >
              <Button
                variant="outline"
                className="w-full"
                onClick={handleImpersonate}
                disabled={!allowImpersonate}
              >
                <VenetianMask />
                Impersonate
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent className={allowImpersonate ? "hidden" : ""}>
            You can&apos;t impersonate admins.
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <PopoverWarning action={handleDelete}>
        <Button variant="destructive" className="w-full" data-slot="button">
          Delete User
        </Button>
      </PopoverWarning>
    </div>
  );
}
