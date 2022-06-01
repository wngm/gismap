/*
 * @Author: R10
 * @Date: 2022-05-30 16:36:39
 * @LastEditTime: 2022-06-01 11:48:21
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/index.js
 */

import pointFn from './point';
import lineFn from './line';
import shapeFn from './shape';

export default {
  ...pointFn,
  ...lineFn,
  ...shapeFn,
};
