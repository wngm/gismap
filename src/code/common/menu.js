import * as Cesium from 'cesium';
import './menu.css';

// { text: '编辑', icon: 'fa-edit', type: 'edit' },
// { text: '展示详情', icon: 'fa-eye', type: 'detail' },
// { text: '删除',icon: 'fa-trash-alt', type: 'delete' },
const iconFromType ={
  'fa-add':'<svg t="1657507199367" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4724" width="48" height="48"><path d="M472 472V120a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v352h352a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H552v352a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V552H120a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h352z" p-id="4725"></path></svg>',
  'fa-edit':'<svg t="1657506595941" class="icon" viewBox="0 0 1152 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18938" width="48" height="48"><path d="M804.6 689.8l64-64c10-10 27.4-3 27.4 11.4V928c0 53-43 96-96 96H96c-53 0-96-43-96-96V224c0-53 43-96 96-96h547c14.2 0 21.4 17.2 11.4 27.4l-64 64c-3 3-7 4.6-11.4 4.6H96v704h704V701c0-4.2 1.6-8.2 4.6-11.2z m313.2-403.6L592.6 811.4l-180.8 20c-52.4 5.8-97-38.4-91.2-91.2l20-180.8L865.8 34.2c45.8-45.8 119.8-45.8 165.4 0l86.4 86.4c45.8 45.8 45.8 120 0.2 165.6zM920.2 348L804 231.8 432.4 603.6l-14.6 130.6 130.6-14.6L920.2 348z m129.6-159.4l-86.4-86.4c-8.2-8.2-21.6-8.2-29.6 0L872 164l116.2 116.2 61.8-61.8c8-8.4 8-21.6-0.2-29.8z" p-id="18939"></path></svg>',
  'fa-eye':'<svg t="1657507128380" class="icon" viewBox="0 0 1152 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2812" width="48" height="48"><path d="M576 288a221.88 221.88 0 0 0-62.48 10 110.8 110.8 0 0 1 14.48 54 112 112 0 0 1-112 112 110.8 110.8 0 0 1-54-14.48A223.42 223.42 0 1 0 576 288z m569.04 194.8C1036.58 271.18 821.86 128 576 128S115.36 271.28 6.96 482.82a64.7 64.7 0 0 0 0 58.38C115.42 752.82 330.14 896 576 896s460.64-143.28 569.04-354.82a64.7 64.7 0 0 0 0-58.38zM576 800c-197.3 0-378.18-110-475.86-288C197.82 334 378.68 224 576 224s378.18 110 475.86 288C954.2 690 773.32 800 576 800z" p-id="2813"></path></svg>',
  'fa-trash-alt':'<svg t="1657506650141" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2466" width="48" height="48"><path d="M599.99999 832.000004h47.999999a24 24 0 0 0 23.999999-24V376.000013a24 24 0 0 0-23.999999-24h-47.999999a24 24 0 0 0-24 24v431.999991a24 24 0 0 0 24 24zM927.999983 160.000017h-164.819997l-67.999998-113.399998A95.999998 95.999998 0 0 0 612.819989 0.00002H411.179993a95.999998 95.999998 0 0 0-82.319998 46.599999L260.819996 160.000017H95.999999A31.999999 31.999999 0 0 0 64 192.000016v32a31.999999 31.999999 0 0 0 31.999999 31.999999h32v671.999987a95.999998 95.999998 0 0 0 95.999998 95.999998h575.999989a95.999998 95.999998 0 0 0 95.999998-95.999998V256.000015h31.999999a31.999999 31.999999 0 0 0 32-31.999999V192.000016a31.999999 31.999999 0 0 0-32-31.999999zM407.679993 101.820018A12 12 0 0 1 417.999993 96.000018h187.999996a12 12 0 0 1 10.3 5.82L651.219989 160.000017H372.779994zM799.999986 928.000002H223.999997V256.000015h575.999989z m-423.999992-95.999998h47.999999a24 24 0 0 0 24-24V376.000013a24 24 0 0 0-24-24h-47.999999a24 24 0 0 0-24 24v431.999991a24 24 0 0 0 24 24z" p-id="2467"></path></svg>',

}

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
    console.log(this.bindEntity ,menuItems,999)
    this.dom = document.createElement('div');
    this.dom.className = `kdyh-cesium-menu ${className}`;
    const content = this.createChildrenDom(menuItems);
    this.dom.appendChild(content);
    this.container.appendChild(this.dom);
    let _positon= this.bindEntity.primitive.position || this.bindEntity.id.position._value
    const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, _positon);
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
      item.innerHTML = `
        <div type=${i.type}>
          <i class=${i.icon?'kdyh-cesium-menu-item-icon':'kdyh-cesium-menu-item-icon-none'}>
          ${i.icon?iconFromType[i.icon]:''}
          </i><span type=${i.type}>${i.text}</span>
        </div>
      `;
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
      let _positon= this.bindEntity.primitive.position || this.bindEntity.id.position._value
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, _positon);
      this.setAt(position);
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
