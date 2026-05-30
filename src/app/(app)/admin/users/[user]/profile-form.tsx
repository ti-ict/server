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

export function EditProfileForm({
  user,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  user: User;
}) {
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
          <h1 className="text-2xl font-bold">Edit {user.name}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Update {user.name}&apos;s profile information below
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
                <span>vCPUs</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {field.value} (Max: 16)
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
                <span>Role</span>
              </FieldLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue
                    aria-invalid={fieldState.invalid}
                    placeholder="Select a role"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
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
