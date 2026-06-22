"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import { User } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function VMSearch({ users }: { users: User[] }) {
  const t = useTranslations("admin.users");
  const router = useRouter();

  const [value, setValue] = useState("");

  return (
    <Combobox
      items={users}
      itemToStringValue={(i: User) => i.name ?? ""}
      onValueChange={(user: User | null) => {
        if (user) router.push(`/admin/vms?user=${user.id}`);
        else router.push("/admin/vms");
        setValue(user ? (user.name ?? "") : "");
      }}
      // @ts-expect-error - This is a known issue with the Combobox component when using object values. The type definitions do not currently support this use case, but it works correctly at runtime.
      value={value}
      showClear
    >
      <ComboboxInput placeholder={t("select_user")} showClear />
      <ComboboxContent>
        <ComboboxEmpty>{t("no_users_found")}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
