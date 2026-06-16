// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

import { PrismaClient } from "@prisma/client";
import { LESSONS } from "../src/content/lessons";
import { CHALLENGES } from "../src/content/challenges";
import { QUIZ } from "../src/content/quiz";

const prisma = new PrismaClient();

async function main() {
  for (const [i, l] of LESSONS.entries()) {
    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: { ...l, order: i },
      create: { ...l, order: i },
    });
  }
  for (const c of CHALLENGES) {
    await prisma.challenge.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  await prisma.quizQuestion.deleteMany();
  await prisma.quizQuestion.createMany({
    data: QUIZ.map((q) => ({
      category: q.c, difficulty: q.d, question: q.q,
      options: q.o, answerIndex: q.a, explanation: q.e,
    })),
  });
  console.log(`Seeded ${LESSONS.length} lessons, ${CHALLENGES.length} challenges, ${QUIZ.length} quiz questions`);
}
main().finally(() => prisma.$disconnect());
