"use client";

import * as React from "react";
import type { FeedbackToastInput } from "@/components/ui/callout/feedbackToastStore";
import { useFeedbackToastStore } from "@/components/ui/callout/feedbackToastStore";

export function useFeedbackToast() {
  const push = useFeedbackToastStore((s) => s.push);
  const dismiss = useFeedbackToastStore((s) => s.dismiss);
  const clear = useFeedbackToastStore((s) => s.clear);

  const api = React.useMemo(
    () => ({
      push,
      dismiss,
      clear,
      info: (input: Omit<FeedbackToastInput, "tone">) =>
        push({ ...input, tone: "info" }),
      success: (input: Omit<FeedbackToastInput, "tone">) =>
        push({ ...input, tone: "success" }),
      warning: (input: Omit<FeedbackToastInput, "tone">) =>
        push({ ...input, tone: "warning" }),
      error: (input: Omit<FeedbackToastInput, "tone">) =>
        push({ ...input, tone: "error" }),
    }),
    [push, dismiss, clear]
  );

  return api;
}
