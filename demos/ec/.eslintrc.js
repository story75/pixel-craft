const config = require('../../.eslintrc');
module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-console': 'off',
  },
};
