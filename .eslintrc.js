/*
 * @Author: R10
 * @Date: 2022-05-30 10:56:28
 * @LastEditTime: 2022-06-01 13:49:53
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/.eslintrc.js
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@src', './src'], // 别名路径
          ['@page', './src'], // 别名路径
          ['@modules', './node_modules'], // 别名路径
        ],
      },
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
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    // 'new-cap': ['error', { newIsCap: 'never' }],
  },
};
