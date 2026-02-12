import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  // Tells Jest to treat .ts files as ESM (required for native ESM support)
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;
