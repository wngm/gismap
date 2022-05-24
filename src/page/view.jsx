/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');
window.gisMap = gisMap;
function Content() {
  const [position, setPosition] = useState({
    longitude: '',
    latitude: '',
    altitude: '',
  });
  const [mousePosition, setMousePosition] = useState({
    longitude: '',
    latitude: '',
    altitude: '',
  });
  // 监听摄像机位置
  const cameraHandle = () => {
    const _position = gisMap.getCameraPosition();
    setPosition(_position);
  };
  // 鼠标位置监听
  const mouseHandle = (moment) => {
    console.log(moment);
  };

  useEffect(
    () => {
      cameraHandle();
      gisMap.addCameraEvent(cameraHandle);
      gisMap.addMouseEvent('mousemove', mouseHandle);
      return () => {
        gisMap.removeCameraEvent(cameraHandle);
        gisMap.removeMouseEvent('mousemove', mouseHandle);
      };
    },
    [],
  );
  return (
    <div className="box">
      <div>
        <div className="line">
          <div className="line-item">
            经度:
            {position.longitude}
          </div>
          <div className="line-item">
            纬度:
            {position.latitude}
          </div>
          <div className="line-item">
            高度:
            {position.altitude}
          </div>
        </div>
        <div className="line">
          <div className="line-item">
            鼠标经度:
            {mousePosition.longitude}
          </div>
          <div className="line-item">
            鼠标纬度:
            {mousePosition.latitude}
          </div>
        </div>
      </div>

      {/* <div className="btn" onClick={clearWeather}>清除</div> */}
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
