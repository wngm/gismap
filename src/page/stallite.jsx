import React from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
import left from '../assets/images/skybox/left.jpg';
import right from '../assets/images/skybox/right.jpg';
import top from '../assets/images/skybox/top.jpg';
import bottom from '../assets/images/skybox/bottom.jpg';
import front from '../assets/images/skybox/front.jpg';
import back from '../assets/images/skybox/back.jpg';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

window.gisMap = gisMap;
function Content() {
  const getImage = () => {
    console.log(222);
    const img = gisMap.canvas2image('file');
    console.log(1111, img);
  };

  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => getImage()}>截图</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
