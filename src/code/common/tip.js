/*
 * @Author: R10
 * @Date: 2022-06-22 13:41:52
 * @LastEditTime: 2022-06-28 16:35:11
 * @LastEditors: R10
 * @Description: 
 * @FilePath: /gismap/src/code/common/tip.js
 */
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
    console.log(entity)
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
    const htmlContent = `
      <div class="title">${content.title}</div>
      ${content.items.map(item => `
        <div class="item">
          <span>${item.key}</span>
          <span>${item.value}</span>
        </div>
      `).join('')}
    `
    this.dom.innerHTML = htmlContent || '该节点缺少 tip 字段';
    this.container.appendChild(this.dom);
    let _positon= this.bindEntity.primitive.position || this.bindEntity.id.position._value
    const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, _positon);
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
      let _positon= this.bindEntity.primitive.position || this.bindEntity.id.position._value
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, _positon);
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
