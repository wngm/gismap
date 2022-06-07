/*
 * @Author: R10
 * @Date: 2022-06-06 17:25:07
 * @LastEditTime: 2022-06-07 17:34:30
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/paint/shape.js
 */
import {
  ScreenSpaceEventHandler, ScreenSpaceEventType,
  Entity, Color, CallbackProperty, Cartesian3, Cartesian2,
  Rectangle,
} from 'cesium';
import { getWGS84FromDKR } from '../common/utils';

function getPointFromWindowPoint(point, viewer) {
  if (viewer.scene.terrainProvider.constructor.name === 'EllipsoidTerrainProvider') {
    return viewer.camera.pickEllipsoid(point, viewer.scene.globe.ellipsoid);
  }
  const ray = viewer.scene.camera.getPickRay(point);
  return viewer.scene.globe.pick(ray, viewer.scene);
}
/**
 *
 * 鼠标矩形绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintRect(data, callback) {
  const pointsArr = [];
  const shape = {
    points: [],
    rect: null,
    entity: null,
  };
  let labelEntity = null;
  let text = '';
  let tempPosition;
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  // 鼠标点击
  handler.setInputAction((movement) => {
    tempPosition = getPointFromWindowPoint(movement.position, this.viewer);
    // 选择的点在球面上
    if (tempPosition) {
      if (shape.points.length === 0) {
        pointsArr.push(tempPosition);
        const cartesian = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition);
        shape.points.push(cartesian);
        shape.rect = Rectangle.fromCartographicArray(shape.points);
        shape.rect.east += 0.000001;
        shape.rect.north += 0.000001;
        shape.entity = this.viewer.entities.add({
          rectangle: {
            coordinates: shape.rect,
            outline: false,
            material: Color.RED.withAlpha(0.5),
          },
        });
        shape.bufferEntity = shape.entity;
      } else if (shape.points.length >= 2) {
        handler.destroy();
        this.viewer.entities.remove(labelEntity);
        if (callback) {
          callback({ id: shape.entity._id, positions: pointsArr });
        }
      }
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动
  handler.setInputAction((movement) => {
    if (!movement.endPosition) return false;
    if (!labelEntity) {
      labelEntity = new Entity({
        position: new CallbackProperty(() => {
          const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
          const position = cartesian ? getWGS84FromDKR(cartesian) : {};
          return cartesian ? Cartesian3.fromDegrees(...Object.values(position)) : Cartesian3.fromDegrees(0, 0);
        }, false),
        label: {
          text: new CallbackProperty(() => text, false),
          font: '14px Source Han Sans CN',
          fillColor: Color.fromCssColorString('#fff'),
          pixelOffset: new Cartesian2(0, -16), // 偏移
        },
      });
      this.viewer.entities.add(labelEntity);
    }
    const moveEndPosition = getPointFromWindowPoint(movement.endPosition, this.viewer);
    if (shape.points.length === 0) {
      text = '点击绘制';
      return;
    }
    text = '再次点击结束绘制';

    if (moveEndPosition) {
      pointsArr[1] = moveEndPosition;
      const cartesian = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
      shape.points[1] = cartesian;
      shape.rect = Rectangle.fromCartographicArray(shape.points);
      if (shape.rect.west === shape.rect.east) {
        shape.rect.east += 0.000001;
      }
      if (shape.rect.south === shape.rect.north) {
        shape.rect.north += 0.000001;
      }
      shape.entity.rectangle.coordinates = shape.rect;
      // 再次点击结束
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
}

export default {
  paintRect,
};
