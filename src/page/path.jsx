import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium", { animation: true, timeline: true });

window.gisMap = gisMap;
gisMap.viewer.scene.debugShowFramesPerSecond = true;
// gisMap.setSceneMode2D3D();

function createPath() {
  // 动态加点 数据
  const linePoints = [
    [120, 0, 100000],
    [60, 0, 100000],
    [60, -20, 100000],
    [10, 40, 100000],
  ];

  const { viewer, Cesium } = gisMap;
  let startTime = Cesium.JulianDate.fromDate(new Date("2022/07/15 00:00:00"));
  let stopTime = Cesium.JulianDate.fromDate(new Date("2022/07/16 00:00:00"));
  viewer.clock.startTime = startTime.clone();
  // viewer.clock.stopTime = stopTime.clone();
  viewer.clock.currentTime = startTime.clone();

  let positions = linePoints.map((item) => {
    return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]);
  });

  var property = new Cesium.SampledPositionProperty();
  let spend =
    (new Date("2022/07/16 00:00:00") - new Date("2022/07/15 00:00:00")) / 1000 /
    positions.length;
  for (var i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(
      startTime,
      spend * i,
      new Cesium.JulianDate(),
    );
    property.addSample(time, positions[i]);
  }
  console.log(property, 555, spend, positions);
  // const interpolationOptions = {
  //   interpolationDegree: 2,
  //   interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  // };
  // property.setInterpolationOptions(interpolationOptions);

  viewer.entities.add({
    id: "path1",
    //   // 实体可用性，在指定时间内返回有效数据
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startTime,
        stop: stopTime,
        isStopIncluded: false,
      }),
    ]),
    sourceData: linePoints,
    sourceType: "linePointWithTime",
    //   // 位置信息随时间变化property
    position: property,
    //   // 实体方向
    //   orientation: new Cesium.VelocityOrientationProperty(property),

    //   // 轨迹路径
    path: {
      // leadTime: 0,
      // trailTime: 0,
      resolution: 100,
      width: 1,
      material: Cesium.Color.RED,
    },
    billboard: {
      width: 30,
      height: 30,
      image: window.CESIUM_BASE_URL + "/images/pointer.svg",
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      eyeOffset: new Cesium.Cartesian3(0, 0, 10),
    },
    // point: {
    //   pixelSize: 10,
    //   // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    //   color: Cesium.Color.fromCssColorString("#0099cc"),
    // },
  });
}

function pathPush() {
  let _entity = viewer.entities.getById("path1");

  console.log(1, _entity);
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
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Content />);
