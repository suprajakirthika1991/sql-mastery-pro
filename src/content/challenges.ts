// Port all 12 challenges from the prototype. One example included.
export const CHALLENGES = [
  {
    slug: "high-earners",
    title: "High earners",
    level: "easy",
    xp: 60,
    ordered: true,
    prompt: "List the name and salary of every employee earning more than 120,000, highest first.",
    tables: ["employees"],
    hints: ["Two columns, one filter, one sort.", "WHERE salary > 120000, ORDER BY salary DESC."],
    solution: "SELECT name, salary FROM employees WHERE salary > 120000 ORDER BY salary DESC;",
  },
];
