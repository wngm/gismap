import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";

import img1 from "../assets/images/img-point.png";
import img2 from "../assets/images/img-point-highlight.png";
// window['CESIUM_BASE_URL'] = '/static/Cesium'

const { Cesium } = GisMap;
const gisMap = new GisMap("cesium", {
  animation: true,
  timeline: true,
  // mapMode2D: GisMap.Cesium.MapMode2D.ROTATE,
  // requestRenderMode: true,
});

// gisMap.scene.postUpdate.addEventListener(function (e) {
//   // This code will run at 60 FPS
//   console.log("postUpdate", e);
// });
// gisMap.scene.preRender.addEventListener(function (e) {
//   // This code will run at 60 FPS
//   console.log("preRender", e);
// });
let data = [
  [120, 40, 0],
  [110, 40, 0],
  [100, 40, 0],
  [90, 40, 0],
  [80, 40, 0],
  [120, 30, 0],
  [110, 30, 0],
  [100, 30, 0],
];

data.forEach((i) => {
  gisMap.drawPoint({
    longitude: i[0],
    latitude: i[1],
    height: i[2],
    layer: "pp1",
    pixelSize: 48,
    color: "#ff0000",
  });
});

gisMap.drawPoint({
  longitude: 120,
  latitude: 40,
  height: 0,
  pixelSize: 68,
  layer: "mergePoint",
  color: "rgba(244,248,9,1)",
});

window.gisMap = gisMap;
gisMap.viewer.scene.debugShowFramesPerSecond = true;
gisMap.setSceneMode2D3D();
// gisMap.viewer.scene.requestRenderMode = true;
gisMap.setView({
  longitude: 60,
  latitude: 0,
  height: 30000000,
});
// gisMap.event.on("moveIn", (e) => {
//   console.log(e);
//   e.entity.point.color = Cesium.Color.BLUE;
// });
// gisMap.event.on("moveOut", (e) => {
//   console.log(e);
//   e.entity.point.color = Cesium.Color.RED;
// });
function createPath() {
  const { viewer, Cesium } = gisMap;

  gisMap.drawPathLine([
    {
      key: "path2_p1",
      longitude: 120,
      latitude: 30,
      height: 100000,
      time: "2022-7-15 00:00:00",
      showDefaultMenu: true,
      imgOptions: {
        image: img1,
      },
      menu: {
        menuItems: [
          { text: "删除", icon: "fa-trash-alt", type: "delete" },
        ],
        onSelect: (type, entity) => {
          gisMap.pathLineDeletePoint("path2", entity._id);
        },
      },
    },
    {
      key: "path2_p2",
      longitude: 60,
      latitude: 20,
      height: 100000,
      time: "2022-7-15 10:00:00",
      imgOptions: {
        image: img2,
      },
      menu: {
        menuItems: [
          { text: "删除", icon: "fa-trash-alt", type: "delete" },
        ],
        onSelect: (type, entity) => {
          if (type === "delete") {
            // gisMap.pathLineDeletePoint(
            //   "path2",
            //   "path2_p2",
            // );
            // 删除
            gisMap.pathLineDeletePoint(
              entity.parent._id,
              entity._id,
            );
          }
        },
      },
    },
    {
      key: "path2_p3",
      longitude: 70,
      latitude: 60,
      height: 100000,
      time: "2022-7-16 00:00:00",
      showDefaultMenu: true,
      menu: {
        menuItems: [
          { text: "删除", icon: "fa-trash-alt", type: "delete" },
        ],
        onSelect: (type, entity) => {
          gisMap.pathLineDeletePoint("path2", entity._id);
        },
      },
    },
  ], {
    key: "path2",
    showPoint: true,
    mode: "show",
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
  let startTime2 = Cesium.JulianDate.fromDate(new Date("2022-7-14 00:00:00"));
  let stopTime = Cesium.JulianDate.fromDate(new Date("2022-7-16 00:00:00"));
  gisMap.viewer.clockViewModel.multiplier = 600;
  viewer.clock.startTime = startTime.clone();
  // viewer.clock.stopTime = stopTime.clone();
  viewer.clock.currentTime = startTime.clone();
  gisMap.viewer.timeline.zoomTo(
    startTime.clone(),
    stopTime.clone(),
  );
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
  // -----------------

  // let event = new Cesium.Event();
}

function pathPush() {
  const list = [
    {
      longitude: 120,
      latitude: 60,
      height: 100000,
      time: "2022-7-16 06:00:00",
    },
    {
      longitude: 130,
      latitude: 50,
      height: 100000,
      time: "2022-7-16 07:00:00",
    },
    {
      longitude: 140,
      latitude: 40,
      height: 100000,
      time: "2022-7-16 09:00:00",
    },
  ];
  // gisMap.pathLinePush("path2", list[2]);
  list.map((i, index) => {
    gisMap.pathLinePush("path2", i);
    setTimeout(() => {
      console.log(i);
    }, index * 5000);
  });
}
const addListener = () => {
  const { Cesium } = GisMap;

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
  const lister = gisMap.areaEvent({ duration: 500 });
  lister.add("path2");
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
        role="none"
        onClick={() => {
          gisMap.pathLineSetMode("path2", "none");
        }}
      >
        隐藏轨迹
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.pathLineSetMode("path2", "show");
        }}
      >
        显示轨迹
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.pathLineSetMode("path2", "lead");
        }}
      >
        燃尽轨迹
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.pathLineSetMode("path2", "trail");
        }}
      >
        尾轨迹
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.pathLineSetBillboard("path2", {
            image: img2,
          });
        }}
      >
        切换icon
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          addListener();
        }}
      >
        区域监测
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.pathLineDeletePoint("path2");
        }}
      >
        删除点
      </div>

      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.viewer.clock.shouldAnimate = true;
        }}
      >
        播放
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.viewer.clock.shouldAnimate = false;
        }}
      >
        停止
      </div>

      <div
        className="btn"
        onClick={() => {
          gisMap.setSceneMode2D3D();
        }}
      >
        2D/3D
      </div>
      <div
        className="btn"
        onClick={() => {
        }}
      >
        图层显示
      </div>
      <div
        className="btn"
        onClick={() => {
          gisMap.layerShow("pp1", "2d");
          gisMap.layerHide("pp1", "2d");
        }}
      >
        图层隐藏
      </div>
      <div
        className="btn"
        onClick={() => {
          // gisMap.viewer.scene.requestRender();
          // gisMap.viewer.scene.forceRender();

          // setTimeout(() => {
          //   gisMap.zoomIn();
          // }, 1000);
          // gisMap.setSceneMode2D3D();
          // gisMap.setSceneMode2D3D();
        }}
      >
        强制渲染
      </div>
      <div></div>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Content />);
