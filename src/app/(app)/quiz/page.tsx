// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useState } from "react";
import { QUIZ, QuizQ } from "@/content/quiz";
import { useProgress } from "@/lib/useProgress";

interface QuizState {
  qs: QuizQ[];
  i: number;
  correct: number;
  answered: number | null;
  finished: boolean;
}

const ALL_CATS = ["All", ...Array.from(new Set(QUIZ.map((q) => q.c)))];

export default function QuizPage() {
  const { progress, recordQuiz } = useProgress();
  const [cat, setCat] = useState("All");
  const [len, setLen] = useState(10);
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  function startQuiz() {
    const src = cat === "All" ? QUIZ : QUIZ.filter((q) => q.c === cat);
    const pool = [...src].sort(() => Math.random() - 0.5).slice(0, Math.min(len, src.length));
    setQuiz({ qs: pool, i: 0, correct: 0, answered: null, finished: false });
  }

  function answerQ(i: number) {
    if (!quiz || quiz.answered !== null) return;
    const correct = quiz.qs[quiz.i].a === i;
    setQuiz((q) => q ? { ...q, answered: i, correct: q.correct + (correct ? 1 : 0) } : q);
  }

  function nextQ() {
    if (!quiz) return;
    if (quiz.i === quiz.qs.length - 1) {
      recordQuiz(quiz.correct + (quiz.answered === quiz.qs[quiz.i].a ? 0 : 0), quiz.qs.length);
      // Note: correct already counted in answerQ
      const finalCorrect = quiz.correct;
      recordQuiz(finalCorrect, quiz.qs.length);
      setQuiz((q) => q ? { ...q, finished: true } : q);
    } else {
      setQuiz((q) => q ? { ...q, i: q.i + 1, answered: null } : q);
    }
  }

  // Quiz setup screen
  if (!quiz) {
    const poolSize = cat === "All" ? QUIZ.length : QUIZ.filter((q) => q.c === cat).length;
    return (
      <div className="card" style={{ padding: 22 }}>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>Interview-style quiz</h2>
        <p className="muted" style={{ marginBottom: 14 }}>
          Randomised questions from a bank of <b>{QUIZ.length}</b> covering {ALL_CATS.length - 1} topics.
          Every answer comes with a full explanation. +10 XP per correct answer.
        </p>

        <div className="eyebrow">Topic</div>
        <div className="row" style={{ marginBottom: 14, flexWrap: "wrap" }}>
          {ALL_CATS.map((c) => (
            <button
              key={c}
              className="sample-chip"
              style={cat === c ? { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--accent-soft)" } : {}}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="eyebrow">Length</div>
        <div className="row" style={{ marginBottom: 18 }}>
          {[10, 20].map((n) => (
            <button
              key={n}
              className="sample-chip"
              style={len === n ? { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--accent-soft)" } : {}}
              onClick={() => setLen(n)}
            >
              {n} questions
            </button>
          ))}
          <span className="muted" style={{ fontSize: 12 }}>{poolSize} available</span>
        </div>

        <div className="row">
          <button className="btn primary" onClick={startQuiz}>Start quiz</button>
          {progress.quizzesTaken > 0 && (
            <span className="muted" style={{ fontSize: 13 }}>
              Best score: <b>{progress.quizBest}%</b> · {progress.quizzesTaken} attempt{progress.quizzesTaken === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Results screen
  if (quiz.finished) {
    const pct = Math.round((quiz.correct / quiz.qs.length) * 100);
    const r = 54, circ = 2 * Math.PI * r;
    const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--gold)" : "var(--red)";
    return (
      <div className="card" style={{ padding: 24, textAlign: "center" }}>
        <div className="eyebrow">Quiz complete</div>
        <div className="scorering">
          <svg width="130" height="130">
            <circle cx="65" cy="65" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
            <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} />
          </svg>
          <div className="v">
            <b>{pct}%</b>
            <span className="muted" style={{ fontSize: 12 }}>{quiz.correct}/{quiz.qs.length} correct</span>
          </div>
        </div>
        <p className="muted" style={{ marginBottom: 6 }}>
          {pct === 100 ? "Flawless. Interview-ready on these topics." : pct >= 70 ? "Strong result — review the explanations you missed and you're there." : "Good start — revisit the related lessons, then try again."}
        </p>
        <p className="muted" style={{ fontSize: "12.5px", marginBottom: 18 }}>
          Earned {quiz.correct * 10} XP · Best score: {progress.quizBest}%
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn primary" onClick={startQuiz}>Try another {len}</button>
          <button className="btn ghost" onClick={() => setQuiz(null)}>Back to setup</button>
        </div>
      </div>
    );
  }

  // Question screen
  const q = quiz.qs[quiz.i];
  return (
    <>
      <div className="qmeter">
        {quiz.qs.map((_, i) => (
          <i key={i} className={i <= quiz.i ? "done" : ""} />
        ))}
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className={`badge ${q.d}`}>{q.d}</span>
        <span className="chip">{q.c}</span>
        <span className="muted" style={{ fontSize: "12.5px", marginLeft: "auto" }}>
          Question {quiz.i + 1} of {quiz.qs.length}
        </span>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 17, lineHeight: 1.45, marginBottom: 16 }}>{q.q}</h2>
        {q.o.map((opt, i) => {
          let cls = "";
          if (quiz.answered !== null) {
            if (i === q.a) cls = "correct";
            else if (i === quiz.answered) cls = "wrong";
          }
          return (
            <button
              key={i}
              className={`opt ${cls}`}
              disabled={quiz.answered !== null}
              onClick={() => answerQ(i)}
            >
              <span className="key">{"ABCD"[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
        {quiz.answered !== null && (
          <>
            <div className={`callout ${quiz.answered === q.a ? "tip" : "warn"}`} style={{ marginTop: 8 }}>
              <b>{quiz.answered === q.a ? "Correct" : "Explanation"}</b>
              {q.e}
            </div>
            <button className="btn primary" onClick={nextQ}>
              {quiz.i === quiz.qs.length - 1 ? "See results" : "Next question"} →
            </button>
          </>
        )}
      </div>
    </>
  );
}
