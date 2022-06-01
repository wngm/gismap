/*
 * @Author: R10
 * @Date: 2022-06-01 09:12:17
 * @LastEditTime: 2022-06-01 17:34:49
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/shape.js
 */
import {
  Entity, Cartesian3, Color, Rectangle, CallbackProperty, ColorMaterialProperty,
} from 'cesium';

let _id = 'shape';

/**
 *
 * 圆绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawCircle(data) {
  _id += 1;
  const {
    longitude,
    latitude,
    height,
    key,
    name,
    radius,
    color,
  } = data;

  const entity = new Entity({
    name,
    id: key || _id,
    show: true,
    ellipse: {
      semiMinorAxis: radius,
      semiMajorAxis: radius,
      material: Color.fromCssColorString(color),
      outline: false,
    },
    position: Cartesian3.fromDegrees(longitude, latitude, height),
  });
  this.viewer.entities.add(entity);
  return entity;
}

/**
 *
 * 椭圆绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawEllipse(data) {
  _id += 1;
  const {
    longitude,
    latitude,
    height,
    key,
    name,
    semiMajorAxis,
    semiMinorAxis,
    color,
  } = data;

  const entity = new Entity({
    name,
    id: key || _id,
    show: true,
    ellipse: {
      semiMinorAxis,
      semiMajorAxis,
      material: Color.fromCssColorString(color),
      outline: false,
    },
    position: Cartesian3.fromDegrees(longitude, latitude, height),
  });
  this.viewer.entities.add(entity);
  return entity;
}
/**
 *
 * 矩形绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawRect(data) {
  _id += 1;
  const {
    key,
    name,
    coordinates,
    color,
  } = data;
  const entity = new Entity({
    name,
    id: key || _id,
    show: true,
    rectangle: {
      coordinates: Rectangle.fromDegrees(...coordinates.flat(Infinity)),
      material: Color.fromCssColorString(color),
    },
  });
  this.viewer.entities.add(entity);
  return entity;
}

/**
 *
 * 多边形形绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawPolygon(data) {
  _id += 1;
  const {
    key,
    name,
    coordinates,
    color,
  } = data;
  const id = key || _id;
  const polygon = this.viewer.entities.add({
    name,
    id,
    polygon: {
      hierarchy: {
        positions: Cartesian3.fromDegreesArray([...coordinates.flat(Infinity)]),
      },
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (id === this.moveActiveId) {
          return Color.YELLOW;
        }
        return Color.fromCssColorString(color);
      }, false)),
      outline: false,
    },
    highlight: true,
  });
  return polygon;
}

export default {
  drawCircle,
  drawEllipse,
  drawRect,
  drawPolygon,
};
