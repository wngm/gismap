//衍生处理管理 【事件中心管理】
import { Color, Cartesian3 } from 'cesium'



//  ------------------点 部分-----------------
/**
 *
 *  设置点 属性
 * @memberof GisMap
 * @param {string} id 点id
 * @param {string} type 点 属性类型
 * @param {string} [value] 属性值
 */
function setPoint(id, type, value) {
    const { viewer } = this

}

function getPoint() {

}
/**
 *
 *  设置点 高亮
 * @memberof GisMap
 * @param {string} id 点id
 * @param {string} [value] 属性值
 */
function highlightPoint(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity) {
        entity.point.color = Color.fromCssColorString(value || window.Cesium.highlightColor)
    }
}

/**
 *
 *  取消点 高亮
 * @memberof GisMap
 * @param {string} id 点id
 * @param {string} [value] 属性值
 */
function unhighlightPoint(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity) {
        entity.point.color = Color.fromCssColorString(value || window.Cesium.themeColor)
    }
}


// ----------------- 线段部分------------------

/**
 *
 *  设置线 高亮
 * @memberof GisMap
 * @param {string} id 点id
 * @param {string} [value] 属性值
 */
function highlightLine(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity) {
        entity.polyline.material.color = Color.fromCssColorString(value || window.Cesium.highlightColor)
    }
}

/**
 *
 *  取消线 高亮
 * @memberof GisMap
 * @param {string} id 点id
 * @param {string} [value] 属性值
 */
function unhighlightLine(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity) {
        entity.polyline.material.color = Color.fromCssColorString(value || window.Cesium.themeColor)
    }
}
// 线段分类
// 1. 普通线 【折线、曲线】
// 2. 点线
// 3. 时间线
// 4. 轨道线
// 5. 路径线

function lineAddPoint(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity && entity.polyline) {
        entity.sourceData = entity.sourceData.concat(value)
        console.log(entity.sourceData, 887)
        entity.polyline.positions = Cartesian3.fromDegreesArrayHeights(entity.sourceData)
    }
}




export default {
    setPoint,
    getPoint,
    highlightPoint,
    unhighlightPoint,
    highlightLine,
    unhighlightLine,
    lineAddPoint
}