// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress, level } from "@/lib/useProgress";

const TABS = [
  {
    id: "learn", href: "/learn", label: "Learn",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    id: "practice", href: "/practice", label: "Practice",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  },
  {
    id: "quiz", href: "/quiz", label: "Quiz",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    id: "playground", href: "/playground", label: "Playground",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  },
  {
    id: "progress", href: "/progress", label: "Progress",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    id: "tutor", href: "/tutor", label: "AI Tutor",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.9 5.7L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress } = useProgress();

  return (
    <div className="app">
      {/* desktop sidebar */}
      <nav className="sidenav">
        <div className="brand">
          <span className="logo-dot">&gt;_</span> SQL Mastery Pro
        </div>
        {TABS.map((t) => {
          const on = pathname.startsWith(t.href);
          return (
            <Link key={t.id} href={t.href} className={`nav ${on ? "on" : ""}`} style={{ textDecoration: "none" }}>
              {t.icon} {t.label}
            </Link>
          );
        })}
        <div style={{ flex: 1 }} />
        <div className="chips" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6, paddingTop: 12 }}>
          <span className="chip gold">🔥 {progress.streak} day{progress.streak === 1 ? "" : "s"}</span>
          <span className="chip xp">⬡ {progress.xp.toLocaleString()} XP · Lv {level(progress.xp)}</span>
        </div>
      </nav>

      {/* main content */}
      <main className="main">{children}</main>

      {/* mobile bottom nav */}
      <nav className="bottomnav">
        {TABS.map((t) => {
          const on = pathname.startsWith(t.href);
          return (
            <Link key={t.id} href={t.href} style={{ textDecoration: "none" }}>
              <button className={on ? "on" : ""}>
                {t.icon}
                <span>{t.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
