module.exports = {
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.model.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!<rootDir>/out/**",
    "!<rootDir>/.next/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/src/styles/**",
    "!<rootDir>/src/mocks/**",
    "!<rootDir>/coverage/**",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    ".+\\.(css|styl|less|sass|scss|png|jpg|jpeg|ttf|woff|woff2)$":
      "identity-obj-proxy",
    "^resources-management/(.*)$": "<rootDir>/src/$1",
    "^react($|/.+)": "<rootDir>/node_modules/react$1",
  },
  setupFiles: ["jest-canvas-mock", "./src/mocks/setup-file.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};
