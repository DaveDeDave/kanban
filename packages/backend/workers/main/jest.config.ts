import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true
      }
    ]
  },
  setupFilesAfterEnv: ["./test/test.setup.ts"]
};

export default config;
