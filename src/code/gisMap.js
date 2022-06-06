import * as Cesium from 'cesium';
import baseOptions from '../config/base';
import Weather from './weather/index';
import Tip from './common/tip';
import Menu from './common/menu';
import material from './material/line';
import material2 from './material/polyline';
import { computeCircle } from './utils';
import camera from './methods/camera';
import mouse from './methods/mouse';
import base from './methods/base';
import { MeasureLine, MeasurePolygn } from './tools';
import '@modules/cesium/Source/Widgets/widgets.css';
import drawFns from './draw';
import paintFns from './paint';

material(Cesium);
material2(Cesium);

window.CESIUM_BASE_URL = '/static/Cesium';
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZGE5MmI2Yy1jZmVmLTQyZGUtYjk4Ni02ODBiYWFiZDZkOGYiLCJpZCI6MjU3MDQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODY0MjQyMDR9.dx-BAVwhWMWfgJb49x2XZEVP-EjFxMvihn8Lca6EXYU';

// id 累加计数器

class GisMap {
  static version = '1.0.0';

  Cesium = Cesium;

  /**
   *
   * @param {Element | String} container
   * @param {Viewer.ConstructorOptions} options cesium Viewer.ConstructorOptions
   * @return {gisMap} gisMap gisMap实例
   */
  constructor(container, options) {
    this.viewer = null;
    this.scene = null;
    this.camera = null;
    // 天气
    this.weather = null;
    // 选中元素
    this.selected = null;
    // tip 对象
    this.tip = null;
    // 右键菜单
    this.contextMenu = null;
    //  事件中心
    this.eventCenter = {};
    // 绘图事件集合
    this.paintHandler = [];
    this.init(container, options);
  }

  init(container, options) {
    this.initViewer(container, options);
  }

  initViewer(container, options = {}) {
    this.viewer = new Cesium.Viewer(container, { ...baseOptions, ...options });
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera;
    this.viewer.scene.globe.depthTestAgainstTerrain = false;
    // 开启抗锯齿
    // this.scene.fxaa = true;
    // this.scene.postProcessStages.fxaa.enabled = true;
    // 图像渲染像素化处理
    // if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //   this.viewer.resolutionScale = window.devicePixelRatio;
    // }
    // http://127.0.0.1:8001/geoserver/my_china/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&STYLES&LAYERS=my_china%3AHYP_HR&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&WIDTH=768&HEIGHT=384&BBOX=73.212890625%2C40.78125%2C106.962890625%2C57.65625
    // viewer.scene.imagerySplitPosition = 0.1;
    // 去除版权信息
    this.viewer.cesiumWidget.creditContainer.style.display = 'none';
    // 太阳光线
    this.viewer.scene.globe.enableLighting = false;
    // 开启阴影效果
    this.viewer.shadows = false;
    // 展示太阳
    // this.scene.sun.show = true;
    // 太阳变大
    // this.scene.sun.glowFactor = 10;
    // 展示月亮
    // this..scene.moon.show = true;
    // 取消双击事件
    // this.setView({ longitude: 100, latitude: 20, height: 10000000 });
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handleEvent();
  }

  // loadScene() {
  //   const tileset = new Cesium.Cesium3DTileset({
  //     url: Cesium.IonResource.fromAssetId(40866),
  //   });
  // }

