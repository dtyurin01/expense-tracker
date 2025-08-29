import { IconType } from "react-icons";

export type NavItem = {
  label: string;
  href: string;
  icon?: IconType;
  section?: string;       // groups
  roles?: string[];       // for roles
};