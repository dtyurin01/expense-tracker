"use client";

import { create } from "zustand";
import type { FeedbackTone } from "@/components/ui/callout/FeedbackCallout";

export type FeedbackToastInput = {
  tone: FeedbackTone;
  title?: string;
  message: React.ReactNode;
  autoDismissMs?: number | null;
};

export type FeedbackToast = FeedbackToastInput & {
  id: string;
  createdAt: number;
};

type FeedbackToastState = {
  toasts: FeedbackToast[];

  push: (toast: FeedbackToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useFeedbackToastStore = create<FeedbackToastState>((set, get) => ({
  toasts: [],

  push: (toast) => {
    const id = createId();
    const item: FeedbackToast = {
      id,
      createdAt: Date.now(),
      ...toast,
    };

    set({ toasts: [...get().toasts, item] });
    return id;
  },

  dismiss: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  clear: () => {
    set({ toasts: [] });
  },
}));
