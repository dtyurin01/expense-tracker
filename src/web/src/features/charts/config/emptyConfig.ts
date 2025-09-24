import { IconType } from "react-icons";
import { FiBookOpen, FiShield } from "react-icons/fi";

export type EmptyChecklistTask = {
  title: string;
  text: string;
  icon: IconType;
  href?: string;
  linkLabel?: string;
};

export const tasks: EmptyChecklistTask[] = [
  {
    title: "Learn how to add",
    text: "Step-by-step guide on adding your first transactions and importing data.",
    icon: FiBookOpen,
    href: "/help/getting-started",
    linkLabel: "Learn more",
  },
  {
    title: "Privacy & security",
    text: "Understand how your financial data is protected and kept secure.",
    icon: FiShield,
    href: "/legal/privacy",
    linkLabel: "View details",
  },
];
