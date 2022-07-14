import * as Cesium from 'cesium';

const c1 = '#0dfcff'
const c2 = '#4291da'
const c3 = '#dbfaff'
const c4 = '#4291da'

const color1 =Cesium.Color.fromCssColorString(c1)
const color2 =Cesium.Color.fromCssColorString(c2)
const color3 =Cesium.Color.fromCssColorString(c3)
const color4 =Cesium.Color.fromCssColorString(c4)
const color1_a = color1.withAlpha(0.24)
const color2_a = color2.withAlpha(0.24)
const color3_a = color3.withAlpha(0.24)

export {
    color1,
    color2,
    color3,
    color4,
    color1_a,
    color2_a,
    color3_a,
}
