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
/**
 * 自定义星空背景图
 * @memberof GisMap
 * @param {[url,url,url,url,url,url]} sources 参考视角[右,左,下,上,前,后]
 */
function setSky(sources) {
  const { viewer, Cesium } = this;
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: sources[0],
      negativeX: sources[1],
      positiveY: sources[2],
      negativeY: sources[3],
      positiveZ: sources[4],
      negativeZ: sources[5],
    },
  });
}
/**
 *
 * 恢复默认星空背景图
 * @memberof GisMap
 */
function resetSky() {
  const { viewer, Cesium } = this;
  const baseUrl = globalThis.CESIUM_BASE_URL;
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: `${baseUrl}/Assets/Textures/SkyBox/tycho2t3_80_px.jpg`,
      negativeX: `${baseUrl}/Assets/Textures/SkyBox//tycho2t3_80_mx.jpg`,
      positiveY: `${baseUrl}/Assets/Textures/SkyBox//tycho2t3_80_py.jpg`,
      negativeY: `${baseUrl}/Assets/Textures/SkyBox//tycho2t3_80_my.jpg`,
      positiveZ: `${baseUrl}/Assets/Textures/SkyBox//tycho2t3_80_pz.jpg`,
      negativeZ: `${baseUrl}/Assets/Textures/SkyBox//tycho2t3_80_mz.jpg`,
    },
  });
}

/**
 *
 * 隐藏星空背景
 * @memberof GisMap
 */
function clearSky() {
  const { viewer } = this;
  viewer.scene.skyBox.show = false;
}

function canvas2image() {
  const { viewer } = this;
  const { canvas } = viewer.scene;
  const genimg = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height, 'png');
}

export default {
  zoomOut,
  zoomIn,
  setSceneMode2D3D,
  setSky,
  resetSky,
  clearSky,
};
