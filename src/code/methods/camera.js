/**
 * 获取摄像头位置
 * @memberof GisMap
 * @returns {Point} 坐标点
 */
function getCameraPosition() {
  const { viewer, Cesium } = this;
  const result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas
    .clientHeight / 2));
  const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
  const lon = (curPosition.longitude * 180) / Math.PI;
  const lat = (curPosition.latitude * 180) / Math.PI;
  const height = this.getCameraHeight();
  return {
    longitude: lon,
    latitude: lat,
    altitude: height,
  };
}

/**
 * 获取摄像头高度
 * @memberof GisMap
 * @returns {Number} height
 */
function getCameraHeight() {
  const { viewer } = this;
  if (viewer) {
    const { scene } = viewer;
    const { ellipsoid } = scene.globe;
    const { height } = ellipsoid.cartesianToCartographic(viewer.camera.position);
    return height;
  }
}

/**
 * 添加摄像头事件监听
 * @memberof GisMap
 * @param {function} listener 监听执行函数
 */
function addCameraEvent(listener) {
  const { camera } = this;
  camera.changed.addEventListener(listener);
}

/**
 * 移除摄像头事件监听
 * @memberof GisMap
 * @param {function} listener 监听执行函数
 */
function removeCameraEvent(listener) {
  const { camera } = this;
  camera.changed.removeEventListener(listener);
}

export default {
  addCameraEvent,
  removeCameraEvent,
  getCameraPosition,
  getCameraHeight,
};
