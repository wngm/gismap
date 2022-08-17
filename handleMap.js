const path = require('path')
const fs = require('fs')
const config = require('./public/static/s.json')

const dir = path.join(__dirname, './public/static')
console.log(config.features.length)
var list = config.features.splice(0, 1000)

let str = JSON.stringify(config)
let str2 = JSON.stringify({
    ...config,
    features: list.slice(0, 100)
})
let str3 = JSON.stringify({
    ...config,
    features: list.slice(100, 150)
})
let str4 = JSON.stringify({
    ...config,
    features: list.slice(150, 160)
})
fs.rmSync(path.join(dir, './test.json'))
fs.rmSync(path.join(dir, './test2.json'))
// fs.rmSync(path.join(dir, './test.json'))
fs.writeFile(path.join(dir, './test.json'), str, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test2.json'), str2, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test3.json'), str3, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test4.json'), str4, function (err) {
    if (err) { }
})