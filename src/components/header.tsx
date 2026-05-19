import { Logo } from "./logo";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { checkSession } from "@/lib/utils-server";

export async function Header() {
  const session = await checkSession();
  return (
    <header className="flex w-full flex-row p-4">
      <Link href="/">
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <>
            <Link
              href="/vm/create"
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
        {session?.user?.role === "admin" && (
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
