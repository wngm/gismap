// 事件Cesium 映射
const mouseEvent2CesiumEvent = {
  click: 'LEFT_CLICK',
  mousemove: 'MOUSE_MOVE',
};
/**
   * 添加鼠标事件监听
   * @memberof GisMap
   * @param {MouseEvent} mouseEvent
   * @param {function} listener 监听执行函数
   */
function addMouseEvent(mouseEvent, listener) {
  const { Cesium, eventCenter, viewer } = this;
  const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

  if (!eventCenter[listener]) {
    eventCenter[listener] = handler;
  }
  eventCenter[listener].setInputAction((movement) => {
    let position = {};
    if (mouseEvent === 'mousemove') {
      position = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
    } else {
      position = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
    }
    // const windowPosition = movement.position;
    listener(Cesium.Cartographic.fromCartesian(position), movement);
  }, Cesium.ScreenSpaceEventType[mouseEvent2CesiumEvent[mouseEvent]]);
  console.log(eventCenter);
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
  console.log(eventCenter);
}

export default {
  addMouseEvent,
  removeMouseEvent,
};
