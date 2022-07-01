import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import Eventemitter from 'eventemitter3'
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium', { animation: true, timeline: true });
const { Cesium } = gisMap

// 波形
gisMap.cylinderWave({
  longitude: 89,
  latitude: 42,
  height: 2003204,
  //可选参数
  bottomRadius:2003204,
  color: '#00ff00'
});
// // 圆锥
// gisMap.drawCylinder({
//   longitude: 120,
//   latitude: 42,
//   height: 2003204,
//   color: '#ff0000'
// });


// 波形绑定卫星
function bindStallite(dataSource, id) {
  const { Cesium, viewer } = gisMap
  const { ellipsoid } = viewer.scene.globe;
  const entity2 = gisMap.cylinderWave({
    longitude: 149,
    latitude: 42,
    height: 1000000,
    color: "#009900"
  });
  let satellite = dataSource.entities.getById(id);
  let property = new Cesium.SampledPositionProperty();
  let property2 = new Cesium.SampledProperty(Number);
  for (var ind = 0; ind < 292; ind++) {
    var time = Cesium.JulianDate.addSeconds(viewer.clock.currentTime, 300 * ind, new Cesium.JulianDate());
    var position = satellite.position.getValue(time);
    var cartographic = ellipsoid.cartesianToCartographic(position);
    var lat = Cesium.Math.toDegrees(cartographic.latitude),
      lng = Cesium.Math.toDegrees(cartographic.longitude),
      hei = cartographic.height / 2;
    property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
    property2.addSample(time, hei * 2);
  }
  entity2.position = property;
  entity2.cylinder.length = property2;
  entity2.cylinder.length.setInterpolationOptions({
    interpolationDegree: 1,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation
  });
  entity2.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });

}

window.gisMap = gisMap;
function Content() {
  const [czmlData, setCzmlData] = useState(null)
  const home = () => {
    gisMap.setView({
      longitude: 106.038795,
      latitude: 31.042339,
      height: 9853204,
    });
  }

  const removeAll = () => {
    gisMap.removeAll();
  };
  const addStallite = () => {
    const { viewer, Cesium } = gisMap
    const czml = '/static/Cesium/czml/data2.czml'
    const loadCzml = gisMap.loadCzml({
      czml,
      onReady: (load) => {
        load.bindStallite('ASTRO_E2', gisMap.cylinderWave({
          key: 'STRO_E2_P',
          longitude: 149,
          latitude: 42,
          height: 1000000,
          color: "#009900"
        }))
      }
    })
    setCzmlData(loadCzml)
  }

  const removeStallite = () => {
    if (czmlData) {
      czmlData.remove()
      setCzmlData(null)
    }

  }


  const addListener = () => {

    // 监视区域1
    gisMap.drawRect({
      key: 'rect',
      color: '#0099cc',
      // highlight: true,
      // highlightColor: 'red',
      coordinates: [
        [80, 20],
        [120, 40],
      ],
    });
    // 监视区域2
    gisMap.drawCircle({
      key: 'circle',
      longitude:60,
      latitude:10,
      height:0,
      radius:2000000,
      color:'#009900'
    })
    const lister = gisMap.areaEvent()
    lister.add('STRO_E2_P')
    lister.addArea('rect')
    lister.addArea('circle')
    // 监视回调
    lister.event.on('in', (e) => {
      console.log(`${e.animate.entity.id} 进入 ${e.area.entity.id}`)
      if(e.area.id  === 'rect'){
        e.area.entity.rectangle.material = Cesium.Color.RED
      }
      if(e.area.id  === 'circle'){
        e.area.entity.ellipse.material = Cesium.Color.RED
      }
    })
    lister.event.on('out', (e) => {
      console.log(`${e.animate.entity.id} 移出 ${e.area.entity.id}`)
      if(e.area.id  === 'rect'){
        e.area.entity.rectangle.material = Cesium.Color.BLUE
      }
      if(e.area.id  === 'circle'){
        e.area.entity.ellipse.material = Cesium.Color.BLUE
      }
    })
  }
  return (
    <div className="box">
      <div className="btn" role="none" onClick={() => home()}>home</div>
      <div className="btn" role="none" onClick={() => removeAll()}>清空所有</div>
      <div className="btn" role="none" onClick={() => addStallite()}>增加卫星扫描</div>
      <div className="btn" role="none" onClick={() => removeStallite()}>移除卫星扫描</div>
      <div className="btn" role="none" onClick={() => addListener()}>区域监听</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
