/*
 * @Author: R10
 * @Date: 2022-06-01 13:47:55
 * @LastEditTime: 2022-07-01 15:41:57
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/page/paint.jsx
 */
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import pointImg from "@src/assets/images/point.png";
import GisMap from "../code/gisMap";

import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium");
gisMap.setSceneMode2D3D();
gisMap.drawPoint({
  key: "p1",
  longitude: 120,
  latitude: 40,
  height: 10,
});
gisMap.drawPoint({
  key: "p2",
  longitude: 100,
  latitude: 40,
  height: 10,
});
gisMap.drawPoint({
  key: "p3",
  longitude: 80,
  latitude: 40,
  height: 10,
});

function Content() {
  useEffect(() => {
    gisMap.setView({
      longitude: 106,
      latitude: 27.2,
      height: 100_222_00,
    });
  }, []);
  return (
    <div className="box">
      <select
        style={{ margin: 20, width: 200 }}
        onChange={(e) => {
          switch (e.target.value) {
            case "1":
              gisMap.paintPoint(
                {
                  pixelSize: 30,
                  showDefaultMenu: true,
                  label: {
                    text: "绘点",
                  },
                  isHighlight: true,
                  menu: {
                    className: "test-menu",
                    show: true,
                    menuItems: [
                      { text: "编辑", type: "edit" },
                      { text: "展示详情", type: "detail" },
                      { text: "删除", type: "delete" },
                    ],

                    onSelect: (type, entity) => {
                      if (type === "delete") {
                        gisMap.remove(entity);
                      }
                    },
                  },
                },
                (v) => {
                  console.log(v);
                },
              );
              break;
            case "2":
              gisMap.paintImgPoint({
                label: {
                  text: "图片点",
                },
                showDefaultMenu: true,
              });
              break;
            case "3":
              gisMap.paintLine({
                label: {
                  text: "线",
                },
                width: 8,
                showDefaultMenu: true,
              });
              break;
            case "4":
              gisMap.paintRect({
                label: {
                  text: "矩形",
                },
                showDefaultMenu: true,
                isHighlight: true,
              }, (paint) => {
                console.log("矩形", paint);
                let list = gisMap.getDataInArea(paint.entity);
                console.log(7777, list);
              });
              break;
            case "5":
              gisMap.paintCircle({
                showDefaultMenu: true,
                label: {
                  text: "圆",
                },
              }, (paint) => {
                let list = gisMap.getDataInArea(paint.entity);
                console.log(9998, list);
              });
              break;
            case "6":
              gisMap.paintPolygon({
                label: {
                  text: "多边形",
                },
                showDefaultMenu: true,
                isHighlight: true,
              }, (paint) => {
                console.log("多边形", paint);
              });
              break;
            case "7":
              gisMap.paintFlashPoint({
                pixelSize: 50,
                showDefaultMenu: true,
                label: {
                  text: "闪烁点",
                },
              });
              break;
            case "8":
              gisMap.paintLineWithPoints({
                pixelSize: 50,
                showDefaultMenu: true,
                label: {
                  text: "带点线",
                },
              });
              break;
            default:
              console.log(e);
          }
        }}
      >
        <option value="">--</option>
        <option value="1">画点</option>
        <option value="2">画图片点</option>
        <option value="3">画线</option>
        <option value="4">画矩形</option>
        <option value="5">画圆</option>
        <option value="6">画多边形</option>
        <option value="7">画闪烁点</option>
        <option value="8">画带点线</option>
      </select>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
