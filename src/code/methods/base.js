// view zoomTo
// function zoomTo() {
//   this.viewer.zoomTo();
// }

/**
   *
   * 缩进视图
   * @memberof GisMap
   * @param {number} [scale = 0.5] 缩进视视图系数1为，缩进已有距离一半,默认0.5
   * @return {number} scale
   */
function zoomIn(scale = 0.5) {
  // 获取当前镜头位置的笛卡尔坐标
  const cameraPos = this.camera.position;

  // // 获取当前坐标系标准
  const { ellipsoid } = this.scene.globe;

  // // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
  const cartographic = ellipsoid.cartesianToCartographic(cameraPos);

  // // 获取镜头的高度
  const { height } = cartographic;
  const _scale = (1 - (1 / (scale + 1))) * height;
  // 优化？
  this.camera.zoomIn(_scale);
  return scale;
}

/**
   *
   * 放大视图
   * @memberof GisMap
   * @param {number} [scale = 0.5] 放大视系数1为一倍视距,默认0.5
   * @return {number} scale
   */
function zoomOut(scale = 0.5) {
  // 获取当前镜头位置的笛卡尔坐标
  const cameraPos = this.camera.position;

  // // 获取当前坐标系标准
  const { ellipsoid } = this.scene.globe;

  // // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
  const cartographic = ellipsoid.cartesianToCartographic(cameraPos);

  // // 获取镜头的高度
  const { height } = cartographic;
  const _scale = height * (1 + scale);
  this.camera.zoomOut(_scale);
  return _scale;
}

/**
   *
   * 切换2D/3D模式
   * @memberof GisMap
   * @param {"2｜3"} [mode] 2或3，不传参数默认切换
   */
function setSceneMode2D3D(mode) {
  const { Cesium } = this;
  if (mode === 3) {
    this.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  } else if (mode === 2) {
    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
  } else if (this.viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
  } else {
    this.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  }
}

export default {
  zoomOut,
  zoomIn,
  setSceneMode2D3D,
};
