module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
    'no-underscore-dangle': ['error', { allow: ['_id', '__filename', '__dirname'] }],
    'import/extensions': ['error', 'always', { ignorePackages: true }],
    'no-param-reassign': ['error', { props: false }],
  },
};
