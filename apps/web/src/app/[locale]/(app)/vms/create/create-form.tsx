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
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVmSchema, type CreateVmSchema } from "./schema";
import { createVmAction } from "./actions";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function CreateForm({
  allowedRam,
  ramUsed,
  allowedCpus,
  cpuUsed,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  allowedRam: number;
  ramUsed: number;
  allowedCpus: number;
  cpuUsed: number;
}) {
  const router = useRouter();
  const t = useTranslations("vm.create");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<ReturnType<CreateVmSchema>>>({
    // @ts-expect-error number coercion is required for the RAM field, but the schema is typed to return a number, so we need to ignore this error
    resolver: zodResolver(
      createVmSchema(allowedRam, ramUsed, allowedCpus, cpuUsed)
    ),
    mode: "onBlur",
    defaultValues: {
      hostname: "",
      sshKey: "",
      ram: 512,
      cpu: allowedCpus - cpuUsed >= 4 ? 4 : 1
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading(t("creating"));
    try {
      // @ts-expect-error the action is typed to return a union type, but we know that it will return the success type if the form data is valid, which is guaranteed by the zod resolver, so we can ignore this error
      const result = await createVmAction(data);
      if (!result.success) throw new Error(result.error);
      toast.success(t("created"), { id: toastId });
      router.push(`/vms/${result.vmId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"), {
        id: toastId
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Controller
          name="hostname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-hostname">
                {t("hostname")}
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-hostname"
                aria-invalid={fieldState.invalid}
                placeholder={t("hostname_placeholder")}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="sshKey"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-sshKey">
                {t("ssh_key")}
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-sshKey"
                aria-invalid={fieldState.invalid}
                placeholder={t("ssh_key_placeholder")}
                autoComplete="off"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="ram"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-ram">
                <span>{t("ram")}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {t("ram_display", {
                    value: field.value / 1024,
                    max: (allowedRam - ramUsed) / 1024
                  })}
                </span>
              </FieldLabel>
              <Slider
                min={512}
                max={allowedRam - ramUsed}
                step={512}
                value={[field.value]}
                onValueChange={field.onChange}
                name="ram"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="cpu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-cpu">
                <span>{t("vcpus")}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {t("vcpus_display", {
                    value: field.value,
                    max: allowedCpus - cpuUsed
                  })}
                </span>
              </FieldLabel>
              <Slider
                min={1}
                max={allowedCpus - cpuUsed}
                step={1}
                value={[field.value]}
                onValueChange={field.onChange}
                name="cpu"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isSubmitting}
          >
            {t("submit")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
