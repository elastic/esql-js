import { baseConfig } from '../../jest.config.base.js';

/** @type {import('jest').Config} */
export default {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  transformIgnorePatterns: [],
};
