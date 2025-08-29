"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FiMoreVertical } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "@/components/ui/button/Button";
import {
  menuContent,
  menuItem,
  menuLabel,
  shortcutText,
  type MenuContentVariants,
  type MenuItemVariants,
} from "./menu.variants";
import type { MenuItem as Item } from "./menu.types";

export type KebabMenuProps = {
  items: Item[];
  trigger?: React.ReactNode;
  triggerProps?: Omit<ButtonProps, "children"> & { "aria-label"?: string };

  elevation?: MenuContentVariants["elevation"];
  radius?: MenuContentVariants["radius"];
  contentClassName?: string;

  density?: MenuItemVariants["density"];
  itemClassName?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  side?: DropdownMenu.DropdownMenuContentProps["side"];
  align?: DropdownMenu.DropdownMenuContentProps["align"];
  sideOffset?: number;
  collisionPadding?:
    | number
    | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
};

export function KebabMenu({
  items,
  trigger,
  triggerProps,
  elevation,
  radius,
  contentClassName,
  density,
  itemClassName,
  open,
  onOpenChange,
  side = "bottom",
  align = "end",
  sideOffset = 6,
  collisionPadding = 8,
}: KebabMenuProps) {
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      radius="full"
      aria-label="More options"
      {...triggerProps}
      className="text-muted-foreground hover:text-foreground"
    >
      <FiMoreVertical className="size-5" aria-hidden />
    </Button>
  );

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        {trigger ?? defaultTrigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(menuContent({ elevation, radius }), contentClassName)}
        >
          {items.map((item, idx) => {
            if ("type" in item) {
              if (item.type === "separator") {
                return (
                  <DropdownMenu.Separator
                    key={`sep-${idx}`}
                    className="my-1 h-px bg-border/70"
                  />
                );
              }
              if (item.type === "label") {
                return (
                  <DropdownMenu.Label
                    key={`label-${idx}`}
                    className={cn(menuLabel(), item.className)}
                  >
                    {item.label}
                  </DropdownMenu.Label>
                );
              }
              return null;
            }

            const isDanger = !!item.danger;
            const content = (
              <>
                {item.icon && (
                  <span className="size-4 shrink-0">{item.icon}</span>
                )}
                <span className="truncate">{item.label}</span>
                {item.shortcut && (
                  <span className={shortcutText()}>{item.shortcut}</span>
                )}
              </>
            );

            const classes = cn(
              menuItem({ density, tone: isDanger ? "danger" : "default" }),
              itemClassName,
              item.className
            );

            if ("href" in item && item.href) {
              return (
                <DropdownMenu.Item
                  key={`link-${idx}`}
                  asChild
                  disabled={item.disabled}
                  className={classes}
                >
                  <a
                    href={item.href}
                    target={item.target ?? "_self"}
                    rel={
                      item.rel ??
                      (item.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined)
                    }
                    data-testid={item["data-testid"]}
                  >
                    {content}
                  </a>
                </DropdownMenu.Item>
              );
            }

            return (
              <DropdownMenu.Item
                key={`action-${idx}`}
                onSelect={() => {
                  item.onSelect?.();
                }}
                disabled={item.disabled}
                className={classes}
                data-testid={item["data-testid"]}
              >
                {content}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
