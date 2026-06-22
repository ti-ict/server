"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { profileSchema, ProfileSchema } from "./schema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slider } from "@/components/ui/slider";
import { editProfileAction } from "./actions";
import { User } from "@/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function EditProfileForm({
  user,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  user: User;
}) {
  const t = useTranslations("admin.edit_user");
  const role =
    user.role !== "admin" && user.role !== "user" ? "user" : user.role;

  const form = useForm<ProfileSchema>({
    //@ts-expect-error zod coercion
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: user.name || "",
      allowedRam: user.allowedRam,
      allowedCpus: user.allowedCpus,
      role
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    toast.promise(
      // @ts-expect-error Server action and form data types don't line up perfectly, but we know this is fine
      editProfileAction({ ...data, id: user.id }).then((result) => {
        if (!result.success) throw new Error(result.error);
        return result;
      }),
      {
        loading: t("updating"),
        success: t("updated"),
        error: (err) => err?.message ?? t("failed")
      }
    );
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {t("title", { name: user.name })}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("description", { name: user.name })}
          </p>
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-hostname">
                {t("name")}
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-hostname"
                aria-invalid={fieldState.invalid}
                placeholder={t("name_placeholder")}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="allowedRam"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-allowed-ram">
                <span>{t("ram")}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {t("ram_display", { value: field.value / 1024 })}
                </span>
              </FieldLabel>
              <Slider
                min={0}
                max={24576}
                step={512}
                value={[field.value]}
                onValueChange={field.onChange}
                name="allowedRam"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="allowedCpus"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-allowed-cpus">
                <span>{t("vcpus")}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {t("vcpus_display", { value: field.value })}
                </span>
              </FieldLabel>
              <Slider
                min={1}
                max={16}
                step={1}
                value={[field.value]}
                onValueChange={field.onChange}
                name="allowedCpus"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-role">
                <span>{t("role")}</span>
              </FieldLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue
                    aria-invalid={fieldState.invalid}
                    placeholder={t("role_placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("role_user")}</SelectItem>
                  <SelectItem value="admin">{t("role_admin")}</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t("save")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
