/*
 * @Author: R10
 * @Date: 2022-05-30 16:36:39
 * @LastEditTime: 2022-05-31 16:03:51
 * @LastEditors: R10
 * @Description:
 * @FilePath: /gismap/src/code/draw/index.js
 */

import pointFn from './point';
import lineFn from './line';

export default {
  ...pointFn,
  ...lineFn,
};
