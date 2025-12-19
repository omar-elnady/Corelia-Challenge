export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          types: ["node", "jest", "@testing-library/jest-dom", "vite/client"],
          lib: ["dom", "dom.iterable", "esnext"],
          jsx: "react-jsx",
          esModuleInterop: true,
        },
        diagnostics: {
          ignoreCodes: [2307],
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup/setupTests.ts"],
};
