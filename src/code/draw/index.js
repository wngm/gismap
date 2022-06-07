/*
 * @Author: R10
 * @Date: 2022-05-30 16:36:39
 * @LastEditTime: 2022-06-02 10:58:01
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/index.js
 */

import pointFn from './point';
import lineFn from './line';
import shapeFn from './shape';
import radarFn from './radar';

export default {
  ...pointFn,
  ...lineFn,
  ...shapeFn,
  ...radarFn,
};
