module.exports = {
  extends: ['@webaverse-studios'],
  env: {
    node: true,
  },
  rules: {
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
        ignorePattern: '^import .*',
        ignoreUrls: true,
      },
    ],
  },
}
