const fs = require('fs');
const files = fs.readdirSync('./dist/js/');
let regName = /^gisMap\.\w{8}\.js$/
files.forEach(f => {
  if (regName.test(f)) {
    fs.copyFile('./dist/js/' + f, './build/gisMap.js', function (err) {
      if (err) console.log('err:', err)
      else console.log('copy file succeed');
    })
  }
})
