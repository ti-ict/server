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
  const [loading, setLoading] = useState(false);
  if (shared && vmAction.notShowWhenShared) return null;

  async function handleStart() {
    setLoading(true);

    const promise = proxmoxVmAction(vmid, node, vmAction.key).catch((err) => {
      if (isRedirectError(err)) return;
      throw err;
    });

    toast.promise(promise, {
      loading: `${cap(vmAction.happening)} VM...`,
      success: `VM ${vmAction.completed} successfully!`,
      error: (err) => {
        return `Failed to ${vmAction.key}: ${err.message}`;
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
