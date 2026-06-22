"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { VmAction } from "./schema";
import { toast } from "sonner";
import { proxmoxVmAction } from "./actions";
import { cap } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import PopoverWarning from "@/components/popover-warning";
import { useTranslations } from "next-intl";

export function ActionButton({
  vmAction,
  vmid,
  node,
  shared,
  mobile = false
}: {
  vmAction: VmAction;
  vmid: number;
  node: string;
  shared: boolean;
  mobile?: boolean;
}) {
  const t = useTranslations("vm.actions");
  const [loading, setLoading] = useState(false);
  if (shared && vmAction.notShowWhenShared) return null;

  async function handleStart() {
    setLoading(true);

    const promise = proxmoxVmAction(vmid, node, vmAction.key).catch((err) => {
      if (isRedirectError(err)) return;
      throw err;
    });

    toast.promise(promise, {
      loading: t("action_toast_loading", { action: cap(vmAction.happening) }),
      success: t("action_toast_success", { action: vmAction.completed }),
      error: (err) => {
        return t("action_toast_error", {
          action: vmAction.key,
          message: err.message
        });
      }
    });

    try {
      await promise;
    } catch (e) {
      console.log(`Error during VM ${vmAction.key}:`, e);
    } finally {
      setLoading(false);
    }
  }

  if (mobile) {
    return (
      <DropdownMenuItem onClick={handleStart} disabled={loading}>
        {vmAction.icon}
        {cap(vmAction.key)}
      </DropdownMenuItem>
    );
  }

  if (vmAction.popOver) {
    return (
      <PopoverWarning action={handleStart}>
        <Button variant="outline">
          {vmAction.icon}
          {cap(vmAction.key)}
        </Button>
      </PopoverWarning>
    );
  }

  return (
    <Button onClick={handleStart} disabled={loading} variant="outline">
      {vmAction.icon}
      {cap(vmAction.key)}
    </Button>
  );
}
