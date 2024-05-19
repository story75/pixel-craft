// @ts-check

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import url from 'node:url';
import tseslint from 'typescript-eslint';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default tseslint.config(
  {
    plugins: {
      ['import']: importPlugin,
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      'eslint.config.mjs',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.es2020,
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './apps/*/tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // only allow camelCase or _
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          custom: {
            regex: '^_.+',
            match: false,
          },
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
        {
          selector: 'classProperty',
          modifiers: ['readonly'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'classProperty',
          modifiers: ['static'],
          format: ['PascalCase', 'UPPER_CASE'],
        },
        {
          // only allow camelCase, UPPER_CASE or _
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          custom: {
            regex: '^_.+',
            match: false,
          },
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          // do not check import format, because we do not control every import
          selector: 'import',
          format: null,
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      'import/no-deprecated': 'off', // disabled because it does not work with eslint v9 yet
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.js',
            '**/*.spec.js',
            '**/*.test.ts',
            '**/*.spec.ts',
          ],
        },
      ],
      'no-console': 'error',
      'object-shorthand': ['error', 'always'],
      'require-await': 'error',
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['demos/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['packages/cli/**/*.ts', 'packages/tooling/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unsafe-call': 'off', // disable due to yargs
      '@typescript-eslint/no-unsafe-member-access': 'off', // disable due to yargs
    },
  },
  {
    files: [
      'apps/level-editor/**/*.ts',
      'apps/level-editor/**/*.tsx',
      'apps/level-editor/**/*.js',
      'apps/level-editor/**/*.mts',
    ],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
);
