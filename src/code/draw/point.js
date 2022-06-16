/* eslint-disable import/no-cycle */
/*
 * @Author: R10
 * @Date: 2022-05-31 09:31:52
 * @LastEditTime: 2022-06-09 10:44:45
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/point.js
 */
import {
  Entity, Cartesian3, HeightReference, CallbackProperty, Color,
} from 'cesium';
import { getPointOptions, getLabelOptions } from '../entity';

let _id = 1;
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
    name,
    pixelSize,
    label,
    tip,
    menu,
  } = data;

  const pointOption = getPointOptions(data);
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
  });
  _id += 1;
  const entity = new Entity({
    name,
    id: key || Number.prototype.toString.apply(_id),
    show: true,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    heightReference: HeightReference.CLAMP_TO_GROUND,
    point: pointOption,
    label: labelOptions,
    tip,
    menu,
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
    label,
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

export default {
  drawPoint,
  drawImgPoint,
  drawFlashPoint,
};
