import { headers } from "next/headers";
import { Logo } from "./logo";
import { auth } from "@/lib/auth";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <header className="w-full p-4 flex flex-row">
      <Link href="/">
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <a
            href="/vm/create"
            className={buttonVariants({ variant: "outline" })}
          >
            Create VM
          </a>
        ) : (
          <a
            href="/auth/signin"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign in
          </a>
        )}
      </div>
    </header>
  );
}
