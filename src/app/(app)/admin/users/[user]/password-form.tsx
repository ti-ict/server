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
import { passwordSchema, PasswordSchema } from "./schema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

export function PasswordForm({
  className,
  setDialogOpen,
  userId,
  ...props
}: React.ComponentProps<"form"> & {
  setDialogOpen: (open: boolean) => void;
  userId: string;
}) {
  const form = useForm<PasswordSchema>({
    // @ts-expect-error weird zod schema
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      destroySessions: false
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const promise = authClient.admin.setUserPassword({
      newPassword: data.newPassword,
      userId
    });
    toast.promise(
      promise.then((result) => {
        if (result.error) throw new Error(result.error.message);
        setDialogOpen(false);
        return result;
      }),
      {
        loading: "Changing password...",
        success: "Password changed!",
        error: (err) => err?.message ?? "Failed to change password"
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
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-new-password">
                New Password
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-new-password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                type="password"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-confirm-password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                type="password"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
