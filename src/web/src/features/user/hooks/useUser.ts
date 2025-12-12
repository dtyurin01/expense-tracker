import { create } from "zustand";
import { getMe, uploadAvatar } from "@/features/user/api/userApi";
import type { UserProfile } from "@/features/user/types/types";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;

  fetchUser: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  logout: () => void;
}

export const useUser = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  isUploading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMe();
      console.log("Fetched user:", data);
      set({ user: data, isLoading: false, error: null });
    } catch (error) {
      const message = await getErrorMessage(error);
      set({ user: null, isLoading: false, error: message });
    }
  },

  updateAvatar: async (file: File) => {
    set({ isUploading: true, error: null });
    try {
      const response = await uploadAvatar(file);

      const currentUser = get().user;

      if (currentUser) {
        set({
          user: {
            ...currentUser,
            avatarUrl: response.avatarUrl,
          },
        });
      }
    } catch (error) {
      const message = await getErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isUploading: false });
    }
  },

  logout: () => {
    set({ user: null, error: null });
  },
}));
