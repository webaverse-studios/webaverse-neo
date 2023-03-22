module.exports = {
  root: true,
  extends: ['@webaverse-studios'],
  env: {
    node: true,
  },
  ignorePatterns: ['**/node_modules/**', '**/old_packages/**'],
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'max-len': [
      1,
      {
        ignorePattern: 'import.*',
        ignoreUrls: true,
      },
    ],
  },
}
