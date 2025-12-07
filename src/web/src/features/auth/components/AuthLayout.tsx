import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitleText: string;
  subtitleLinkText: string;
  subtitleLinkHref: string;
}

export function AuthLayout({
  children,
  title,
  subtitleText,
  subtitleLinkText,
  subtitleLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-svh grid place-items-center bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_circle_at_20%_20%,hsl(198_81%_67%/.06),transparent_60%),radial-gradient(600px_circle_at_80%_80%,hsl(198_81%_67%/.06),transparent_60%)]" />

      <div className="w-[92%] max-w-md rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur p-6 sm:p-7 z-10">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 grid size-12 place-items-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
            <Image
              src="/PocketPulseLogo.svg"
              alt="PocketPulse"
              width={24}
              height={24}
              priority
            />
          </div>
          <h1 className="text-h5 sm:text-h4 font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitleText}{" "}
            <Link
              href={subtitleLinkHref}
              className="text-brand hover:text-brand-600"
            >
              {subtitleLinkText}
            </Link>
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
