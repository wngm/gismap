import React from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

window.gisMap = gisMap;
function Content() {
  const getImage = () => {
    const img = gisMap.canvas2image('file');
    console.log('image', img);
  };

  const getDistance = () => {
    const measure = gisMap.measureLine();
    console.log(measure);
  };
  const getSize = () => {
    gisMap.measurePolygn(gisMap.viewer);
  };

  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => getImage()}>截图</div>
      <div className="btn" role="none" onClick={() => getDistance()}>测量距离</div>
      <div className="btn" role="none" onClick={() => getSize()}>测量面积</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
