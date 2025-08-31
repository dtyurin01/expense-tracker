import AppSidebar from "@/components/shell/sidebar/AppSidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* фиксированный сайдбар */}
      <AppSidebar />

      {/* смещаем контент вправо: 
          на xs/md = 5rem (w-20) + 1.5rem = 6.5rem,
          на lg     = 320px + 1.5rem */}
      <main className="px-2 pt-5 pl-[6.5rem] md:pl-2 lg:pl-[calc(320px+1.2rem)]">
        <section className="min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-h2 font-semibold">Your Dashboard</h1>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm">
                USD ▾
              </button>
              <button className="rounded-xl bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90">
                + Add transaction
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
