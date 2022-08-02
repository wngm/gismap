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
  static positionFromPlacement = {
    rightTop: {
      x: { key: 'left', fixValue: 24 },
      y: { key: 'top', fixValue: -20 },
    },
    leftTop: {
      x: { key: 'left', fixValue: 24 },
      y: { key: 'top', fixValue: -20 },
    }
  }
  constructor(viewer, entity) {
    this.container = viewer.container;
    this.viewer = viewer;
    this.visible = false;
    this.placement = 'rightTop'
    // 当前绑定目标
    this.bindEntity = entity;
    this.dom = null;
    this.handleEvent = null;
    console.log(entity)
    this.init();
  }


  //tip mode = { table:'列表模式',html:'html 内容模式'}
  // placement 展现位置：top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom
  init() {
    if (!this.bindEntity.id.tip) return;
    const tip = this.bindEntity.id.tip || {};
    const {
      content = {},
      show,
      className = '',
      style,
      mode = 'html',
      // 展示位置
      placement = 'rightTop'
    } = tip;
    this.placement = placement
    const {
      // 自定义样式内容 （暂时缺事件交互）
      htmlContent = '',
      items = []
    } = content
    if (!content) return;
    this.dom = document.createElement('div');
    this.dom.className = `kdyh-cesium-tip ${className}`;
    let _htmlContent = htmlContent
    // table 模式 (默认样式)
    if (mode === 'table') {
      _htmlContent = `
      <div class="title">${content.title}</div>
      ${items.map(item => `
        <div class="item">
          <span>${item.key}</span>
          <span>${item.value}</span>
        </div>
      `).join('')}
    `
    }

    this.dom.innerHTML = _htmlContent || '该节点缺少 tip 字段';
    this.container.appendChild(this.dom);
    let _positon = this.bindEntity.primitive.position || this.bindEntity.id.position._value
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
      let _positon = this.bindEntity.primitive.position || this.bindEntity.id.position._value
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
    const placement = this.placement
    const style = Tip.positionFromPlacement[placement]
    // let width = this.dom.offsetWidth
    // let height = this.dom.offsetHeight
    this.dom.style[style.x.key] = `${position.x + style.x.fixValue}px`;
    this.dom.style[style.y.key] = `${position.y + style.y.fixValue}px`;
  }
}

export default Tip;
