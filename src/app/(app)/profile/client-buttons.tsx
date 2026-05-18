"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { KeyRound, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { PasswordForm } from "./password-form";
import { useState } from "react";
import PopoverWarning from "@/components/popover-warning";

export default function ClientButtons() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
        }
      }
    });
  }
  return (
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
          <PasswordForm setDialogOpen={setDialogOpen} />
        </DialogContent>
      </Dialog>

      <PopoverWarning action={signOut}>
        <Button variant="outline" className="flex-1">
          <LogOut />
          Sign Out
        </Button>
      </PopoverWarning>
    </ButtonGroup>
  );
}
