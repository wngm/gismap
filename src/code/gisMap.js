import * as Cesium from 'cesium';
import Eventemitter from 'eventemitter3'
import baseOptions from '../config/base';
import Weather from './weather/index';
import Tip from './common/tip';
import Menu from './common/menu';
import material from './material/line';
import material2 from './material/polyline';
import material3 from './material/circleWave';
import material4 from './material/pointFlash';
import { computeCircle } from './utils';
import camera from './methods/camera';
import mouse from './methods/mouse';
import base from './methods/base';
import entityMethods from './methods/entityMethods';
import { MeasureLine, MeasurePolygn, SelectRect, SelectCircle, LoadCzml, AreaEvent, Satellite } from './tools';
import '@modules/cesium/Source/Widgets/widgets.css';
import drawFns from './draw';
import paintFns from './paint';
import layer from './layer';
import ClockAnimate from "./control/clockAnimate"
import './index.css'
window.CESIUM_BASE_URL = '/static/Cesium';


function sprintf() {
  let args = arguments, string = args[0];
  for (let i = 1; i < args.length; i++) {
    let item = arguments[i];
    if (item < 10) {
      item = `0${item}`
    }
    string = string.replace('%02d', item);
  }
  return string;
}

function loadMaterial() {
  material(Cesium);
  material2(Cesium);
  material3(Cesium);
  material4(Cesium);
}
// id 累加计数器

