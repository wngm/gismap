/* eslint-disable no-plusplus */
/* eslint-disable func-names */
import * as Cesium from 'cesium';

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
 * @property {numver} value - 测量距离长度 单位【米】
 * @property {Object[]} points -测量绘制的坐标点
 */

// 测量线段
/**
 *
 * 线段距离测量工具 【单击鼠标左键绘制点，点击鼠标右键结束】
 * @class MeasureLine
 * @return {Object} measureInstance 测量工具实例
 */
class MeasureLine {
  /**
   * 实例测量工具
   * @param {MeasureOptions} [options={}]
   * @memberof MeasureLine
   */
  constructor(viewer, options = {}) {
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.positions = [];
    this.poly = null;
    this.distance = 0;
    this.cartesian = null;
    this.floatingPoint = null;
    this.labelPt = null;
    this.viewer = viewer;
    this.onFinish = options.onFinish;

    this.PolyLinePrimitive = (function () {
      function _(positions) {
        this.options = {
          name: '直线',
          polyline: {
            show: true,
            positions: [],
            // material: Cesium.Color.TRANSPARENT,
            material: Cesium.Color.CHARTREUSE,
            width: 2,
            clampToGround: true,
          },
        };
        this.positions = positions;
        this._init();
      }
      _.prototype._init = function () {
        const _self = this;
        const _update = function () {
          return _self.positions;
        };
        // 实时更新polyline.positions
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
        viewer.entities.add(this.options);
      };

      return _;
    }());
    // eslint-disable-next-line no-param-reassign
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
    Promise.resolve(promise).then((updatedPositions) => {
      for (let jj = 0; jj < updatedPositions.length - 1; jj++) {
        const geoD = new Cesium.EllipsoidGeodesic();
        geoD.setEndPoints(updatedPositions[jj], updatedPositions[jj + 1]);
        let innerS = geoD.surfaceDistance;
        innerS = Math.sqrt(innerS ** 2 + (updatedPositions[jj + 1].height - updatedPositions[jj].height) ** 2);
        this.distance += innerS;
      }
      // 在三维场景中添加Label
      const lon1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(this.labelPt).longitude;
      const lat1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(this.labelPt).latitude;
      const lonLat = `(${Cesium.Math.toDegrees(lon1).toFixed(2)},${Cesium.Math.toDegrees(lat1).toFixed(2)})`;
      let textDisance = `${this.distance.toFixed(2)}米`;
      if (this.distance > 10000) { textDisance = `${(this.distance / 1000.0).toFixed(2)}千米`; }
      this.floatingPoint = viewer.entities.add({
        name: '贴地距离',
        position: this.labelPt,
        point: {
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: lonLat + textDisance,
          font: '18px sans-serif',
          fillColor: Cesium.Color.GOLD,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(20, -20),
          eyeOffset: new Cesium.Cartesian3(0, 0, 10),
        },
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
          this.poly = new this.PolyLinePrimitive(this.positions);
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
      console.log(movement.position,ray,this.cartesian)
      this.positions.push(this.cartesian);
      // 记录鼠标单击时的节点位置，异步计算贴地距离
      this.labelPt = this.positions[this.positions.length - 1];
      if (this.positions.length > 2) {
        this.getSpaceDistance(this.positions);
      } else if (this.positions.length === 2) {
        // 在三维场景中添加Label
        this.floatingPoint = viewer.entities.add({
          name: '空间距离',
          position: this.labelPt,
          point: {
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(() => {
      this.finish();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   *
   * 完成测量
   * @returns {'{points:any[],value:Number}'} data 返回数据 【value】为距离单位米，【points】坐标点
   * @memberof MeasureLine
   */
  finish() {
    const { viewer } = this.viewer;
    console.log(this.positions);
    this.handler.destroy();
    this.handler = undefined;
    this.positions.pop(); // 最后一个点无效
    if (this.positions.length === 1) { viewer.entities.remove(this.floatingPoint); }
    const data = { points: this.positions, value: this.distance };
    // eslint-disable-next-line no-unused-expressions
    this.onFinish && this.onFinish(data);
    return data;
  }

  /**
   *
   * 销毁测量工具
   * @memberof MeasureLine
   */
  destroy() {
    this.handler.destroy();
  }
}

export default MeasureLine;
