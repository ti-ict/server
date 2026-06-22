"use client";

import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "./ui/drawer";
import { HeaderContents } from "./header-contents";
import Crumbs from "./crumbs";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { auth } from "@/lib/auth";

export function MobileNav({
  session
}: {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
}) {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="ml-auto md:hidden">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex-row items-center gap-4">
          <DrawerTitle>
            <Link href="/vms">
              <Logo />
            </Link>
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-8 py-20">
          <Crumbs />
          <div className="flex flex-row items-center gap-4">
            <LocaleSwitcher />
            <HeaderContents session={session} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
