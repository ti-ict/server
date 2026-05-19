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
import { addUserSchema, ProfileSchema } from "./schema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slider } from "@/components/ui/slider";
import { addUserAction } from "./actions";

export function AddUserForm({
  setDialogOpen,
  className,
  ...props
}: React.ComponentProps<"form"> & { setDialogOpen: (open: boolean) => void }) {
  const form = useForm<ProfileSchema>({
    //@ts-expect-error zod coercion
    resolver: zodResolver(addUserSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      allowedRam: 8192
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    toast.promise(
      // @ts-expect-error Server action and form data types don't line up perfectly, but we know this is fine
      addUserAction(data).then((result) => {
        if (!result.success) throw new Error(result.error);
        setDialogOpen(false);
        return result;
      }),
      {
        loading: "Creating user...",
        success: "User created!",
        error: (err) => err?.message ?? "Failed to create user"
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
          <h1 className="text-2xl font-bold">Create User</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Create a new user.
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

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-password">Password</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-password"
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
          name="allowedRam"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-allowed-ram">
                <span>RAM</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {field.value / 1024} GiB (Max: 24 GiB)
                </span>
              </FieldLabel>
              <Slider
                min={1024}
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

        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Create User
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
