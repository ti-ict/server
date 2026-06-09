import type { auth } from "@/lib/auth";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export function HeaderContents({
  session
}: {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
}) {
  return (
    <>
      {session?.user ? (
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
        <Link
          href="/auth/signin"
          className={buttonVariants({ variant: "outline" })}
        >
          Sign in
        </Link>
      )}
      {session?.user.role === "admin" && (
        <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
          Admin
        </Link>
      )}
    </>
  );
}
