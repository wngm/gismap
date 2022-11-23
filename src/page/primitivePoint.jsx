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
gisMap.viewer.clock.currentTime = Cesium.JulianDate.addHours(
  Cesium.JulianDate.now(new Date()),
  4,
  new Cesium.JulianDate(),
);

console.log(gisMap.viewer.scene, "fxaa");

var PrimitivePoints = (
  function () {
    var vertexShader;
    var fragmentShader;
    var geometry;
    var appearance;
    var viewer;
    function _(options) {
      viewer = options.viewer;
      vertexShader = getVS();
      fragmentShader = getFS();
      if (options.Cartesians && options.Cartesians.length >= 2) {
        var postionsTemp = [];
        var colorsTemp = [];
        var indicesTesm = [];
        if (
          options.Colors &&
          options.Colors.length === options.Cartesians.length * 4
        ) {
          for (var i = 0; i < options.Cartesians.length; i++) {
            postionsTemp.push(options.Cartesians[i].x);
            postionsTemp.push(options.Cartesians[i].y);
            postionsTemp.push(options.Cartesians[i].z);
          }
          colorsTemp = options.Colors;
        } else {
          for (var i = 0; i < options.Cartesians.length; i++) {
            postionsTemp.push(options.Cartesians[i].x);
            postionsTemp.push(options.Cartesians[i].y);
            postionsTemp.push(options.Cartesians[i].z);
            //
            colorsTemp.push(0.0);
            colorsTemp.push(0.0);
            colorsTemp.push(1.0);
            colorsTemp.push(1.0);
          }
        }

        //顶点索引（坐标点下标的连接顺序）
        for (var i = 0; i < options.Cartesians.length; i++) {
          indicesTesm.push(i);
        }
        this.positionArr = new Float64Array(postionsTemp);
        this.colorArr = new Float32Array(colorsTemp);
        this.indiceArr = new Uint16Array(indicesTesm);
      } else {
        var p1 = Cesium.Cartesian3.fromDegrees(0, 0, -10);
        var p2 = Cesium.Cartesian3.fromDegrees(0, 0.001, -10);
        this.positionArr = new Float64Array([
          p1.x,
          p1.y,
          p1.z,
          p2.x,
          p2.y,
          p2.z,
        ]);
        this.colorArr = new Float32Array([
          0.0,
          0.0,
          1.0,
          1.0,
          0.0,
          0.0,
          1.0,
          1.0,
        ]);
        this.indiceArr = new Uint16Array([0, 1]);
      }

      geometry = CreateGeometry(
        this.positionArr,
        this.colorArr,
        this.indiceArr,
      );
      appearance = CreateAppearence(fragmentShader, vertexShader);

      console.log(
        "new",
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
          }),
          appearance: appearance,
          asynchronous: false,
          abc: "abc",
        }),
      );
      this.primitive = viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
          }),
          appearance: appearance,
          asynchronous: false,
          abc: "abc",
        }),
      );
      this.primitive.id = {
        show: true,
        menu: {
          className: "div-menu",
          menuItems: [
            { text: "编辑", icon: "fa-edit", type: "edit" },
            { text: "展示详情", icon: "fa-eye", type: "detail" },
            { text: "删除", icon: "fa-trash-alt", type: "delete" },
          ],
        },
      };
    }

    function CreateGeometry(positions, colors, indices) {
      return new Cesium.Geometry({
        attributes: {
          position: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: positions,
          }),
          color: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.FLOAT,
            componentsPerAttribute: 4,
            values: colors,
          }),
        },
        indices: indices,
        primitiveType: Cesium.PrimitiveType.POINTS,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions),
      });
    }

    function CreateAppearence(fs, vs) {
      return new Cesium.Appearance({
        renderState: {
          blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
          depthTest: { enabled: true },
          depthMask: true,
        },
        fragmentShaderSource: fs,
        vertexShaderSource: vs,
      });
    }

    function getVS() {
      return "attribute vec3 position3DHigh;\
            attribute vec3 position3DLow;\
            attribute vec4 color;\
            varying vec4 v_color;\
            attribute float batchId;\
            void main()\
            {\
                vec4 p = czm_computePosition();\
                v_color =color;\
                p = czm_modelViewProjectionRelativeToEye * p;\
                gl_Position = p;\
                gl_PointSize=32.0;\
            }\
            ";
    }
    function getFS() {
      return "varying vec4 v_color;\
            void main()\
            {\
                 float d = distance(gl_PointCoord, vec2(0.5,0.5));\
                 if(d < 0.5){\
                    gl_FragColor = v_color;\
                 }else{\
                    discard;\
                 }\
            }\
            ";
    }

    _.prototype.remove = function () {
      if (this.primitive != null) {
        viewer.scene.primitives.remove(this.primitive);
        this.primitive = null;
      }
    };
    _.prototype.updateCartesianPosition = function (cartesians) {
      if (this.primitive != null) {
        viewer.scene.primitives.remove(this.primitive);
        if (cartesians && cartesians.length < 2) return;

        var postionsTemp = [];
        var colorsTemp = [];
        var indicesTesm = [];
        for (var i = 0; i < cartesians.length; i++) {
          postionsTemp.push(cartesians[i].x);
          postionsTemp.push(cartesians[i].y);
          postionsTemp.push(cartesians[i].z);

          colorsTemp.push(0.0);
          colorsTemp.push(0.0);
          colorsTemp.push(1.0);
          colorsTemp.push(1.0);
        }
        for (var i = 0; i < cartesians.length; i++) {
          indicesTesm.push(i);
        }
        this.positionArr = new Float64Array(postionsTemp);
        this.colorArr = new Float32Array(colorsTemp);
        this.indiceArr = new Uint16Array(indicesTesm);

        geometry = CreateGeometry(
          this.positionArr,
          this.colorArr,
          this.indiceArr,
        );
        appearance = CreateAppearence(fragmentShader, vertexShader);
        this.primitive = viewer.scene.primitives.add(
          new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
              geometry: geometry,
            }),
            appearance: appearance,
            asynchronous: false,
          }),
        );
      } else return;
    };
    _.prototype.updateCartesianPositionColor = function (cartesians, colors) {
      if (colors.length === cartesians.length * 4) {}
      else return;
      if (this.primitive != null) {
        viewer.scene.primitives.remove(this.primitive);
        if (cartesians && cartesians.length < 2) return;

        var postionsTemp = [];
        var indicesTesm = [];

        for (var i = 0; i < cartesians.length; i++) {
          postionsTemp.push(cartesians[i].x);
          postionsTemp.push(cartesians[i].y);
          postionsTemp.push(cartesians[i].z);
        }
        for (var i = 0; i < cartesians.length; i++) {
          indicesTesm.push(i);
        }
        this.positionArr = new Float64Array(postionsTemp);
        this.colorArr = new Float32Array(colors);
        this.indiceArr = new Uint16Array(indicesTesm);

        geometry = CreateGeometry(
          this.positionArr,
          this.colorArr,
          this.indiceArr,
        );
        appearance = CreateAppearence(fragmentShader, vertexShader);

        this.primitive = viewer.scene.primitives.add(
          new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
              geometry: geometry,
            }),
            appearance: appearance,
            asynchronous: false,
          }),
        );
      } else return;
    };
    return _;
  }
)();

var positions = new Float64Array([
  110.2,
  20.6,
  110.2,
  21.9,
  111,
  23,
]);
var cartesian3Positions = Cesium.Cartesian3.fromDegreesArray(positions);

//定义要显示的点的颜色（4个元素定义一个点的颜色（红绿蓝透明度））
var Colors = new Float64Array([
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  1.0,
]);
gisMap.setSceneMode2D3D();

gisMap.setView({
  longitude: 110,
  latitude: 40,
});
var p = new PrimitivePoints({
  viewer: gisMap.viewer,
  Cartesians: cartesian3Positions,
  Colors: Colors,
});

console.log("point", p);

let ps = [[110, 40], [100, 39], [90, 38], [80, 37]];
ps.forEach((p) => {
  gisMap.drawPoint({
    longitude: p[0],
    latitude: p[1],
  });
});

// gisMap.viewer
function renderOptimize(viewer) {
  if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    viewer.resolutionScale = window.devicePixelRatio;
  } else {
    console.warn("不支持图像渲染像素化");
  }
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
}

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
      <div
        className="btn"
        onClick={() => {
          gisMap.setSceneMode2D3D();
        }}
        role="none"
      >
        2D3D
      </div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
