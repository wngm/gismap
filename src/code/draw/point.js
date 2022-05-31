/* eslint-disable import/no-cycle */
/*
 * @Author: R10
 * @Date: 2022-05-31 09:31:52
 * @LastEditTime: 2022-05-31 14:52:17
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/point.js
 */
import { Entity, Cartesian3 } from 'cesium';
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
    point: pointOption,
    label: labelOptions,
    tip,
    menu,
  });
  this.viewer.entities.add(entity);
  return entity;
}

export default {
  drawPoint,
};
