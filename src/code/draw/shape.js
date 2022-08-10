/*
 * @Author: R10
 * @Date: 2022-06-01 09:12:17
 * @LastEditTime: 2022-06-30 17:49:53
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/shape.js
 */
import {
  Entity, Cartesian3, Color, Rectangle, CallbackProperty, ColorMaterialProperty,
} from 'cesium';
import * as Cesium from 'cesium';
import { getLabelOptions } from '../entity';
import { defaultMenuItems } from '../common/utils'

/**
 *
 * 圆绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawCircle(data) {
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
    label = {},
    pixelSize,
    menu,
    tip
  } = data;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize: pixelSize || (radius / 10000 * 3.6),
    isHighlight
  });
  const id = key;
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
    label: labelOptions,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
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
  return {
    id: entity._id,
    entity
  };
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
    isHighlight = false,
    label = {},
    onMenuSelect,
    showDefaultMenu = false,
    pixelSize,
    menu,
    tip
  } = data;
  const id = key;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const entity = new Entity({
    name,
    id,
    layer: data.layer || 'default',
    show: true,
    highlight,
    ellipse: {
      semiMinorAxis,
      semiMajorAxis,
      height: 0,
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor);
        }
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.3);
      }, false)),
      outline: true,
      width: 10,
      outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
    },
    label: labelOptions,
    position: Cartesian3.fromDegrees(longitude, latitude, height),
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
  return {
    id: entity._id,
    entity
  };
}
/**
 *
 * 矩形绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function drawRect(data) {
  const {
    key,
    name,
    coordinates,
    highlightColor,
    highlight,
    color,
    isHighlight = false,
    label = {},
    onMenuSelect,
    showDefaultMenu = false,
    pixelSize,
    menu,
    tip
  } = data;
  const id = key;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
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
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.3);
      }, false)),
      height: 0,
      outline: true,
      width: 10,
      outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
    },
    position: Cartesian3.fromDegrees((coordinates[0][0] + coordinates[1][0]) / 2, (coordinates[0][1] + coordinates[1][1]) / 2, 0),
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
  return {
    id: entity._id,
    entity
  };
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
    isHighlight = false,
    label = {},
    onMenuSelect,
    showDefaultMenu = false,
    pixelSize,
    menu,
    tip
  } = data;
  const id = key || _id;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const entity = this.viewer.entities.add({
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
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.3);
      }, false)),
      height: 0,
      outline: true,
      width: 10,
      outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
    },
    label: labelOptions,
    position: Cartesian3.fromDegrees(coordinates[0][0], coordinates[0][1], 0),
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: [
        { text: '编辑', icon: 'fa-edit', type: 'edit' },
        { text: '展示详情', icon: 'fa-eye', type: 'detail' },
        { text: '删除', icon: 'fa-trash-alt', type: 'delete' },
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
  return {
    id: entity._id,
    entity
  };
}

export default {
  drawCircle,
  drawEllipse,
  drawRect,
  drawPolygon,
};
