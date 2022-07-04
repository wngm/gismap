import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

// 随机测试点
gisMap.setView({
  longitude: 106.038795,
  latitude: 31.042339,
  height: 9853204,
  color: "#ff0000",
  layer:"lev1"
});

gisMap.drawPoint({
  longitude: 120,
  latitude: 41,
  height: 0,
  color: "#ff0000",
  layer:"lev1"
});

gisMap.drawPoint({
  longitude: 120,
  latitude: 42,
  height: 0,
});
gisMap.drawPoint({
  longitude: 119,
  latitude: 42,
  height: 0,
});
gisMap.drawPoint({
  longitude: 89,
  latitude: 42,
  height: 0,
  color: "#ffff00",
  layer:"lev2"
});
gisMap.drawPoint({
    longitude: 89,
    latitude: 32,
    height: 0,
    color: "#ffff00",
  layer:"lev2"
});
  gisMap.drawPoint({
    longitude: 89,
    latitude: 22,
    height: 0,
    color: "#ffff00",
  layer:"lev2"
  });
gisMap.drawPoint({
    longitude: 89,
    latitude: 12,
    height: 0,
    color: "#ff0000",
  layer:"lev1"
});




window.gisMap = gisMap;
function Content() {
  const home=()=>{
    gisMap.setView({
      longitude: 106.038795,
      latitude: 31.042339,
      height: 9853204,
    });
  }

  const removeAll = () => {
    gisMap.removeAll();
  };

  const getLayer =() =>{
   let layers = gisMap.getLayer()
   console.log(layers)
  }
  const showLayer =() =>{
    let layers = gisMap.layerShow('lev1')
    console.log(layers)
   }
   const hideLayer =() =>{
    let layers = gisMap.layerHide('lev1')
    console.log(layers)
   }
   const removeLayer =() =>{
    let layers = gisMap.layerRemove('lev1')
    console.log(layers)
   }
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => home()}>home</div>
      <div className="btn" role="none" onClick={() => getLayer()}>获取所有图层</div>
      <div className="btn" role="none" onClick={() => showLayer()}>显示图层</div>
      <div className="btn" role="none" onClick={() => hideLayer()}>隐藏图层</div>
      <div className="btn" role="none" onClick={() => removeLayer()}>删除图层</div>
      <div className="btn" role="none" onClick={() => removeAll()}>清空所有</div>
    </div>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(<Content />);
