import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage ?? '/og.png' }],
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',  
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage ?? '/og.png'],
    creator: siteConfig.links?.twitter,
  },
  icons: {
    icon: siteConfig.icons?.icon,
    shortcut: siteConfig.icons?.shortcut,
    apple: siteConfig.icons?.apple,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.themeColorLight ?? '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: siteConfig.themeColorDark ?? '#000000' },
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`dark ${GeistMono.variable} ${GeistSans.variable}`}>
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
