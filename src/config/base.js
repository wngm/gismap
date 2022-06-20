import * as Cesium from 'cesium';

export default {
  vrButton: false, // vr工具
  animation: false,
  baseLayerPicker: false,
  CreditsDisplay: false,
  geocoder: false, // 编码搜索工具
  timeline: false,
  navigationHelpButton: false,
  infoBox: false,
  selectionIndicator: false,
  projectionPicker: false,
  homeButton: false,
  sceneModePicker: false,
  fullscreenButton: false,
  // skyBox: false,
  navigationInstructionsInitiallyVisible: false,
  contextOptions: {
    webgl: {
      alpha: false,
      depth: false,
      stencil: true,
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: true,
    },
    allowTextureFilterAnisotropic: true,
  },
  // msaaSamples: 4,
  // 加载arcGis 暗色地图
  url: '/static/resource',
  // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
  //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
  // }),
  // 高德矢量
  // imageryProvider: new Cesium.UrlTemplateImageryProvider({
  //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  //   minimumLevel: 3,
  //   maximumLevel: 18,
  // }),
  // 高德影像
  // imageryProvider: new Cesium.UrlTemplateImageryProvider({
  //   url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  //   minimumLevel: 3,
  //   maximumLevel: 18,
  // }),
  // 高德标记
  // imageryProvider: new Cesium.UrlTemplateImageryProvider({
  //   url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
  //   minimumLevel: 3,
  //   maximumLevel: 18,
  // }),
  // imageryProvider: new Cesium.WebMapServiceImageryProvider({
  //   url: "/geoserver/my_china/wms",
  //   layers: "my_china:HYP_HR",
  // }),;
};
