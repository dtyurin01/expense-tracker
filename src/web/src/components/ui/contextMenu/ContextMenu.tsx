"use client";

import * as React from "react";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { cn } from "@/lib/cn";
import {
  menuContent,
  menuItem,
  menuLabel,
  shortcutText,
  type MenuContentVariants,
  type MenuItemVariants,
} from "@/components/ui/menu/menu.variants";

export type ContextMenuItem =
  | { type: "separator" }
  | { type: "label"; label: string; className?: string }
  | {
      type?: "item";
      label: string;
      onSelect: () => void;
      disabled?: boolean;
      shortcut?: string;
      danger?: boolean;
      className?: string;
      "data-testid"?: string;
    };

export type ContextMenuProps = {
  children: React.ReactNode;
  items: ContextMenuItem[];
  elevation?: MenuContentVariants["elevation"];
  radius?: MenuContentVariants["radius"];
  density?: MenuItemVariants["density"];
  contentClassName?: string;
  itemClassName?: string;
};

export function ContextMenu({
  children,
  items,
  elevation,
  radius,
  density,
  contentClassName,
  itemClassName,
}: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>{children}</RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={cn(menuContent({ elevation, radius }), contentClassName, "z-55")}
        >
          {items.map((item, idx) => {
            if (item.type === "separator") {
              return (
                <RadixContextMenu.Separator
                  key={`sep-${idx}`}
                  className="my-1 h-px bg-border/70"
                />
              );
            }

            if (item.type === "label") {
              return (
                <RadixContextMenu.Label
                  key={`label-${idx}`}
                  className={cn(menuLabel(), item.className)}
                >
                  {item.label}
                </RadixContextMenu.Label>
              );
            }

            const isDanger = !!item.danger;

            return (
              <RadixContextMenu.Item
                key={`item-${idx}`}
                disabled={item.disabled}
                className={cn(
                  menuItem({ density, tone: isDanger ? "danger" : "default" }),
                  itemClassName,
                  item.className,
                  "cursor-pointer select-none"
                )}
                data-testid={item["data-testid"]}
                onSelect={() => item.onSelect()}
              >
                <span className="truncate">{item.label}</span>
                {item.shortcut ? (
                  <span className={shortcutText()}>{item.shortcut}</span>
                ) : null}
              </RadixContextMenu.Item>
            );
          })}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
