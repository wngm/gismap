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
//高质量展示
// gisMap.hightQuality();
//低质量展示
// gisMap.lowQuality()
// 绘制点

// 事件监听 单击
gisMap.event.on("click", (e) => {
  console.log("click", e);
});

// 事件监听 双击
gisMap.event.on("dbClick", (e) => {
  console.log("dbClick", e);
});

// 事件监听 右键
gisMap.event.on("contextmenu", (e) => {
  console.log("contextmenu", e);
});

//测试点1
let p1 = gisMap.drawPoint({
  key: "p1",
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
    placement: "top",
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
  // isHighlight: true,
  // 默认删除 菜单
  // showDefaultMenu: true,
});

//测试点2
let p2 = gisMap.drawPoint({
  key: "p2",
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
    placement: "rightTop",
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
  menu: {
    className: "div-menu",
    menuItems: [
      { text: "编辑", icon: "fa-edit", type: "edit" },
      { text: "展示详情", icon: "fa-eye", type: "detail" },
      { text: "删除", icon: "fa-trash-alt", type: "delete" },
      { type: "type1", text: "文本1 " },
      { type: "type2", text: "文本2 " },
      { type: "type3", text: "文本3 " },
    ],
    onSelect: (type, entity) => {
      console.log(type);
      console.log(entity);
      const p = gisMap.getPoint(entity);
      // 点信息
      console.log(p);
    },
  },
  isHighlight: true,
});

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
        onClick={() => gisMap.highlightPoint("p1")}
      >
        高亮
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => gisMap.highlightPoint("p2", "#ff0000")}
      >
        高亮红
      </div>
      <div
        className="btn"
        role="none"
        onClick={() => {
          gisMap.unhighlightPoint("p1");
          gisMap.unhighlightPoint("p2");
        }}
      >
        默认
      </div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
