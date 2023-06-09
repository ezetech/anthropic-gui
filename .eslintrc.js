module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['build/**/*.js', 'public/**/*.js', 'config-overrides.js'],
  overrides: [
    {
      files: ['.eslintrc.js'],
      rules: {
        'sort-keys-fix/sort-keys-fix': [
          'error',
          'asc',
          {
            caseSensitive: false,
          },
        ],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jest',
    'import',
    'sort-keys-fix',
  ],

  root: true,
  rules: {
    '@typescript-eslint/default-param-last': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      { format: ['UPPER_CASE'], selector: 'enum' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'arrow-body-style': ['error', 'as-needed'],
    'import/no-extraneous-dependencies': 'off',

    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'external',
            pattern: 'react',
            position: 'before',
          },
          {
            group: 'internal',
            pattern: '@/**',
            position: 'before',
          },
          {
            group: 'object',
            pattern: '{.,..}/**/*.scss',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        warnOnUnassignedImports: true,
      },
    ],
    'linebreak-style': 'off',
    'no-console': 1,
    'prefer-const': 'error',

    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-uses-react': 'off',
    'react/no-array-index-key': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
    react: {
      version: 'detect',
    },
  },
};
