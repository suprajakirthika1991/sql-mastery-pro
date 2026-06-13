// Port the full 141-question bank from the prototype (QUIZ + QUIZ_MORE arrays).
export type QuizQ = { c: string; d: string; q: string; o: string[]; a: number; e: string };
export const QUIZ: QuizQ[] = [
  {
    c: "Fundamentals", d: "easy",
    q: "Which clause filters rows BEFORE any grouping happens?",
    o: ["HAVING", "WHERE", "GROUP BY", "ORDER BY"], a: 1,
    e: "WHERE filters rows before grouping; HAVING filters groups after aggregation.",
  },
];
