import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex mt-20 items-center justify-center">{children}</main>
    </>
  );
}
