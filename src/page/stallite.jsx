import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium',{animation:true,timeline:true});

// 波形
gisMap.cylinderWave({
  longitude: 89,
  latitude: 42,
  height: 2003204,
  color: '#00ff00'
});
// 圆锥
gisMap.drawCylinder({
  longitude: 120,
  latitude: 42,
  height: 2003204,
  color: '#ff0000'
});

// 波形绑定卫星
function bindStallite(dataSource,id){
  const {Cesium, viewer}= gisMap
  const { ellipsoid } = viewer.scene.globe;
  const entity2 = gisMap.cylinderWave({
    longitude: 149,
    latitude: 42,
    height: 1000000,
    color:"#009900"
  });
  let satellite = dataSource.entities.getById(id);
  let property = new Cesium.SampledPositionProperty();
  let property2 = new Cesium.SampledProperty(Number);
  for (var ind = 0; ind < 292; ind++) {
    var time = Cesium.JulianDate.addSeconds(viewer.clock.currentTime, 300*ind, new Cesium.JulianDate());
    var position = satellite.position.getValue(time);
    var cartographic = ellipsoid.cartesianToCartographic(position);
    var lat = Cesium.Math.toDegrees(cartographic.latitude),
      lng = Cesium.Math.toDegrees(cartographic.longitude),
      hei = cartographic.height / 2;
    property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
    property2.addSample(time, hei*2);
  }
  entity2.position = property;
  entity2.cylinder.length = property2;
  entity2.cylinder.length.setInterpolationOptions({
    interpolationDegree : 1,
    interpolationAlgorithm : Cesium.HermitePolynomialApproximation
    });
  entity2.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });

}

window.gisMap = gisMap;
function Content() {
  const [czmlData,setCzmlData] =useState(null)
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

  const addStallite =() =>{
    const {viewer,Cesium} = gisMap
    // viewer.scene.skyBox.show = false;
    // viewer.scene.globe.depthTestAgainstTerrain = true;
    // viewer.scene.globe.enableLighting = false;
    // viewer.shadows = false
    // const entity = new Cesium.Entity({
    //   name:'卫星波束',
    //   show: true,
    //   position: Cesium.Cartesian3.fromDegrees(120, 40, 2000000),
    //   cylinder: {
    //     topRadius:0,
    //     bottomRadius:200000,
    //     bottomSurface:true,
    //     length:800000,
    //     slices:128,
    //     material:Cesium.Color.CHARTREUSE.withAlpha(0.5),
    //     disableDepthTestDistance: 0
    //   },
    // });
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
    // gisMap.viewer.entities.add(entity);
    // gisMap.viewer.entities.add(entity2);
    const czml = '/static/Cesium/czml/data2.czml' 

    const loadCzml = gisMap.loadCzml({
      czml,
      onReady:(load)=>{
        load.bindStallite('ASTRO_E2',gisMap.cylinderWave({
          longitude: 149,
          latitude: 42,
          height: 1000000,
          color:"#009900"
        }))
      }
    }) 
    setCzmlData(loadCzml)
  }

  const removeStallite =()=>{
    if(czmlData){
      czmlData.remove()
      setCzmlData(null)
    }

  }
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => home()}>home</div>
      <div className="btn" role="none" onClick={() => removeAll()}>清空所有</div>
      <div className="btn" role="none" onClick={() => addStallite()}>增加卫星扫描</div>
      <div className="btn" role="none" onClick={() => removeStallite()}>移除卫星扫描</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
