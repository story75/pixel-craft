const config = require('../../.eslintrc');
module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-call': 'off', // disable due to yargs
    '@typescript-eslint/no-unsafe-member-access': 'off', // disable due to yargs
  },
};
