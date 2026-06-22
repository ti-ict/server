import { Logo } from "./logo";
import Link from "next/link";
import { HeaderContents } from "./header-contents";
import Crumbs from "./crumbs";
import { MobileNav } from "./mobile-nav";
import { checkSession } from "@/lib/utils-server";
import { LocaleSwitcher } from "./locale-switcher";

export async function Header() {
  const session = await checkSession();

  return (
    <header className="flex w-full flex-row items-center gap-4 p-4">
      <Link href="/vms">
        <Logo />
      </Link>

      <Crumbs className="hidden md:block" />

      <MobileNav session={session.data ?? null} />

      <div className="ml-auto hidden items-center gap-4 md:flex">
        <LocaleSwitcher />
        <HeaderContents session={session.data ?? null} />
      </div>
    </header>
  );
}
