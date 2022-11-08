import React from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import * as Cesium from "cesium";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium", { animation: true, timeline: true });
const viewModel = {
  show: true,
  glowOnly: false,
  contrast: 128,
  brightness: -0.3,
  delta: 1.0,
  sigma: 3.78,
  stepSize: 5.0,
};
window.gisMap = gisMap;
gisMap.viewer.scene.debugShowFramesPerSecond = true;
gisMap.setView({
  longitude: 120,
  latitude: 41,
  height: 100000,
  pitch: -45,
});

// var modelMatrix3 = Cesium.Transforms.headingPitchRollToFixedFrame(
//   new Cesium.Cartesian3.fromDegrees(120, 42.0, 2000),
//   new Cesium.HeadingPitchRoll(0, 0, 0),
// ); //gltf数据加载位置
// console.log(modelMatrix3, 99);

let position = new Cesium.Cartesian3.fromDegrees(120, 42.0, 50000);

var entity2 = gisMap.viewer.entities.add({
  id: "test",
  position,
  // orientation: {
  //   // 初始视角
  //   heading: Cesium.Math.toRadians(0.0),
  //   pitch: Cesium.Math.toRadians(90.0),
  //   roll: Cesium.Math.toRadians(0.0),
  // },
  orientation: Cesium.Transforms.headingPitchRollQuaternion(
    position,
    new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(90), // 设置这个属性即可（顺时针旋转的角度值）
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0),
    ),
  ),
  model: {
    // uri:'/static/Cesium/model/satellite.gltf',
    uri: "/static/model/scene.gltf",
    scale: 1000.0, //放大倍数
    shadows: Cesium.ShadowMode.ENABLED,
    lightColor: new Cesium.Cartesian3(10.0, 10.0, 10.0),
  },
});

const handler = new Cesium.ScreenSpaceEventHandler(gisMap.scene.canvas);

const { viewer } = gisMap;
handler.setInputAction(function (movement) {
  //当鼠标点击时获取移动的位置
  var pick = viewer.scene.pick(movement.position);
  console.log(pick);
  if (pick != undefined) {
    var id = pick.id._id;
    console.log(id);
    switch (id) {
      case "test":
        entity2.model.silhouetteColor = Cesium.Color.RED;
        entity2.model.silhouetteSize = 3.0;
        break;
      case "milkCar":
        entity1.model.silhouetteColor = Cesium.Color.RED;
        entity1.model.silhouetteSize = 3.0;
        break;
      default:
        entity2.model.silhouetteColor = Cesium.Color.RED;
        entity2.model.silhouetteSize = 0.0;
        break;
    }
  } else {
    // entity1.model.silhouetteSize = 0.0;
    entity2.model.silhouetteSize = 0.0;
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// var model2 =  gisMap.viewer.entities.add({
//     position:new Cesium.Cartesian3.fromDegrees(119, 42.0, 0),
//     // orientation:{
//     //      // 初始视角
//     //      heading: Cesium.Math.toRadians(0.0),
//     //      pitch: Cesium.Math.toRadians(-90.0),
//     //      roll: Cesium.Math.toRadians(0.0),
//     // },
//     model:{
//         uri:'/static/Cesium/model/satellite.gltf',
//         // uri:'/static/Cesium/model/027.glb',
//         scale: 1.0, //放大倍数
//         shadows:Cesium.ShadowMode.ENABLED,
//         lightColor : new Cesium.Cartesian3(10.0,10.0, 10.0)
//     }
// })
// Cesium.Model.fromGltf({
//     id: "1",
//     mytype: "satellite",
//     url: '/static/Cesium/model/satellite.gltf', //gltf文件的URL
//     modelMatrix: modelMatrix3,
//     scale: 1.0, //放大倍数
//     shadows:Cesium.ShadowMode.ENABLED,
//     dequantizeInShader:false
// })
gisMap.viewer.clock.currentTime = Cesium.JulianDate.addHours(
  Cesium.JulianDate.now(new Date()),
  4,
  new Cesium.JulianDate(),
);

function Content() {
  const { viewer } = gisMap;
  viewer.scene.globe.depthTestAgainstTerrain = true;

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
