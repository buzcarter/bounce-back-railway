/* eslint-disable no-unused-vars, no-multi-spaces */
const OFF       = 0;
const WARNING   = 1;
const ERROR     = 2;
/* eslint-enable no-unused-vars, no-multi-spaces */

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    './node_modules/eslint-config-airbnb-base/rules/best-practices',
    './node_modules/eslint-config-airbnb-base/rules/errors',
    './node_modules/eslint-config-airbnb-base/rules/node',
    './node_modules/eslint-config-airbnb-base/rules/style',
    './node_modules/eslint-config-airbnb-base/rules/variables',
    './node_modules/eslint-config-airbnb-base/rules/es6',
    './node_modules/eslint-config-airbnb-base/rules/strict',
  ].map(require.resolve),
  ignorePatterns: [
    'src/vendor/**/*.js',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Example rules
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/order': ['error', {
      'newlines-between': 'always',
      groups: ['builtin', 'external', 'internal'],
    }],
    '@typescript-eslint/no-shadow': ERROR,
    camelcase: OFF,
    'default-case': OFF,
    'function-paren-newline': OFF,
    'max-len': OFF,
    'no-plusplus': OFF,
    'no-shadow': OFF,
    'object-curly-newline': [ERROR, {
      ImportDeclaration: {
        multiline: true,
        minProperties: 5,
      },
    }],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
  },
  overrides: [{
    files: [
      '*.ts',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
  }],
};
