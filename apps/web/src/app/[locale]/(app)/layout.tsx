import { Suspense } from "react";
import { Header } from "@/components/header";
import Notifier from "@/components/notifier";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-20 flex items-center justify-center">{children}</main>
      <Suspense fallback={null}>
        <Notifier />
      </Suspense>
    </>
  );
}
