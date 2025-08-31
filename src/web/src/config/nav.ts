import { FiHome, FiPieChart, FiCreditCard, FiSettings } from "react-icons/fi";
import { NavItem } from "@/types/nav";

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: FiHome,
    section: "Main",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: FiPieChart,
    section: "Main",
  },
  {
    label: "Payments",
    href: "/payments",
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


