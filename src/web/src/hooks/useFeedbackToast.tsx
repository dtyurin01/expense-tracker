"use client";

import * as React from "react";
import { toast as hotToast } from "react-hot-toast";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
import {
  type FeedbackToastVariant,
  toastConfig,
  MAX_ACTIVE_TOASTS,
} from "@/config/toast";

type FeedbackToastInput = {
  title?: string;
  message: React.ReactNode;
};

const activeToastIds: string[] = [];

function trackToast(id: string) {
  if (!id) return;

  const existingIndex = activeToastIds.indexOf(id);
  if (existingIndex !== -1) {
    activeToastIds.splice(existingIndex, 1);
  }

  activeToastIds.unshift(id);

  while (activeToastIds.length > MAX_ACTIVE_TOASTS) {
    const toDismiss = activeToastIds.pop();
    if (toDismiss) {
      hotToast.dismiss(toDismiss);
    }
  }
}

function untrackToast(id?: string) {
  if (!id) {
    return;
  }
  const index = activeToastIds.indexOf(id);
  if (index !== -1) {
    activeToastIds.splice(index, 1);
  }
}

function renderToastContent(input: FeedbackToastInput) {
  const message = input.message;

  if (!input.title) {
    return <div className="text-sm leading-5">{message}</div>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-md font-medium leading-5">{input.title}</div>
      <div className="text-sm text-foreground leading-4">{message}</div>
    </div>
  );
}

function getToastIcon(variant: FeedbackToastVariant) {
  const iconClassName = "size-8";

  switch (variant) {
    case "success":
      return <FiCheckCircle className={`${iconClassName} text-success`} />;
    case "error":
      return <FiXCircle className={`${iconClassName} text-error`} />;
    case "warning":
      return <FiAlertTriangle className={`${iconClassName} text-warning`} />;
    case "info":
    default:
      return <FiInfo className={`${iconClassName} text-brand`} />;
  }
}

function getToastClassName(variant: FeedbackToastVariant): string {
  return `${toastConfig.classNames.base} ${toastConfig.classNames[variant]}`;
}

export function useFeedbackToast() {
  const requestDismiss = React.useCallback((id: string) => {
    hotToast.dismiss(id);
    untrackToast(id);
  }, []);

  function clearAll() {
    hotToast.dismiss();
    activeToastIds.length = 0;
  }

  function dismiss(id?: string) {
    if (id) {
      hotToast.dismiss(id);
      untrackToast(id);
      return;
    }

    hotToast.dismiss();
    activeToastIds.length = 0;
  }

  const info = React.useCallback((data: FeedbackToastInput) => {
    const id = hotToast(renderToastContent(data), {
      icon: getToastIcon("info"),
      className: getToastClassName("info"),
      duration: toastConfig.durations.default,
    });
    trackToast(id);
    return id;
  }, []);

  const success = React.useCallback((data: FeedbackToastInput) => {
    const id = hotToast.success(renderToastContent(data), {
      icon: getToastIcon("success"),
      className: getToastClassName("success"),
      duration: toastConfig.durations.success,
    });
    trackToast(id);
    return id;
  }, []);

  const warning = React.useCallback((data: FeedbackToastInput) => {
    const id = hotToast(renderToastContent(data), {
      icon: getToastIcon("warning"),
      className: getToastClassName("warning"),
      duration: toastConfig.durations.default,
    });
    trackToast(id);
    return id;
  }, []);

  const error = React.useCallback((data: FeedbackToastInput) => {
    const id = hotToast.error(renderToastContent(data), {
      icon: getToastIcon("error"),
      className: getToastClassName("error"),
      duration: toastConfig.durations.default,
    });
    trackToast(id);
    return id;
  }, []);

  return {
    toasts: [] as const,
    closingIds: new Set<string>(),
    requestDismiss,
    info,
    success,
    warning,
    error,
    clear: clearAll,
    dismiss,
  };
}
