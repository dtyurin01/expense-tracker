export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto py-6">
        <div className="flex gap-6">
          <aside className="w-[280px] shrink-0">
            <Sidebar />
          </aside>

          <section className="flex-1 min-w-0 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-h2 font-semibold">Dashboard</h1>
              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm">
                  USD ▾
                </button>
                <button className="rounded-xl bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90">
                  + Add expense
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
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const items = [
    { label: 'Dashboard', active: true, icon: '▦' },
    { label: 'Accounts', icon: '💳' },
    { label: 'Receipts', icon: '🧾' },
    { label: 'Statistics', icon: '📊' },
  ];

  return (
    // 1) фикс-ширина + высота на весь видпорт
    <aside className="w-[280px] shrink-0 sticky top-6 h-dvh">
      {/* 2) ВНУТРЕННЯЯ КАРТОЧКА ДОЛЖНА БЫТЬ flex и h-full */}
      <div className="h-full flex flex-col rounded-2xl border border-border bg-surface p-4">
        {/* Лого */}
        <div className="mb-4 flex items-center gap-2">
          <div className="size-8 rounded-xl bg-brand" />
          <span className="text-h5 font-semibold">PocketPulse</span>
        </div>

        {/* 3) Навигация растягивается и выталкивает низ */}
        <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
          {items.map(i => (
            <a
              key={i.label}
              href="#"
              aria-current={i.active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm
                ${i.active ? 'bg-surface-2' : 'hover:bg-surface-2'}`}
            >
              <span className="inline-flex size-5 items-center justify-center">{i.icon}</span>
              {i.label}
            </a>
          ))}
        </nav>

        {/* 4) НИЖНИЙ БЛОК — ПРИЖАТ ВНИЗ */}
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-border p-4">
            <div className="text-sm font-medium">Explore plans</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Free trial ends soon – 7 days left
            </p>
            <button className="mt-3 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm">
              Upgrade
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
            <div className="size-9 rounded-full bg-surface-2" />
            <div className="text-sm">
              <div>Nicholas Brown</div>
              <div className="text-xs text-muted-foreground">Member</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
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
