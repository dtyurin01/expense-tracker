"use client";

import * as React from "react";
import { FeedbackCallout } from "@/components/ui/callout/FeedbackCallout";
import { useFeedbackToastStore } from "@/components/ui/callout/feedbackToastStore";

export function FeedbackToaster() {
  const toasts = useFeedbackToastStore((s) => s.toasts);
  const dismiss = useFeedbackToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className={
        "fixed bottom-4 right-4 z-50 flex w-[500px] max-w-[calc(100vw-2rem)] flex-col gap-2 pointer-events-none"
      }
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <FeedbackCallout
            tone={t.tone}
            title={t.title}
            message={t.message}
            autoDismissMs={t.autoDismissMs}
            onDismiss={() => dismiss(t.id)}
          />
        </div>
      ))}
    </div>
  );
}
