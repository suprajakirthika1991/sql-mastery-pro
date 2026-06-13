import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug } });
  if (!lesson) notFound();
  return (
    <article className="prose max-w-none">
      <h1 className="font-display">{lesson.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: lesson.body }} />
      {/* TODO: terminal-styled SQL block, "Open in Playground", mark-complete button → /api/progress */}
    </article>
  );
}
