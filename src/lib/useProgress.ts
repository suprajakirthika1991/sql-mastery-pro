// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useState, useEffect, useCallback } from "react";

export interface Progress {
  xp: number;
  completedLessons: string[];
  solvedChallenges: string[];
  quizBest: number;
  quizzesTaken: number;
  streak: number;
  lastVisit: string | null;
}

const KEY = "sqlmastery:v1";
const DEFAULT: Progress = {
  xp: 0,
  completedLessons: [],
  solvedChallenges: [],
  quizBest: 0,
  quizzesTaken: 0,
  streak: 1,
  lastVisit: null,
};

function load(): Progress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function level(xp: number) {
  return Math.floor(xp / 250) + 1;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT);

  useEffect(() => {
    const p = load();
    const today = new Date().toISOString().slice(0, 10);
    if (p.lastVisit) {
      const diff = (new Date(today).getTime() - new Date(p.lastVisit).getTime()) / 86400000;
      if (diff === 1) p.streak += 1;
      else if (diff > 1) p.streak = 1;
    }
    p.lastVisit = today;
    save(p);
    setProgress(p);
  }, []);

  const update = useCallback((updater: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  const completeLesson = useCallback(
    (slug: string) => {
      update((p) => {
        if (p.completedLessons.includes(slug)) return p;
        return { ...p, xp: p.xp + 50, completedLessons: [...p.completedLessons, slug] };
      });
    },
    [update]
  );

  const solveChallenge = useCallback(
    (slug: string, xp: number) => {
      update((p) => {
        if (p.solvedChallenges.includes(slug)) return p;
        return { ...p, xp: p.xp + xp, solvedChallenges: [...p.solvedChallenges, slug] };
      });
    },
    [update]
  );

  const recordQuiz = useCallback(
    (correct: number, total: number) => {
      update((p) => {
        const pct = Math.round((correct / total) * 100);
        return {
          ...p,
          xp: p.xp + correct * 10,
          quizzesTaken: p.quizzesTaken + 1,
          quizBest: Math.max(p.quizBest, pct),
        };
      });
    },
    [update]
  );

  return { progress, completeLesson, solveChallenge, recordQuiz, update };
}
