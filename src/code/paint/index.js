/*
 * @Author: R10
 * @Date: 2022-06-06 10:30:30
 * @LastEditTime: 2022-06-07 16:19:22
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/paint/index.js
 */

import pointFn from './point';
import lineFn from './line';
import shapeFn from './shape';

export default {
  ...pointFn,
  ...lineFn,
  ...shapeFn,
};
