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
let str5 = JSON.stringify({
    ...config,
    features: list.slice(800, 1000)
})
let str6 = JSON.stringify({
    ...config,
    features: list.slice(400, 800)
})
let str7 = JSON.stringify({
    ...config,
    features: list.slice(200, 400)
})
let str8 = JSON.stringify({
    ...config,
    features: list.slice(160, 165)
})
let str9 = JSON.stringify({
    ...config,
    features: list.slice(165, 167)
})
let str10 = JSON.stringify({
    ...config,
    features: list.slice(167, 168)
})
let str11 = JSON.stringify({
    ...config,
    features: list.slice(170, 190)
})
let str12 = JSON.stringify({
    ...config,
    features: list.slice(190, 200)
})
let str13 = JSON.stringify({
    ...config,
    features: list.slice(168, 170)
})
// fs.rmdirSync(path.join(dir, './data'))
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
fs.writeFile(path.join(dir, './test5.json'), str5, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test6.json'), str6, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test7.json'), str7, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test8.json'), str8, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test9.json'), str9, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test10.json'), str10, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test11.json'), str11, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test12.json'), str12, function (err) {
    if (err) { }
})
fs.writeFile(path.join(dir, './test13.json'), str13, function (err) {
    if (err) { }
})