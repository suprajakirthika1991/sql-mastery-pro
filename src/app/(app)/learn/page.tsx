// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LESSONS } from "@/content/lessons";
import { useProgress } from "@/lib/useProgress";

export default function LearnPage() {
  const { progress } = useProgress();
  const [typed, setTyped] = useState("");
  const caretRef = useRef<NodeJS.Timeout | null>(null);

  const done = progress.completedLessons.length;
  const total = LESSONS.length;
  const pct = Math.round((done / total) * 100);
  const next = LESSONS.find((l) => !progress.completedLessons.includes(l.slug));

  useEffect(() => {
    const txt = "SELECT mastery FROM you WHERE effort = 'daily';";
    let i = 0;
    const tick = () => {
      setTyped(txt.slice(0, i));
      if (i++ <= txt.length) caretRef.current = setTimeout(tick, 28);
    };
    caretRef.current = setTimeout(tick, 200);
    return () => { if (caretRef.current) clearTimeout(caretRef.current); };
  }, []);

  return (
    <>
      {/* hero */}
      <div className="hero">
        <div className="prompt">sql&gt;</div>
        <div className="typed">
          {typed}
          <span className="caret" />
        </div>
        <div className="sub">
          {done === 0
            ? "Start with lesson 01 — no prior experience needed."
            : done === total
            ? "Curriculum complete. Keep your edge sharp in Practice and Quiz."
            : <>Up next: <b style={{ color: "#D7E2F5" }}>{next?.title}</b></>}
        </div>
      </div>

      {/* progress */}
      <div className="section">
        <div className="spread" style={{ marginBottom: 8 }}>
          <span className="eyebrow" style={{ margin: 0 }}>Course progress</span>
          <span className="muted" style={{ fontSize: "12.5px", fontWeight: 600 }}>
            {done}/{total} lessons · {pct}%
          </span>
        </div>
        <div className="progressbar">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* lesson list */}
      <div className="card">
        {LESSONS.map((l, i) => {
          const dn = progress.completedLessons.includes(l.slug);
          return (
            <Link key={l.slug} href={`/learn/${l.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="lesson-row">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="t">{l.title}</div>
                  <div className="meta">{l.minutes} min read</div>
                </div>
                <div className="right">
                  <span className={`badge ${l.level}`}>{l.level}</span>
                  <span className={`check ${dn ? "on" : ""}`}>✓</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
