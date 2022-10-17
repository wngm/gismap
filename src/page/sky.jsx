import React from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";
import left from "../assets/images/skybox/12h+00.jpg";
import right from "../assets/images/skybox/00h+00.jpg";
import top from "../assets/images/skybox/06h+00.jpg";
// import top from "../assets/images/skybox/top.jpg";
// import bottom from "../assets/images/skybox/06h+90.jpg";
import bottom from "../assets/images/skybox/18h+00.jpg";
import front from "../assets/images/skybox//06h+90.jpg";
import back from "../assets/images/skybox/06h-90.jpg";
window["CESIUM_BASE_URL"] = "/static/Cesium";
const gisMap = new GisMap("cesium");

setTimeout(() => {
  gisMap.viewer.scene.fog.enable = true;
  gisMap.viewer.scene.fog.show = true;
  gisMap.viewer.scene.sun.enable = true;
  gisMap.viewer.scene.moon.enable = true;
  gisMap.viewer.scene.skyAtmosphere.show = true;
  gisMap.viewer.scene.globe.showGroundAtmosphere = true;
}, 1000);

gisMap.setView({
  latitude: 0,
  longitude: 0,
  height: 100000000,
  heading: 0.0,
  pitc: -90.0,
  roll: 70.0,
});
window.gisMap = gisMap;
gisMap.setSky([right, left, front, back, bottom, top]);
function Content() {
  const setSky = () => {
    gisMap.setSky([right, left, front, back, bottom, top]);
  };

  const clearSky = () => {
    gisMap.clearSky();
  };
  const resetSky = () => {
    gisMap.resetSky();
  };
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => setSky()}>设置</div>
      <div className="btn" role="none" onClick={() => resetSky()}>重置</div>
      <div className="btn" role="none" onClick={() => clearSky()}>取消</div>
      <div
        className="btn"
        role="none"
        onClick={() => gisMap.globeRotateStart(5)}
      >
        自转
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => gisMap.globeRotateStop()}
      >
        停止自转
      </div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
