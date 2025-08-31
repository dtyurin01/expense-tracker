"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { navItems } from "@/config/nav";
import { menuItems, isActivePath } from "@/config/menu";

import { UpgradeCard } from "@/components/shell/cards/UpgradeCard";
import { UserCard } from "@/components/shell/cards/UserCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function AppSidebar() {
  const pathname = usePathname();
  const [mdOpen, setMdOpen] = React.useState(true);

  return (
    <>
      {!mdOpen && (
        <button
          onClick={() => setMdOpen(true)}
          aria-label="Open sidebar"
          className="hidden md:flex lg:hidden fixed z-50 top-1/2 left-2 -translate-y-1/2
                     size-9 items-center justify-center rounded-full
                     border border-border bg-surface shadow-md
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <FiChevronRight className="size-5" aria-hidden />
        </button>
      )}

      <aside
        className={cn(
          "fixed inset-y-2 left-1 shrink-0 w-20 lg:w-[320px]",
          "transition-transform duration-200 ease-out will-change-transform",
          !mdOpen && "md:-translate-x-[calc(100%+0.5rem)] lg:translate-x-0"
        )}
      >
        <div className="relative h-full flex flex-col rounded-2xl border border-border bg-surface p-2 lg:p-4">
          <button
            onClick={() => setMdOpen(false)}
            aria-label="Close sidebar"
            className="hidden md:flex lg:hidden absolute z-10 top-1/2 -translate-y-1/2 -right-3
                       size-9 items-center justify-center rounded-full
                       border border-border bg-surface shadow-md
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            <FiChevronLeft className="size-5" aria-hidden />
          </button>

          <div className="mb-3 lg:mb-4 flex w-full items-center gap-2 justify-start md:justify-center px-2 lg:justify-start">
            <div className="relative size-8 rounded-xl overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-300 to-brand-700" />
            </div>
            <span className="hidden lg:inline text-h5 font-semibold">
              PocketPulse
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto pr-0 lg:pr-1 space-y-1 pb-3 lg:pb-4">
            {navItems.map((i) => {
              const Icon = i.icon;
              const active = isActivePath(pathname, i.href);

              return (
                <Link
                  key={i.label}
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={i.label}
                  title={i.label}
                  className={cn(
                    "flex w-full items-center rounded-2xl text-md transition-colors",
                    "h-10 px-0 lg:px-3",
                    "justify-center lg:justify-start",
                    active
                      ? "bg-surface/70 border border-border"
                      : "hover:bg-surface/60"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-5 items-center justify-center",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {Icon && <Icon className="size-5" aria-hidden />}
                  </span>
                  <span className="ml-0 lg:ml-3 hidden lg:inline">
                    {i.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 lg:mt-6 space-y-3 lg:space-y-6">
            <div className="hidden md:flex lg:hidden justify-center">
              <UpgradeCard
                variant="pill"
                pillSize="sm"
                href="/pricing"
                label="pro"
              />
            </div>

            <UpgradeCard
              variant="full"
              className="hidden lg:block"
              title="Explore plans"
              href="/pricing"
            />

            <div className="flex justify-center lg:block">
              <UserCard
                variant="avatar"
                size="md"
                name="Nicholas Brown"
                className="lg:hidden"
                aria-label="Open profile"
              />
            </div>

            <UserCard
              variant="full"
              size="md"
              name="Nicholas Brown"
              subtitle="Member"
              className="hidden lg:flex"
              menuItems={menuItems}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
