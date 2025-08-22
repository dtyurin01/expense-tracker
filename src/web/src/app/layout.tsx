import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

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
