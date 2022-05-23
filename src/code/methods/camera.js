/**
 *
 * @memberof GisMap
 * @returns {Point} 摄像头位置
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
    lon,
    lat,
    height,
  };
}

/**
 *
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

export {
  getCameraPosition,
  getCameraHeight,
};
