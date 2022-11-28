import React from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import * as Cesium from "cesium";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium", { animation: true, timeline: true });
gisMap.viewer.scene.globe.depthTestAgainstTerrain = false;
const viewModel = {
  show: true,
  glowOnly: false,
  contrast: 128,
  brightness: -0.3,
  delta: 1.0,
  sigma: 3.78,
  stepSize: 5.0,
};

let points = [];
for (var longitude = -360; longitude < 360; longitude++) {
  var color = "#ff000";
  if ((longitude % 2) === 0) {
    color = "#0099cc";
  }

  for (var latitude = -180; latitude < 180; latitude++) {
    points.push({
      color,
      latitude,
      longitude,
    });
  }
}
window.gisMap = gisMap;
gisMap.viewer.scene.debugShowFramesPerSecond = true;
gisMap.setView({
  longitude: 120,
  latitude: 41,
  height: 100000,
  pitch: -45,
});

// gisMap.setSceneMode2D3D(2);
gisMap.viewer.clock.currentTime = Cesium.JulianDate.addHours(
  Cesium.JulianDate.now(new Date()),
  4,
  new Cesium.JulianDate(),
);

function getViewExtend(viewer) {
  let params = {};
  let extend = viewer.camera.computeViewRectangle();
  if (typeof extend === "undefined") {
    //2D下会可能拾取不到坐标，extend返回undefined,所以做以下转换
    let canvas = viewer.scene.canvas;
    let upperLeft = new Cesium.Cartesian2(0, 0); //canvas左上角坐标转2d坐标
    let lowerRight = new Cesium.Cartesian2(
      canvas.clientWidth,
      canvas.clientHeight,
    ); //canvas右下角坐标转2d坐标

    let ellipsoid = viewer.scene.globe.ellipsoid;
    let upperLeft3 = viewer.camera.pickEllipsoid(
      upperLeft,
      ellipsoid,
    ); //2D转3D世界坐标

    let lowerRight3 = viewer.camera.pickEllipsoid(
      lowerRight,
      ellipsoid,
    ); //2D转3D世界坐标

    let upperLeftCartographic = viewer.scene.globe.ellipsoid
      .cartesianToCartographic(
        upperLeft3,
      ); //3D世界坐标转弧度
    let lowerRightCartographic = viewer.scene.globe.ellipsoid
      .cartesianToCartographic(
        lowerRight3,
      ); //3D世界坐标转弧度

    let minx = Cesium.Math.toDegrees(upperLeftCartographic.longitude); //弧度转经纬度
    let maxx = Cesium.Math.toDegrees(lowerRightCartographic.longitude); //弧度转经纬度

    let miny = Cesium.Math.toDegrees(lowerRightCartographic.latitude); //弧度转经纬度
    let maxy = Cesium.Math.toDegrees(upperLeftCartographic.latitude); //弧度转经纬度

    // console.log("经度：" + minx + "----" + maxx);
    // console.log("纬度：" + miny + "----" + maxy);

    params.minx = minx;
    params.maxx = maxx;
    params.miny = miny;
    params.maxy = maxy;
  } else {
    //3D获取方式
    params.maxx = Cesium.Math.toDegrees(extend.east);
    params.maxy = Cesium.Math.toDegrees(extend.north);

    params.minx = Cesium.Math.toDegrees(extend.west);
    params.miny = Cesium.Math.toDegrees(extend.south);
  }
  return params; //返回屏幕所在经纬度范围
}
function cameraChange(e) {
  let params = getViewExtend(gisMap.viewer);

  let _points = points.filter((p) => {
    if (
      params.maxx > p.longitude && params.minx < p.longitude &&
      params.maxy > p.latitude && params.miny < p.latitude
    ) {
      return true;
    }

    return false;
  });

  gisMap.removeAll();
  let maxNumber = 100;
  console.log(_points);
  let $points = [];
  if (_points.length > maxNumber) {
    let step = Math.ceil(_points.length / maxNumber);
    _points = _points.slice(0, maxNumber);
    console.log(step);
    for (let i = 0; i < maxNumber; i++) {
      let index = i * step;
      if (index >= _points.length) {
        index = index - _points.length;
      }
      console.log(index, _points[index]);
      $points.push({ ..._points[index] });
    }
  } else {
    $points = _points;
  }
  console.log($points, 888);
  $points.forEach((i) => {
    gisMap.drawPoint({
      ...i,
      height: 100,
    });
  });
  console.log(e, params);
}
gisMap.addCameraEvent(cameraChange);
function Content() {
  const { viewer } = gisMap;
  //   viewer.scene.globe.depthTestAgainstTerrain = true;

  const resolutionScale = viewer.resolutionScale;
  const imageRendering = () => {
    //判断是否支持图像渲染像素化处理
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      viewer.resolutionScale = window.devicePixelRatio;
    } else {
      console.warn("不支持图像渲染像素化");
    }
  };
  const imageRenderingClose = () => {
    viewer.resolutionScale = resolutionScale;
  };

  const fxaa = (status) => {
    viewer.scene.fxaa = status;
    viewer.scene.postProcessStages.fxaa.enabled = status;
  };

  const msaa = (val) => {
    viewer.scene.msaaSamples = val;
    console.log(viewer.scene?.msaaSamples);
  };
  const sunLight = new Cesium.SunLight();
  const flashlight = new Cesium.DirectionalLight({
    direction: viewer.scene.camera.directionWC, // Updated every frame
  });
  const light = (status) => {
    const { scene } = viewer;
    viewer.scene.moon.show = false;
    viewer.scene.fog.enabled = false;
    viewer.scene.sun.show = true;
    viewer.scene.skyBox.show = false;
    //阴影
    viewer.scene.globe.enableLighting = status;
    viewer.shadows = status;
    viewer.shadowMap.softShadows = status;
    viewer.shadowMap.darkness = 0.02;
    // viewer.shadowMap.darkness  = 0.8//阴影透明度--越大越透明
    viewer.terrainShadows = Cesium.ShadowMode.RECEIVE_ONLY;

    scene.light = status ? flashlight : sunLight;
    scene.globe.dynamicAtmosphereLighting = !status;
    scene.globe.dynamicAtmosphereLightingFromSun = false;
    scene.globe.dynamicAtmosphereLighting = status;
    // viewer.terrainShadows=status?Cesium.ShadowMode.ENABLED:Cesium.ShadowMode.DISABLED
    // 改变时间设置光照效果
    // var utc=Cesium.JulianDate.fromDate(new Date("2021/07/04 04:00:00"));
    //北京时间=UTC+8=GMT+8
    // viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc,8,new Cesium.JulianDate());
    // viewer.scene.light = new Cesium.DirectionalLight({ //去除时间原因影响模型颜色
    //     direction: new Cesium.Cartesian3(0.35492591601301104, -0.8909182691839401, -0.2833588392420772)
    // })
  };
  function updatePostProcess() {
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = Boolean(viewModel.show);
    bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly);
    bloom.uniforms.contrast = Number(viewModel.contrast);
    bloom.uniforms.brightness = Number(viewModel.brightness);
    bloom.uniforms.delta = Number(viewModel.delta);
    bloom.uniforms.sigma = Number(viewModel.sigma);
    bloom.uniforms.stepSize = Number(viewModel.stepSize);
  }

  function updatePostProcessOff() {
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = Boolean(false);
  }
  return (
    <div className="box">
      <div className="btn" onClick={imageRendering} role="none">像素化处理</div>
      <div className="btn" onClick={imageRenderingClose} role="none">
        像素化处理 关闭
      </div>
      <div className="btn" onClick={() => fxaa(true)} role="none">fxaa 开启</div>
      <div className="btn" onClick={() => fxaa(false)} role="none">fxaa 关闭</div>
      <div className="btn" onClick={() => msaa(4)} role="none">msaa 开启</div>
      <div className="btn" onClick={() => msaa(1)} role="none">msaa 关闭</div>
      <div className="btn" onClick={() => light(true)} role="none">光照 开启</div>
      <div className="btn" onClick={() => light(false)} role="none">光照 关闭</div>
      <div className="btn" onClick={updatePostProcess} role="none">泛光 开启</div>
      <div className="btn" onClick={updatePostProcessOff} role="none">
        泛光 关闭
      </div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
