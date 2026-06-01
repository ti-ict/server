"use client";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <H1>Sign In</H1>
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-2 flex">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleMicorsoftSignIn}
          >
            Sign in with Microsoft
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
