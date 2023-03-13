module.exports = {
  extends: ['@webaverse-studios'],
  env: {
    node: true,
  },
  rules: {
    'max-len': [
      1,
      {
        code: 85,
        comments: 85,
        ignoreUrls: true,
      },
    ],
  },
}
