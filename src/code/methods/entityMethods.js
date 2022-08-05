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


/**
 *
 *  线段添加 点
 * @memberof GisMap
 * @param {string} id 线id
 * @param {*} [value] 属性值
 */
function linePush(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity && entity.polyline) {
        entity.sourceData.push(value)
        this.renderLine(entity, entity.sourceData)
    }
}

/**
 *
 *  线段 删除点
 * @memberof GisMap
 * @param {string} id 线id
 * @param {int} start 起始位
 * @param {int} length 长度
 */
function lineSplice(id, start, length) {
    let entity = this.viewer.entities.getById(id);
    if (entity && entity.polyline) {
        entity.sourceData.splice(start, length)
        this.renderLine(entity, entity.sourceData)
    }

}

function renderLine(entity, data) {

    console.log('render', entity, data)
    if (entity && data) {
        let type = entity.sourceType
        switch (type) {
            case 'line':
                const pointsArray = data.reduce((a, b) => a.concat(b), []);
                entity.polyline.positions = Cartesian3.fromDegreesArrayHeights(pointsArray)
                break;
            case 'linePoint':
                this.renderLinePoint(entity, data)
                break;
            default:
                break
        }
    }
}

function renderLinePoint(entity, data) {

    entity._children.forEach(e => {
        this.viewer.entities.remove(e)
    })

    let mode = Array.isArray(data[0]) ? 0 : 1;

    if (mode === 1) {
        let pointsArray = data.reduce((a, b) => a.concat([b.longitude, b.latitude, b.height]), []);
        entity.polyline.positions = Cartesian3.fromDegreesArrayHeights(pointsArray)
        data.forEach(item => {
            this.drawPoint({
                parent: entity,
                layer: entity.layer,
                ...item
            })
        })
    } else {
        let pointsArray = data.reduce((a, b) => a.concat(b), []);
        entity.polyline.positions = Cartesian3.fromDegreesArrayHeights(pointsArray)
        data.forEach(item => {
            let p = this.drawPoint({
                parent: entity,
                layer: entity.layer,
                longitude: item[0],
                latitude: item[1],
                height: item[2],
                key: null,
                label: null
            })
            p.entity.point.color = Color.clone(entity.polyline.material.color._value)
        })
    }

}




export default {
    setPoint,
    getPoint,
    highlightPoint,
    unhighlightPoint,
    highlightLine,
    unhighlightLine,
    linePush,
    lineSplice,
    renderLine,
    renderLinePoint
}