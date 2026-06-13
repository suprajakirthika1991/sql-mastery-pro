import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQL Mastery Pro",
  description: "Learn SQL from zero to interview-ready.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
