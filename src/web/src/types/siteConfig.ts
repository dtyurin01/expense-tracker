import { NavItem } from "./nav";

export type FooterSection = {
  title: string;
  links: NavItem[];
};

export type SiteConfig = {
  name: string;
  shortName?: string;
  description: string;
  url: string; // canonical base URL
  locale: string; // BCP-47 (e.g., 'ru', 'de-DE')
  keywords: string[];
  creator?: string;
  themeColorLight?: string; // for <meta name="theme-color">
  themeColorDark?: string;

  // Default icons/images
  ogImage?: string; // OpenGraph preview
  icons?: {
    icon?: string; // favicon.ico or .svg
    shortcut?: string; // /favicon-32x32.png (optional)
    apple?: string; // /apple-touch-icon.png
  };

  footer?: FooterSection[];

  // Social links, contacts
  links?: {
    github?: string;
    twitter?: string;
    email?: string;
  };
};
