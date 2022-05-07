import * as Cesium from "@modules/cesium/Source/Cesium";
import baseOptions from "../config/base";
import "@modules/cesium/Source/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/static/Cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZGE5MmI2Yy1jZmVmLTQyZGUtYjk4Ni02ODBiYWFiZDZkOGYiLCJpZCI6MjU3MDQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODY0MjQyMDR9.dx-BAVwhWMWfgJb49x2XZEVP-EjFxMvihn8Lca6EXYU";


function getPoint(color = Cesium.Color.RED, heightReference = Cesium.HeightReference.CLAMP_TO_GROUND) {
  return {
      show: true,
      pixelSize: 30,
      heightReference: heightReference,
      color: color,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 10,
      scaleByDistance: new Cesium.NearFarScalar(1500, 1, 20000, 0.3),
      // translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 20000, 0.2),
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000)
  }
}

class GisMap {
  static version ='1.0.0'
  constructor(options) {
    this.viewer = null;
    this.scene = null;
    this.camera =null
    this.init(options);
  }
  init(container) {
    this.initViewer(container)
   
  }
  initViewer(container){
    this.viewer = new Cesium.Viewer(container, baseOptions);
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera
    // this.scene.fxaa = true;
    // this.scene.postProcessStages.fxaa.enabled = true;
    // if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //   this.viewer.resolutionScale = window.devicePixelRatio;
    // }
    // http://127.0.0.1:8001/geoserver/my_china/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&STYLES&LAYERS=my_china%3AHYP_HR&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&WIDTH=768&HEIGHT=384&BBOX=73.212890625%2C40.78125%2C106.962890625%2C57.65625
    // viewer.scene.imagerySplitPosition = 0.1;
    this.viewer.shadows = false;

    // 太阳光线
    this.viewer.scene.globe.enableLighting = false;

    this.viewer.shadows = false;
    // viewer.scene.sun.show = true;
    // scene.sun.glowFactor = 10; //太阳变大
    // viewer.scene.moon.show = true;
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
  }
  loadScene(){
    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866),
    });
  }
  cSetView(data){
    const {longitude, latitude, altitude} = data
    if(data){
      this.camera.setView({
        // 设置相机位置
        destination:Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
        // orientation: {
        //     // 初始视角
        //     heading: 1.0639406240008213,
        //     pitch: -0.013688041766217074,
        //     roll: 0.00002273530734786533
        // }
    });
    }

  }
  cSetDefaultPosition(data){
    const {longitude, latitude, altitude} = data
    if(data){
      const center = Cesium.Cartesian3.fromDegrees(longitude, latitude,altitude);
      this.camera.lookAt(center,  new Cesium.HeadingPitchRange(0.01, Cesium.Math.toRadians(-90.0), 0.01))
    }
  }

  cDrawMpoint(data){
    const {longitude, latitude, altitude} = data

    const pointOption = getPoint()

    var entity = new Cesium.Entity({
      name: 'test',
      show: true,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      point: pointOption,
      description: `
      <p>这是entity的属性信息，entity的description里面可以写一段html</p>                
      <p>苹果园dog</p>`
  });
  this.viewer.entities.add(entity);
  console.log(666,pointOption);
  return entity;
  }

  cZoomIn(scale) {
    // 获取当前镜头位置的笛卡尔坐标
    let cameraPos = this.camera.position;

    // 获取当前坐标系标准
    let ellipsoid = this.scene.globe.ellipsoid;

    // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

    // 获取镜头的高度
    let height = cartographic.height;
    // 优化？
    this.camera.zoomIn()
    return scale
  }

  cZoomout(scale) {
    this.camera.zoomOut()
    return scale
  }

  cSetsceneMode2D3D(mode){
    if(mode ===3){
      this.viewer.scene.mode= Cesium.SceneMode.SCENE3D
    }else if(mode ===2){
      this.viewer.scene.mode= Cesium.SceneMode.SCENE2D
    }else if(this.viewer.scene.mode === Cesium.SceneMode.SCENE3D){
      this.viewer.scene.mode= Cesium.SceneMode.SCENE2D
    }else{
      this.viewer.scene.mode= Cesium.SceneMode.SCENE3D
    }

  }
}


window.GisMap = GisMap
window.Cesium = Cesium
 
export default GisMap;
