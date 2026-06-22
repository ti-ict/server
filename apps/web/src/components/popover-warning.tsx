import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import type { Popover as PopoverPrimitive } from "@base-ui/react";
import * as React from "react";
import { useTranslations } from "next-intl";

export default function PopoverWarning({
  children,
  action,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  children: React.ReactElement;
  action: () => void;
}) {
  const t = useTranslations("common");

  return (
    <Popover {...props}>
      <PopoverTrigger render={children} />
      <PopoverContent className="w-32">
        <Button variant="destructive" onClick={action} className="w-full">
          {t("are_you_sure")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
