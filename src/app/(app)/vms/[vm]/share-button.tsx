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

export default function ShareButton({
  vmId,
  domain
}: {
  vmId: number;
  domain: string;
}) {
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
    const toastId = toast.loading("Sending invite...");
    try {
      const result = await inviteAction({ ...data, vmId });
      if (!result.success) throw new Error(result.error);
      toast.success("Invite sent successfully!", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong", {
        id: toastId
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="outline" size="icon">
          <Share />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share VM</DialogTitle>
          <DialogDescription>
            Invite an user to access this VM.
          </DialogDescription>
          <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <FieldGroup>
              {/* ── Text field ── */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={`name@${domain}`}
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
                      Allow Start/Stop
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
                  Submit
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
