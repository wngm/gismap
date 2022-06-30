/*
 * @Author: R10
 * @Date: 2022-05-31 15:41:36
 * @LastEditTime: 2022-06-30 13:45:06
 * @LastEditors: R10
 * @Description: 
 * @FilePath: /gismap/src/code/entity.js
 */
import * as Cesium from 'cesium';

function getLabelOptions(options) {
  const {
    show,
    fillColor,
    outlineColor,
    text,
    pixelSize = 30,
    isHighlight = false
  } = options;
  const offset = {}
  if (options.pixelOffset) {
    offset.pixelOffset = options.pixelOffset
  }
  return {
    text,
    font: '14px Source Han Sans CN', // 字体样式
    fillColor: fillColor ? Cesium.Color.fromCssColorString(fillColor) : Cesium.Color.fromCssColorString(isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor), // 字体颜色
    // outlineColor: outlineColor ? Cesium.Color.fromCssColorString(outlineColor) : Cesium.Color.TRANSPARENT,
    // backgroundColor: Cesium.Color.AQUA, // 背景颜色
    showBackground: false, // 是否显示背景颜色
    heightReference: Cesium.HeightReference.NONE,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE, // label样式
    // outlineWidth: 2,
    verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平位置
    pixelOffset: new Cesium.Cartesian2(0, pixelSize / 3), // 偏移
    eyeOffset: Cesium.Cartesian3.ZERO, // 偏移
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 40000000),
    disableDepthTestDistance: 10,
    ...offset,
  };
}

function getPointOptions(options) {
  let {
    color,
    pixelSize = 30,
    isHighlight,
    heightReference = Cesium.HeightReference.CLAMP_TO_GROUND,
  } = options;
  color = color ? Cesium.Color.fromCssColorString(color) : Cesium.Color.fromCssColorString(isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor);
  return {
    ...options,
    // show: true,
    pixelSize,
    heightReference,
    color,
    // outlineWidth: 10,,
    // outlineColor: Cesium.Color.LIME,
    // outlineWidth: 10,
    scaleByDistance: new Cesium.NearFarScalar(1500, 1, 200000, 0.3),
    // translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 20000, 0.2),
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000)
  };
}
export {
  getLabelOptions,
  getPointOptions,
};
export default {
  getLabelOptions,
  getPointOptions,
};
