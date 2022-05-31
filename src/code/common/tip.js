import * as Cesium from 'cesium';
import './tip.css';

class Tip {
  constructor(viewer, entity) {
    this.container = viewer.container;
    this.viewer = viewer;
    this.visible = false;
    // 当前绑定目标
    this.bindEntity = entity;
    this.dom = null;
    this.handleEvent = null;
    this.init();
  }

  init() {
    const tip = this.bindEntity.id.tip || {};
    const {
      content, show, className = '', style,
    } = tip;
    if (!content) return;
    this.dom = document.createElement('div');
    this.dom.className = `kdyh-cesium-tip ${className}`;
    this.dom.innerHTML = content || '该节点缺少 tip 字段';
    this.container.appendChild(this.dom);
    const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.bindEntity.primitive.position);
    this.setAt(position);
    this.handle();
  }

  destroy() {
    if (this.dom) {
      this.handleEvent.destroy();
      this.container.removeChild(this.dom);
    }
  }

  handle() {
    this.handleEvent = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    this.handleEvent.setInputAction(() => {
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.bindEntity.primitive.position);
      this.setAt(position);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  show() {
    if (this.dom) {
      this.dom.style.display = 'block';
    }
  }

  hide() {
    if (this.dom) {
      this.dom.style.display = 'none';
    }
  }

  setAt(position) {
    if (!this.dom) return;
    this.dom.style.left = `${position.x + 24}px`;
    this.dom.style.top = `${position.y - 20}px`;
  }
}

export default Tip;
