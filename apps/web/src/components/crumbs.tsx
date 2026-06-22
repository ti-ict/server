"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "./ui/breadcrumb";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Crumbs({
  ...props
}: React.ComponentProps<typeof Breadcrumb>) {
  const t = useTranslations("breadcrumbs");
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labelKeys: Record<string, [string, string?]> = {
    admin: ["admin"],
    users: ["user_management", "user"],
    vms: ["virtual_machines", "vm"],
    create: ["create"],
    profile: ["profile"]
  };

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const keys = labelKeys[segment];
          const labelKey =
            keys?.[0] || labelKeys[segments[index - 1]]?.[1] || "home";
          const label = t(labelKey);

          return (
            <div key={href} className="flex items-center gap-1">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <Link href={href}>{label}</Link>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
