/*
 * @Author: R10
 * @Date: 2022-06-06 15:11:31
 * @LastEditTime: 2022-06-06 16:37:55
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/common/utils.js
 */
import { Cartographic, Math } from 'cesium';
/**
 * @description: 笛卡尔坐标转经纬度高程
 * @param {*} cartesian 笛卡尔坐标
 * @return {*} wgs84 经纬度高程
 */
export function getWGS84FromDKR(cartesian) {
  const cartographic = Cartographic.fromCartesian(cartesian);
  const longitude = Math.toDegrees(cartographic.longitude);
  const latitude = Math.toDegrees(cartographic.latitude);
  const height = Math.toDegrees(cartographic.height);
  const wgs84 = {
    longitude,
    latitude,
    height,
  };
  return wgs84;
}

// 默认右键菜单
export const defaultMenuItems =[
  // { text: '编辑', icon: 'fa-edit', type: 'edit' },
  // { text: '展示详情', icon: 'fa-eye', type: 'detail' },
  { text: '删除',icon: 'fa-trash-alt', type: 'delete' },
]
export function other() {}
