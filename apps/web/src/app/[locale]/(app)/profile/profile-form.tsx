import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/typography";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function EditProfileForm({
  userId,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  userId: string;
}) {
  const t = await getTranslations("profile");
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser) return redirect("/auth/signin");

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="form-rhf-demo-name">{t("name")}</FieldLabel>
          <Input
            id="form-rhf-demo-name"
            placeholder={t("name_placeholder")}
            autoComplete="off"
            value={dbUser.name}
            readOnly
            disabled
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-rhf-demo-email">{t("email")}</FieldLabel>
          <Input
            id="form-rhf-demo-email"
            placeholder={t("email_placeholder")}
            autoComplete="off"
            value={dbUser.email}
            readOnly
            disabled
          />
        </Field>

        <div>
          <H3 className="mt-4 mb-2">{t("limits")}</H3>
          <p>{t("ram", { ram: dbUser.allowedRam / 1024 })}</p>
          <p>{t("vcpu", { cpu: dbUser.allowedCpus })}</p>
        </div>
      </FieldGroup>
    </form>
  );
}
