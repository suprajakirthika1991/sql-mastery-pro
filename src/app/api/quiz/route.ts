// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

import { NextResponse } from "next/server";
import { QUIZ } from "@/content/quiz";

// GET /api/quiz?category=Joins&n=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const n = Math.min(Number(searchParams.get("n") ?? 10), 50);
  const all = category && category !== "All" ? QUIZ.filter((q) => q.c === category) : QUIZ;
  const picked = [...all].sort(() => Math.random() - 0.5).slice(0, n);
  return NextResponse.json(picked);
}
