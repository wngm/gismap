const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

const dist = path.resolve(__dirname, '../dist/');
const pathDir = (pathname) => path.resolve(__dirname, pathname);
// 获取路径下所有文件 地址
function getFiles(jsonPath) {
  const jsonFiles = [];
  function findJsonFile(ppath) {
    const files = fs.readdirSync(ppath);
    files.forEach((item) => {
      const fPath = path.join(ppath, item);
      const stat = fs.statSync(fPath);
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
  const filesJsonList = files.map((item) => {
    const fileName = item
      .slice(rootPath.length + 1)
      .replace(/(.*\/)*([^.]+).(jsx|js)/gi, '$1$2');
    return { name: fileName, path: item };
  });

  return filesJsonList;
}

// 获取所有page 文件路径
const pageFiles = getFiles(path.resolve(__dirname, '../src/page'));

const list = FilesFormat(pageFiles, path.resolve(__dirname, '../src/page'));
const entry = {};
list.forEach((item) => {
  entry[item.name] = item.path;
});

// model
entry.gisMap = path.resolve(__dirname, '../src/code/gisMap.js');

module.exports = {
  mode: 'development',
  entry,
  output: {
    path: dist,
    // 直接输出完整路径
    filename: 'js/[name].[hash:8].js',
    // 动态输出文件名，以chunk名命名
    sourcePrefix: '',
  },
  // amd: {
  //   toUrlUndefined: true,
  // },
  // node: {
  //   fs: "empty",
  // },
  resolve: {
    alias: {
      '@src': pathDir('../src'),
      '@modules': pathDir('../node_modules'),
      '@pages': pathDir('../src/page'),
    },
  },
  devtool: 'inline-source-map',
  plugins: [
    ...list.map(
      (i) => new HtmlWebpackPlugin({
        filename: i.name,
        template: path.resolve(__dirname, '../index.html'),
        inject: true,
        chunks: [i.name],
      }),
    ),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|gltf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
            },
          },
        ],
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
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
