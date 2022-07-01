/*
 * @Author: R10
 * @Date: 2022-06-01 13:47:55
 * @LastEditTime: 2022-07-01 16:09:08
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/page/shape.jsx
 */
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Color } from 'cesium';
import GisMap from '../code/gisMap';
import * as Cesium from 'cesium'
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');


gisMap.drawCircleTest({
  longitude: 106,
  latitude: 27.2,
  height: 100000,
  radius: 200000
})

gisMap.drawCircleTest2({
  longitude: 120,
  latitude: 40,
  height: 100000,
  radius: 200000
})
function Content() {
  useEffect(() => {
    gisMap.setView({
      longitude: 106,
      latitude: 27.2,
      height: 100_222_00,
    });
  }, []);
  const drawCircle = () => {
    gisMap.drawCircle({
      radius: 1000000,
      longitude: Number(106),
      latitude: Number(27),
      height: 0,
      showDefaultMenu: true,
      label: {
        text: '圆'
      }
    });
  }
  const clearLayer = () => {
    gisMap.clearLayer('default');
  };
  const drawEllipse = () => {
    gisMap.drawEllipse({
      semiMajorAxis: 400000,
      semiMinorAxis: 200000,
      longitude: Number(136),
      latitude: Number(37),
      label: {
        text: '椭圆',
        pixelOffset: new Cesium.Cartesian2(0, 30)
      },
      height: 0,
      showDefaultMenu: true,
      onMenuSelect() {
      }

    });
  };
  const drawRect = () => {
    gisMap.drawRect({
      showDefaultMenu: true,
      label: {
        text: '矩形',
        pixelOffset: new Cesium.Cartesian2(0, 30)
      },
      isHighlight: true,
      coordinates: [
        [106, 27],
        [110, 30],
      ],
      onMenuSelect() {
        
      }
    });
  };
  const drawPolygon = () => {
    gisMap.drawPolygon({
      name: 'polygon',
      highlight: true,
      highlightColor: 'lightblue',
      showDefaultMenu: true,
      coordinates: [
        [120, 33],
        [125, 27],
        [128, 26],
        [118, 26],
        // [102, 30],
      ],
      label: {
        text: '多边形',
        pixelOffset: new Cesium.Cartesian2(0, 100)
      },
      isHighlight: true,
      onMenuSelect() {
        
      }
    });
  };
  const addCircleScan = () => {
    gisMap.addCircleScan({
      longitude: 113.665412, latitude: 34.757975, r: 50000, scanColor: new Color(1.0, 0.0, 0.0, 1), interval: 1000,
    });
  };
  const addRadarScan = () => {
    gisMap.addRadarScan({
      longitude: 113.665412, latitude: 34.757975, r: 200000, scanColor: new Color(1.0, 0.0, 0.0, 1), interval: 1000,
    });


    gisMap.addRadarScan({
      longitude: 100.665412, latitude: 34.757975, r: 100000, scanColor: new Color(1.0, 1.0, 0.0, 1), interval: 1000,
    });
  };
  return (
    <div className="box">
      <div />
      <div className="btn" onClick={drawCircle}>画圆</div>
      <div className="btn" onClick={drawEllipse}>画椭圆</div>
      <div className="btn" onClick={drawRect}>画矩形</div>
      <div className="btn" onClick={drawPolygon}>多边形</div>
      <div className="btn" onClick={clearLayer}>清除图形组</div>
      <div className="btn" onClick={addCircleScan}>圆扫描</div>
      <div className="btn" onClick={addRadarScan}>扇形扫描</div>
      {/* <div className="btn" onClick={test}>暂停</div>       */}
      {/* <div className="btn" onClick={test2}>运动</div>       */}

    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
