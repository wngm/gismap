/*
 * @Author: R10
 * @Date: 2022-06-06 17:25:07
 * @LastEditTime: 2022-06-06 17:31:14
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/paint/line.js
 */
import { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { getWGS84FromDKR } from '../common/utils';

/**
 *
 * 鼠标线绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintLine(data, callback) {
  const positions = [];
  const handler = ScreenSpaceEventHandler(this.viewer.scene.canvas);
  // 鼠标点击
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    positions.push(position);
    if (callback) callback({ positions });
  }, ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    if (positions.length >= 2) {

    }
  }, ScreenSpaceEventType.LEFT_CLICK);
}

export default {
  paintLine,
};
