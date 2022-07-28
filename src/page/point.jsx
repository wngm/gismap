import React from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";
const gisMap = new GisMap("cesium");
gisMap.setView({
  latitude: 40,
  longitude: 120,
  height: 20000000,
  heading: 0.0,
  pitc: -90.0,
  roll: 70.0,
});
window.gisMap = gisMap;
// 绘制点

gisMap.drawPoint({
  longitude: 120,
  latitude: 40,
  height: 10,
  // 点大小
  pixelSize: 40,
  label: {
    text: "自定义 tip",
  },
  //   提示
  tip: {
    placement: "rightTop",
    mode: "html",
    // 自定义css class
    className: "class-tip",
    content: {
      htmlContent: `<ul class="list-group">
      <li class="list-group-item">Cras justo odio</li>
      <li class="list-group-item">Dapibus ac facilisis in</li>
      <li class="list-group-item">Morbi leo risus</li>
      <li class="list-group-item">Porta ac consectetur ac</li>
      <li class="list-group-item">Vestibulum at eros</li>
    </ul>`,
    },
  },

  Menu: {},
  // isHighlight: true,
  showDefaultMenu: true,
  onMenuSelect(type, entity) {
    console.log(type);
    console.log(entity);
  },
});

gisMap.drawPoint({
  longitude: 120,
  latitude: 30,
  height: 10,
  // 点大小
  pixelSize: 40,
  label: {
    text: "table tip 点",
  },
  //   提示
  tip: {
    placement: "leftTop",
    mode: "table",
    // 自定义css class
    className: "class-tip",
    content: {
      title: "tips",
      items: [
        {
          key: "test1",
          value: "苏打水",
        },
        {
          key: "test2",
          value: "苏打水",
        },
        {
          key: "test3",
          value: "苏打水",
        },
        {
          key: "test4",
          value: "苏打水",
        },
      ],
    },
  },
  // isHighlight: true,
  showDefaultMenu: true,
  onMenuSelect(type, entity) {
    console.log(type);
    console.log(entity);
  },
});

function Content() {
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => setSky()}>设置</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
