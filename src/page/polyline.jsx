import * as Cesium from "cesium";
import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium");

window.gisMap = gisMap;
gisMap.setView({
  longitude: 104.06836,
  latitude: 30.60,
  height: 800,
  pitch: -45.0,
});

function Content() {
  const [name, setName] = useState("测试");
  const [latitude, setLatitude] = useState(30.60);
  const [longitude, setLongitude] = useState(104.06836);
  const [height, setheight] = useState(800);
  const [labelName, setLabelName] = useState("测试点");
  const [tip, setTip] = useState("");

  const setView = useCallback(() => {
    gisMap.setView({
      longitude: Number(longitude),
      latitude: Number(latitude),
      height: Number(height),
      pitch: -45.0,
    });
  }, [latitude, longitude, height]);

  const test = () => {
    const points = [
      // [104.06834473029204, 30.644507622074453, 10],
      // [104.06835473784035, 30.641167540489427, 10],
      // [104.0649213449914, 30.641261363072736, 10],
      [104.0652037488406, 30.640307797224754, 10],
      [104.06842086951482, 30.600165370177698, 10],
    ];
    gisMap.drawPolyLine(points, { width: 6, color: "#0dfcff" });
  };
  const test2 = () => {
    const points = [
      [104.06814473029204, 30.644507622074453, -20],
      [104.06815473784035, 30.641167540489427, -20],
      [104.0646213449914, 30.641261363072736, -20],
      [104.0650037488406, 30.640307797224754, -20],
      [104.06822086951482, 30.600165370177698, -20],
    ];
    gisMap.drawPolyLine(points, { width: 6, color: "#990000" });
  };
  const test21 = () => {
    const points = [
      [104.0662037488406, 30.640307797224754, 10],
      [104.06942086951482, 30.600165370177698, 10],
    ];
    gisMap.drawPolyLine(points, { width: 6, color: "#990000", type: 1 });
  };

  const test3 = () => {
    gisMap.viewer.scene.globe.depthTestAgainstTerrain = false;
  };
  const test4 = () => {
    gisMap.viewer.scene.globe.depthTestAgainstTerrain = true;
  };

  const test5 = () => {
    const { globe } = gisMap.viewer.scene;
    const { viewer } = gisMap;
    const position = new Cesium.Cartesian3.fromDegrees(
      Number(longitude),
      Number(latitude),
      10,
    );
    const entity = gisMap.viewer.entities.add({
      position,
      box: {
        dimensions: new Cesium.Cartesian3(1400.0, 1400.0, 2800.0),
        material: Cesium.Color.WHITE.withAlpha(0.3),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
      },
    });

    globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      modelMatrix: entity.computeModelMatrix(Cesium.JulianDate.now()),
      planes: [
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(1.0, 0.0, 0.0),
          -700.0,
        ),
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(-1.0, 0.0, 0.0),
          -700.0,
        ),
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(0.0, 1.0, 0.0),
          -700.0,
        ),
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(0.0, -1.0, 0.0),
          -700.0,
        ),
      ],
      edgeWidth: edgeStylingEnabled ? 1.0 : 0.0,
      edgeColor: Cesium.Color.WHITE,
      enabled: clippingPlanesEnabled,
    });
    globe.backFaceCulling = true;
    globe.showSkirts = true;

    viewer.trackedEntity = entity;
  };
  return (
    <div className="box">
      <div>
        <div>
          <span>经度</span>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div>
          <span>纬度</span>
          <input
            type="number"
            value={latitude}
            onChange={(e) => {
              setLatitude(e.target.value);
            }}
          />
        </div>
        <div>
          <span>高度</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setheight(e.target.value)}
          />
        </div>
      </div>
      <div className="btn" onClick={setView}>设置显示</div>
      <div className="btn" onClick={test}>管道</div>
      <div className="btn" onClick={test21}>管道流动</div>
      <div className="btn" onClick={test2}>地下管道</div>
      <div className="btn" onClick={test3}>地下可视</div>
      <div className="btn" onClick={test4}>地下隐藏</div>
      <div className="btn" onClick={test5}>k</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);

// const { Cesium } = GisMap;

// function renderPoints(viewer) {
//   var pointCollection = viewer.scene.primitives.add(
//     new Cesium.PointPrimitiveCollection(),
//   );
//   for (var longitude = -180; longitude < 180; longitude++) {
//     var color = Cesium.Color.PINK;
//     if ((longitude % 2) === 0) {
//       color = Cesium.Color.CYAN;
//     }
//     for (var latitude = -90; latitude < 90; latitude++) {
//       pointCollection.add({
//         position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
//         color: color,
//       });
//     }
//   }
// }
