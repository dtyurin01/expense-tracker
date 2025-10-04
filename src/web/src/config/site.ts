import { SiteConfig } from "@/types/siteConfig";

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv?.startsWith("http")) return fromEnv.replace(/\/+$/, "");
  return "http://localhost:3000";
}

export const siteConfig: SiteConfig = {
  name: "PocketPulse",
  shortName: "PP",
  description:
    "A simple expense tracker with a clean UI built with Next.js + Tailwind.",
  url: getBaseUrl(),
  locale: "en",
  keywords: ["budget", "expenses", "nextjs", "tailwind"],

  creator: "PocketPulse Team",
  themeColorLight: "#ffffff",
  themeColorDark: "#002A22",

  ogImage: "/og.png",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  footer: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
  ],

  links: {
    github: "https://github.com/you/expense-tracker",
    twitter: "https://x.com/your_handle",
    email: "support@pocketpulse.app",
  },
} as const;
