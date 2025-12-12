"use client";

import { useUser } from "@/features/user/hooks/useUser";

export function useUserSnapshot() {
  const user = useUser((s) => s.user);
  const isLoading = useUser((s) => s.isLoading);

  return { user, isLoading };
}
