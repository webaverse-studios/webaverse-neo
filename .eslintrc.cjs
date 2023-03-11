module.exports = {
  extends: ['@webaverse-studios'],
  env: {
    node: true,
  },
  rules: {
    'max-len': [
      1,
      {
        code: 110,
        comments: 110,
        ignoreUrls: true,
      },
    ],
  },
}
