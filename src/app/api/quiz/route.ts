// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quiz?category=Joins&n=10 → random questions (answers stripped client-side scoring happens via POST)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const n = Math.min(Number(searchParams.get("n") ?? 10), 50);
  const where = category && category !== "All" ? { category } : {};
  const all = await prisma.quizQuestion.findMany({ where });
  const picked = all.sort(() => Math.random() - 0.5).slice(0, n);
  return NextResponse.json(picked);
}
