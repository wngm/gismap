import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import Eventemitter from "eventemitter3";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium", { animation: true, timeline: true });
gisMap.viewer.scene.debugShowFramesPerSecond = true;

const { Cesium } = gisMap;
const tles = `CALSPHERE 1
1 00900U 64063C   22201.59855198  .00000465  00000+0  48647-3 0  9991
2 00900  90.1734  41.5172 0024979 284.1901 139.1813 13.73845354875213`;
// 波形
// gisMap.cylinderWave({
//   longitude: 89,
//   latitude: 42,
//   height: 2003204,
//   //可选参数
//   bottomRadius: 2003204,
//   color: "#00ff00",
// });

// gisMap.setSceneMode2D3D();
// // 圆锥
// gisMap.drawCylinder({
//   longitude: 120,
//   latitude: 42,
//   height: 2003204,
//   color: '#ff0000'
// });

// 波形绑定卫星
function bindStallite(dataSource, id) {
  const { Cesium, viewer } = gisMap;
  const { ellipsoid } = viewer.scene.globe;
  const entity2 = gisMap.cylinderWave({
    longitude: 149,
    latitude: 42,
    height: 1000000,
    color: "#009900",
  });
  let satellite = dataSource.entities.getById(id);
  let property = new Cesium.SampledPositionProperty();
  let property2 = new Cesium.SampledProperty(Number);
  for (var ind = 0; ind < 292; ind++) {
    var time = Cesium.JulianDate.addSeconds(
      viewer.clock.currentTime,
      300 * ind,
      new Cesium.JulianDate(),
    );
    var position = satellite.position.getValue(time);
    var cartographic = ellipsoid.cartesianToCartographic(position);
    var lat = Cesium.Math.toDegrees(cartographic.latitude),
      lng = Cesium.Math.toDegrees(cartographic.longitude),
      hei = cartographic.height / 2;
    property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
    property2.addSample(time, hei * 2);
  }
  entity2.position = property;
  entity2.cylinder.length = property2;
  entity2.cylinder.length.setInterpolationOptions({
    interpolationDegree: 1,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
  });
  entity2.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  });
}

