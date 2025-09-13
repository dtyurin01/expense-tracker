import { IconType } from "react-icons";

export type NavItem = {
  label: string;
  href: string;
  icon?: IconType;
  section?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
};
