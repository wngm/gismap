var fs = require('fs')
var path = require('path')

fs.copyFile(path.join(__dirname, '../dist/js/gisMap.**.js'), path.join(__dirname, '../build/gisMap.js'), (err) => {
    if (err) throw err;
    console.log('源文件已拷贝到目标文件');
  });