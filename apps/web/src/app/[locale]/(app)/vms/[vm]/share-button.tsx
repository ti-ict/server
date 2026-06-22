"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Share } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { shareSchema, ShareSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { inviteAction } from "./actions";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

export default function ShareButton({
  vmId,
  domain
}: {
  vmId: number;
  domain: string;
}) {
  const t = useTranslations("vm.share");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShareSchema>({
    resolver: zodResolver(shareSchema),
    mode: "onBlur",
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading(t("sending"));
    try {
      const result = await inviteAction({ ...data, vmId });
      if (!result.success) throw new Error(result.error);
      toast.success(t("sent"), { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"), {
        id: toastId
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="ml-auto" variant="outline" size="icon">
            <Share />
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
          <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("email_placeholder", { domain })}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="allowActions"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <FieldLabel htmlFor="allowActions">
                      {t("allow_actions")}
                    </FieldLabel>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="allowActions"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
