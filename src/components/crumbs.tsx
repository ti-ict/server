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

const labels: Record<string, string[]> = {
  admin: ["Admin"],
  users: ["User Management", "User"],
  vms: ["Virtual Machines", "VM"],
  create: ["Create"],
  profile: ["Profile"]
};

export default function Crumbs({
  ...props
}: React.ComponentProps<typeof Breadcrumb>) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          // Try to find a label for the current segment, falling back to the previous segment's singular form, and finally to "Home"
          const label =
            labels[segment]?.[0] || labels[segments[index - 1]]?.[1] || "Home";

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
