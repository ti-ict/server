"use client";
import { Logo } from "@/components/logo";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPage() {
  async function handleMicorsoftSignIn() {
    const { error } = await authClient.signIn.social({
      provider: "microsoft"
    });

    if (error) {
      toast.error("Failed to sign in with Microsoft");
      console.error("Microsoft sign-in error:", error);
    }
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/cover.jpg"
          alt="Image"
          width={500}
          height={500}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>
                  <H1>Sign In</H1>
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-3 flex">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleMicorsoftSignIn}
                >
                  <Image
                    src="/microsoft.svg"
                    alt="Microsoft Logo"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Microsoft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Logo className="fixed p-6" />
    </div>
  );
}
