import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/typography";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function EditProfileForm({
  userId,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  userId: string;
}) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser) return redirect("/auth/signin");

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">View Profile</h1>
          <p className="text-sm text-balance text-muted-foreground">
            View your profile information
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="form-rhf-demo-name">Name</FieldLabel>
          <Input
            id="form-rhf-demo-name"
            placeholder="John Doe"
            autoComplete="off"
            value={dbUser.name}
            readOnly
            disabled
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
          <Input
            id="form-rhf-demo-email"
            placeholder="a@donboscosdw.be"
            autoComplete="off"
            value={dbUser.email}
            readOnly
            disabled
          />
        </Field>

        <div>
          <H3 className="mt-4 mb-2">Limits</H3>
          <p>RAM: {dbUser.allowedRam / 1024} GiB</p>
          <p>vCPU: {dbUser.allowedCpus}</p>
        </div>
      </FieldGroup>
    </form>
  );
}
