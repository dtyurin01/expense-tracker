"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { KebabMenu } from "@/components/ui/index";
import type { MenuItem } from "@/components/ui/menu/menu.types";

type CommonProps = {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
};

type FullProps = CommonProps & {
  variant?: "full";
  block?: boolean;
  menuItems?: MenuItem[];
  onMenuOpenChange?: (open: boolean) => void;
};

type AvatarOnlyProps = CommonProps & {
  variant: "avatar";
  href?: "string";
  "aria-label"?: string;
};

export type UserCardProps = FullProps | AvatarOnlyProps;

export function UserCard(props: UserCardProps) {
  const {
    name,
    subtitle = "Member",
    avatarUrl,
    className,
    disabled,
    onClick,
    size = "md",
  } = props;

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

  const seed = React.useMemo(() => encodeURIComponent(name || "user"), [name]);
  const fallbackAvatar = `https://i.pravatar.cc/160?u=${seed}`;
  const src = avatarUrl ?? fallbackAvatar;
  const [imgOk, setImgOk] = React.useState(true);

  const avatarSize =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
      ? "h-12 w-12"
      : "h-10 w-10";

  if (props.variant === "avatar") {
    const Wrapper = onClick ? "button" : "div";
    return (
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={disabled ? undefined : onClick}
        aria-label={props["aria-label"] ?? name}
        className={cn(
          "inline-flex items-center justify-center",
          disabled && "pointer-events-none opacity-60",
          className
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-full ring-1 ring-border/60 bg-surface/5 shadow-sm",
            avatarSize
          )}
        >
          {imgOk ? (
            <Image
              src={src}
              alt={`${name} avatar`}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setImgOk(false)}
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              {initials || "?"}
            </div>
          )}
        </div>
      </Wrapper>
    );
  }

  const { block, menuItems, onMenuOpenChange } = props as FullProps;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border border-2 border-border bg-surface/5 px-4 py-3",
        "hover:bg-surface/10 transition-colors",
        disabled && "pointer-events-none opacity-60",
        block && "w-full",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-full ring-1 ring-border/60 bg-surface shadow-sm",
          avatarSize
        )}
      >
        {imgOk ? (
          <Image
            src={src}
            alt={`${name} avatar`}
            fill
            sizes="64px"
            className="object-cover"
            onError={() => setImgOk(false)}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            {initials || "?"}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>

      {menuItems?.length ? (
        <div className="ml-auto">
          <KebabMenu align="start" items={menuItems} onOpenChange={onMenuOpenChange} />
        </div>
      ) : null}
    </div>
  );
}
