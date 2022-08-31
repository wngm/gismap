import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import pointImg from "@src/assets/images/point.png";
import GisMap from "../code/gisMap";
import "./index.less";
const { Cesium } = GisMap;

// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium");
gisMap.viewer.scene.debugShowFramesPerSecond = true;

window.gisMap = gisMap;
gisMap.viewer.scene.globe.depthTestAgainstTerrain = false;

gisMap.event.on("moveIn", (e) => {
  if (e.entity.polygon) {
    e.entity.polygon.height = 0;
    e.entity.polygon.outlineColor = Cesium.Color.RED;
    e.entity.polygon.material = Cesium.Color.RED.withAlpha(0.3);
  }
});
gisMap.event.on("moveOut", (e) => {
  if (e.entity.polygon) {
    e.entity.polygon.height = 0;
    e.entity.polygon.outlineColor = Cesium.Color.YELLOW;
    e.entity.polygon.material = Cesium.Color.YELLOW.withAlpha(0.3);
  }
});

// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test.json", {
//     // stroke: Cesium.Color.HOTPINK,
//     // fill: Cesium.Color.PINK,
//     // strokeWidth: 3,
//     // markerSymbol: "?",
//   }),
// );
gisMap.viewer.dataSources.add(
  Cesium.GeoJsonDataSource.load("/static/test2.json", {
    // stroke: Cesium.Color.HOTPINK,
    // fill: Cesium.Color.PINK,
    // strokeWidth: 3,
    // markerSymbol: "?",
  }),
);
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test3.json", {
//     stroke: Cesium.Color.BLUE,
//     fill: Cesium.Color.BLUE,
//     strokeWidth: 3,
//     markerSymbol: "?",
//   }),
// );
gisMap.viewer.dataSources.dataSourceAdded.addEventListener(function (a) {
  console.log("add data sucess :", a.get(0));

  let source = a.get(0);
  console.log("-------------------");
  console.log(gisMap.viewer);
  source.fill = GisMap.Cesium.Color.RED;
});
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test4.json"),
//   {
//     stroke: Cesium.Color.HOTPINK,
//     fill: Cesium.Color.PINK,
//     strokeWidth: 3,
//     markerSymbol: "?",
//   },
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test5.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test6.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test7.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test8.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test9.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test10.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test11.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test12.json"),
// );
// gisMap.viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load("/static/test13.json"),
// );
function Content() {
  const [name, setName] = useState("测试");
  const [latitude, setLatitude] = useState(60);
  const [longitude, setLongitude] = useState(100);
  const [height, setheight] = useState(10);
  const [labelName, setLabelName] = useState("测试点");
  const [tip, setTip] = useState("点的描述信息");
  const setView = useCallback(() => {
    gisMap.setView({
      longitude: Number(longitude),
      latitude: Number(latitude),
      height: Number(height),
    });
  }, [latitude, longitude, height]);

  return (
    <div className="box">
      <div className="btn" onClick={() => gisMap.setSceneMode2D3D()}>2D/3D</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
