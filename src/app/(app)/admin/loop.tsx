"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Loop() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing admin dashboard...");
      router.refresh();
    }, 2000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