window.gisMap = gisMap;
function Content() {
  const [czmlData, setCzmlData] = useState(null);
  const home = () => {
    gisMap.setView({
      longitude: 106.038795,
      latitude: 31.042339,
      height: 9853204,
    });
  };

  const removeAll = () => {
    gisMap.removeAll();
  };
  const addStallite = () => {
    const { viewer, Cesium } = gisMap;
    const czml = "/static/Cesium/czml/data2.czml";
    const loadCzml = gisMap.loadCzml({
      czml,
      onReady: (load) => {
        load.bindStallite(
          "ASTRO_E2",
          gisMap.cylinderWave({
            key: "STRO_E2_P",
            longitude: 149,
            latitude: 42,
            height: 1000000,
            color: "#009900",
          }),
        );
      },
    });
    setCzmlData(loadCzml);
  };

  const removeStallite = () => {
    if (czmlData) {
      czmlData.remove();
      setCzmlData(null);
    }
  };

  const addListener = () => {
    // 监视区域1
    gisMap.drawRect({
      key: "rect",
      color: "#0dfcff",
      // highlight: true,
      // highlightColor: 'red',
      coordinates: [
        [80, 20],
        [120, 40],
      ],
    });
    // 监视区域2
    gisMap.drawCircle({
      key: "circle",
      longitude: 60,
      latitude: 10,
      height: 0,
      radius: 2000000,
      color: "#009900",
    });
    const lister = gisMap.areaEvent();
    lister.add("STRO_E2_P");
    lister.addArea("rect");
    lister.addArea("circle");
    // 监视回调
    lister.event.on("in", (e) => {
      console.log(`${e.animate.entity.id} 进入 ${e.area.entity.id}`);
      if (e.area.id === "rect") {
        e.area.entity.rectangle.material = Cesium.Color.RED;
      }
      if (e.area.id === "circle") {
        e.area.entity.ellipse.material = Cesium.Color.RED;
      }
    });
    lister.event.on("out", (e) => {
      console.log(`${e.animate.entity.id} 移出 ${e.area.entity.id}`);
      if (e.area.id === "rect") {
        e.area.entity.rectangle.material = Cesium.Color.BLUE;
      }
      if (e.area.id === "circle") {
        e.area.entity.ellipse.material = Cesium.Color.BLUE;
      }
    });
  };

  const tel = () => {
    // gisMap.viewer.scene.globe.depthTestAgainstTerrain = true;

    // let tle1 =
    //   "1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927";
    // let tle2 =
    //   "2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537";
    // let tle1 =
    //   "1 47293U 20100AM  22200.76967069 -.00000394  00000+0 -11305-2 0  9993";
    // let tle2 =
    //   "2 47293  87.8873 274.4828 0002579  97.4959 262.6462 13.12443371 77202";

    // lines = lines.split("\n");
    let lines = tles.split("\n");
    console.log(lines);
    let l = lines.length / 3;
    let start = "2022/07/15 00:00:00";
    let end = "2022/07/15 02:00:00";
    gisMap.viewer.clock.currentTime = new GisMap.Cesium.JulianDate.fromDate(
      new Date(start),
    );
    gisMap.viewer.clock.multiplier = 40;
    const points = gisMap.scene.primitives.add(
      new Cesium.PointPrimitiveCollection(),
    );
    const colors = {
      0: "#00ff00",
      1: "#ff0000",
      2: "#0000ff",
    };
    // 单条线还行 一多就卡
    for (let i = 0; i < l; i++) {
      let tle1 = lines[3 * i + 1];
      let tle2 = lines[3 * i + 2];
      let point = gisMap.drawPoint({
        color: colors[i % 3],
        longitude: 149,
        latitude: 42,
        height: 2000000,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      });

      // let _sampledPosition = gisMap.Satellite.getTleSampledPosition(
      let { sampledPosition, positionList = [] } = gisMap.Satellite
        .getPassLineFormTle(
          tle1,
          tle2,
          start,
          end,
          10,
          gisMap,
        );
      let circle = gisMap.cylinderWave({
        longitude: 89,
        latitude: 42,
        height: 2003204,
        //可选参数
        bottomRadius: 503204,
        color: "#00ff00",
      });
      // points.add({
      //   pixelSize: 100.0,
      //   position: Cesium.Cartesian3.ZERO,
      //   color: Cesium.Color.YELLOW,
      // });
      point.position = sampledPosition;
      circle.position = sampledPosition;
      gisMap.viewer.entities.add(gisMap.Satellite.drawPath(
        new Date(start),
        new Date(end),
        sampledPosition,
      ));
      // positionList.forEach(({ startTime, endTime, position }) => {
      // console.log(gisMap.Satellite.drawPath(startTime, endTime, ç√));
      // });
    }

    //   positionList.forEach(({
    //     position, startTime, endTime
    // }) => {
    //     Satellite.drawPath(startTime, endTime, position)

    // })
    // let cl2 = gisMap.cylinderWave({
    //   key: "STRO_E2_P2",
    //   longitude: 149,
    //   latitude: 42,
    //   height: 2000000,
    //   bottomRadius: 1000000,
    //   color: "#cc0099",
    // });

    // cl.position = _sampledPosition.sampledPosition;
    // _sampledPosition.positionList.forEach(
    //   ({ startTime, endTime, position }) => {
    //     console.log(position, 888);
    //     gisMap.viewer.entities.add(
    //       gisMap.Satellite.drawPath(
    //         startTime,
    //         endTime,
    //         _sampledPosition.sampledPosition,
    //       ),
    //     );
    //   },
    // );
  };
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => home()}>home</div>
      <div className="btn" role="none" onClick={() => removeAll()}>清空所有</div>
      <div className="btn" role="none" onClick={() => addStallite()}>
        增加卫星扫描
      </div>
      <div className="btn" role="none" onClick={() => removeStallite()}>
        移除卫星扫描
      </div>
      <div className="btn" role="none" onClick={() => addListener()}>区域监听</div>
      <div className="btn" role="none" onClick={() => tel()}>TEL</div>
      <div
        className="btn"
        role="none"
        onClick={() => gisMap.setSceneMode2D3D()}
      >
        2D3D
      </div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
