import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { requireLicenseHeader } from './lint-licence-rule.mjs';

export default defineConfig([
  globalIgnores(['lib/', 'node_modules/', 'src/parser/antlr/', '*.js', '*.mjs']),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'local-rules': {
        rules: {
          'require-license-header': requireLicenseHeader,
        },
      },
    },
    rules: {
      'local-rules/require-license-header': 'error',

      // TypeScript handles this natively; ESLint's no-undef doesn't understand TS types
      'no-undef': 'off',

      // Rules that are actually active in Kibana and affects the code to be migrated,
      // We can modify them once the migration is finished to avoid conflicts.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-useless-escape': 'off',
      'no-extra-boolean-cast': 'off',
      'no-useless-assignment': 'off',
      'no-constant-condition': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': 'error',
    },
  },
  eslintConfigPrettier,
]);
