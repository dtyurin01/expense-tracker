"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { logout as logoutApi } from "@/features/auth/api/authApi";
import { useUser } from "@/features/user/hooks/useUser";

type UseLogoutOptions = {
  redirectTo?: string;
};

export function useLogout(options?: UseLogoutOptions) {
  const router = useRouter();
  const clearUser = useUser((s) => s.logout);

  const redirectTo = options?.redirectTo ?? "/login";

  const logout = React.useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Even if the request fails, still clear local user and route to login.
    } finally {
      clearUser();
      router.replace(redirectTo);
    }
  }, [clearUser, redirectTo, router]);

  return { logout };
}
