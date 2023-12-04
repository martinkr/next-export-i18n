/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      // using a custom tsconfig file
      tsconfig: "tsconfig.jest.json",
    },
  },
  moduleDirectories: ["node_modules", "<rootDir>/node_modules", "."],
  moduleNameMapper: {
    "^src(.*)$": "<rootDir>/src$1",
  },

  testPathIgnorePatterns: ["/dist/*"],
  setupFilesAfterEnv: [
    // '@testing-library/react/cleanup-after-each',
    // '@testing-library/jest-dom/extend-expect',
  ],
  roots: ["./src"],
};
