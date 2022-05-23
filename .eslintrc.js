module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      alias: [['/@', './src'], ['@modules', './node_modules']],
    },
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': ['error', { code: 300 }],
    camelcase: ['error', { properties: 'never' }],
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    // 'new-cap': ['error', { newIsCap: 'never' }],
  },
};
