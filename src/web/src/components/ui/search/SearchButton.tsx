"use client";

import * as React from "react";
import { FiSearch } from "react-icons/fi";
import { Button, type ButtonProps } from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

type SearchButtonProps = Omit<
  ButtonProps,
  "children" | "leftIcon" | "rightIcon" | "size"
> & {
  label?: string;
  icon?: React.ReactNode;
};

export default function SearchButton({
  label = "Search",
  icon = <FiSearch className="size-5" />,
  className,
  variant = "outline",
  radius = "full",
  block = false,
  ...props
}: SearchButtonProps) {
  return (
    <Button
      variant={variant}
      radius={radius}
      size="icon"
      block={block}
      leftIcon={icon}
      aria-label={label}
      title={props.title ?? label}
      className={cn(className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </Button>
  );
}
