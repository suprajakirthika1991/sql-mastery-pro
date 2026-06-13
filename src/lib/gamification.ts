export const XP = { lesson: 50, quizCorrect: 10, challenge: { easy: 60, medium: 100, hard: 150 } };
export const level = (xp: number) => Math.floor(xp / 250) + 1;

export function nextStreak(lastVisit: Date | null, streak: number, today = new Date()): number {
  if (!lastVisit) return 1;
  const days = Math.floor((+today - +lastVisit) / 86_400_000);
  if (days === 0) return streak;
  if (days === 1) return streak + 1;
  return 1;
}
// TODO: badge definitions + evaluation (port BADGES from prototype)