  _handleEvent() {
    const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    handler.setInputAction((movement) => {
      const windowPosition = movement.position;
      const pick = this.viewer.scene.pick(windowPosition);
      if (pick) {
        this.handleTip(pick);
      } else {
        this.unHandleTip();
        this.unHandleMenu();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
      const windowPosition = movement.position;
      const pick = this.viewer.scene.pick(windowPosition);
      if (pick) {
        this.handleMenu(pick);
      } else {
        this.unHandleTip();
        this.unHandleMenu();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    // 高亮id设置
    handler.setInputAction((movement) => {
      const moveFeature = this.viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(moveFeature)) {
        this.moveActiveId = undefined;
      } else if (moveFeature.id.highlight) {
        this.moveActiveId = moveFeature.id.id;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   *
   * 设置视角（相机位置）
   * @param {position} data
   * @memberof GisMap
   * @return {GisMap} gismap
   */
  setView(data) {
    const {
      longitude,
      latitude,
      height,
      heading = 0.0,
      pitch = -90.0,
      roll = 0.0,

    } = data;
    if (data) {
      this.camera.setView({
        // 设置相机位置
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        orientation: {
          // 初始视角
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          roll: Cesium.Math.toRadians(roll),
        },
      });
    }
    return this;
  }

  setDefaultPosition(data) {
    this.setView(data);
    // const {longitude, latitude, height} = data
    // if(data){
    //   const center = Cesium.Cartesian3.fromDegrees(longitude, latitude,height);
    //   this.camera.lookAt(center,  new Cesium.HeadingPitchRange(0.01, Cesium.Math.toRadians(-90.0), 0.01))
    // }
  }

  /**
   *
   * 设置天气
   * @param {'rain'| 'snow' |'fog'} weather  设置 雨、雪、雾
   * @memberof GisMap
   */
  setWeather(weather) {
    if (!weather) return;
    if (this.weather) {
      this.clearWeather();
    }
    this.weather = new Weather[weather](this.viewer);
    this.weather.init();
  }

  /**
   *
   * 清除天气
   * @memberof GisMap
   */
  clearWeather() {
    if (this.weather) {
      this.weather.destroy();
      this.weather = null;
    }
  }

  unHandleTip() {
    if (this.tip) {
      this.tip.destroy();
      this.tip = null;
      this.selected = null;
    }
  }

  handleTip(entity) {
    if (this.contextMenu) {
      this.contextMenu.hide();
    }
    // 单个tip展示
    if (this.tip && this.selected && this.selected.id === entity.id) {
      this.tip.show();
      console.log('已选中该对象');
    } else if (this.selected && this.selected.id !== entity.id) {
      this.unHandleTip();
      this.selected = entity;
      this.tip = new Tip(this.viewer, entity);
    } else {
      this.selected = entity;
      this.tip = new Tip(this.viewer, entity);
    }
  }

  unHandleMenu() {
    if (this.contextMenu) {
      this.contextMenu.destroy();
      this.contextMenu = null;
      this.selected = null;
    }
  }

  handleMenu(entity) {
    if (this.tip) {
      this.tip.hide();
    }
    // 单个tip展示
    if (this.contextMenu && this.selected && this.selected.id === entity.id) {
      this.contextMenu.show();
      // console.log( this.contextMenu)
      console.log('已选中该对象');
    } else if (this.selected && this.selected.id !== entity.id) {
      this.unHandleMenu();
      this.selected = entity;
      this.contextMenu = new Menu(this.viewer, entity);
    } else {
      this.selected = entity;
      this.contextMenu = new Menu(this.viewer, entity);
    }
  }

  drawPolyLine(points = [], options = {}) {
    const { width = 10, color = '#ff0000' } = options;

    if (points.length < 2) {
      return;
    }

    const pointsArray = points.reduce((a, b) => a.concat(b), []);
    const poly = this.viewer.entities.add({
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
          pointsArray,
        ),
        shape: computeCircle(width, 15), // 参数是管线的半径，管线的横截面形状
        // material: Cesium.Color.fromCssColorString(color),
        material: new Cesium.PolylineMp(
          Cesium.Color.fromCssColorString(color || '#0099cc'),
          2000,
        ),
        // material: new Cesium.PolylineGlowMaterialProperty({
        //   color :new Cesium.Color.fromCssColorString(color||'#0099cc'),
        // }),
      },
    });

    return poly;
  }

  /**
   *
   * 移除元素
   * @param {string} id
   * @memberof GisMap
   */
  remove(entity) {
    let _entity = entity;
    if (typeof entity === 'string') {
      _entity = this.viewer.entities.getById(entity);
    }
    if (_entity) {
      this.viewer.entities.remove(_entity);
    }
  }

  /**
   *
   * 销毁GisMap实例
   * @memberof GisMap
   */
  destroy() {
    this.viewer.destroy();
  }

  test() {
    return this;
  }
}
// 摄像机事件
GisMap.prototype.addCameraEvent = camera.addCameraEvent;
GisMap.prototype.removeCameraEvent = camera.removeCameraEvent;
GisMap.prototype.getCameraPosition = camera.getCameraPosition;
GisMap.prototype.getCameraHeight = camera.getCameraHeight;
// 鼠标事件
GisMap.prototype.addMouseEvent = mouse.addMouseEvent;
GisMap.prototype.removeMouseEvent = mouse.removeMouseEvent;
// 缩放
GisMap.prototype.zoomIn = base.zoomIn;
GisMap.prototype.zoomOut = base.zoomOut;
GisMap.prototype.setSceneMode2D3D = base.setSceneMode2D3D;
// 星空背景
GisMap.prototype.setSky = base.setSky;
GisMap.prototype.clearSky = base.clearSky;
GisMap.prototype.resetSky = base.resetSky;
GisMap.prototype.canvas2image = base.canvas2image;
// 测量工具
GisMap.prototype.measureLine = function measureLine() { return new MeasureLine(this.viewer); };
GisMap.prototype.measurePolygn = function measurePolygn() { return new MeasurePolygn(this.viewer); };

// 画图方法
const fns = {
  ...drawFns, ...paintFns,
};
Object.keys(fns).forEach((key) => {
  GisMap.prototype[key] = fns[key];
});
window.Cesium = Cesium;

export default GisMap;
