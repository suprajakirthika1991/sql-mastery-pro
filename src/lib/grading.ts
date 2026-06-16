// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

// Result-set comparison used by the challenge checker (mirrors the prototype).
export type Row = Record<string, unknown>;

export function normalizeRows(rows: Row[], ordered: boolean): string {
  const mapped = rows.map((r) =>
    Object.values(r)
      .map((v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v ?? null))
      .join("\u0001")
  );
  if (!ordered) mapped.sort();
  return mapped.join("\u0002");
}

export function isCorrect(user: Row[], expected: Row[], ordered: boolean): boolean {
  return normalizeRows(user, ordered) === normalizeRows(expected, ordered);
}
