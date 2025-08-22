import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <section className="min-h-dvh">{children}</section>;
}