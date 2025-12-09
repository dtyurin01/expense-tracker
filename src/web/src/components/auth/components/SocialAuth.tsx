"use client";

import { FcGoogle } from "react-icons/fc";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { Button } from "@/components/ui/button/Button";

export function SocialAuth() {
  const handleGoogleLogin = () => {
    // todo: implement Google OAuth flow
    console.log("Login with Google");
  };

  const handleOutlookLogin = () => {
    console.log("Login with GitHub");
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase">
          Or continue with
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
          Google
        </Button>
      </div>
    </div>
  );
}
