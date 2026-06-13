import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const [user, lessons, solved] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.lessonProgress.count({ where: { userId } }),
    prisma.challengeSubmission.groupBy({ by: ["challengeId"], where: { userId, correct: true } }),
  ]);
  return NextResponse.json({ xp: user?.xp ?? 0, streak: user?.streak ?? 1, lessonsCompleted: lessons, challengesSolved: solved.length });
}
// TODO: POST handlers — mark lesson complete (+50 XP), record quiz attempt, record challenge submission
