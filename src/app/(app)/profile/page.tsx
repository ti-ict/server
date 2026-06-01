import { checkSession } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./profile-form";
import ClientButtons from "./client-buttons";

export default async function Page() {
  const session = await checkSession();
  if (!session.success) redirect("/auth/signin");

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm rounded-lg p-6 sm:border sm:bg-popover">
        <EditProfileForm userId={session.data.user.id} className="mb-4" />

        <ClientButtons />
      </div>
    </div>
  );
}
