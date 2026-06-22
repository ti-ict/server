"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";

export function TopLoader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextTopLoader color={resolvedTheme === "dark" ? "#ffffff" : "#000000"} />
  );
}
