import React from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

window.gisMap = gisMap;
function Content() {
  const setWeather = (type) => {
    gisMap.setWeather(type || 'snow');
  };

  const clearWeather = () => {
    gisMap.clearWeather('rain');
  };
  return (
    <div className="box">
      <div className="btn" onClick={() => setWeather('snow')}>雪</div>
      <div className="btn" onClick={() => setWeather('rain')}>雨</div>
      <div className="btn" onClick={() => setWeather('fog')}>雾</div>
      <div className="btn" onClick={clearWeather}>清除</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
