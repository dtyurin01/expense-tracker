import { FiPieChart, FiCreditCard, FiSettings } from "react-icons/fi";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { NavItem } from "@/types/nav";

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: RiDashboardHorizontalLine,
    section: "Main",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: FiPieChart,
    section: "Main",
  },
  {
    label: "Accounts",
    href: "/accounts",
    icon: FiCreditCard,
    section: "Main",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: FiSettings,
    section: "Other",
  },
];
