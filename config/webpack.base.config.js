const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const dist = path.resolve(__dirname, "../dist/");

// 获取路径下所有文件 地址
function getFiles(jsonPath) {
  let jsonFiles = [];
  function findJsonFile(ppath) {
    let files = fs.readdirSync(ppath);
    files.forEach(function (item, index) {
      let fPath = path.join(ppath, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        jsonFiles.push(fPath);
      }
    });
  }
  findJsonFile(jsonPath);

  return jsonFiles;
}

// 路径数据 格式化
function FilesFormat(files, rootPath) {
  let filesJsonList = files.map((item) => {
    let file_name = item
      .slice(rootPath.length + 1)
      .replace(/(.*\/)*([^.]+).js/gi, "$1$2");
    return { name: file_name, path: item };
  });

  return filesJsonList;
}

// 获取所有page 文件路径
let pageFiles = getFiles(path.resolve(__dirname, "../src/page"));

let list = FilesFormat(pageFiles, path.resolve(__dirname, "../src/page"));

let entry = {};
list.forEach((item) => {
  entry[item.name] = item.path;
});

module.exports = {
  mode: "development",
  entry,
  output: {
    path: dist,
    //直接输出完整路径
    filename: "js/[name].[hash:8].js",
    //动态输出文件名，以chunk名命名
    sourcePrefix: "",
  },
  // amd: {
  //   toUrlUndefined: true,
  // },
  // node: {
  //   fs: "empty",
  // },
  resolve: {
    alias: {
      "@src": path.resolve("src"),
      "@modules": path.resolve("node_modules"),
      "@pages": path.resolve("src/page"),
    },
  },
  plugins: [
    ...list.map(
      (i) =>
        new HtmlWebpackPlugin({
          filename: i.name + ".html",
          template: path.resolve(__dirname, "../index.html"),
          inject: true,
          chunks: [i.name],
        })
    ),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|gltf)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: false,
            },
          },
        ],
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
    // rules: [
    //   {
    //     test: /\.(css|less)$/,
    //     use: [
    //       {
    //         loader: "style-loader", // creates style nodes from JS strings
    //       },
    //       {
    //         loader: "css-loader", // translates CSS into CommonJS
    //       },
    //       {
    //         loader: "less-loader", // compiles Less to CSS
    //       },
    //     ],
    //   },
    // ],
  },
  devServer: {},
};
