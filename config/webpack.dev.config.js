var webpack = require("webpack");
const path = require("path");
var webpackBase = require("./webpack.base.config.js");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");

var webppackBuild = {
  devtool: "source-map",
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "../public/static"), to: "static" },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    proxy: {
      "/geoserver": {
        target: "http://127.0.0.1:8001",
        secure: false,
      },
    },
  },
};

var cfg = merge(webpackBase, webppackBuild);
console.log(cfg);
//entry
Object.getOwnPropertyNames(webpackBase.entry || {}).map(function (name) {
  cfg.entry[name] = []
    //添加webpack-dev-server客户端
    .concat("webpack-dev-server/client?http://localhost:9091")
    .concat(webpackBase.entry[name]);
});

module.exports = cfg;
