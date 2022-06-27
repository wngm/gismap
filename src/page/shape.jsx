/*
 * @Author: R10
 * @Date: 2022-06-01 13:47:55
 * @LastEditTime: 2022-06-02 11:54:43
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/page/shape.jsx
 */
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Color } from 'cesium';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

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
      color: 'rgba(212,225,127,0.5)',
      radius: 1000000,
      longitude: Number(106),
      latitude: Number(27),
      height: 0,
    });
  };
  const drawEllipse = () => {
    gisMap.drawEllipse({
      color: 'red',
      semiMajorAxis: 400000,
      semiMinorAxis: 200000,
      longitude: Number(136),
      latitude: Number(37),
      height: 0,
    });
  };
  const drawRect = () => {
    gisMap.drawRect({
      color: 'orange',
      highlight: true,
      highlightColor: 'red',
      coordinates: [
        [106, 27],
        [110, 30],
      ],
    });
  };
  const drawPolygon = () => {
    gisMap.drawPolygon({
      name: 'polygon',
      color: 'red',
      highlight: true,
      highlightColor: 'lightblue',
      coordinates: [
        [120, 33],
        [125, 27],
        [128, 26],
        [118, 26],
        // [102, 30],
      ],
    });
  };
  const addCircleScan = () => {
    gisMap.addCircleScan({
      longitude: 113.665412, latitude: 34.757975, r: 50000, scanColor: new Color(1.0, 0.0, 0.0, 1), interval: 1000,
    });
  };
  const addRadarScan = () => {
    gisMap.addRadarScan({
      longitude: 113.665412, latitude: 34.757975, r: 50000, scanColor: new Color(1.0, 0.0, 0.0, 1), interval: 1000,
    });
  };
  return (
    <div className="box">
      <div />
      <div className="btn" onClick={drawCircle}>画圆</div>
      <div className="btn" onClick={drawEllipse}>画椭圆</div>
      <div className="btn" onClick={drawRect}>画矩形</div>
      <div className="btn" onClick={drawPolygon}>多边形</div>
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