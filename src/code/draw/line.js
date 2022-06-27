/*
 * @Author: R10
 * @Date: 2022-05-31 15:53:36
 * @LastEditTime: 2022-06-06 17:44:12
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/line.js
 */
import {
  Entity, ArcType, Cartesian3, PolylineTrailLinkMaterialProperty, Color,
} from 'cesium';

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
  const entity = new Entity({
    id: _id,
    // tip:{show:true,content:'这是线段'},
    width: 2,
    layer: 'default',
    ...options,
    polyline: {
      positions: Cartesian3.fromDegreesArrayHeights(pointsArray),
      // eslint-disable-next-line new-cap
      material: new Color.fromCssColorString(options.color || '#0099cc'),
      arcType: ArcType.GEODESIC,
      // clampToGround: true,
    },
  });
  this.viewer.entities.add(entity);
  return entity;
}

export default {
  drawAnimateLine,
  drawLine,
};
