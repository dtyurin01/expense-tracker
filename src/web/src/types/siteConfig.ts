export type SiteLink = { label: string; href: string };

export type SiteFooterSection = {
  title: string;
  links: SiteLink[];
};

export type SiteIcons = {
  icon: string;
  shortcut?: string;
  apple?: string;
};

export type SiteLinks = {
  github?: string;
  twitter?: string;
  email?: string;
  [key: string]: string | undefined;
};

export type SiteConfig = {
  name: string;
  shortName?: string;
  description?: string;
  url?: string;
  locale?: string;
  keywords?: string[];
  creator?: string;
  themeColorLight?: string;
  themeColorDark?: string;
  ogImage?: string;
  icons?: SiteIcons;
  footer?: SiteFooterSection[];
  links?: SiteLinks;
};
