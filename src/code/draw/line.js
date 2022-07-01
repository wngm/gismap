/*
 * @Author: R10
 * @Date: 2022-05-31 15:53:36
 * @LastEditTime: 2022-07-01 15:26:49
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/line.js
 */
import {
  Entity, ArcType, Cartesian3, PolylineTrailLinkMaterialProperty, Color,ColorMaterialProperty, CallbackProperty
} from 'cesium';
import { getLabelOptions } from '../entity';

let _id = 'line';
/**
   *
   * 绘制动态线段
   * @param {Point[]} points
   * @param {Object} [options={}]
   * @memberof GisMap
   * @returns {*}
   */
function drawAnimateLine(points, options = {}) {
  _id += 1;
  if (points.length < 2) {
    return;
  }

  const pointsArray = points.reduce((a, b) => a.concat(b), []);
  const entity = new Entity({
    id: _id,
    // show: true,
    // tip:{show:true,content:'这是线段'},
    width: 2,
    layer: 'default',
    ...options,
    polyline: {
      positions: Cartesian3.fromDegreesArrayHeights(pointsArray),
      // material:  Cesium.Material.fromType(Cesium.Material.PolylineTrailLinkType),
      material: new PolylineTrailLinkMaterialProperty(
        Color.fromCssColorString(options.color || '#0099cc'),
        2000,
      ),
      arcType: ArcType.GEODESIC,
      // clampToGround: true,
    },
  });

  const line = this.viewer.entities.add(entity);

  return line;
}

/**
   *
   * 绘制线段
   * @param {Point[]} points
   * @param {Object} [options={}]
   * @memberof GisMap
   * @returns {*}
   */
function drawLine(points = [], options = {}) {
  if (points.length < 2) {
    return;
  }
  const pointsArray = points.reduce((a, b) => a.concat(b), []);
  _id += 1;
    const {
    key,
    name,
    color,
    highlight,
    isHighlight = false,
    highlightColor,
    onMenuSelect,
    showDefaultMenu = false,
    label = {},
    pixelSize,
    width = 2,
    menu,
    tip
    } = options;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const entity = new Entity({
    id: key || _id,
    // tip:{show:true,content:'这是线段'},
    name,
    layer: 'default' || options.layer,
    ...options,
    polyline: {
      positions: Cartesian3.fromDegreesArrayHeights(pointsArray),
      height: 0,
      // eslint-disable-next-line new-cap
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (_id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor);
        }
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor));
      }, false)),
      width,
      arcType: ArcType.GEODESIC,
      // clampToGround: true,
    },
    position: Cartesian3.fromDegrees(points[0][0], points[0][1], 0),
    label: labelOptions,
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
   * 绘制带点线段
   * @param {Point[]} points
   * @param {Object} [options={}]
   * @memberof GisMap
   * @returns {*}
   */
function drawLineWithPoints(points = [], options = {}) {
  if (points.length < 2) {
    return;
  }
  const pointsArray = points.reduce((a, b) => a.concat(b), []);
  _id += 1;
    const {
    key,
    name,
    color,
    highlight,
    isHighlight = false,
    highlightColor,
    onMenuSelect,
    showDefaultMenu = false,
    label = {},
    pixelSize,
    width = 2,
    menu,
    tip
    } = options;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const entity = new Entity({
    id: key || _id,
    // tip:{show:true,content:'这是线段'},
    name,
    layer: 'default' || options.layer,
    ...options,
    polyline: {
      positions: Cartesian3.fromDegreesArrayHeights(pointsArray),
      height: 0,
      // eslint-disable-next-line new-cap
      material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (_id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor);
        }
        return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor));
      }, false)),
      width,
      arcType: ArcType.GEODESIC,
      // clampToGround: true,
    },
    position: Cartesian3.fromDegrees(points[0][0], points[0][1], 0),
    label: labelOptions,
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
  points.forEach(item => {
    console.log(item)
    this.drawPoint({
      longitude: item[0],
      latitude: item[1],
      height: item[2],
      ...options,
      label: null
    })
  })
  return entity;
}

export default {
  drawAnimateLine,
  drawLine,
  drawLineWithPoints,
};
