import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import GisMap from '../code/gisMap';
import './index.less';
// window['CESIUM_BASE_URL'] = '/static/Cesium'
const gisMap = new GisMap('cesium');

window.gisMap = gisMap;
gisMap.viewer.scene.globe.depthTestAgainstTerrain = false;
function Content() {
  const [name, setName] = useState('测试');
  const [latitude, setLatitude] = useState(60);
  const [longitude, setLongitude] = useState(100);
  const [height, setheight] = useState(10);
  const [labelName, setLabelName] = useState('测试点');
  const [tip, setTip] = useState('点的描述信息');

  const setView = useCallback(() => {
    gisMap.setView({ longitude: Number(longitude), latitude: Number(latitude), height: Number(height) });
  }, [latitude, longitude, height]);

  const zoomIn = () => {
    gisMap.zoomIn();
  };
  const zoomOut = () => {
    gisMap.zoomOut();
  };
  const drawMpoint = () => {
    const point = gisMap.drawPoint(
      {
        name,
        pixelSize: 60,
        color: 'rgba(0,255,255,1)',
        longitude: Number(longitude),
        latitude: Number(latitude),
        height: Number(height),
        label: {
          show: true,
          text: labelName,
          outlineColor: '#ff0000',
          fillColor: 'rgba(173, 255, 47,1)',
        },
        tip: {
          show: true,
          content: tip,
        },
        menu: {
          className: 'test-menu',
          show: true,
          menuItems: [
            { text: '编辑', type: 'edit' },
            { text: '展示详情', type: 'detail' },
            { text: '删除', type: 'delete' },
          ],
          onSelect: (type, entity) => {
            console.log(`选择了 ${type}`, name);
            if (type === 'delete') {
              gisMap.remove(entity);
            }
          },
        },
      },
    );
    console.log('new point ', point);
  };

  const switchType = () => {
    gisMap.setSceneMode2D3D();
  };
  return (
    <div className="box">
      <div>
        <div>
          <span>标签</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <span>经度</span>
          <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <div>
          <span>纬度</span>
          <input type="number" value={latitude} onChange={(e) => { setLatitude(e.target.value); }} />
        </div>
        <div>
          <span>高度</span>
          <input type="number" value={height} onChange={(e) => setheight(e.target.value)} />
        </div>
        <div>
          <span>labelName</span>
          <input value={labelName} onChange={(e) => setLabelName(e.target.value)} />
        </div>
        <div>
          <span>tip</span>
          <input value={tip} onChange={(e) => setTip(e.target.value)} />
        </div>

      </div>
      <div className="btn" onClick={setView}>设置显示</div>
      <div className="btn" onClick={drawMpoint}>绘点</div>
      <div className="btn" onClick={zoomIn}>放大</div>
      <div className="btn" onClick={zoomOut}>缩小</div>
      <div className="btn" onClick={switchType}>2D/3D</div>
    </div>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById('app'));
root.render(<Content />);
// gisMap.setView({
//     longitude: 110.00,
//     latitude: 40.00,
//     height: 10000000
// })

// gisMap.drawPoint({
//     longitude: 80.00,
//     latitude: 40.00,
//     height: 10
// })

// console.log(Cesium.Math.toRadians(0.0))

// let pointA =  Cesium.Cartesian3.fromDegrees(110,40,10000000);
// let pointC =  Cesium.Cartesian3.fromDegrees(80,40,10000000);
// let pointB =  Cesium.Cartesian3.fromDegrees(80,40,10);

// let m = getModelMatrix(pointB , pointC  );
// let hpr = getHeadingPitchRoll(m);

// // setInterval(()=>{
// //   gisMap.camera.zoomIn(100000)
// // },1000)
// setInterval(()=>{

//   gisMap.setSceneMode2D3D()
// },10000)
// // setTimeout(()=>{
// //   // gisMap.setDefaultPosition(
// //   //     {
// //   //         longitude: 120.00,
// //   //         latitude: 40.00,
// //   //         height: 1000000
// //   //     } )
// //   console.log(Cesium.Math.toRadians(0.0),Cesium.Math.toRadians(-90))
// //   gisMap.camera.setView({
// //     destination:pointC,
// //     orientation:{
// //       heading : Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
// //       pitch : Cesium.Math.toRadians(-90),    // default value (looking down)
// //       roll : 0.0
// //     }
// //   })
// // },5000)
// hpr.pitch = hpr.pitch + 3.14 / 2 + 3.14;
// let orientation = Cesium.Transforms.headingPitchRollQuaternion(
//   pointA,
//   hpr
// );
// console.log(hpr,orientation)

// function getModelMatrix(pointB, pointA) {
//   //向量AB
//   const vector2 = Cesium.Cartesian3.subtract(
//     pointB,
//     pointA,
//     new Cesium.Cartesian3()
//   );
//   //归一化
//   const normal = Cesium.Cartesian3.normalize(vector2, new Cesium.Cartesian3());
//   //旋转矩阵 rotationMatrixFromPositionVelocity源码中有，并未出现在cesiumAPI中
//   const rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity(
//     pointA,
//     normal,
//     Cesium.Ellipsoid.WGS84
//   );
//   const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(
//     rotationMatrix3,
//     pointA
//   );
//   return modelMatrix4;
// }

// function getHeadingPitchRoll(m) {
//   var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(
//     Cesium.Matrix4.getTranslation(m, new Cesium.Cartesian3()),
//     Cesium.Ellipsoid.WGS84,
//     new Cesium.Matrix4()
//   );
//   // 矩阵相除
//   var m3 = Cesium.Matrix4.multiply(
//     Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
//     m,
//     new Cesium.Matrix4()
//   );
//   // 得到旋转矩阵
//   var mat3 = Cesium.Matrix4.getMatrix3(m3, new Cesium.Matrix3());
//   // 计算四元数
//   var q = Cesium.Quaternion.fromRotationMatrix(mat3);
//   // 计算旋转角(弧度)
//   var hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
//   return hpr;
// }
