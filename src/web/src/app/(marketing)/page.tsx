import Image from "next/image";
import { GiMoneyStack } from "react-icons/gi";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-6 shadow">
        <h1 className="text-h2 font-semibold">Заголовок</h1>
        <p className="mt-2 text-muted-foreground">Some Text</p>

        <button className="mt-6 inline-flex items-center rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand">
          Button
        </button>
      </div>
    </main>
  );
}