export class GisMap {
  static version = '1.0.45';
  static Cesium = Cesium;
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
    this.primitives = null;
    // 天气
    this.weather = null;
    // 选中元素
    this.selected = null;
    this.selectedMenu = null;
    // tip 对象
    this.tip = null;
    // 右键菜单
    this.contextMenu = null;
    //  事件中心
    this.event = new Eventemitter();
    this.eventCenter = {};
    // 绘图事件集合
    this.paintHandler = [];
    this.init(container, options);
  }

  init(container, options) {
    // CESIUM_BASE_URL 配置
    if (options?.CESIUM_BASE_URL) {
      window.CESIUM_BASE_URL = options.CESIUM_BASE_URL;
    }
    if (!Cesium.PointFlashMaterialProperty) {
      loadMaterial()
    }

    this.initViewer(container, options);
  }

  initViewer(container, options = {}) {
    this.viewer = new Cesium.Viewer(container, { ...baseOptions(), ...options, animation: false });
    //新建 primitives 集合 然后添加到顶层集合中 不然调用 removeAll 会报错 
    this.primitives = this.viewer.scene.primitives.add(new Cesium.PrimitiveCollection());
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
    // this.scene.moon.show = true;
    // 取消双击事件
    // this.setView({ longitude: 100, latitude: 20, height: 10000000 });
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handleEvent();

    // 格式化时间 （北京时间）
    if (options.animation) {
      // this.viewer.animation.viewModel.dateFormatter = this.DateTimeFormatter
      // this.viewer.animation.viewModel.timeFormatter = this.TimeFormatter
      const clockAnimate = new ClockAnimate(this.viewer)
      this.viewer.timeline._topDiv.style.left = "240px"
    }
    if (options.timeline) {
      this.viewer.timeline.makeLabel = this.DateTimeFormatter
    }

  }
  DateTimeFormatter(datetime, viewModel = null, ignoredate = null) {
    var julianDT = new Cesium.JulianDate()
    Cesium.JulianDate.addHours(datetime, 8, julianDT)
    var gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)
    var objDT
    if (ignoredate)
      objDT = ''
    else {
      objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day)
      objDT = gregorianDT.year + '-' + gregorianDT.month + '-' + gregorianDT.day + ' '
      if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
        return objDT
      objDT += ' '
    }
    return objDT + sprintf('%02d:%02d:%02d', gregorianDT.hour, gregorianDT.minute, gregorianDT.second)
  }

  TimeFormatter(time, viewModel) {
    // console.log(time, viewModel)
    // const s = this.DateTimeFormatter(time)
    return ''

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
        this.handleMenu(pick);
        this.event.emit('contextmenu', { id: pick.id?.id, entity: pick.id })
      }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    handler.setInputAction((movement) => {
      const windowPosition = movement.position;
      const pick = this.viewer.scene.pick(windowPosition);
      if (pick) {
        this.handleMenu(pick);
        this.event.emit('click', { id: pick.id?.id, entity: pick.id })
      } else {
        this.unHandleTip();
        this.unHandleMenu();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement) => {
      console.log(movement)
      const pick = this.viewer.scene.pick(movement.position);
      if (pick) {
        this.event.emit('dbClick', { id: pick.id?.id, entity: pick.id })
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    handler.setInputAction((movement) => {
      const { startPosition, endPosition } = movement
      const moveEnd = this.viewer.scene.pick(endPosition);
      const moveStart = this.viewer.scene.pick(startPosition);
      if (!Cesium.defined(moveEnd)) {
        this.moveActiveId = undefined;
        this.unHandleTip();
      } else if (moveEnd.id.highlight) {
        this.moveActiveId = moveEnd.id.id;
      } else if (moveEnd.id) {
        if (!this.contextMenu) {
          this.handleTip(moveEnd);
        }
      } else {

      }
      // moveIn
      if (!Cesium.defined(moveStart) && Cesium.defined(moveEnd)) {
        this.event.emit('moveIn', { id: moveEnd.id?.id, entity: moveEnd.id })
      }
      if (Cesium.defined(moveStart) && !Cesium.defined(moveEnd)) {
        this.event.emit('moveOut', { id: moveStart.id?.id, entity: moveStart.id })
      }
      if (Cesium.defined(moveStart) && Cesium.defined(moveEnd) && moveStart.id !== moveEnd.id) {
        this.event.emit('moveIn', { id: moveEnd.id?.id, entity: moveEnd.id })
        this.event.emit('moveOut', { id: moveStart.id?.id, entity: moveStart.id })
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
    if (this.tip && this.selected && this.selected === entity.id) {
      this.tip.show();
      console.log('已选中该对象');
    } else if (this.selected && this.selected !== entity.id) {
      this.unHandleTip();
      this.selected = entity.id || entity;
      this.tip = new Tip(this.viewer, entity);
    } else {
      this.selected = entity.id || entity;
      this.tip = new Tip(this.viewer, entity);
    }
  }

  unHandleMenu() {
    if (this.contextMenu) {
      this.contextMenu.destroy();
      this.contextMenu = null;
      this.selectedMenu = null;
    }
  }

  handleMenu(entity) {
    if (this.tip) {
      this.tip.hide();
    }
    // 单个tip展示

    if (this.contextMenu && this.selectedMenu && this.selectedMenu === entity.id) {
      this.contextMenu.show();
      // console.log( this.contextMenu)
      console.log('已选中该对象');
    } else if (this.selectedMenu && this.selectedMenu !== entity.id) {
      this.unHandleMenu();
      this.selectedMenu = entity.id || entity;
      this.contextMenu = this.selectedMenu?.menu ? new Menu(this.viewer, entity) : null;
    } else {
      this.selectedMenu = entity.id || entity;
      this.contextMenu = this.selectedMenu?.menu ? new Menu(this.viewer, entity) : null;
    }
    if (!this.selectedMenu?.menu) {
      this.selectedMenu = null
      this.tip.show();
    }
  }
  /**
   *
   * 绘制管线
   * @param {*} [points=[]]
   * @param {*} [options={}]
   * @memberof GisMap
   */
  drawPolyLine(points = [], options = {}) {
    const { width = 10, color = '#ff0000' } = options;

    if (points.length < 2) {
      return;
    }

    const type = options.type || 0
    let material = Cesium.Color.fromCssColorString(color)
    if (type) {
      material = new Cesium.PolylineProperty(
        Cesium.Color.fromCssColorString(color || '#0dfcff'),
        2000,
      )
    }

    const pointsArray = points.reduce((a, b) => a.concat(b), []);
    const poly = this.viewer.entities.add({
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
          pointsArray,
        ),
        shape: computeCircle(width, 15), // 参数是管线的半径，管线的横截面形状
        material,
        // material: ,
        // material: new Cesium.PolylineGlowMaterialProperty({
        //   color :new Cesium.Color.fromCssColorString(color||'#0dfcff'),
        // }),
      },
    });

    return poly;
  }

  /**
   *
   * 移除元素 单个元素
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
    if (_entity._children && _entity._children.length > 0) {
      _entity._children.forEach(e => {
        this.viewer.entities.remove(e)
      })
    }
  }

  /**
   *
   *  移除元素所有元素
   * @memberof GisMap
   */
  removeAll() {
    this.viewer.entities.removeAll()
    this.primitives.removeAll()
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
GisMap.prototype.hightQuality = base.hightQuality;
GisMap.prototype.lowQuality = base.lowQuality;
// 自转
GisMap.prototype.globeRotateStart = base.globeRotateStart
GisMap.prototype.globeRotateStop = base.globeRotateStop
// 星空背景
GisMap.prototype.setSky = base.setSky;
GisMap.prototype.clearSky = base.clearSky;
GisMap.prototype.resetSky = base.resetSky;
GisMap.prototype.canvas2image = base.canvas2image;
GisMap.prototype.getPositionByCartesian = base.getPositionByCartesian;
// 测量工具
GisMap.prototype.measureLine = function measureLine(options) { return new MeasureLine(this.viewer, options); };
GisMap.prototype.measurePolygn = function measurePolygn(options) { return new MeasurePolygn(this.viewer, options); };
GisMap.prototype.selectRect = function selectRect(options) { return new SelectRect(this.viewer, options); };
GisMap.prototype.selectCircle = function selectCircle(options) { return new SelectCircle(this.viewer, options); };
GisMap.prototype.loadCzml = function loadCzml(options) { return new LoadCzml(this.viewer, options); };
GisMap.prototype.areaEvent = function areaEvent(options) { return new AreaEvent(this.viewer, options); };
GisMap.prototype.Satellite = Satellite;
// 图层管理
GisMap.prototype.clearLayer = function (str) {
  console.log(this.viewer.entities)
  const entities = this.viewer.entities.values
  entities.filter(e => e.layer === str).forEach(e => {
    this.remove(e)
  })
}

// 画图方法
const fns = {
  ...drawFns, ...paintFns, ...layer, ...entityMethods
};
Object.keys(fns).forEach((key) => {
  GisMap.prototype[key] = fns[key];
});


window.Cesium = Cesium;
window.Cesium.highlightColor = '#0dfcff';
window.Cesium.themeColor = '#4291da';
window.Cesium.fontColor = '#dbfaff';


export default GisMap;
