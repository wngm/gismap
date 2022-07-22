import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import Eventemitter from "eventemitter3";
import "./index.less";
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap("cesium", { animation: true, timeline: true });
gisMap.viewer.scene.debugShowFramesPerSecond = true;

const { Cesium } = gisMap;

window.gisMap = gisMap;
function Content() {
    const [czmlData, setCzmlData] = useState(null);
    const tel = () => {
        let l = lines.length / 3;
        let start = "2022/07/15 00:00:00";
        let end = "2022/07/16 00:00:00";
        gisMap.viewer.clock.currentTime = new GisMap.Cesium.JulianDate.fromDate(
            new Date(start),
        );
        gisMap.viewer.clock.multiplier = 40;

        var pointCollection = gisMap.viewer.scene.primitives.add(
            new Cesium.PointPrimitiveCollection(),
        );

        //  生成64800个点，每个经度、纬度值各生成一个点，高度为0（贴地表）
        //  每个点都添加到PointPrimitiveCollection对象中
        for (var longitude = -180; longitude < 180; longitude++) {
            var color = Cesium.Color.PINK;
            if ((longitude % 2) === 0) {
                color = Cesium.Color.CYAN;
            }
            for (var latitude = -90; latitude < 90; latitude++) {
                pointCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                    color: color,
                });
            }
        }

        //  模拟每个点固定向外偏移(1km,1km,1km)(跟时间无关，每帧调用此函数)
        function animatePoints() {
            var positionScratch = new Cesium.Cartesian3();
            var points = pointCollection._pointPrimitives;
            var length = points.length;
            for (var i = 0; i < length; ++i) {
                var point = points[i];
                Cesium.Cartesian3.clone(point.position, positionScratch);
                Cesium.Cartesian3.add(
                    positionScratch,
                    new Cesium.Cartesian3(1000, 1000, 1000),
                    positionScratch,
                );
                point.position = positionScratch;
            }
        }
        gisMap.viewer.scene.preRender.addEventListener(animatePoints);
    };
    return (
        <div className="box">
            <div className="btn" role="none" onClick={() => tel()}>点</div>
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
