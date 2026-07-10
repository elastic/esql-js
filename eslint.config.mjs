import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { requireLicenseHeader, mitLicenseHeader } from './lint-license-rule.mjs';

export default defineConfig([
  globalIgnores([
    '.yarn/',
    '**/lib/',
    'node_modules/',
    '**/parser/antlr/',
    // Generated ANTLR4 grammar artifacts — do not lint
    'packages/esql-grammar/src/esql_*.ts',
    'packages/esql-grammar/src/lexer_config.js',
    'packages/esql-grammar/src/parser_config.js',
    'packages/esql-promql-grammar/src/promql_*.ts',
    'packages/esql-promql-grammar/src/lexer_config.js',
    'packages/esql-promql-grammar/src/parser_config.js',
    'storybook-static/',
    '*.js',
    '*.mjs',
  ]),
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
      '@typescript-eslint/no-explicit-any': 'error',
      // TypeScript handles this natively; ESLint's no-undef doesn't understand TS types
      'no-undef': 'off',

      // Rules that are actually active in Kibana and affects the code to be migrated,
      // We can modify them once the migration is finished to avoid conflicts.
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
  {
    // @elastic/monaco-esql is MIT-licensed (unlike the rest of this
    // Elastic-2.0 monorepo), so its published source uses the MIT header.
    files: ['packages/monaco-esql/src/**/*.{ts,tsx}'],
    rules: {
      'local-rules/require-license-header': ['error', { license: mitLicenseHeader }],
    },
  },
  {
    // @elastic/prismjs-esql is MIT-licensed (unlike the rest of this
    // Elastic-2.0 monorepo), so its published source uses the MIT header.
    files: ['packages/prismjs-esql/src/**/*.{ts,tsx}'],
    rules: {
      'local-rules/require-license-header': ['error', { license: mitLicenseHeader }],
    },
  },
  eslintConfigPrettier,
  ...storybook.configs['flat/recommended'],
]);
