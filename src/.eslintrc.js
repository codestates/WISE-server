module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  rules: {
    'no-console': 0,
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'off',
    ],
  },
};
