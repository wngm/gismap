/*
 * @Author: R10
 * @Date: 2022-06-06 10:32:17
 * @LastEditTime: 2022-06-09 11:05:35
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/paint/point.js
 */
import {
  ScreenSpaceEventHandler, Color, ScreenSpaceEventType, CallbackProperty,
} from 'cesium';
import { getWGS84FromDKR } from '../common/utils';

/**
 *
 * 鼠标点绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintPoint(data, callback) {
  const positions = [];
  let entity = null;
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  this.paintHandler.push(handler);
  // 单机鼠标左键画点
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    positions.push(position);
    entity = this.drawPoint({
      ...data,
      ...position,
    });
    handler.destroy();
    if (callback) callback({ positions, entity });
  }, ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(() => {
    handler.destroy();
    if (callback) callback({ positions, entity });
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

/**
 *
 * 鼠标闪烁点绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintFlashPoint(data, callback) {
  const positions = [];
  let entity = null;
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  this.paintHandler.push(handler);
  // 单机鼠标左键画点
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    positions.push(position);
    entity = this.drawFlashPoint({
      ...data,
      ...position,
    });
    handler.destroy();
    if (callback) callback({ positions, entity });
  }, ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(() => {
    handler.destroy();
    if (callback) callback({ positions, entity });
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

/**
 *
 * 鼠标图片点绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintImgPoint(data, callback) {
  const positions = [];
  let entity = null;
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  this.paintHandler.push(handler);
  // 单机鼠标左键画点
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    positions.push(position);
    entity = this.drawImgPoint({
      ...data,
      ...position,
    });
    handler.destroy();
    if (callback) callback({ positions, entity });
  }, ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(() => {
    handler.destroy();
    if (callback) callback({ positions, entity });
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

export default {
  paintPoint,
  paintImgPoint,
  paintFlashPoint,
};
