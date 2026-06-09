"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PopoverWarning from "@/components/popover-warning";

export default function ClientButtons({ userId }: { userId: string }) {
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
        loading: "Deleting user...",
        success: "User deleted!",
        error: (err) => err?.message ?? "Failed to delete user"
      }
    );
  }

  return (
    <PopoverWarning action={handleDelete}>
      <Button variant="destructive" className="flex-1" data-slot="button">
        Delete User
      </Button>
    </PopoverWarning>
  );
}
