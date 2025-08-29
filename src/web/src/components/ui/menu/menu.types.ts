import { ReactNode } from "react";

export type MenuItemBase = {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
  "data-testid"?: string;
};

export type ActionItem = MenuItemBase & {
  onSelect: () => void;
  href?: never;
};

export type LinkItem = MenuItemBase & {
  href: string;
  target?: "_self" | "_blank";
  rel?: string;
  onSelect?: never;
};

export type SeparatorItem = {
  type: "separator";
};

export type LabelItem = {
  type: "label";
  label: string;
  className: string;
};

export type MenuItem = ActionItem | LinkItem | SeparatorItem | LabelItem;
