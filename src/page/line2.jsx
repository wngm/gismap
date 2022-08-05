import * as Cesium from "cesium";
import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium");

window.gisMap = gisMap;

// 标准线
const line1 = gisMap.drawLine([
  [10, 40, 0],
  [120, 40, 0],
], {
  key: "line1",
  showDefaultMenu: true,
  width: 1,
  color: "#ff0000",
  label: {
    text: "线",
  },
});
// 标准线
const line2 = gisMap.drawLine([
  [10, 30, 0],
  [120, 30, 0],
], {
  key: "line2",
  showDefaultMenu: true,
  width: 1,
  label: {
    text: "线段2",
  },
});
// 标准线
const line3 = gisMap.drawLine([
  [10, 20, 0],
  [120, 20, 0],
  [60, 10, 0],
], {
  key: "line3",
  showDefaultMenu: true,
  width: 1,
  label: {
    text: "线段3",
  },
});

// 线点1【使用模式1】
const line4 = gisMap.drawLineWithPoints([
  [10, 5, 0],
  [120, 5, 0],
  [80, 0, 0],
], {
  key: "line4",
  showDefaultMenu: true,
  width: 1,
  color: "#00ff00",
  label: {
    text: "线段4",
  },
});

// 线点1【使用模式2 点属性拓展】
const line5 = gisMap.drawLineWithPoints([
  {
    longitude: 10,
    latitude: -5,
    height: 0,
    pixelSize: 40,
    label: {
      text: "点1",
    },
    //   提示
    tip: {
      mode: "html",
      // 自定义css class
      className: "class-tip",
      content: {
        htmlContent: `<ul class="list-group">
        <li class="list-group-item">点1 描述</li>
      </ul>`,
      },
    },
    menu: {
      className: "div-menu",
      menuItems: [
        { text: "展示详情", icon: "fa-eye", type: "detail" },
        { text: "删除", icon: "fa-trash-alt", type: "delete" },
      ],
    },
    // 自定义菜单
    onMenuSelect(type, entity) {
      console.log(type);
      console.log(entity);
    },
  },
  {
    longitude: 120,
    latitude: -5,
    height: 0,
    tip: {
      mode: "html",
      // 自定义css class
      className: "class-tip",
      content: {
        htmlContent: `<ul class="list-group">
        <li class="list-group-item">点2 描述</li>
      </ul>`,
      },
    },
  },
  {
    longitude: 80,
    latitude: -30,
    height: 0,
    pixelSize: 40,
    label: {
      text: "点3",
    },
    tip: {
      mode: "html",
      // 自定义css class
      className: "class-tip",
      content: {
        htmlContent: `<ul class="list-group">
        <li class="list-group-item">点3 描述</li>
      </ul>`,
      },
    },
  },
], {
  key: "line5",
  width: 1,
  label: {
    text: "线段5",
  },
  tip: {
    mode: "html",
    // 自定义css class
    className: "class-tip",
    content: {
      htmlContent: `<ul class="list-group">
      <li class="list-group-item">线段5 描述</li>
      <li class="list-group-item">222222</li>
      <li class="list-group-item">33333</li>
      <li class="list-group-item">444444</li>
      <li class="list-group-item">555555</li>
    </ul>`,
    },
  },
});

// 动态加点 数据
const linePoints = [
  [120, 0, 0],
  [60, 0, 0],
  [60, -20, 0],
  [10, 40, 0],
];
let linePointsIndex = 0;

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
        onClick={() => {
          gisMap.highlightLine("line1");
        }}
      >
        高亮线1
      </div>
      <div
        className="btn"
        onClick={() => {
          gisMap.highlightLine("line2", "#ff0000");
        }}
      >
        高亮线2
      </div>
      <div
        className="btn"
        onClick={() => {
          gisMap.unhighlightLine("line1");
          gisMap.unhighlightLine("line2");
        }}
      >
        取消高亮线
      </div>
      <div
        className="btn"
        onClick={() => {
          console.log(linePoints[linePointsIndex], linePointsIndex);
          gisMap.linePush("line1", linePoints[linePointsIndex]);
          linePointsIndex += 1;
        }}
      >
        插入点
      </div>
      <div
        className="btn"
        onClick={() => {
          gisMap.lineSplice("line1", 2, 1);
        }}
      >
        删除中间点
      </div>

      <div
        className="btn"
        onClick={() => {
          gisMap.linePush("line4", linePoints[0]);
        }}
      >
        点线插入点
      </div>
      <div
        className="btn"
        onClick={() => {
          gisMap.linePush("line5", {
            longitude: 120,
            latitude: -50,
            height: 0,
            pixelSize: 40,
            label: {
              text: "新增点",
            },
            tip: {
              mode: "html",
              content: {
                htmlContent: `<li class="list-group-item">新增点</li>`,
              },
            },
          });
        }}
      >
        点线插入点
      </div>
      <div
        className="btn"
        onClick={() => {
          gisMap.lineSplice("line5", 1, 1);
        }}
      >
        删除 line5 点
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Content />);
