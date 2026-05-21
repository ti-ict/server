import { Logo } from "./logo";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { checkSession } from "@/lib/utils-server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Crumbs from "./crumbs";

export async function Header() {
  async function stopImpersonating() {
    "use server";
    await auth.api.stopImpersonating({ headers: await headers() });
    redirect("/vms");
  }

  const session = await checkSession();
  return (
    <header className="flex w-full flex-row items-center gap-4 p-4">
      <Link href="/">
        <Logo />
      </Link>
      <Crumbs />
      <div className="ml-auto flex items-center gap-4">
        {/* @ts-expect-error this exists but isn't typed */}
        {session.data?.impersonatedBy && (
          <>
            <span className="text-sm text-muted-foreground">
              Impersonating {session.data.user.name} ({session.data.user.email})
            </span>
            <form action={stopImpersonating}>
              <Button variant="outline" type="submit">
                Stop Impersonating
              </Button>
            </form>
          </>
        )}
        {session.data ? (
          <>
            <Link
              href="/vms/create"
              className={buttonVariants({ variant: "outline" })}
            >
              Create VM
            </Link>
            <Link
              href="/profile"
              className={buttonVariants({ variant: "outline" })}
            >
              Profile
            </Link>
          </>
        ) : (
          <a
            href="/auth/signin"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign in
          </a>
        )}
        {session.data?.user.role === "admin" && (
          <Link
            href="/admin"
            className={buttonVariants({ variant: "outline" })}
          >
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
