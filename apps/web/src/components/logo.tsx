import { cn } from "@/lib/utils";
import { Cloud } from "lucide-react";
import { useTranslations } from "next-intl";

export function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(`flex justify-center gap-2 md:justify-start`, className)}
      {...props}
    >
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Cloud className="size-4" />
      </div>
      {t("app_name")}
    </div>
  );
}
