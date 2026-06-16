// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LESSONS } from "@/content/lessons";
import { useProgress } from "@/lib/useProgress";

function highlightSQL(sql: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let h = esc(sql)
    .replace(/--[^\n]*/g, (m) => `\x01c${m}\x02`)
    .replace(/'[^']*'/g, (m) => `\x01s${m}\x02`)
    .replace(/\b(\d+(\.\d+)?)\b/g, "\x01n$1\x02")
    .replace(
      /\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|ON|AS|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|DISTINCT|UNION|ALL|CASE|WHEN|THEN|ELSE|END|WITH|OVER|PARTITION BY|DESC|ASC|EXCEPT|INTERSECT|INSERT|UPDATE|DELETE|CREATE|TABLE|VALUES|EXISTS|SUBSTR)\b/gi,
      "\x01k$1\x02"
    )
    .replace(
      /\b(COUNT|SUM|AVG|MIN|MAX|ROUND|UPPER|LOWER|COALESCE|SUBSTR|SUBSTRING|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|NTILE|CONCAT|LENGTH)(?=\s*\()/gi,
      "\x01f$1\x02"
    );
  h = h.replace(/\x01(k|s|n|f|c)/g, '<span class="$1">').replace(/\x02/g, "</span>");
  return h;
}

function SqlBlock({ sql }: { sql: string }) {
  return (
    <div className="term">
      <div className="bar">
        <span className="dots"><i /><i /><i /></span>sql
      </div>
      <pre dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }} />
    </div>
  );
}

export default function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { progress, completeLesson } = useProgress();

  const idx = LESSONS.findIndex((l) => l.slug === slug);
  const lesson = LESSONS[idx];
  const nextLesson = LESSONS[idx + 1];

  if (!lesson) {
    return <div className="loading">Lesson not found. <Link href="/learn">← Back</Link></div>;
  }

  const done = progress.completedLessons.includes(lesson.slug);

  const handleComplete = () => {
    completeLesson(lesson.slug);
  };

  const handlePlayground = () => {
    sessionStorage.setItem("sqlmastery:pendingSQL", lesson.sql);
    router.push("/playground");
  };

  return (
    <>
      <button className="backlink" onClick={() => router.push("/learn")}>← All lessons</button>
      <div className="row" style={{ marginBottom: 6 }}>
        <span className={`badge ${lesson.level}`}>{lesson.level}</span>
        <span className="muted" style={{ fontSize: "12.5px" }}>
          {lesson.minutes} min · Lesson {String(idx + 1).padStart(2, "0")}
        </span>
      </div>
      <h2 style={{ fontSize: 24, marginBottom: 14 }}>{lesson.title}</h2>

      <div className="lesson-body">
        <div className="callout tip">
          <b>Why this matters</b>
          {lesson.why}
        </div>
        <div className="callout analogy">
          <b>Real-world analogy</b>
          {lesson.analogy}
        </div>
        <div dangerouslySetInnerHTML={{ __html: lesson.body }} />

        <h3>Try it yourself</h3>
        <SqlBlock sql={lesson.sql} />
        <div className="row" style={{ margin: "4px 0 14px" }}>
          <button className="btn primary small" onClick={handlePlayground}>▶ Open in Playground</button>
        </div>

        <h3>Common mistakes</h3>
        <div className="callout warn">
          <b>Watch out</b>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {lesson.mistakes.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>

        <h3>Key takeaways</h3>
        <ul>{lesson.takeaways.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>

      <div className="row" style={{ marginTop: 20 }}>
        {done ? (
          <span className="badge done" style={{ padding: "8px 14px", fontSize: 13 }}>✓ Completed</span>
        ) : (
          <button className="btn primary" onClick={handleComplete}>Mark complete · +50 XP</button>
        )}
        {nextLesson && (
          <Link href={`/learn/${nextLesson.slug}`}>
            <button className="btn ghost">Next: {nextLesson.title} →</button>
          </Link>
        )}
      </div>
    </>
  );
}
