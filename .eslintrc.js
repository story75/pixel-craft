module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/member-ordering': 'error',
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
    'import/no-deprecated': 'error',
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
  ignorePatterns: ['node_modules', 'dist', '*.js', '*.cjs', '*.d.ts'],
};
