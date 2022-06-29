/*
 * @Author: R10
 * @Date: 2022-06-01 09:12:17
 * @LastEditTime: 2022-06-29 17:09:21
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
    isHighlight = false,
    highlightColor,
    onMenuSelect,
    showDefaultMenu = false,
    menu,
    tip
  } = data;
  const id = key || _id;
  const entity = new Entity({
    name,
    layer: data.layer || 'default',
    id,
    show: true,
    highlight,
    ellipse: {
      semiMinorAxis: radius,
      semiMajorAxis: radius,
      height: 0,
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor).withAlpha(0.5);
        }
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.3);
      }, false)),
      outline: true,
      width: 10,
      outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
    },
    position: Cartesian3.fromDegrees(longitude, latitude, height),
    tip,
    menu: showDefaultMenu ? (menu || {
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
    layer: data.layer || 'default',
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
  const id = key || _id;
  const entity = new Entity({
    name,
    id,
    layer: data.layer || 'default',
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
    layer: data.layer || 'default',
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
