/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const open = require('open');
const webpackDevServer = require('webpack-dev-server');
const webpackCfg = require('./webpack.dev.config.js');

const port = process.env.PORT || 3000;

const compiler = webpack(webpackCfg);

// init server

const app = new webpackDevServer(compiler, {
  // 注意此处publicPath必填
  // publicPath: webpackCfg.output.publicPath,
  publicPath: '',
  contentBase: [path.join(__dirname, '../public')],
  proxy: {
    '/geoserver': {
      target: 'http://127.0.0.1:8001',
      secure: false,
    },
  },
  // ...webpackCfg.devServer,
});

app.listen(port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
});

console.log(`listen at http://localhost:${port}`);

open(`http://localhost:${port}`, 'chrome');
