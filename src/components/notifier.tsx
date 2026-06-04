"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Notifier() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const error = searchParams.get("error");
    const message = searchParams.get("message");

    console.log("Notifier fired:", { error, message });
    console.log("Toast object:", toast);
    console.log("Toast.error fn:", typeof toast.error);

    if (!message && !error) return;

    handled.current = true;

    // Use setTimeout to ensure the toast is shown after the component has mounted
    setTimeout(() => {
      if (message) toast.success(message);
      if (error) toast.error(error);
    }, 0);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    params.delete("message");
    const newUrl =
      params.size > 0 ? `?${params.toString()}` : window.location.pathname;

    setTimeout(() => router.replace(newUrl), 500);
  }, [router, searchParams]);

  return null;
}
