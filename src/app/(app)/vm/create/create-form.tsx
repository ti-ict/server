"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVmSchema, type CreateVmSchema } from "./schema";
import { createVmAction } from "./actions";
import { Slider } from "@/components/ui/slider";

export function CreateForm({
  allowedRam,
  ramUsed,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  allowedRam: number;
  ramUsed: number;
}) {
  const form = useForm<z.infer<ReturnType<CreateVmSchema>>>({
    // @ts-expect-error number coercion is required for the RAM field, but the schema is typed to return a number, so we need to ignore this error
    resolver: zodResolver(createVmSchema(allowedRam, ramUsed)),
    mode: "onBlur",
    defaultValues: {
      hostname: "",
      sshKey: "",
      ram: 512,
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      action={createVmAction}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create a new VM</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill out the form below to create a new VM
          </p>
        </div>
        <Controller
          name="hostname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-hostname">Hostname</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-hostname"
                aria-invalid={fieldState.invalid}
                placeholder="my-vm"
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
                Public SSH Key
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-sshKey"
                aria-invalid={fieldState.invalid}
                placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..."
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
                <span>RAM</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {field.value / 1024} GiB (Max: {(allowedRam - ramUsed) / 1024}{" "}
                  GiB)
                </span>
              </FieldLabel>
              <Slider
                min={512}
                max={allowedRam - ramUsed}
                step={512}
                value={[field.value]}
                onValueChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Create VM
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
