/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');

const entry = {};
entry.gisMap = path.resolve(__dirname, '../src/code/gisMap.js');

const webppackBuild = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../public/static'), to: 'static' },
        { from: path.resolve(__dirname, '../node_modules/cesium/Build/Cesium'), to: 'static/Cesium' },
        { from: path.resolve(__dirname, '../public/static/Cesium'), to: '../build/Cesium' },
        { from: path.resolve(__dirname, '../src/code/gisMap.d.ts'), to: '../build/gisMap.d.ts' },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};

const cfg = merge(webpackBase, webppackBuild);
const dist = path.resolve(__dirname, '../build/');

cfg.entry = entry
cfg.output = {
    path: dist,
    // 直接输出完整路径
    filename: '[name].js',
    // 动态输出文件名，以chunk名命名
    sourcePrefix: '',
  }
cfg.plugins =[]
// entry
// Object.getOwnPropertyNames(webpackBase.entry || {}).map((name) => {
//   cfg.entry[name] = []
//     // 添加webpack-dev-server客户端
//     .concat('webpack-dev-server/client?http://localhost:9091')
//     .concat(webpackBase.entry[name]);
// });
cfg.entry = entry;
module.exports = cfg;
