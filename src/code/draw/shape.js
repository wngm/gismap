/*
 * @Author: R10
 * @Date: 2022-06-01 09:12:17
 * @LastEditTime: 2022-06-02 09:31:19
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
    highlight,
    highlightColor,
  } = data;
  const id = key || _id;
  const entity = new Entity({
    name,
    id,
    show: true,
    highlight,
    ellipse: {
      semiMinorAxis: radius,
      semiMajorAxis: radius,
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor);
        }
        return Color.fromCssColorString(color);
      }, false)),
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
    highlight,
    highlightColor,
  } = data;
  const id = key || _id;
  const entity = new Entity({
    name,
    id,
    show: true,
    highlight,
    ellipse: {
      semiMinorAxis,
      semiMajorAxis,
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor);
        }
        return Color.fromCssColorString(color);
      }, false)),
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
    highlightColor,
    highlight,
    color,
  } = data;
  const id = _id || key;
  const entity = new Entity({
    name,
    id,
    show: true,
    highlight,
    rectangle: {
      coordinates: Rectangle.fromDegrees(...coordinates.flat(Infinity)),
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor);
        }
        return Color.fromCssColorString(color);
      }, false)),
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
    highlightColor,
    highlight,
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
          return Color.fromCssColorString(highlightColor);
        }
        return Color.fromCssColorString(color);
      }, false)),
      outline: false,
    },
    highlight,
  });
  return polygon;
}

export default {
  drawCircle,
  drawEllipse,
  drawRect,
  drawPolygon,
};
