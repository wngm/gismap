/* eslint-disable no-use-before-define */
/*
 * @Author: R10
 * @Date: 2022-06-06 17:25:07
 * @LastEditTime: 2022-07-01 15:56:48
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/paint/shape.js
 */
import * as Cesium from 'cesium';
import { point as turfPoint, distance } from '@turf/turf';
import {
  ScreenSpaceEventHandler, ScreenSpaceEventType,
  Entity, Color, CallbackProperty, Cartesian3, Cartesian2,
  Rectangle, Ellipsoid, ColorMaterialProperty, PolygonHierarchy,
  ArcType,
} from 'cesium';
import { getWGS84FromDKR } from '../common/utils';
import { getLabelOptions } from '../entity';
import {defaultMenuItems} from '../common/utils'



function getPointFromWindowPoint(point, viewer) {
  if (viewer.scene.terrainProvider.constructor.name === 'EllipsoidTerrainProvider') {
    return viewer.camera.pickEllipsoid(point, viewer.scene.globe.ellipsoid);
  }
  const ray = viewer.scene.camera.getPickRay(point);
  return viewer.scene.globe.pick(ray, viewer.scene);
}
/**
 *
 * 鼠标矩形绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintRect(data = {}, callback) {
  const {
    key,
    name,
    highlightColor,
    highlight,
    color,
    isHighlight = false,
    label = {},
    onMenuSelect,
    showDefaultMenu = false,
    pixelSize,
    menu,
    tip
  } = data;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  let _id = key
  const pointsArr = [];
  const shape = {
    points: [],
    rect: null,
    entity: null,
  };
  let labelEntity = null;
  let text = '';
  let tempPosition;
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  // 鼠标点击
  handler.setInputAction((movement) => {
    tempPosition = getPointFromWindowPoint(movement.position, this.viewer);
    let catp = Ellipsoid.WGS84.cartesianToCartographic(tempPosition);
    const tempLon = Cesium.Math.toDegrees(catp.longitude);
    const tempLat = Cesium.Math.toDegrees(catp.latitude);
    // 选择的点在球面上
    if (tempPosition) {
      if (shape.points.length === 0) {
        pointsArr.push(tempPosition);
        const cartesian = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition);
        shape.points.push(cartesian);
        shape.rect = Rectangle.fromCartographicArray(shape.points);
        shape.rect.east += 0.000001;
        shape.rect.north += 0.000001;
        shape.entity = this.viewer.entities.add({
          id: _id,
          layer: 'default' || data.layer,
          rectangle: {
            coordinates: shape.rect,
            height: 0,
            outline: true,
            width: 10,
            outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
          },
          label: labelOptions,
          position: Cartesian3.fromDegrees(tempLon, tempLat),
          tip,
          menu: showDefaultMenu ? (menu || {
            className: 'test-menu',
            show: true,
            menuItems:defaultMenuItems,
            onSelect: (type, entity) => {
              if (type === 'delete') {
                console.log(entity)
                this.remove(entity);
              }
              onMenuSelect && onMenuSelect(type, entity)
            },
          }) : null,
        });
        shape.entity.rectangle.material= new ColorMaterialProperty(new CallbackProperty(() => {
          if (shape.entity.id === this.moveActiveId) {
            return Color.fromCssColorString(highlightColor||window.Cesium.highlightColor).withAlpha(0.3);
          }
          return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.3);
        }, false))
        shape.bufferEntity = shape.entity;
      } else if (shape.points.length >= 2) {
        handler.destroy();
        this.viewer.entities.remove(labelEntity);
        if (callback) {
          callback({ id: shape.entity._id, positions: pointsArr });
        }
      }
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动
  handler.setInputAction((movement) => {
    if (!movement.endPosition) return false;
    if (!labelEntity) {
      labelEntity = new Entity({
        position: new CallbackProperty(() => {
          const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
          const position = cartesian ? getWGS84FromDKR(cartesian) : {};
          return cartesian ? Cartesian3.fromDegrees(...Object.values(position)) : Cartesian3.fromDegrees(0, 0);
        }, false),
        label: {
          text: new CallbackProperty(() => text, false),
          font: '14px Source Han Sans CN',
          fillColor: Color.fromCssColorString('#fff'),
          pixelOffset: new Cartesian2(0, -16), // 偏移
        },
      });
      this.viewer.entities.add(labelEntity);
    }
    const moveEndPosition = getPointFromWindowPoint(movement.endPosition, this.viewer);
    if (shape.points.length === 0) {
      text = '点击绘制';
      return;
    }
    text = '再次点击结束绘制';

    if (moveEndPosition) {
      pointsArr[1] = moveEndPosition;
      const cartesian = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
      shape.points[1] = cartesian;
      shape.rect = Rectangle.fromCartographicArray(shape.points);
      if (shape.rect.west === shape.rect.east) {
        shape.rect.east += 0.000001;
      }
      if (shape.rect.south === shape.rect.north) {
        shape.rect.north += 0.000001;
      }
      shape.entity.rectangle.coordinates = shape.rect;
      // 再次点击结束
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
}

/**
 *
 * 鼠标绘制圆
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintCircle(data = {}, callback) {
  const {
    key,
    name,
    highlightColor,
    highlight,
    color,
    isHighlight = false,
    label = {},
    onMenuSelect,
    showDefaultMenu = false,
    pixelSize,
    menu,
    tip
  } = data;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const circle = {
    points: [],
    entity: null,
    r: 1,
  };
  let tempPosition;
  let cartographic1;
  let labelEntity;
  let tempLon;
  let tempLat;
  let p = null;
  let text = '';
  let _id = key
  const handle = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  handle.setInputAction((click) => {
    tempPosition = getPointFromWindowPoint(click.position, this.viewer);
    if (tempPosition) {
      // eslint-disable-next-line no-inner-declarations
      function callBackPos() {
        if (circle.points.length === 0) return;
        const minLon = Cesium.Math.toDegrees(circle.points[0].longitude);
        const minLat = Cesium.Math.toDegrees(circle.points[0].latitude);
        const maxLon = Cesium.Math.toDegrees(circle.points[1].longitude);
        const maxLat = Cesium.Math.toDegrees(circle.points[1].latitude);
        const from = turfPoint([minLon, minLat]);
        const to = turfPoint([maxLon, maxLat]);
        const r = distance(from, to, { units: 'kilometers' });
        if (r) return r * 1000;
        return 1;
      }
      if (circle.points.length === 0) {
        p = click.position;
        cartographic1 = Ellipsoid.WGS84.cartesianToCartographic(tempPosition);
        if (!tempPosition) return false;
        circle.points.push(this.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
        circle.points.push(this.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
        tempLon = Cesium.Math.toDegrees(cartographic1.longitude);
        tempLat = Cesium.Math.toDegrees(cartographic1.latitude);
        circle.entity = this.viewer.entities.add({
          id: _id,
          layer: 'default' || data.layer,
          position: Cartesian3.fromDegrees(tempLon, tempLat),
          label: labelOptions,
          ellipse: {
            semiMinorAxis: new CallbackProperty(callBackPos, false),
            semiMajorAxis: new CallbackProperty(callBackPos, false),
            outline: false,
            height: 0,
            outline: true,
            width: 10,
            outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
          },
          label: labelOptions,
          tip,
          menu: showDefaultMenu ? (menu || {
            className: 'test-menu',
            show: true,
            menuItems: defaultMenuItems,
            onSelect: (type, entity) => {
              if (type === 'delete') {
                console.log(entity)
                this.remove(entity);
              }
              onMenuSelect && onMenuSelect(type, entity)
            },
          }) : null,
        });
        circle.entity.ellipse.material= new ColorMaterialProperty(new CallbackProperty(() => {
          if (circle.entity.id === this.moveActiveId) {
            return Color.fromCssColorString(highlightColor||window.Cesium.highlightColor).withAlpha(0.3);
          }
          return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.3);
        }, false))
      } else {
        // const tempCircle = new CircleOutlineGeometry({
        //   center: Cartesian3.fromDegrees(tempLon, tempLat),
        //   radius: callBackPos(),
        //   granularity: Math.PI / 2,
        // });
        // const geometry = CircleOutlineGeometry.createGeometry(tempCircle);
        // let float64ArrayPositionsIn = geometry.attributes.position.values
        handle.destroy();
        this.viewer.entities.remove(labelEntity);
        const r = parseFloat(callBackPos());
        if (callback) {
          callback({
            id: circle.entity._id,
            centerPoint: [tempLon, tempLat],
            radius: r,
          });
        }
      }
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
  handle.setInputAction((movement) => {
    const moveEndPosition = getPointFromWindowPoint(movement.endPosition, this.viewer);
    if (circle.points.length === 0) {
      if (!labelEntity) {
        text = '点击绘制';
        labelEntity = new Entity({
          position: new CallbackProperty(() => {
            const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
            const position = cartesian ? getWGS84FromDKR(cartesian) : {};
            return cartesian ? Cartesian3.fromDegrees(...Object.values(position)) : Cartesian3.fromDegrees(0, 0);
          }, false),
          label: {
            text: new CallbackProperty(() => text, false),
            font: '14px Source Han Sans CN',
            fillColor: Color.fromCssColorString('#fff'),
            pixelOffset: new Cartesian2(0, -16), // 偏移
          },
          zIndex: 100,
        });
        this.viewer.entities.add(labelEntity);
      }
      return false;
    }
    text = '点击结束';
    // 选择的点在球面上
    if (moveEndPosition) {
      // 再次点击结束
      circle.points.pop();
      circle.points.push(this.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition));
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
}

/**
 *
 * 多边形绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintPolygon(data = {}, callback) {
  const {
    key,
    name,
    highlightColor,
    highlight,
    color,
    isHighlight = false,
    label = {},
    onMenuSelect,
    showDefaultMenu = false,
    pixelSize,
    menu,
    tip
  } = data;
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  let _id = key
  let labelEntity = null;
  let text = '';
  let tempLon = '';
  let tempLat = '';
  let poly;
  const positions = [];
  const drawPolygon = () => {
    console.log(positions)
    poly = this.viewer.entities.add({
      id: _id,
      layer: 'default' || data.layer,
      name: '多边形',
      polygon: {
        hierarchy: new CallbackProperty(() => new PolygonHierarchy(positions), false),
        outline: false,
        material: new ColorMaterialProperty(new CallbackProperty(() => {
        if (_id === this.moveActiveId) {
          return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor);
        }
          return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor)).withAlpha(0.5);
        }, false)),
        height: 0,
        outline: true,
        width: 10,
        outlineColor: Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor))
      },
      position: Cartesian3.fromDegrees(tempLon, tempLat),
      label: labelOptions,
      arcType: ArcType.GEODESIC,
      tip,
      menu: showDefaultMenu ? (menu || {
        className: 'test-menu',
        show: true,
        menuItems: [
          { text: '编辑', icon: 'fa-edit', type: 'edit' },
          { text: '展示详情', icon: 'fa-eye', type: 'detail' },
          { text: '删除',icon: 'fa-trash-alt', type: 'delete' },
        ],
        onSelect: (type, entity) => {
          if (type === 'delete') {
            console.log(entity)
            this.remove(entity);
          }
          onMenuSelect && onMenuSelect(type, entity)
        },
      }) : null,
    });
  };
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  // 单击画点
  handler.setInputAction((movement) => {
    const tempPosition = getPointFromWindowPoint(movement.position, this.viewer);
    let catp = Ellipsoid.WGS84.cartesianToCartographic(tempPosition);
    tempLon = Cesium.Math.toDegrees(catp.longitude);
    tempLat = Cesium.Math.toDegrees(catp.latitude);
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    // if (positions.length === 0) {
    //   positions.push(cartesian.clone());
    // }
    if (cartesian) {
      positions.push(cartesian);
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动
  handler.setInputAction((movement) => {
    if (!labelEntity) {
      labelEntity = new Entity({
        position: new CallbackProperty(() => {
          const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
          const position = cartesian ? getWGS84FromDKR(cartesian) : {};
          return cartesian ? Cartesian3.fromDegrees(...Object.values(position)) : Cartesian3.fromDegrees(0, 0);
        }, false),
        label: {
          text: new CallbackProperty(() => text, false),
          font: '14px Source Han Sans CN',
          fillColor: Color.fromCssColorString('#fff'),
          pixelOffset: new Cartesian2(0, -16), // 偏移
        },
      });
      this.viewer.entities.add(labelEntity);
    }
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
    if (cartesian !== undefined) {
      positions.pop();
      positions.push(cartesian);
    }
    if (positions.length > 2) {
      text = '点击右键结束';
    }
    if (positions.length >= 2) {
      if (!poly) {
        drawPolygon(positions);
      }
    } else {
      text = '点击绘制';
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
  // 鼠标点击
  handler.setInputAction(() => {
    handler.destroy();
    this.viewer.entities.remove(labelEntity);
    if (callback) {
      callback({
        id: poly._id,
        positions,
      });
    }
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

export default {
  paintRect,
  paintCircle,
  paintPolygon,
};
