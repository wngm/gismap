import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as turf from '@turf/turf';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

const pt = turf.point([120, 41, 0]);
const converted = turf.toMercator(pt);
console.log(pt, converted,gisMap);


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
// gisMap.drawPoint({
//   longitude: 89,
//   latitude: 42,
//   height: 0,
// });




gisMap.drawCylinder({
  longitude: 149,
  latitude: 42,
  height: 53204,
});

// gisMap.drawFlashPoint({
//   pixelSize:100,
//   longitude: 89,
//   latitude: 42,
//   height: 53210,
//   color:"#0099cc"
// });
gisMap.drawLine([[89,42,2003204],[120,40,80000]], { color: '#66FFFF99' });

gisMap.cylinderWave({
  longitude: 89,
  latitude: 42,
  height: 2003204,
  color: '#00ff0066'
});
window.gisMap = gisMap;
function Content() {
  const [measure, setMeasure] = useState(null);

  const home=()=>{
    gisMap.setView({
      longitude: 106.038795,
      latitude: 31.042339,
      height: 9853204,
    });
  }
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
    const { ellipsoid } = viewer.scene.globe;
    // viewer.scene.skyBox.show = false;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    // viewer.scene.globe.enableLighting = false;
    // viewer.shadows = false

    const entity = new Cesium.Entity({
      name:'卫星波束',
      show: true,
      position: Cesium.Cartesian3.fromDegrees(120, 40, 2000000),
      cylinder: {
        topRadius:0,
        bottomRadius:200000,
        bottomSurface:true,
        length:800000,
        slices:128,
        material:Cesium.Color.CHARTREUSE.withAlpha(0.5),
        disableDepthTestDistance: 0
      },
    });
    // const entity2 = new Cesium.Entity({
    //   name:'卫星波束dian',
    //   show: true,
    //   position: Cesium.Cartesian3.fromDegrees(120, 40, 2000000),
    //   point: {
    //     pixelSize:10,
    //     material:Cesium.Color.CRIMSON,
    //     color:Cesium.Color.CRIMSON,
    //     disableDepthTestDistance: 0
    //   },
    // });
    gisMap.viewer.entities.add(entity);
    // gisMap.viewer.entities.add(entity2);
    const czmlFile = '/czml/data.czml' 
      

      const dataSource = new Cesium.CzmlDataSource(czmlFile);

      dataSource.load(czmlFile);
      let property
      viewer.dataSources.add(dataSource).then(function(dataSource){
        setTimeout(()=>{
          let satellite = dataSource.entities.getById("wq");
          property = new Cesium.SampledPositionProperty();
          for (var ind = 0; ind < 292; ind++) {
            var time = Cesium.JulianDate.addSeconds(viewer.clock.currentTime, 300*ind, new Cesium.JulianDate());
            var position = satellite.position.getValue(time);
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude),
              lng = Cesium.Math.toDegrees(cartographic.longitude),
              hei = cartographic.height / 2;
            property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
          }
          entity.position = property;
          entity.position.setInterpolationOptions({ //设定位置的插值算法
            interpolationDegree: 5,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
          });
        })
     
			// for (var ind = 0; ind < 292; ind++) {
       
			// 	property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
			// }
			
		
			
			// viewer.clock.onTick.addEventListener(function(clock) {
      //   if (property) {
			// 		var time = clock.currentTime;
			// 		var val = property.getValue(clock.currentTime);
			// 		console.log(val);
			// 	} 
			// });
      })
  }
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => home()}>home</div>
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
