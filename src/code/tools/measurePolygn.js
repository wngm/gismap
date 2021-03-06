/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
import * as Cesium from 'cesium';
import { color1,color1_a,color3,color4} from "../color"
import {defaultMenuItems} from '../common/utils'

/**
 * 测量工具可选配配置项
 * @typedef {Object} MeasureOptions
 * @property {finishCallback} [onFinish] - 测量结束的的回调函数
 */

/**
 * 测量工具完成回调函数.
 * @callback finishCallback
 * @param {FinishData} finishData
 */

/**
 * FinishData 回调函数返回数据
 * @typedef {Object} FinishData
 * @property {numver} value - 测量距离长度 单位平方公里
 * @property {Object[]} points -测量绘制的坐标点
 */

const radiansPerDegree = Math.PI / 180.0;// 角度转化为弧度(rad)
const degreesPerRadian = 180.0 / Math.PI;// 弧度转化为角度
/* 方向 */
function Bearing(from, to) {
  const lat1 = from.lat * radiansPerDegree;
  const lon1 = from.lon * radiansPerDegree;
  const lat2 = to.lat * radiansPerDegree;
  const lon2 = to.lon * radiansPerDegree;
  let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
  if (angle < 0) {
    angle += Math.PI * 2.0;
  }
  angle *= degreesPerRadian;// 角度
  return angle;
}
/* 角度 */
function Angle(p1, p2, p3) {
  const bearing21 = Bearing(p2, p1);
  const bearing23 = Bearing(p2, p3);
  let angle = bearing21 - bearing23;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}

function distance(point1, point2) {
  const point1cartographic = Cesium.Cartographic.fromCartesian(point1);
  const point2cartographic = Cesium.Cartographic.fromCartesian(point2);
  /** 根据经纬度计算出距离* */
  const geodesic = new Cesium.EllipsoidGeodesic();
  geodesic.setEndPoints(point1cartographic, point2cartographic);
  let s = geodesic.surfaceDistance;
  // 返回两点之间的距离
  s = Math.sqrt(s ** 2 + (point2cartographic.height - point1cartographic.height) ** 2);
  return s;
}

/**
 *
 * 面积测量工具 【单击鼠标左键绘制点，点击鼠标右键结束】
 * @class MeasurePolygn
 * @return {Object} measureInstance 测量工具实例
 */
