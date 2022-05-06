import GisMap from "../code/gisMap";
import * as Cesium from "@modules/cesium/Source/Cesium";

let gisMap = new GisMap('cesium');

window.gisMap = gisMap


// gisMap.cSetView({
//     longitude: 110.00,
//     latitude: 40.00,
//     altitude: 10000000
// })

// gisMap.cDrawMpoint({
//     longitude: 80.00,
//     latitude: 40.00,
//     altitude: 10
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

//   gisMap.cSetsceneMode2D3D()
// },10000)
// // setTimeout(()=>{
// //   // gisMap.cSetDefaultPosition(
// //   //     {
// //   //         longitude: 120.00,
// //   //         latitude: 40.00,
// //   //         altitude: 1000000
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

