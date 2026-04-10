module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(expo.*|@expo.*|react-native|@react-native|react-navigation|@react-navigation/.*|@ungap|@react-native-async-storage|react-native-reanimated|react-native-worklets)/)"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
  ],
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@screens/(.*)$": "<rootDir>/src/screens/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@theme$": "<rootDir>/src/theme/index",
    "^@theme/(.*)$": "<rootDir>/src/theme/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@navigation/(.*)$": "<rootDir>/src/navigation/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/theme/**"
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"]
};
