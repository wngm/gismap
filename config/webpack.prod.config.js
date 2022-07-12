/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
        { from: path.resolve(__dirname, '../public/static/Cesium'), to: '../build/Cesium' },
        { from: path.resolve(__dirname, '../src/code/gisMap.d.ts'), to: '../build/gisMap.d.ts' },
      ],
    }),
    new CleanWebpackPlugin(),
    new UglifyJsPlugin({
      uglifyOptions:{
          compress:{
              drop_console:true
          }
      },
      sourceMap:true,
      parallel:true    
  
  })
  ],
};

const cfg = merge(webpackBase, webppackBuild);

// entry
// Object.getOwnPropertyNames(webpackBase.entry || {}).map((name) => {
//   cfg.entry[name] = []
//     // 添加webpack-dev-server客户端
//     .concat('webpack-dev-server/client?http://localhost:9091')
//     .concat(webpackBase.entry[name]);
// });
cfg.entry = entry;
module.exports = cfg;
