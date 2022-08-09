import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";

import img1 from "../assets/images/img-point.png";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium", { animation: true, timeline: true });

window.gisMap = gisMap;
gisMap.viewer.scene.debugShowFramesPerSecond = true;
gisMap.setSceneMode2D3D();

gisMap.setView({
  longitude: 60,
  latitude: 0,
  height: 30000000,
});

function createPath() {
  const { viewer, Cesium } = gisMap;

  gisMap.drawPathLine([
    {
      longitude: 120,
      latitude: 40,
      height: 100000,
      time: "2022-7-15 00:00:00",
    },
    {
      longitude: 80,
      latitude: 30,
      height: 100000,
      time: "2022-7-15 10:00:00",
    },
    {
      longitude: 70,
      latitude: 60,
      height: 100000,
      time: "2022-7-16 00:00:00",
    },
  ], {
    key: "path2",
    showPoint: true,
    // 标记样式
    billboard: {
      width: 30,
      height: 40,
      // image  支持base64 || url
      image: img1,
      // image: window.CESIUM_BASE_URL + "/images/img-point.png",
      // 位置调整
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    },
  });
  let startTime = Cesium.JulianDate.fromDate(new Date("2022-7-15 00:00:00"));
  let stopTime = Cesium.JulianDate.fromDate(new Date("2022-7-16 06:00:00"));
  viewer.clockViewModel.multiplier = 600;
  viewer.clock.startTime = startTime;
  viewer.clock.stopTime = stopTime;
  viewer.clock.currentTime = startTime.clone();

  // let event = new Cesium.Event();

  console.log(viewer.clock);
  viewer.clock.onStop.addEventListener(function (c) {
    console.log(2222, c);
  });
  viewer.clock.onTick.addEventListener(function (clock) {
    console.log(888, clock);
  });
}

function pathPush() {
  gisMap.pathLinePush("path2", {
    longitude: 120,
    latitude: 60,
    height: 100000,
    time: "2022-7-16 06:00:00",
  });
}

function Content() {
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => gisMap.hightQuality()}>
        图像质量高
      </div>
      <div className="btn" role="none" onClick={() => gisMap.lowQuality()}>
        图像质量低
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          createPath();
        }}
      >
        添加移动轨迹
      </div>

      <div
        className="btn"
        role="none"
        onClick={() => {
          pathPush();
        }}
      >
        追加坐标点
      </div>

      <div
        className="btn"
        onClick={() => {
          gisMap.setSceneMode2D3D();
        }}
      >
        2D/3D
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Content />);
