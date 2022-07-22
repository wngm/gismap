/* eslint-disable import/no-cycle */
/*
 * @Author: R10
 * @Date: 2022-05-31 09:31:52
 * @LastEditTime: 2022-07-01 09:20:03
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/point.js
 */
import {
  Entity, Cartesian3, HeightReference, CallbackProperty, Color,
} from 'cesium';
import { getPointOptions, getLabelOptions } from '../entity';
import { defaultMenuItems } from '../common/utils'
// import normalPoint from '@src/assets/images/point.png'
// import normalPointHighlight from '@src/assets/images/point-highlight.png'
// import imgPoint from '@src/assets/images/img-point.png'
// import imgPointHighlight from '@src/assets/images/img-point-highlight.png'

/**
 *
 * 点绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawPoint(data) {
  const {
    longitude,
    latitude,
    height,
    key,
    menu,
    name,
    isHighlight = false,
    pixelSize = 14,
    label = {},
    showDefaultMenu = false,
    onMenuSelect,
    tip,
    ...optopns
  } = data;

  const pointOption = getPointOptions(data);
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const entity = new Entity({
    ...optopns,
    layer: data.layer || 'default',
    name,
    pixelSize,
    label,
    tip,
    id: key,
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    point: pointOption,
    label: labelOptions,
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: defaultMenuItems,
      onSelect: (type, entity) => {
        if (type === 'delete') {
          console.log(entity)
          this.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
  });
  this.viewer.entities.add(entity);
  return entity;
}

/**
 *
 * 点的参数
 * @typedef {Object} PointProps 点的相关参数
 * @property {number} longitude 经度
 * @property {number} latitude 维度
 * @property {number} height 高度
 * @property {number} pixelSize 点大小
 * @property {Object} [label] label 展示
 * @property {Object} [tip] 提示信息
 * @property {Object} [menu] 右键菜单
 * @property {string} [key] 指定唯一 id 
 * @property {string} [layer] 图层 默认图层名为【default】
 */

/**
 *
 * 标记点绘制
 * @param {PointProps} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawMarkerPoint(data) {
  const {
    name,
    key,
    longitude,
    latitude,
    isHighlight = false,
    pixelSize = 14,
    height,
    label = {},
    imgOptions,
    showDefaultMenu = false,
    onMenuSelect,
    tip,
    menu
  } = data;

  // const pointOption = getPointOptions(data);
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });

  let normalPointHighlight = window.CESIUM_BASE_URL + '/images/point-highlight.png'
  let normalPoint = window.CESIUM_BASE_URL + '/images/point.png'
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key,
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    heightReference: HeightReference.CLAMP_TO_GROUND,
    billboard: {
      width: 24,
      height: 27,
      image: isHighlight ? normalPointHighlight : normalPoint,
      ...imgOptions,
    },
    label: labelOptions,
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: defaultMenuItems,
      onSelect: (type, entity) => {
        if (type === 'delete') {
          console.log(entity)
          this.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
  });
  this.viewer.entities.add(entity);
  return entity;
}

/**
 *
 * 图标点
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawImgPoint(data) {
  const {
    longitude,
    latitude,
    height,
    key,
    name,
    label = {},
    tip,
    menu,
    imgOptions,
    showDefaultMenu = false,
    onMenuSelect,
    isHighlight = false,
    pixelSize = 14,
  } = data;

  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  let imgPointHighlight = window.CESIUM_BASE_URL + '/images/img-point-highlight.png'
  let imgPoint = window.CESIUM_BASE_URL + '/images/img-point.png'
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key,
    show: true,
    billboard: {
      width: 28,
      height: 36,
      image: isHighlight ? imgPointHighlight : imgPoint,
      ...imgOptions,
    },
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    heightReference: HeightReference.CLAMP_TO_GROUND,
    label: labelOptions,
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: defaultMenuItems,
      onSelect: (type, entity) => {
        if (type === 'delete') {
          console.log(entity)
          this.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
  });
  this.viewer.entities.add(entity);
  return entity;
}
/**
 *
 * 闪烁点
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawFlashPoint(data) {
  const pointOption = getPointOptions(data);
  const {
    longitude,
    latitude,
    height,
    key,
    pixelSize = 14,
    name,
    label,
    tip,
    showDefaultMenu = false,
    isHighlight = false,
    onMenuSelect,
    menu,
    color,
  } = data;
  let alpha = 0;
  let size = data.pixelSize - 20;
  const initSize = data.pixelSize - 20;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key,
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    heightReference: HeightReference.CLAMP_TO_GROUND,
    point: {
      ...pointOption,
      pixelSize: new CallbackProperty(() => {
        if (size >= data.pixelSize) size = initSize;
        size += 1;
        return size;
      }, false),
      color: new CallbackProperty(() => {
        if (alpha >= 1) alpha = 0;
        alpha += 0.05;
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(alpha);
      }, false),
    },
    label: labelOptions,
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: defaultMenuItems,
      onSelect: (type, entity) => {
        if (type === 'delete') {
          console.log(entity)
          this.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
  });
  this.viewer.entities.add(entity);
  return entity;
}

/**
 *
 * 定时闪烁点
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawFlashPointClock(data) {
  const { Cesium } = this
  // const pointOption = getPointOptions(data);
  const {
    longitude,
    latitude,
    height,
    key,
    name,
    label,
    tip,
    menu,
    color,
    flashTime = 5000,
    duration = 1000,
    pixelSize = 1000,
    showDefaultMenu = false,
    isHighlight = false,
    onMenuSelect,
  } = data;
  let size = pixelSize;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize: 14,
    isHighlight
  });
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key,
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    // heightReference: HeightReference.CLAMP_TO_GROUND,
    ellipse: {
      // ...pointOption,
      semiMinorAxis: size,
      semiMajorAxis: size,
      heightReference: Cesium.HeightReference.NONE,
      height,
      material: new Cesium.PointFlashMaterialProperty({
        duration,
        count: 5,
        gradient: 1,
        flashTime,
        color: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
      })
    },
    label: labelOptions,
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: defaultMenuItems,
      onSelect: (type, entity) => {
        if (type === 'delete') {
          this.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
  });
  this.viewer.entities.add(entity);
  return entity;
}

export default {
  drawPoint,
  drawMarkerPoint,
  drawImgPoint,
  drawFlashPoint,
  drawFlashPointClock,
};
