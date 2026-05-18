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
import { editProfileAction } from "./actions";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

export function EditProfileForm({
  name,
  email,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  name: string;
  email: string;
}) {
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name,
      email
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    toast.promise(
      editProfileAction(data).then((result) => {
        if (!result.success) throw new Error(result.error);

        return result;
      }),
      {
        loading: "Updating...",
        success: "Profile updated!",
        error: (err) => err?.message ?? "Failed to update profile"
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
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Update your profile information below
          </p>
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-hostname">Name</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-hostname"
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                type="email"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save Changes
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
