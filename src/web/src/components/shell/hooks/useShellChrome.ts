import { create } from "zustand";

type ShellChromeState = {
  showFiltersOverride: boolean | null;
  setShowFiltersOverride: (v: boolean | null) => void;
};

export const useShellChrome = create<ShellChromeState>((set) => ({
  showFiltersOverride: null,
  setShowFiltersOverride: (showFiltersOverride) => set({ showFiltersOverride }),
}));
