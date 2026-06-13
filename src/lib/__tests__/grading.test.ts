import { isCorrect } from "../grading";

test("order-insensitive comparison", () => {
  expect(isCorrect([{ a: 1 }, { a: 2 }], [{ a: 2 }, { a: 1 }], false)).toBe(true);
  expect(isCorrect([{ a: 1 }, { a: 2 }], [{ a: 2 }, { a: 1 }], true)).toBe(false);
});

test("numeric rounding tolerance", () => {
  expect(isCorrect([{ v: 0.1 + 0.2 }], [{ v: 0.3 }], true)).toBe(true);
});
