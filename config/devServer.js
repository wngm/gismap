var path = require("path");
var webpack = require("webpack");
let open = require("open");
var webpackDevServer = require("webpack-dev-server");
var webpackCfg = require("./webpack.dev.config.js");

var port = process.env.PORT || 3000;

var compiler = webpack(webpackCfg);

//init server

var app = new webpackDevServer(compiler, {
  //注意此处publicPath必填
  // publicPath: webpackCfg.output.publicPath,
  publicPath: "",
  contentBase: [path.join(__dirname, "../public")],
  proxy: {
    "/geoserver": {
      target: "http://127.0.0.1:8001",
      secure: false,
    },
  },
  // ...webpackCfg.devServer,
});

app.listen(port, "localhost", function (err) {
  if (err) {
    console.log(err);
  }
});

console.log("listen at http://localhost:" + port);

open("http://localhost:" + port, "chrome");
