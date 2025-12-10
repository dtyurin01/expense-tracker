"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button/Button";

export function SocialAuth() {
  const handleGoogleLogin = () => {
    // todo: implement Google OAuth flow
    console.log("Login with Google");
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase">
          Or
        </span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <div>
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full"
          leftIcon={<FcGoogle className="size-5" />}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
