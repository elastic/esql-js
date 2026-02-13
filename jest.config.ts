import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  // Only treat *.test.ts files as test suites (excludes fixtures, helpers, etc. in __tests__/)
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    // rewriteRelativeImportExtensions rewrites .ts → .js in transpiled output;
    // this maps those .js imports back so Jest can resolve the .ts source files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.[jt]s$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: {
          // Override to CommonJS for tests so --experimental-vm-modules is not needed
          module: 'commonjs',
          // Allow transforming .js files (needed for ANTLR-generated ESM files)
          allowJs: true,
        },
      },
    ],
  },
};

export default config;
