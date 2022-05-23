/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');

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
        { from: path.resolve(__dirname, '../node_modules/cesium/Build/Cesium'), to: '../build/Cesium' },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};

const cfg = merge(webpackBase, webppackBuild);

// entry
Object.getOwnPropertyNames(webpackBase.entry || {}).map((name) => {
  cfg.entry[name] = []
    // 添加webpack-dev-server客户端
    .concat('webpack-dev-server/client?http://localhost:9091')
    .concat(webpackBase.entry[name]);
});

module.exports = cfg;
