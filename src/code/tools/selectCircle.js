/* eslint-disable no-plusplus */
/* eslint-disable func-names */
import * as Cesium from 'cesium';
import {color1_a} from "../color"

/**
 * 测量工具可选配配置项
 * @typedef {Object} SelectCircleOptions
 * @property {selectCircleCallback} [onFinish] - 测量结束的的回调函数
 */

/**
 * 测量工具完成回调函数.
 * @callback selectCircleCallback
 * @param {selectInfo} finishData
 */

/**
 *
 * 地图框选工具 返回元素和框选矩形的起点和终点坐标
 * @class SelectCircle
 */
class SelectCircle {
  /**
   * 实例测量工具
   * @param {SelectCircleOptions} [options={}]
   * @memberof SelectCircle
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
    this.tempPoints = [];
    this.onFinish = options.onFinish;
    // eslint-disable-next-line no-param-reassign
    viewer.scene.globe.depthTestAgainstTerrain = false;

    this.Circle = function Circle(positions) {
        let size = new Cesium.CallbackProperty(()=>Cesium.Cartesian3.distance(positions[0],positions[1]), false)
        size.getValue()
        return viewer.entities.add({
            position: positions[0],
            ellipse: {
                semiMinorAxis : size,
                semiMajorAxis : size,
                // heightReference: GisMap.Cesium.HeightReference.NONE,
                // height:1000,
                material: color1_a
            }
        });
    };
    this.init(viewer);
  }

  init() {
    this.handleEvent();
  }

  handleEvent() {
    const { viewer } = this;
    this.handler.setInputAction((movement) => {
      const ray = viewer.camera.getPickRay(movement.endPosition);
      this.cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      // 跳出地球时异常
      if (!Cesium.defined(this.cartesian)) { return; }
      if (this.positions.length === 1) {
        this.positions.push(this.cartesian);
        if (!Cesium.defined(this.poly)) {
          this.poly = new this.Circle(this.positions);
        } 
      }else if(this.positions.length >= 2) {
          this.positions.pop();
          this.positions.push(this.cartesian);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((movement) => {
      const ray = viewer.camera.getPickRay(movement.position);
      this.cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      // 跳出地球时异常
      if (!Cesium.defined(this.cartesian)) { return; }
      if (this.positions.length === 0) {
        this.positions.push(this.cartesian.clone());
        // this.positions.push(this.cartesian);
      }
      // 在三维场景中添加点
      const cartographic = Cesium.Cartographic.fromCartesian(this.positions[this.positions.length - 1]);
      const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      const heightString = cartographic.height;
    //   this.tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
      // const labelText = `(${longitudeString.toFixed(2)},${latitudeString.toFixed(2)})`;
      this.labelPt = this.positions[0];
      if (this.positions.length === 1) {
        this.poly = new this.Circle(this.positions);
      }
      if (this.positions.length === 2) {
        // 在三维场景中添加Label
        // this.floatingPoint = viewer.entities.add({
        //   name: '多边形面积',
        //   position: this.labelPt,
        //   point: {
        //     pixelSize: 5,
        //     color: Cesium.Color.RED,
        //     outlineColor: Cesium.Color.WHITE,
        //     outlineWidth: 2,
        //   },
        this.finish();
        // label: {
        //   text: labelText,
        //   font: '18px sans-serif',
        //   fillColor: Cesium.Color.GOLD,
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   outlineWidth: 2,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   pixelOffset: new Cesium.Cartesian2(20, -20),
        // },
        // });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // this.handler.setInputAction(() => {
    //   this.finish();
    // }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  drawShape(positionData) {
    const { viewer } = this;
    let shape;
    const drawingMode = 'rectangle';
    if (drawingMode === 'rectangle') {
      // 当positionData为数组时绘制最终图，如果为function则绘制动态图
      const arr = typeof positionData.getValue === 'function' ? positionData.getValue(0) : positionData;
      shape = viewer.entities.add({
        name: 'Blue translucent, rotated, and extruded ellipse with outline',
        rectangle: {
          coordinates: new Cesium.CallbackProperty((() => {
            const obj = Cesium.Circle.fromCartesianArray(arr);
            // if(obj.west==obj.east){ obj.east+=0.000001};
            // if(obj.south==obj.north){obj.north+=0.000001};
            return obj;
          }), false),
          material: color1_a
        },
      });
    }
    return shape;
  }

  /**
 * 框选完成后返回 区域内的数据格式
 * @typedef {Object} selectElement
 * @property {number} longitude - 维度
 * @property {number} latitude - 维度
 * @property {number} height - 高度 默认为 0
 * @property {string} id - 维度
 */

  /**
 * 框选完成后返回数据
 * @typedef {Object} selectInfo
 * @property {Array<selectElement>} list - 包含在内的元素信息
 * @property {Object} data - 框选矩形信息
 */

  /**
   *
   * 完成测量
   * @returns {selectInfo} info 返回数据 【value】为距离单位米，【points】坐标点
   * @memberof SelectCircle
   */
  finish() {
    const { viewer } = this.viewer;
    this.handler.destroy();
    this.handler = undefined;
    // eslint-disable-next-line no-unused-expressions
    const list = this.getData();
    const data = { list, data:{ points: this.positions}};
    this.onFinish && this.onFinish(data);
    return data;
  }
 // 获取矩形框内数据
  getData() {
    const { viewer,positions } = this;
    const { ellipsoid } = viewer.scene.globe;
    const datas = [];
    const r = Cesium.Cartesian3.distance(positions[0],positions[1])
    // const rectangle = Cesium.Circle.fromCartesianArray(this.positions.slice(0, 2));
    this.viewer.entities.values.forEach((entity) => {
      const { id } = entity;
      if (id !== this.poly.id && entity.position?._value) {
        const cartographic = ellipsoid.cartesianToCartographic(entity.position._value);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const { height } = cartographic;
        let _r = Cesium.Cartesian3.distance(positions[0],entity.position._value)
        // 判断元素点是否在矩形内
        const status = _r < r

        if (status) {
          datas.push({
            latitude,
            longitude,
            height,
            id,
          });
        }
      }
    });
    // const a = turf;

    return datas;
  }



  destroy() {
    this.handler.destroy();
  }
}

export default SelectCircle;
