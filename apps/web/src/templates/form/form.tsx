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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formSchema, FormSchema } from "./schema";
import { submitFormAction } from "./actions";

// ─────────────────────────────────────────────
// 1. Form component props
// ─────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TemplateFormProps extends React.ComponentProps<"form"> {
  // Add any props your form needs (e.g. limits, initial values, context)
}

// ─────────────────────────────────────────────
// 2. The form component
// ─────────────────────────────────────────────
export function TemplateForm({ className, ...props }: TemplateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      fieldOne: "",
      fieldTwo: ""
      // Set sensible defaults for all fields
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting...");
    try {
      const result = await submitFormAction(data);
      if (!result.success) throw new Error(result.error);
      toast.success("Submitted successfully!", { id: toastId });
      router.push(`/success/${result.id}`); // ← update redirect target
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong", {
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
        {/* Form header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Form Title</h1>
          <p className="text-sm text-balance text-muted-foreground">
            A short description of what this form does.
          </p>
        </div>

        {/* ── Text field ── */}
        <Controller
          name="fieldOne"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-one">Field One</FieldLabel>
              <Input
                {...field}
                id="field-one"
                aria-invalid={fieldState.invalid}
                placeholder="Enter a value..."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ── Password / sensitive field ── */}
        <Controller
          name="fieldTwo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-two">Field Two</FieldLabel>
              <Input
                {...field}
                id="field-two"
                aria-invalid={fieldState.invalid}
                placeholder="Enter a secret..."
                autoComplete="off"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/*
          ── Slider field (copy this block for range inputs) ──

          First, add `import { Slider } from "@/components/ui/slider"` at the top.
          Then uncomment and adapt:

          <Controller
            name="sliderField"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slider-field">
                  <span>Slider Label</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {field.value} (Max: {MAX_VALUE})
                  </span>
                </FieldLabel>
                <Slider
                  min={MIN_VALUE}
                  max={MAX_VALUE}
                  step={STEP}
                  value={[field.value]}
                  onValueChange={field.onChange}
                  name="sliderField"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        */}

        <Field>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isSubmitting}
          >
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
