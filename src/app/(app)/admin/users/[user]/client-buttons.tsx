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

export default function ClientButtons({ userId }: { userId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleImpersonate() {
    const promise = authClient.admin.impersonateUser({ userId });
    toast.promise(
      promise.then((result) => {
        if (result.error) throw new Error(result.error.message);
        return result;
      }),
      {
        loading: "Impersonating user...",
        success: "Now impersonating user!",
        error: (err) => err?.message ?? "Failed to impersonate user"
      }
    );
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
          <PasswordForm setDialogOpen={setDialogOpen} userId={userId} />
        </DialogContent>
      </Dialog>
      <Button variant="outline" className="flex-1" onClick={handleImpersonate}>
        <VenetianMask />
        Impersonate
      </Button>
    </ButtonGroup>
  );
}
