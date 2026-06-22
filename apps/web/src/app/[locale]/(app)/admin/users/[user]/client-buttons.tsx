"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PopoverWarning from "@/components/popover-warning";
import { useTranslations } from "next-intl";

export default function ClientButtons({ userId }: { userId: string }) {
  const t = useTranslations("admin.edit_user");
  const router = useRouter();

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
        loading: t("deleting"),
        success: t("deleted"),
        error: (err) => err?.message ?? t("delete_failed")
      }
    );
  }

  return (
    <PopoverWarning action={handleDelete}>
      <Button variant="destructive" className="flex-1" data-slot="button">
        {t("delete")}
      </Button>
    </PopoverWarning>
  );
}
