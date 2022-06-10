import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as turf from '@turf/turf';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

const pt = turf.point([120, 41, 0]);
const converted = turf.toMercator(pt);
console.log(pt, converted);


// 随机测试点
gisMap.setView({
  longitude: 106.038795,
  latitude: 31.042339,
  height: 9853204,
});

gisMap.drawPoint({

  longitude: 120,
  latitude: 41,
  height: 0,
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
  };

  const selectRectCallBack = (data) => {
    console.log('selectRectCallBack', data);
    // 删除选中点
    // data.list.forEach(i=>{
    //   gisMap.remove(i.id)
    // })
    // 高亮标记

    const colorRed = new gisMap.Cesium.Color.fromCssColorString('#ff0000');
    data.list.forEach(i=>{
      let entity = gisMap.viewer.entities.getById(i.id);
      entity.point.color= colorRed
        // gisMap.remove(i.id)
      })
  };

  const selectRect = () => {
    const _measure = gisMap.selectRect({ onFinish: selectRectCallBack });
    setMeasure(_measure);
  };

  const removeAll = () => {
    gisMap.removeAll();
  };

  const addStallite =() =>{
    const {viewer,Cesium} = gisMap
    // viewer.scene.skyBox.show = false;
    // viewer.scene.globe.depthTestAgainstTerrain = false;
    // viewer.scene.globe.enableLighting = false;
    // viewer.shadows = false

    const entity = new Cesium.Entity({
      name:'卫星波束',
      show: true,
      position: Cesium.Cartesian3.fromDegrees(120, 40, 2000000),
      cylinder: {
        topRadius:0,
        bottomRadius:2000000,
        length:6000000,
        slices:128,
        material:Cesium.Color.CHARTREUSE.withAlpha(0.5),
        disableDepthTestDistance: 0
      },
    });
    const entity2 = new Cesium.Entity({
      name:'卫星波束dian',
      show: true,
      position: Cesium.Cartesian3.fromDegrees(120, 40, 2000000),
      point: {
        pixelSize:10,
        material:Cesium.Color.CRIMSON,
        color:Cesium.Color.CRIMSON,
        disableDepthTestDistance: 0
      },
    });
    gisMap.viewer.entities.add(entity);
    gisMap.viewer.entities.add(entity2);


    const czmlFile = '/czml/a.czml' 
      

      const dataSource = new Cesium.CzmlDataSource(czmlFile);

      dataSource.load(czmlFile);

      viewer.dataSources.add(dataSource);
  }
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => getImage()}>截图</div>
      <div className="btn" role="none" onClick={() => getDistance()}>测量距离</div>
      <div className="btn" role="none" onClick={() => removeDistance()}>完成测量距离</div>
      <div className="btn" role="none" onClick={() => getSize()}>测量面积</div>
      <div className="btn" role="none" onClick={() => removeSize()}>完成测量面积</div>
      <div className="btn" role="none" onClick={() => selectRect()}>框选</div>
      <div className="btn" role="none" onClick={() => removeAll()}>清空所有</div>
      <div className="btn" role="none" onClick={() => addStallite()}>增加卫星扫描</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