class MeasurePolygn {
  /**
   * 实例测量工具
   * @param {MeasureOptions} [options={}]
   * @memberof MeasurePolygn
   */
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.positions = [];
    this.tempPoints = [];
    this.poly = null;
    this.cartesian = null;
    // 浮动点
    this.floatingPoint = null;
    this.labelPt = null;
    this.polygon = null;
    this.onFinish = options.onFinish;
    this.PolygonPrimitive = function PolygonPrimitive(positions) {
      this.polygon = viewer.entities.add({
        polygon: {
          height:1,
          hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(positions), false),
          outline:true,
          outlineColor:color1,
          outerlineWidth:2,
          material:color1_a
        },
        // menu: {
        //   show: true,
        //   menuItems: defaultMenuItems,
        //   onSelect: (type, entity) => {
        //     console.log(1,entity)
        //     if (type === 'delete') {
        //       // this.viewer.entities.remove(entity);
        //     }
        //   },
        // }
      });
    };
    viewer.scene.globe.depthTestAgainstTerrain = false;
    this.init(viewer);
  }

  init() {
    this.handleEvent();
  }

  getTerrainDistance(point1cartographic, point2cartographic) {
    const { viewer } = this;
    const geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    const s = geodesic.surfaceDistance;
    const cartoPts = [point1cartographic];
    for (let jj = 1000; jj < s; jj += 1000) {
      // 分段采样计算距离
      const cartoPt = geodesic.interpolateUsingSurfaceDistance(jj);
      cartoPts.push(cartoPt);
    }
    cartoPts.push(point2cartographic);
    // 返回两点之间的距离
    const promise = Cesium.sampleTerrain(viewer.terrainProvider, 8, cartoPts);
    Promise.resolve(promise)
      .then((updatedPositions) => {
        for (let jj = 0; jj < updatedPositions.length - 1; jj++) {
          const geoD = new Cesium.EllipsoidGeodesic();
          geoD.setEndPoints(updatedPositions[jj], updatedPositions[jj + 1]);
          let innerS = geoD.surfaceDistance;
          innerS = Math.sqrt(innerS ** 2 + (updatedPositions[jj + 1].height - updatedPositions[jj].height) ** 2);
          this.distance += innerS;
        }
        // 在三维场景中添加Label
        // const lon1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(this.labelPt).longitude;
        // const lat1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(this.labelPt).latitude;
        // const lonLat = `(${Cesium.Math.toDegrees(lon1).toFixed(2)},${Cesium.Math.toDegrees(lat1).toFixed(2)})`;
        // let textDisance = `${this.distance.toFixed(2)}米`;
        // if (this.distance > 10000) { textDisance = `${(this.distance / 1000.0).toFixed(2)}千米`; }
        this.floatingPoint = viewer.entities.add({
          name: '贴地距离',
          position: this.labelPt,
          point: {
            pixelSize: 5,
            color: color1,
            outlineColor: color3,
            outlineWidth: 2,
          },
        // label: {
        //   text: lonLat,
        //   font: '18px sans-serif',
        //   fillColor: Cesium.Color.GOLD,
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   outlineWidth: 2,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   pixelOffset: new Cesium.Cartesian2(20, -20),
        // },
        });
      });
  }

  // 空间两点距离计算函数
  getSpaceDistance($positions) {
    // 只计算最后一截，与前面累加
    // 因move和鼠标左击事件，最后两个点坐标重复
    const i = $positions.length - 3;
    const point1cartographic = Cesium.Cartographic.fromCartesian($positions[i]);
    const point2cartographic = Cesium.Cartographic.fromCartesian($positions[i + 1]);
    this.getTerrainDistance(point1cartographic, point2cartographic);
  }

  handleEvent() {
    const { viewer } = this;
    this.handler.setInputAction((movement) => {
      const ray = viewer.camera.getPickRay(movement.endPosition);
      this.cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      // 跳出地球时异常
      if (!Cesium.defined(this.cartesian)) { return; }
      if (this.positions.length >= 2) {
        if (!Cesium.defined(this.poly)) {
          this.poly = new this.PolygonPrimitive(this.positions);
        } else {
          this.positions.pop();
          this.positions.push(this.cartesian);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((movement) => {
      const ray = viewer.camera.getPickRay(movement.position);
      this.cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      // 跳出地球时异常
      if (!Cesium.defined(this.cartesian)) { return; }
      if (this.positions.length === 0) {
        this.positions.push(this.cartesian.clone());
      }
      this.positions.push(this.cartesian);
      // 在三维场景中添加点
      const cartographic = Cesium.Cartographic.fromCartesian(this.positions[this.positions.length - 1]);
      const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      const heightString = cartographic.height;
      this.tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
      // const labelText = `(${longitudeString.toFixed(2)},${latitudeString.toFixed(2)})`;
      this.labelPt = this.positions[this.positions.length - 1];
      if (this.positions.length > 2) {
        this.getSpaceDistance(this.positions);
      } else if (this.positions.length === 2) {
        // 在三维场景中添加Label
        this.floatingPoint = viewer.entities.add({
          name: '多边形面积',
          position: this.labelPt,
          point: {
            pixelSize: 5,
            color: color1,
            outlineColor: color3,
            outlineWidth: 2,
          },
          // label: {
          //   text: labelText,
          //   font: '18px sans-serif',
          //   fillColor: Cesium.Color.GOLD,
          //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          //   outlineWidth: 2,
          //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          //   pixelOffset: new Cesium.Cartesian2(20, -20),
          // },
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(() => {
      this.finish();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  getArea(points) {
    let res = 0;
    // 拆分三角曲面
    for (let i = 0; i < points.length - 2; i++) {
      const j = (i + 1) % points.length;
      const k = (i + 2) % points.length;
      const totalAngle = Angle(points[i], points[j], points[k]);
      const disTemp1 = distance(this.positions[i], this.positions[j]);
      const disTemp2 = distance(this.positions[j], this.positions[k]);
      res += disTemp1 * disTemp2 * Math.abs(Math.sin(totalAngle));
    }
    return (res / 1000000.0).toFixed(4);
  }

  /**
   *
   * 完成测量
   * @returns {'{points:any[],value:Number}'} data 返回数据 【value】为距离平方公里，【points】坐标点
   * @memberof MeasurePolygn
   */
  finish() {
    const { viewer } = this;
    this.handler.destroy(); // 关闭事件句柄
    this.handler = undefined;
    this.positions.pop(); // 最后一个点无效
    const area = this.getArea(this.tempPoints);
    const textArea = `${area}平方公里`;

    // let mid = new Cesium.Cartesian3();
    // console.log(555, this.positions);
    // mid = Cesium.Cartesian3.subtract(this.positions[Math.round(this.positions.length / 2) - 1], this.positions[this.positions.length - 1], mid);
    // console.log(mid);
    viewer.entities.add({
      name: '多边形面积',
      position: this.positions[this.positions.length - 1],
      label: {
        text: textArea,
        font: '18px sans-serif',
        fillColor: color4,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 1,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        // pixelOffset: new Cesium.Cartesian3(0, 0, -100),
        eyeOffset: new Cesium.Cartesian3(0, 0, -200),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    const data = { points: this.positions, value: area };
    this.onFinish && this.onFinish(data);
    return data;
  }

  /**
   *
   * 销毁测量工具
   * @memberof MeasurePolygn
   */
  destroy() {
    this.handler.destroy();
  }
}

export default MeasurePolygn;
