"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { KebabMenu } from "@/components/ui/index";
import type { MenuItem } from "@/components/ui/menu/menu.types";
import { Skeleton } from "@radix-ui/themes";
import { Button } from "@/components/ui/button/Button";

type CommonProps = {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  className?: string;
  subtitleStyle?: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  nameSize?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
};

type FullProps = CommonProps & {
  variant?: "full";
  block?: boolean;
  menuItems?: MenuItem[];
  onMenuOpenChange?: (open: boolean) => void;
  onEditClick?: () => void;
};

type AvatarOnlyProps = CommonProps & {
  variant: "avatar";
  href?: string;
  "aria-label"?: string;
};

export type UserCardProps = FullProps | AvatarOnlyProps;

export function UserCard(props: UserCardProps) {
  const {
    name,
    subtitle = "Member",
    subtitleStyle = "text-muted-foreground",
    avatarUrl,
    className,
    disabled,
    onClick,
    size = "md",
    nameSize = "sm",
    loading = false,
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
      : size === "xl"
      ? "h-14 w-14 text-xl"
      : "h-10 w-10";

  const nameSizeVar =
    nameSize === "sm"
      ? "text-sm"
      : nameSize === "lg"
      ? "text-lg"
      : nameSize === "xl"
      ? "text-xl"
      : "text-md";

  if (props.variant === "avatar") {
    const Wrapper = onClick ? ("button" as const) : ("div" as const);
    return (
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={disabled || loading ? undefined : onClick}
        aria-label={props["aria-label"] ?? name}
        className={cn(
          "inline-flex items-center justify-center",
          (disabled || loading) && "pointer-events-none opacity-60",
          className
        )}
        aria-busy={loading}
      >
        <div
          className={cn(
            "relative rounded-full ring-1 ring-border/60 bg-surface/5 shadow-sm overflow-hidden",
            avatarSize
          )}
        >
          {loading ? (
            <Skeleton width="100%" height="100%" />
          ) : imgOk ? (
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
      onClick={disabled || loading ? undefined : onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border border-2 border-border bg-surface/5 px-4 py-3",
        "hover:bg-surface/10 transition-colors",
        (disabled || loading) && "pointer-events-none opacity-60",
        block && "w-full",
        className
      )}
      aria-busy={loading}
      aria-live="polite"
    >
      <div
        className={cn(
          "relative rounded-full ring-1 ring-border/60 bg-surface shadow-sm overflow-hidden",
          avatarSize
        )}
      >
        {loading ? (
          <Skeleton width="100%" height="100%" />
        ) : imgOk ? (
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
        {loading ? (
          <div className="space-y-1">
            <div className="h-4 w-32 rounded-md overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
            <div className="h-3 w-24 rounded-md overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        ) : (
          <>
            <div className={`truncate font-medium ${nameSizeVar}`}>{name}</div>
            <div className={`truncate text-xs ${subtitleStyle}`}>
              {subtitle}
            </div>
          </>
        )}
      </div>

      {/* Kebab */}
      {/* {menuItems?.length ? (
        <div className="ml-auto">
          {loading ? (
            <div className="size-8 rounded-full overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          ) : (
            
            <KebabMenu
              align="start"
              items={menuItems}
              onOpenChange={onMenuOpenChange}
            />
          )}
        </div>
      ) : null} */}
      {(menuItems?.length || props.onEditClick) && (
        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="size-8 rounded-full overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          ) : (
            <>
              {/* Edit button */}
              {props.onEditClick && (
                <Button
                  type="button"
                  variant="muted"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onEditClick?.();
                  }}
                  className="p-1"
                >
                  Edit profile
                </Button>
              )}

              {/* Kebab menu */}
              {menuItems?.length ? (
                <KebabMenu
                  align="start"
                  items={menuItems}
                  onOpenChange={onMenuOpenChange}
                />
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
