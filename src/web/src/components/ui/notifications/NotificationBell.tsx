"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FiBell } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button/Button";
import type { NotificationItem } from "@/types/notification";
import {
  bellTrigger,
  notificationContent,
  notificationHeader,
  notificationList,
  notificationItem,
  unreadDot,
  title,
  message,
  time,
  footer,
} from "./notificationBell.variants";

type NotificationBellProps = {
  items: NotificationItem[];
  count?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onMarkAllRead?: () => void;
  side?: DropdownMenu.DropdownMenuContentProps["side"];
  align?: DropdownMenu.DropdownMenuContentProps["align"];
  sideOffset?: number;
  collisionPadding?:
    | number
    | Partial<Record<"top" | "right" | "bottom" | "left", number>>;

  className?: string;
};

export function NotificationBell({
  items,
  count,
  open,
  onOpenChange,
  onMarkAllRead,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  collisionPadding = 8,
  className,
}: NotificationBellProps) {
  const unreadCount =
    typeof count === "number" ? count : items.filter((i) => i.unread).length;

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="iconTransparent"
          size="icon"
          radius="full"
          className={cn(bellTrigger(), className)}
          aria-label={
            unreadCount
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <span className="relative place-items-center">
            <FiBell className="size-5" aria-hidden />
            {unreadCount > 0 && (
              <span
                aria-hidden
                className="absolute right-0 top-0 size-2 rounded-full bg-error"
              />
            )}
          </span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={notificationContent()}
        >
          <div className={notificationHeader()}>
            <div className="text-sm font-semibold">Notifications</div>
            <button
              onClick={onMarkAllRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all as read
            </button>
          </div>

          <ul className={notificationList()}>
            {items.map((n) => (
              <li key={n.id}>
                <DropdownMenu.Item asChild>
                  <a
                    href={n.href}
                    className={notificationItem({ unread: !!n.unread })}
                  >
                    <span className={unreadDot({ unread: !!n.unread })} />
                    <div className="min-w-0 flex-1">
                      <div className={title()}>{n.title}</div>
                      {n.message && (
                        <div className={message()}>{n.message}</div>
                      )}
                      {n.time && <div className={time()}>{n.time}</div>}
                    </div>
                  </a>
                </DropdownMenu.Item>
              </li>
            ))}
          </ul>

          <div className={footer()}>
            <a href="/notifications" className="text-brand hover:underline">
              View all
            </a>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
