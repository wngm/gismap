import * as Cesium from "@modules/cesium/Source/Cesium";
import baseOptions from "../config/base";
import {getPointOptions,getLabelOptions} from "./entity"
import Weather from "./weather/index"
import Tip from './common/tip'
import Menu from './common/menu'
import material from  './material/line'
import "@modules/cesium/Source/Widgets/widgets.css";



material(Cesium)

window.CESIUM_BASE_URL = "/static/Cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZGE5MmI2Yy1jZmVmLTQyZGUtYjk4Ni02ODBiYWFiZDZkOGYiLCJpZCI6MjU3MDQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODY0MjQyMDR9.dx-BAVwhWMWfgJb49x2XZEVP-EjFxMvihn8Lca6EXYU";


function computeCircle(radius,step=15) {
  var positions = [];
  var i = 0;
  while (i < 360) {
      var radians = Cesium.Math.toRadians(i);
      positions.push(
          new Cesium.Cartesian2(
              radius * Math.cos(radians),
              radius * Math.sin(radians)
          )
      );
      i += step;//如果去掉管横截面就是圆，但是影响渲染
    }
  return positions;
}
// id 累加计数器
let _id =1
class GisMap {
  static version ='1.0.0'
  constructor(options) {
    this.viewer = null;
    this.scene = null;
    this.camera =null
    // 天气
    this.weather =null
    // 选中元素
    this.selected = null
    // tip 对象 
    this.tip = null
    // 右键菜单
    this.contextMenu =null
    this.init(options);
  }
  init(container) {
    this.initViewer(container)
   
  }
  initViewer(container){
    this.viewer = new Cesium.Viewer(container, baseOptions);
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera
    this.viewer.scene.globe.depthTestAgainstTerrain = true
    // 开启抗锯齿
    // this.scene.fxaa = true;
    // this.scene.postProcessStages.fxaa.enabled = true;
    //图像渲染像素化处理
    // if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //   this.viewer.resolutionScale = window.devicePixelRatio;
    // }
    // http://127.0.0.1:8001/geoserver/my_china/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&STYLES&LAYERS=my_china%3AHYP_HR&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&WIDTH=768&HEIGHT=384&BBOX=73.212890625%2C40.78125%2C106.962890625%2C57.65625
    // viewer.scene.imagerySplitPosition = 0.1;
    //去除版权信息
    this.viewer.cesiumWidget.creditContainer.style.display = "none";
    // 太阳光线
    this.viewer.scene.globe.enableLighting = false;
    // 开启阴影效果
    this.viewer.shadows = false;
    //展示太阳
    // this.scene.sun.show = true;
    //太阳变大
    // this.scene.sun.glowFactor = 10;
    //展示月亮
    // this..scene.moon.show = true;
    // 取消双击事件
    this.cSetView({longitude:100, latitude:20, altitude:10000000})

    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this._handleEvent()
  
  }
  loadScene(){
    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866),
    });
  }

  _handleEvent(){
    const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas)
    handler.setInputAction((movement)=>{
      let windowPosition = movement.position
      let pick = this.viewer.scene.pick(windowPosition)
      if(pick){
        this.handleTip(pick)
      }else{
        this.unHandleTip()
        this.unHandleMenu()
      }

    },Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement)=>{
      let windowPosition = movement.position
      let pick = this.viewer.scene.pick(windowPosition)
      if(pick){
        this.handleMenu(pick)
      }else{
        this.unHandleTip()
        this.unHandleMenu()
      }

    },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  cSetView(data){
    const {
      longitude, 
      latitude, 
      altitude,
      heading = 0.0,
      pitch = -90.0,
      roll = 0.0

    } = data
    if(data){
      this.camera.setView({
        // 设置相机位置
        destination:Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
        orientation: {
            // 初始视角
            heading:  Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            roll:  Cesium.Math.toRadians(roll)
        }
    });
    }

  }
  cSetDefaultPosition(data){

    this.cSetView(data)
    // const {longitude, latitude, altitude} = data
    // if(data){
    //   const center = Cesium.Cartesian3.fromDegrees(longitude, latitude,altitude);
    //   this.camera.lookAt(center,  new Cesium.HeadingPitchRange(0.01, Cesium.Math.toRadians(-90.0), 0.01))
    // }
  }

  drawAnimateLine(start,end,options={}){
    _id++;
    var entity = new Cesium.Entity({
      id: Number.prototype.toString.apply(_id),
      // show: true,
      // tip:{show:true,content:'这是线段'},
      width: 2,
      ...options,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          start.longitude,
          start.latitude,
          start.altitude,
          end.longitude,
          end.latitude,
          end.altitude,
        ]),
        // material:  Cesium.Material.fromType(Cesium.Material.PolylineTrailLinkType),
        material:  new Cesium.PolylineTrailLinkMaterialProperty(
          new Cesium.Color.fromCssColorString(options.color||'#0099cc'),
          2000
        ),
        arcType: Cesium.ArcType.GEODESIC,
        // clampToGround: true,
      },
    });

    let line = this.viewer.entities.add(entity);

    return entity
  }

  drawLine(start,end,options={}){
    _id++;
    var entity = new Cesium.Entity({
      id: Number.prototype.toString.apply(_id),
      // show: true,
      // tip:{show:true,content:'这是线段'},
      width: 2,
      ...options,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          start.longitude,
          start.latitude,
          start.altitude,
          end.longitude,
          end.latitude,
          end.altitude,
        ]),
        material:new Cesium.Color.fromCssColorString(options.color||'#0099cc'),
        arcType: Cesium.ArcType.GEODESIC,
        // clampToGround: true,
      },
    });

    let line = this.viewer.entities.add(entity);

    return entity
  }

  drawPoint(data){
    const {
      longitude,
      latitude,
      altitude,
      key, 
      name,
      pixelSize,
      label,
      tip,
      menu
    } = data

    const pointOption = getPointOptions(data)
    const lableOptiopns =getLabelOptions({
      ...label,
      pixelSize
    })
    _id++
    var entity = new Cesium.Entity({
      name,
      id:key|| Number.prototype.toString.apply(_id),
      show: true,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      point: pointOption,
      label : lableOptiopns,
      tip,
      menu
    });
    this.viewer.entities.add(entity);
    console.log(666,pointOption);
    return entity;
  }
  zoomTo(){
    // this.viewer.zoomTo()
  }

  cZoomIn(scale) {
    // 获取当前镜头位置的笛卡尔坐标
    let cameraPos = this.camera.position;

    // // 获取当前坐标系标准
    let ellipsoid = this.scene.globe.ellipsoid;

    // // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

    // // 获取镜头的高度
    let height = cartographic.height;
    scale=scale?scale:height/3
    // 优化？
    this.camera.zoomIn(scale)
    return scale
  }

  cZoomOut(scale) {
    // 获取当前镜头位置的笛卡尔坐标
    let cameraPos = this.camera.position;

    // // 获取当前坐标系标准
    let ellipsoid = this.scene.globe.ellipsoid;

    // // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

    // // 获取镜头的高度
    let height = cartographic.height;
    scale=scale?scale:height*1.5
    this.camera.zoomOut(scale)
    return scale
  }

  cSetsceneMode2D3D(mode){
    if(mode === 3){
      this.viewer.scene.mode= Cesium.SceneMode.SCENE3D
    }else if(mode ===2){
      this.viewer.scene.mode= Cesium.SceneMode.SCENE2D
    }else if(this.viewer.scene.mode === Cesium.SceneMode.SCENE3D){
      this.viewer.scene.mode= Cesium.SceneMode.SCENE2D
    }else{
      this.viewer.scene.mode= Cesium.SceneMode.SCENE3D
    }

  }

  setWeather(weather){
    if(!weather) return;
    if(this.weather){
      this.clearWeather()
    }
    this.weather= new Weather[weather](this.viewer)
    this.weather.init()
  }
  clearWeather(){
    if(this.weather){
      this.weather.destroy()
      this.weather = null
    }
  }
  unHandleTip(){
    if(this.tip){
      this.tip.destroy()
      this.tip = null
      this.selected = null
    }
  }

  handleTip(entity){
    if(this.contextMenu){
      this.contextMenu.hide()
    }
    // 单个tip展示
    if(this.tip && this.selected && this.selected.id === entity.id){
      this.tip.show()
      console.log("已选中该对象")
      return ;
    }else if(this.selected && this.selected.id !== entity.id){
      this.unHandleTip()
      this.selected = entity
      this.tip = new Tip(this.viewer,entity)
    }else{
      this.selected = entity
      this.tip = new Tip(this.viewer,entity)
    }
  }
  unHandleMenu(){
    if(this.contextMenu){
      this.contextMenu.destroy()
      this.contextMenu = null
      this.selected = null
    }
  }

  handleMenu(entity){
    if(this.tip){
      this.tip.hide()
    }
    // 单个tip展示
    if(this.contextMenu && this.selected && this.selected.id === entity.id){
      this.contextMenu.show()
      // console.log( this.contextMenu)
      console.log("已选中该对象")
      return ;
    }else if(this.selected && this.selected.id !== entity.id){
      this.unHandleMenu()
      this.selected = entity
      this.contextMenu = new Menu(this.viewer,entity)
    }else{
      this.selected = entity
      this.contextMenu = new Menu(this.viewer,entity)
    }
  }

  remove(entity){
    let _entity = entity
    if(typeof entity === 'string'){
     _entity =this.viewer.entities.getById(entity)
    }
    if(_entity){
      this.viewer.entities.remove(_entity)
    }
  }


  drawPolyLine(points=[],options={}){
    const {width=10,color='#ff0000'} = options
   
    if(points.length<2){

      return 
    }

    let pointsArray=points.reduce((a,b)=>a.concat(b),[])
    var poly = this.viewer.entities.add({
      polylineVolume: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
              pointsArray
              // 94.0643911540741, 30.644520180014712, 10,
              
              // 104.0709632404425, 30.640218289417344, 10,
              // 104.07189450434191, 30.644299282412025, 10,
              // 104.07064427253918, 30.64452012128316, 10,
              // 104.07011034321702, 30.64035622435374, 10,
              // 104.06936621258502, 30.64035013733864, 10,
              // 104.069595128153, 30.64431128951718, 10,
              // 104.06491237588305, 30.63936779475631, 10
          ),
          shape: computeCircle(width,15),//参数是管线的半径，管线的横截面形状
          material: Cesium.Color.fromCssColorString(color),
      },
    });

    return poly
  }
  test(){
 
    

  }
}


window.Cesium = Cesium
 
export default GisMap;
