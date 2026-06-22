"use client";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const t = useTranslations("locale");

  const switchLocale = (newLocale: string) => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    // Replace or prepend locale segment
    const locales = ["en", "nl"];
    if (locales.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    window.location.href = "/" + segments.join("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <Globe />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => switchLocale("nl")}>
            {t("nl")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchLocale("en")}>
            {t("en")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
