/* eslint-disable import/no-cycle */
/*
 * @Author: R10
 * @Date: 2022-05-31 09:31:52
 * @LastEditTime: 2022-06-06 16:01:19
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/point.js
 */
import { Entity, Cartesian3, HeightReference } from 'cesium';
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

export default {
  drawPoint,
  drawImgPoint,
};
