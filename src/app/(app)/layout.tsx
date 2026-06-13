// App shell: side nav (desktop) / bottom nav (mobile) — port chrome from the prototype.
import Link from "next/link";
const tabs = ["learn", "practice", "quiz", "playground", "progress", "tutor"] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <nav className="hidden w-56 flex-col gap-1 border-r bg-white p-4 md:flex">
        {tabs.map((t) => (
          <Link key={t} href={`/${t}`} className="rounded-lg px-3 py-2 font-semibold capitalize hover:bg-accent-soft">
            {t}
          </Link>
        ))}
      </nav>
      <main className="mx-auto w-full max-w-3xl p-6">{children}</main>
    </div>
  );
}
