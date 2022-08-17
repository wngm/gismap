/*
 * @Author: R10
 * @Date: 2022-05-31 15:53:36
 * @LastEditTime: 2022-07-01 15:26:49
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/line.js
 */
import {
  Entity, ArcType, Cartesian3, PolylineTrailLinkMaterialProperty, Color, ColorMaterialProperty, CallbackProperty
} from 'cesium';
import { defaultMenuItems } from '../common/utils'
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
        Color.fromCssColorString(options.color || '#0dfcff'),
        2000,
      ),
      arcType: ArcType.GEODESIC,

    },
  });

  this.viewer.entities.add(entity);

  return {
    id: entity._id,
    entity
  };;
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
    id: key,
    // tip:{show:true,content:'这是线段'},
    name,
    layer: options.layer || 'default',
    ...options,
    // 备份原数据
    sourceData: points,
    sourceType: 'line',
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
      // 是否固定到地面上
      clampToGround: false,
    },
    position: Cartesian3.fromDegrees(points[0][0], points[0][1], 0),
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
  return {
    id: entity._id,
    entity
  };
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
  // 0 简单模式； 1 复合模式
  let mode = 0;
  if (points.length < 2) {
    return;
  }
  let pointsArray = []
  if (points[0].longitude && typeof points[0].longitude === 'number') {
    mode = 1
    pointsArray = points.reduce((a, b) => a.concat([b.longitude, b.latitude, b.height]), []);
  } else {
    pointsArray = points.reduce((a, b) => a.concat(b), []);
  }

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
    id: key,
    // tip:{show:true,content:'这是线段'},
    name,
    layer: options.layer || 'default',
    ...options,
    // 原数据
    sourceData: points,
    sourceType: 'linePoint',
    polyline: {
      positions: Cartesian3.fromDegreesArrayHeights(pointsArray),
      height: 0,
      // material: new Cesium.PolylineDashMaterialProperty({
      //   color: Cesium.Color.YELLOW,
      //   dashLength: 20 //短划线长度」
      // }),
      material: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
      ,
      // eslint-disable-next-line new-cap
      // material: new ColorMaterialProperty(new CallbackProperty(() => {
      //   if (_id === this.moveActiveId) {
      //     return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor);
      //   }
      //   return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor));
      // }, false)),
      width,
      arcType: ArcType.GEODESIC,
      // clampToGround: true,
    },
    // label 位置
    position: Cartesian3.fromDegrees(pointsArray[0], pointsArray[1], 0),
    label: labelOptions,
    tip,
    menu: showDefaultMenu ? (menu || {
      className: 'test-menu',
      show: true,
      menuItems: defaultMenuItems,
      onSelect: (type, entity) => {
        if (type === 'delete') {
          // console.log(this.viewer.entities, 99988)
          // this.remove(entity);
        }
        onMenuSelect && onMenuSelect(type, entity)
      },
    }) : null,
  });
  this.viewer.entities.add(entity);
  if (mode === 1) {
    points.forEach(item => {
      this.drawPoint({
        layer: options.layer || 'default',
        parent: entity,
        ...item
      })
    })
  } else {
    points.forEach(item => {
      this.drawPoint({
        parent: entity,
        layer: options.layer || 'default',
        longitude: item[0],
        latitude: item[1],
        height: item[2],
        ...options,
        key: null,
        label: null
      })
    })
  }

  return {
    id: entity._id,
    entity
  };;
}

export default {
  drawAnimateLine,
  drawLine,
  drawLineWithPoints,
};
