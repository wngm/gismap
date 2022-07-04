/*
 * @Author: R10
 * @Date: 2022-05-31 15:41:36
 * @LastEditTime: 2022-07-01 15:31:04
 * @LastEditors: R10
 * @Description: 
 * @FilePath: /gismap/src/page/line.jsx
 */
import * as Cesium from 'cesium';
import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

window.gisMap = gisMap;

function Content() {
  const [name, setName] = useState('测试');
  const [latitude, setLatitude] = useState(30.644);
  const [longitude, setLongitude] = useState(104);
  const [height, setheight] = useState(0);
  const [labelName, setLabelName] = useState('测试点');
  const [tip, setTip] = useState('');

  const setView = useCallback(() => {
    gisMap.setView({ longitude: Number(longitude), latitude: Number(latitude), height: Number(height) });
  }, [latitude, longitude, height]);
  const drawAnimateLine = () => {
    const start = [Number(longitude), Number(latitude), Number(height)];
    const ends = [start, [116.20, 39.56, 0]];
    // const ends = [[110,20,0],[100,10],[90,0,0],[70,20,0],[50,10,0]]
    gisMap.drawAnimateLine(ends, { color: '#33FF66'});
  };
  const drawLine = () => {
    const start = [Number(longitude), Number(latitude), Number(height)];
    const ends = [start, [116.20, 39.56, 0]];
    gisMap.drawLine(ends, {
      showDefaultMenu: true, width: 8,
      label: {
        text: '线'
      }
    });
  }
  const drawLineWithPoints = () => {
    const start = [Number(longitude), Number(latitude), Number(height)];
    const ends = [start, [116.20, 39.56, 0]];
    gisMap.drawLineWithPoints(ends, {
      showDefaultMenu: true, width: 2,
      label: {
        text: '点线'
      },
      pixelSize: 60,
    });
  };

  const test = () => {
    gisMap.viewer.clock.shouldAnimate = false;
  };
  const test2 = () => {
    gisMap.viewer.clock.shouldAnimate = true;
  };
  return (
    <div className="box">
      <div>
        <div>
          <span>标签</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <span>经度</span>
          <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <div>
          <span>纬度</span>
          <input type="number" value={latitude} onChange={(e) => { setLatitude(e.target.value); }} />
        </div>
        <div>
          <span>高度</span>
          <input type="number" value={height} onChange={(e) => setheight(e.target.value)} />
        </div>
        <div>
          <span>labelName</span>
          <input value={labelName} onChange={(e) => setLabelName(e.target.value)} />
        </div>
        <div>
          <span>tip</span>
          <input value={tip} onChange={(e) => setTip(e.target.value)} />
        </div>

      </div>
      <div className="btn" onClick={setView}>设置显示</div>
      <div className="btn" onClick={drawLine}>线段绘制</div>
      <div className="btn" onClick={drawLineWithPoints}>带点线绘制</div>
      <div className="btn" onClick={drawAnimateLine}>动态线绘制</div>
      {/* <div className="btn" onClick={test}>暂停</div>       */}
      {/* <div className="btn" onClick={test2}>运动</div>       */}

    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
