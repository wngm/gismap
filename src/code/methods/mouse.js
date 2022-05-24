// 事件Cesium 映射
const mouseEvent2CesiumEvent = {
  click: 'LEFT_CLICK',
  mousemove: 'MOUSE_MOVE',
};
/**
   * 添加鼠标事件监听
   * @memberof GisMap
   * @param {MouseEvent} mouseEvent
   * @param {function(point:Point)} listener 监听执行函数
   */
function addMouseEvent(mouseEvent, listener) {
  const { Cesium, eventCenter, viewer } = this;
  const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

  if (!eventCenter[listener]) {
    eventCenter[listener] = handler;
  }
  eventCenter[listener].setInputAction((movement) => {
    const position = {};
    let cartesian = null;
    if (mouseEvent === 'mousemove') {
      cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(movement.endPosition), viewer.scene);
    } else {
      cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(movement.position), viewer.scene);
    }
    if (cartesian) {
      const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
      position.longitude = (curPosition.longitude * 180) / Math.PI;
      position.latitude = (curPosition.latitude * 180) / Math.PI;
    }
    listener(position, movement);
  }, Cesium.ScreenSpaceEventType[mouseEvent2CesiumEvent[mouseEvent]]);
}

/**
   * 移除鼠标事件监听
   * @memberof GisMap
   * @param {MouseEvent} mouseEvent
   * @param {function} listener 监听执行函数
   */
function removeMouseEvent(mouseEvent, listener) {
  const { eventCenter } = this;
  if (eventCenter[listener]) {
    eventCenter[listener].destroy();
    delete eventCenter[listener];
  }
}

export default {
  addMouseEvent,
  removeMouseEvent,
};
