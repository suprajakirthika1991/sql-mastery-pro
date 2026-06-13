module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEach: undefined,
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  transform: { "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }] },
};
