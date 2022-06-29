/* eslint-disable import/no-cycle */
/*
 * @Author: R10
 * @Date: 2022-05-31 09:31:52
 * @LastEditTime: 2022-06-29 09:32:20
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/point.js
 */
import {
  Entity, Cartesian3, HeightReference, CallbackProperty, Color,
} from 'cesium';
import { getPointOptions, getLabelOptions } from '../entity';
import normalPoint from '@src/assets/images/point.png'
import normalPointHighlight from '@src/assets/images/point-highlight.png'
import imgPoint from '@src/assets/images/img-point.png'
import imgPointHighlight from '@src/assets/images/img-point-highlight.png'

let _id = 1;
// /**
//  *
//  * 点绘制
//  * @param {object} data
//  * @returns {entity} entity
//  * @memberof GisMap
//  */
// function drawPoint(data) {
//   const {
//     longitude,
//     latitude,
//     height,
//     key,
//     menu,
//   } = data;

//   const pointOption = getPointOptions(data);
//   const labelOptions = getLabelOptions({
//     ...label,
//     pixelSize,
//   });
//   _id += 1;
//   const entity = new Entity({
//     name,
//     name,
//     pixelSize,
//     label,
//     tip,
//     id: key || Number.prototype.toString.apply(_id),
//     show: true,
//     position: Cartesian3.fromDegrees(longitude, latitude, height),
//     heightReference: HeightReference.CLAMP_TO_GROUND,
//     point: pointOption,
//     label: labelOptions,
//     tip,
//     menu,
//   });
//   this.viewer.entities.add(entity);
//   return entity;
// }

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
 * 点绘制
 * @param {PointProps} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawPoint(data) {
  const {
    name,
    key,
    longitude,
    latitude,
    isHighlight = false,
    pixelSize = 14,
    height,
    showLabel = true,
    label = {},
    imgOptions,
    showTip = false,
    showMenu = false,
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
  _id += 1;
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key || Number.prototype.toString.apply(_id),
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    heightReference: HeightReference.CLAMP_TO_GROUND,
    billboard: {
      width: 24,
      height: 27,
      image: isHighlight ? normalPointHighlight : normalPoint,
      ...imgOptions,
    },
    label: showLabel ? labelOptions : null,
    tip: showTip ? (tip || {
      show: true
    }) : null,
    menu: showMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: [
        { text: '编辑', icon: 'fa-edit', type: 'edit' },
        { text: '展示详情', icon: 'fa-eye', type: 'detail' },
        { text: '删除',icon: 'fa-trash-alt', type: 'delete' },
      ],

      onSelect: (type, entity) => {
        if (type === 'delete') {
          console.log(entity)
          gisMap.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
    // menu,
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
  } = data;

  const labelOptions = getLabelOptions({
    ...label,
  });
  _id += 1;
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key || Number.prototype.toString.apply(_id),
    show: true,
    billboard: {
      width: 40,
      height: 40,
      ...imgOptions,
    },
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    heightReference: HeightReference.CLAMP_TO_GROUND,
    label: labelOptions,
    tip,
    menu,
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
    name,
    label,
    tip,
    menu,
  } = data;
  let alpha = 0;
  let size = data.pixelSize - 20;
  const initSize = data.pixelSize - 20;
  const labelOptions = getLabelOptions({
    ...label,
  });
  _id += 1;
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key || Number.prototype.toString.apply(_id),
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
        return Color.fromCssColorString(data?.color || 'red').withAlpha(alpha);
      }, false),
    },
    label: labelOptions,
    tip,
    menu,
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
  const {Cesium} = this
  const pointOption = getPointOptions(data);
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
    duration=1000,
    pixelSize= 1000
  } = data;
  let size = pixelSize;
  const labelOptions = getLabelOptions({
    ...label,
  });
  _id += 1;
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id: key || Number.prototype.toString.apply(_id),
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    // heightReference: HeightReference.CLAMP_TO_GROUND,
    ellipse: {
      ...pointOption,
      semiMinorAxis: size,
      semiMajorAxis:  size,
      heightReference: Cesium.HeightReference.NONE,
      height,
      material :new Cesium.PointFlashMaterialProperty({
        duration,
        count:5,
        gradient:1,
        flashTime,
        color: Color.fromCssColorString(color||'#ff0000')
      })
    },
    label: labelOptions,
    tip,
    menu,
  });
  this.viewer.entities.add(entity);
  return entity;
}

export default {
  drawPoint,
  drawImgPoint,
  drawFlashPoint,
  drawFlashPointClock,
};
