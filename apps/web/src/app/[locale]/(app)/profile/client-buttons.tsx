"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import PopoverWarning from "@/components/popover-warning";
import { useTranslations } from "next-intl";

export default function ClientButtons() {
  const t = useTranslations("nav");
  const router = useRouter();

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
    <PopoverWarning action={signOut}>
      <Button variant="outline" className="w-full">
        <LogOut />
        {t("sign_out")}
      </Button>
    </PopoverWarning>
  );
}
