import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-10">
      <h1 className="font-display text-3xl font-bold">SQL Mastery Pro</h1>
      <p className="mt-2 text-zinc-600">From your first SELECT to interview-ready window functions.</p>
      <Link href="/learn" className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-semibold text-white">
        Start learning
      </Link>
    </main>
  );
}
