import AppSidebar from "@/components/shell/sidebar/AppSidebar";
import { FiSearch, FiBell } from "react-icons/fi";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />

      <main className="px-3 pt-5 pl-[6.5rem] md:pl-2 lg:pl-[calc(320px+1.2rem)]">
        <section className="min-w-0 space-y-6">
          <div className="flex items-center">
            <div className="pl-2">
              <h1 className="text-2xl font-semibold leading-tight">Dashboard</h1>
              <p className="mt-1 text-md text-muted-foreground">
                Hi Nicholas, here are your financial stats
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                aria-label="Search"
                className="grid size-10 place-items-center rounded-full border border-border bg-surface/10 hover:bg-surface/20"
              >
                <FiSearch className="size-5" />
              </button>
              <button
                aria-label="Notifications"
                className="relative hidden sm:grid size-10 place-items-center rounded-full border border-border bg-surface/10 hover:bg-surface/20"
              >
                <FiBell className="size-5" />
                <span
                  aria-hidden
                  className="absolute right-2 top-2 size-2 rounded-full bg-error"
                />
              </button>
              <button className="h-10 rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand-600">
                <span className="hidden md:inline">+ Add transaction</span>
                <span className="md:hidden">＋</span>
              </button>
            </div>
          </div>

          {/* Row 2 — заголовок слева, ЕДИНЫЙ блок фильтров справа */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* ВАЖНО: один общий правый блок, который уезжает вправо */}
            <div className="ml-auto flex items-center gap-2">
              {/* Segments */}
              <div className="inline-flex h-10 items-center rounded-2xl border border-border bg-surface-2 p-0.5">
                <button className="rounded-xl px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                  Personal
                </button>
                <button className="rounded-xl bg-surface px-3 py-1.5 text-sm font-medium">
                  All family
                </button>
              </div>

              {/* Currency — рядом с сегментами, той же высоты */}
              <button className="h-10 rounded-xl border border-border bg-surface-2 px-3 text-sm">
                USD <span className="align-[-1px]">▾</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <Card className="col-span-12 lg:col-span-8" title="Total balance">
              <Placeholder height="h-52" />
            </Card>

            <Card
              className="col-span-12 lg:col-span-4"
              title="Receipts split summary"
              footer
            >
              <Placeholder height="h-52" />
            </Card>

            <Card
              className="col-span-12 md:col-span-6 lg:col-span-4"
              title="Income & Expenses"
            >
              <Placeholder height="h-48" />
            </Card>

            <Card
              className="col-span-12 md:col-span-6 lg:col-span-4"
              title="Spending categories"
              footer
            >
              <Placeholder height="h-48" />
            </Card>

            <Card
              className="col-span-12 lg:col-span-4"
              title="Latest transactions"
              footer
            >
              <Placeholder height="h-48" />
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({
  title,
  className = "",
  children,
  footer,
}: {
  title: string;
  className?: string;
  children?: React.ReactNode;
  footer?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-4 md:p-6 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-h6 font-semibold">{title}</h3>
        <button className="rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs">
          ☰
        </button>
      </div>
      {children}
      {footer && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            Updated just now
          </span>
          <button className="rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs">
            View report ↗
          </button>
        </div>
      )}
    </section>
  );
}

function Placeholder({ height }: { height: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface-2 ${height}`} />
  );
}
