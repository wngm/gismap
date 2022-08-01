//衍生处理管理 【事件中心管理】
import { Color } from 'cesium'


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
 * @param {string} type 点 属性类型
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
 * @param {string} type 点 属性类型
 * @param {string} [value] 属性值
 */
function unhighlightPoint(id, value) {

    let entity = this.viewer.entities.getById(id);
    if (entity) {
        entity.point.color = Color.fromCssColorString(value || window.Cesium.themeColor)
    }
}

export default {
    setPoint,
    getPoint,
    highlightPoint,
    unhighlightPoint
}