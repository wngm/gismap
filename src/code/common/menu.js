import * as Cesium from 'cesium';
import './menu.css';

class Menu {
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
    const menu = this.bindEntity.id.menu || {};
    const { menuItems, show, className = '' } = menu;
    if (!menuItems || menuItems.length === 0) {
      return;
    }
    this.dom = document.createElement('div');
    this.dom.className = `kdyh-cesium-menu ${className}`;
    const content = this.createChildrenDom(menuItems);
    this.dom.appendChild(content);
    this.container.appendChild(this.dom);
    const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.bindEntity.primitive.position);
    this.setAt(position);
    this.handle();
    this.onEvent();
    console.log('created menu');
  }

  createChildrenDom(menuItems) {
    const ul = document.createElement('div');
    ul.className = 'kdyh-cesium-menu-ul';
    const list = menuItems.map((i) => {
      const item = document.createElement('div');
      item.className = 'kdyh-cesium-menu-item';
      item.innerText = i.text;
      item.setAttribute('type', i.type);
      return item;
    });
    list.forEach((item) => {
      ul.appendChild(item);
    });
    return ul;
  }

  destroy() {
    if (this.dom) {
      this.handleEvent.destroy();
      this.container.removeChild(this.dom);
    }
  }

  onEvent() {
    this.dom.onclick = (e) => {
      const type = e.target.getAttribute('type');
      if (type) {
        this.bindEntity.id.menu.onSelect(type, this.bindEntity.id);
        this.hide();
      }
    };
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
    if (!this.dom || !position) return;
    this.dom.style.left = `${position.x + 24}px`;
    this.dom.style.top = `${position.y - 20}px`;
  }
}

export default Menu;
