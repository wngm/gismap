/*
 * @Author: R10
 * @Date: 2022-06-06 17:25:07
 * @LastEditTime: 2022-07-01 15:50:37
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/paint/line.js
 */
import {
  ScreenSpaceEventHandler, ScreenSpaceEventType, Entity, Color, CallbackProperty, Cartesian3, Cartesian2, ColorMaterialProperty,
} from 'cesium';
import { getWGS84FromDKR } from '../common/utils';
import { getLabelOptions } from '../entity';

let id = 'paintLine'

/**
 *
 * 鼠标线绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintLine(data = {}, callback) {
  const {
    key,
    name,
    color,
    highlight,
    isHighlight = false,
    highlightColor,
    onMenuSelect,
    showDefaultMenu = false,
    label = {},
    pixelSize,
    menu,
    tip
  } = data;
  id += 1;
  let _id = key || id
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const positions = [];
  let polyline = null;
  let labelEntity = null;
  // eslint-disable-next-line no-unused-vars
  let isEnd = false;
  let text = '点击绘制';
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  // 鼠标点击
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    positions.push(position);
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
    if (positions.length >= 2) {
      text = '鼠标右键结束绘制';
    } else {
      text = '点击绘制';
    }
    if (positions.length > 0) {
      if (!polyline) {
        polyline = new Entity({
          id: _id,
          layer: 'default' || data.layer,
          polyline: {
          material: new ColorMaterialProperty(new CallbackProperty(() => {
            if (id === this.moveActiveId) {
              return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor);
            }
              return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor));
            }, false)),
            width: data?.width || 1,
            positions: new CallbackProperty(() => {
              const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
              const position = cartesian ? getWGS84FromDKR(cartesian) : {};
              delete position.height;
              const arr = positions.map(({ longitude, latitude }) => [longitude, latitude]);
              const lineArr = [...arr.flat(Infinity), ...Object.values(!isEnd ? position : {})];
              return Cartesian3.fromDegreesArray(lineArr);
            }, false),
          },
          label: labelOptions,
          position: Cartesian3.fromDegrees(positions[0]?.longitude, positions[0]?.latitude, 0),
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
        this.viewer.entities.add(polyline);
      }
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
  // 鼠标右键结束画线
  handler.setInputAction(() => {
    handler.destroy();
    isEnd = true;
    this.viewer.entities.remove(labelEntity);
    if (callback) {
      callback({ positions: positions.map(({ longitude, latitude }) => ({ longitude, latitude })) });
    }
  }, ScreenSpaceEventType.RIGHT_CLICK);
}
/**
 *
 * 鼠标带点线绘制
 * @param {object} data
 * @returns {entity} entity
 * @memberof GisMap
 */
function paintLineWithPoints(data = {}, callback) {
  const {
    key,
    name,
    color,
    highlight,
    isHighlight = false,
    highlightColor,
    onMenuSelect,
    showDefaultMenu = false,
    label = {},
    pixelSize,
    menu,
    tip
  } = data;
  id += 1;
  let _id = key || id
  const labelOptions = getLabelOptions({
    ...label,
    pixelSize,
    isHighlight
  });
  const positions = [];
  let polyline = null;
  let labelEntity = null;
  // eslint-disable-next-line no-unused-vars
  let isEnd = false;
  let text = '点击绘制';
  const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  // 鼠标点击
  handler.setInputAction((movement) => {
    const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
    const position = getWGS84FromDKR(cartesian);
    this.drawPoint({
      ...position,
      ...data,
      label: null
    })
    positions.push(position);
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
    if (positions.length >= 2) {
      text = '鼠标右键结束绘制';
    } else {
      text = '点击绘制';
    }
    if (positions.length > 0) {
      if (!polyline) {
        polyline = new Entity({
          id: _id,
          layer: 'default' || data.layer,
          polyline: {
          material: new ColorMaterialProperty(new CallbackProperty(() => {
            if (id === this.moveActiveId) {
              return Color.fromCssColorString(highlightColor || window.Cesium.highlightColor);
            }
              return Color.fromCssColorString(color || (isHighlight ? window.Cesium.highlightColor : window.Cesium.themeColor));
            }, false)),
            width: data?.width || 1,
            positions: new CallbackProperty(() => {
              const cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
              const position = cartesian ? getWGS84FromDKR(cartesian) : {};
              delete position.height;
              const arr = positions.map(({ longitude, latitude }) => [longitude, latitude]);
              const lineArr = [...arr.flat(Infinity), ...Object.values(!isEnd ? position : {})];
              return Cartesian3.fromDegreesArray(lineArr);
            }, false),
          },
          label: labelOptions,
          position: Cartesian3.fromDegrees(positions[0]?.longitude, positions[0]?.latitude, 0),
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
        this.viewer.entities.add(polyline);
      }
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
  // 鼠标右键结束画线
  handler.setInputAction(() => {
    handler.destroy();
    isEnd = true;
    this.viewer.entities.remove(labelEntity);
    if (callback) {
      callback({ positions: positions.map(({ longitude, latitude }) => ({ longitude, latitude })) });
    }
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

export default {
  paintLine,
  paintLineWithPoints,
};
