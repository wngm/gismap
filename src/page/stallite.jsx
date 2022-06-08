import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as turf from '@turf/turf';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

// const { Point } = turf;
// console.log(turf, turf.point([120, 30]));
gisMap.setView({
  longitude: 106.038795,
  latitude: 31.042339,
  height: 9853204,
});
window.gisMap = gisMap;
function Content() {
  const [measure, setMeasure] = useState(null);
  const getImage = () => {
    const img = gisMap.canvas2image('file');
    console.log('image', img);
  };

  const getDistance = () => {
    const _measure = gisMap.measureLine();
    setMeasure(_measure);
    console.log(_measure);
  };
  const removeDistance = () => {
    const result = measure && measure.finish();
    console.log(result, 33);
  };
  const getSize = () => {
    const _measure = gisMap.measurePolygn();
    setMeasure(_measure);
  };
  const removeSize = () => {
    const result = measure && measure.finish();
    console.log(result, 22223);
  };

  const selectRectCallBack = (data) => {
    console.log(data);
  };

  const selectRect = () => {
    const _measure = gisMap.selectRect({ onFinsh: selectRectCallBack });
    setMeasure(_measure);
  };

  const removeAll = () => {
    gisMap.removeAll();
  };
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => getImage()}>截图</div>
      <div className="btn" role="none" onClick={() => getDistance()}>测量距离</div>
      <div className="btn" role="none" onClick={() => removeDistance()}>完成测量距离</div>
      <div className="btn" role="none" onClick={() => getSize()}>测量面积</div>
      <div className="btn" role="none" onClick={() => removeSize()}>完成测量面积</div>
      <div className="btn" role="none" onClick={() => selectRect()}>框选</div>
      <div className="btn" role="none" onClick={() => removeAll()}>清空所有</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
