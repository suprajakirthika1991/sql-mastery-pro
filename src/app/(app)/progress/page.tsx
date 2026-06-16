// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useProgress, level } from "@/lib/useProgress";
import { LESSONS } from "@/content/lessons";
import { CHALLENGES } from "@/content/challenges";
import { Progress } from "@/lib/useProgress";

const BADGES = [
  { id: "first", ic: "🌱", t: "First Query", cond: (s: Progress) => s.completedLessons.length >= 1, d: "Complete your first lesson" },
  { id: "l5", ic: "📘", t: "Bookworm", cond: (s: Progress) => s.completedLessons.length >= 5, d: "Complete 5 lessons" },
  { id: "lall", ic: "🎓", t: "Curriculum Clear", cond: (s: Progress) => s.completedLessons.length >= LESSONS.length, d: "Complete every lesson" },
  { id: "c1", ic: "⚡", t: "Problem Solver", cond: (s: Progress) => s.solvedChallenges.length >= 1, d: "Solve a challenge" },
  { id: "c5", ic: "🛠️", t: "Query Builder", cond: (s: Progress) => s.solvedChallenges.length >= 5, d: "Solve 5 challenges" },
  { id: "call", ic: "🏆", t: "Challenge Champion", cond: (s: Progress) => s.solvedChallenges.length >= CHALLENGES.length, d: "Solve every challenge" },
  { id: "q80", ic: "🧠", t: "Sharp Mind", cond: (s: Progress) => s.quizBest >= 80, d: "Score 80%+ on a quiz" },
  { id: "q100", ic: "💎", t: "Perfect Run", cond: (s: Progress) => s.quizBest >= 100, d: "Score 100% on a quiz" },
  { id: "xp1k", ic: "🚀", t: "Level Up", cond: (s: Progress) => s.xp >= 1000, d: "Earn 1,000 XP" },
];

function recommendation(p: Progress): string {
  const nextLesson = LESSONS.find((l) => !p.completedLessons.includes(l.slug));
  const nextCh = CHALLENGES.find((c) => !p.solvedChallenges.includes(c.slug));
  if (p.completedLessons.length < 3 && nextLesson) return `📘 Build your foundation: continue with "${nextLesson.title}" in Learn.`;
  if (nextCh && p.solvedChallenges.length < p.completedLessons.length) return `⚡ Time to apply what you've learned: try the challenge "${nextCh.title}" in Practice.`;
  if (p.quizzesTaken === 0) return "🧠 Benchmark yourself: take your first quiz to find weak spots.";
  if (nextLesson) return `📘 Keep momentum: your next lesson is "${nextLesson.title}".`;
  if (nextCh) return `⚡ Push to Challenge Champion: "${nextCh.title}" is still unsolved.`;
  if (p.quizBest < 100) return "💎 One goal left: a perfect 100% quiz run.";
  return "🏆 You've cleared everything here. Next step: install PostgreSQL, rebuild these datasets, and practise window functions and EXPLAIN plans.";
}

export default function ProgressPage() {
  const { progress } = useProgress();
  const lvl = level(progress.xp);
  const inLvl = progress.xp % 250;
  const earned = BADGES.filter((b) => b.cond(progress));

  return (
    <>
      <div className="statgrid section">
        <div className="stat card"><div className="v">{progress.xp.toLocaleString()}</div><div className="l">Total XP</div></div>
        <div className="stat card"><div className="v">Lv {lvl}</div><div className="l">{250 - inLvl} XP to next level</div></div>
        <div className="stat card"><div className="v">{progress.streak}🔥</div><div className="l">Day streak</div></div>
        <div className="stat card"><div className="v">{progress.quizBest}%</div><div className="l">Best quiz score</div></div>
      </div>

      <div className="section">
        <div className="eyebrow">Level progress</div>
        <div className="progressbar"><i style={{ width: `${(inLvl / 250) * 100}%` }} /></div>
      </div>

      <div className="statgrid section" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <div className="stat card">
          <div className="v">{progress.completedLessons.length}/{LESSONS.length}</div>
          <div className="l">Lessons completed</div>
        </div>
        <div className="stat card">
          <div className="v">{progress.solvedChallenges.length}/{CHALLENGES.length}</div>
          <div className="l">Challenges solved</div>
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Achievements · {earned.length}/{BADGES.length}</div>
        <div className="badgegrid">
          {BADGES.map((b) => (
            <div key={b.id} className={`bdg ${b.cond(progress) ? "" : "locked"}`}>
              <div className="ic">{b.ic}</div>
              <div className="t">{b.t}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{b.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Recommended next step</div>
        <div className="card" style={{ padding: 16 }}>{recommendation(progress)}</div>
      </div>
    </>
  );
}
