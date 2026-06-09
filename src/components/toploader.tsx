"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  const { resolvedTheme } = useTheme();

  return (
    <NextTopLoader color={resolvedTheme === "dark" ? "#ffffff" : "#000000"} />
  );
}
