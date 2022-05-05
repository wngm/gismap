import * as Cesium from "@modules/cesium/Source/Cesium";
import baseOptions from "../config/base";
import "@modules/cesium/Source/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/static/Cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZGE5MmI2Yy1jZmVmLTQyZGUtYjk4Ni02ODBiYWFiZDZkOGYiLCJpZCI6MjU3MDQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODY0MjQyMDR9.dx-BAVwhWMWfgJb49x2XZEVP-EjFxMvihn8Lca6EXYU";

class GisMap {
  constructor(options) {
    this.viewer = null;
    this.scene = null;
    this.init();
  }
  init() {
    this.initViewer()
   
  }
  initViewer(){
    this.viewer = new Cesium.Viewer("cesium", baseOptions);
    this.scene = this.viewer.scene;
    this.scene.fxaa = true;
    this.scene.postProcessStages.fxaa.enabled = true;
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      this.viewer.resolutionScale = window.devicePixelRatio;
      //   this.viewer.scene.postProcessStages.÷
    }
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
      this.viewer.camera.setView({
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
}

export default GisMap;
