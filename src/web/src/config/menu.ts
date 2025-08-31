import { FiHome, FiCreditCard, FiFileText, FiPieChart } from "react-icons/fi";
import type { MenuItem } from "@/components/ui/menu/menu.types";

export const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome },
  { label: "Accounts", href: "/accounts", icon: FiCreditCard },
  { type: "separator" },
  { label: "Receipts", href: "/receipts", icon: FiFileText },
  { label: "Statistics", href: "/statistics", icon: FiPieChart, danger: true },
];

export const isActivePath = (
  pathname: string | null,
  href: string,
  exact = false
): boolean => {
  if (!pathname) {
    return false;
  }

  if (exact) {
    return pathname === href;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};
