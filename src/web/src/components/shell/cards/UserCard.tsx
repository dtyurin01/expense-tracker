"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { KebabMenu } from "@/components/ui/index";
import type { MenuItem } from "@/components/ui/menu/menu.types";

type UserCardProps = {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;

  menuItems?: MenuItem[];
  onMenuOpenChange?: (open: boolean) => void;
};

export function UserCard({
  name,
  subtitle = "Member",
  avatarUrl,
  className,
  onClick,
  disabled,
  menuItems = [],
  onMenuOpenChange,
}: UserCardProps) {
  const seed = React.useMemo(() => encodeURIComponent(name || "user"), [name]);
  const fallbackAvatar = `https://i.pravatar.cc/96?u=${seed}`;
  const src = avatarUrl ?? fallbackAvatar;

  const [imgOk, setImgOk] = React.useState(true);
  const initials = React.useMemo(
    () =>
      name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join(""),
    [name]
  );
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-full border border-border/80 bg-surface/5",
        "px-3 py-2 shadow-sm hover:bg-surface/10 hover:border-border transition-colors",
        "focus-within:ring-2 focus-within:ring-brand/50",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border/60">
        {imgOk ? (
          <Image
            src={src}
            alt={`${name} avatar`}
            fill
            sizes="40px"
            className="object-cover"
            onError={() => setImgOk(false)}
            draggable={false}
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface text-sm text-muted-foreground">
            {initials || "?"}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-semibold leading-tight text-foreground">
          {name}
        </div>
        <div className="truncate text-sm leading-tight text-muted-foreground">
          {subtitle}
        </div>
      </div>

      {menuItems.length > 0 && (
        <KebabMenu
          items={menuItems}
          onOpenChange={onMenuOpenChange}
          sideOffset={12}
          elevation={2}
          radius="lg"
        />
      )}
    </div>
  );
}
