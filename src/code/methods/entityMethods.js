//衍生处理管理 【事件中心管理】
import * as Cesium from 'cesium'
import entity from '../entity'

const { Color, Cartesian3 } = Cesium


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


/**
 *
 *  获取点 属性
 * @memberof GisMap
 * @param {entity} entity 点
 * @returns {{id:string,key:string}}
 */
function getPoint(entity) {
    const { viewer, } = this
    let position = entity.position.getValue(viewer.clock.currentTime)
    let _p = this.getPositionByCartesian(position)
    return {
        id: entity._id,
        key: entity._id,
        ..._p
    }

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


/**
 *
 *  图点设置
 * @memberof GisMap
 * @param {string} id 点id
 * @param {Object} [value] 属性值
 */
function setImgPoint(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity && entity.billboard) {
        for (let key in value) {
            entity.billboard[key] = value[key]
        }
        // entity.billboard.
    }
}

/**
 *
 *  点设置闪烁时常
 * @memberof GisMap
 * @param {string} id 点id
 * @param {number} [time] 单位毫秒，缺省为一直闪烁
 */
function setPointFlash(id, time) {
    const { Cesium } = this
    let entity = this.viewer.entities.getById(id);
    if (entity && entity.point) {
        let color = Cesium.Color.clone(entity.point.color.getValue())
        let alpha = 0
        if (time) {
            setTimeout(() => {
                entity.point.color = color
            }, time)
        }
        const property = new Cesium.CallbackProperty(() => {
            if (alpha >= 1) alpha = 0;
            alpha += 0.05;
            return Cesium.Color.clone(color).withAlpha(alpha);
        }, false)
        entity.point.color = property
        // entity.billboard.
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

// 动画点
function pathLinePush(id, value) {
    let entity = this.viewer.entities.getById(id);
    if (entity.sourceType === 'pathLineByTime') {
        entity.sourceData.push(value)

        let pointsList = entity.sourceData.map((item) => {
            const {
                longitude,
                latitude,
                height = 0,
                time
            } = item
            if (!time) {
                throw new Error('drawPathLine data 缺少参数time')
            }
            let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
            let _time = Cesium.JulianDate.fromDate(new Date(time));
            return {
                position,
                time: _time
            }
        });
        var property = new Cesium.SampledPositionProperty();
        pointsList.forEach(i => {
            property.addSample(i.time, i.position);
        })
        entity.position = property
        entity.orientation = new Cesium.VelocityOrientationProperty(property)
        if (entity.billboard && entity.billboard.rotation !== undefined) {
            entity.billboard.alignedAxis = new Cesium.VelocityVectorProperty(property, true)

        }
        const showPoint = entity?.sourceOptions?.showPoint
        if (showPoint) {
            this.renderPathPoint(entity, entity.sourceData)
        }
    }
}


function pathLineDeletePoint(pathId, pointId) {
    let entity = this.viewer.entities.getById(pathId);
    if (entity.sourceType === 'pathLineByTime') {
        let index = entity.sourceData.findIndex(i => {
            return i.key === pointId
        })
        entity.sourceData.splice(index, 1)
        this.remove(pointId)
        let pointsList = entity.sourceData.map((item) => {
            const {
                longitude,
                latitude,
                height = 0,
                time
            } = item
            if (!time) {
                throw new Error('drawPathLine data 缺少参数time')
            }
            let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
            let _time = Cesium.JulianDate.fromDate(new Date(time));
            return {
                position,
                time: _time
            }
        });
        var property = new Cesium.SampledPositionProperty();
        pointsList.forEach(i => {
            property.addSample(i.time, i.position);
        })
        entity.position = property
        entity.orientation = new Cesium.VelocityOrientationProperty(property)
        if (entity.billboard && entity.billboard.rotation !== undefined) {
            entity.billboard.alignedAxis = new Cesium.VelocityVectorProperty(property, true)

        }

        // this.renderPathPoint(entity, entity.sourceData)
    }
}

const mode2Option = {
    'show': {
        leadTime: undefined,
        trailTime: undefined,
    },
    'none': {
        leadTime: 0,
        trailTime: 0,
    },
    'trail': {
        leadTime: 0,
        trailTime: undefined,
    },
    'lead': {
        leadTime: undefined,
        trailTime: 0,
    },
}
// path 播放模式 
function pathLineSetMode(pathId, type) {
    let entity = this.viewer.entities.getById(pathId);
    if (entity.sourceType === 'pathLineByTime') {
        entity.path.leadTime = mode2Option[type].leadTime
        entity.path.trailTime = mode2Option[type].trailTime
    }
}

// 设置path图标
function pathLineSetBillboard(pathId, options) {
    let entity = this.viewer.entities.getById(pathId);
    if (entity.sourceType === 'pathLineByTime') {
        for (let i in options) {
            entity.billboard[i] = options[i]
        }

    }
}
function renderPathPoint(entity, data, force) {
    let stopTime = new Cesium.JulianDate.fromDate(new Date())

    const color = entity?.sourceOptions?.color || window.Cesium.highlightColor
    // entity._children.forEach(e => {
    //     this.viewer.entities.remove(e)
    // })

    if (force) {

    } else {
        let p = data[data.length - 1]
        let _st = Cesium.JulianDate.fromDate(new Date(p.time))

        let availability = new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
                start: _st,
                stop: stopTime,
                // isStopIncluded: false,
            }),
        ])
        if (p.imgOptions) {
            this.drawMarkerPoint({
                parent: entity,
                ...p,
                availability
            })
        } else {
            // this.drawPoint({
            //     parent: entity,
            //     color,
            //     ...p,
            //     availability,
            // })
            this.drawMarkerPoint({
                parent: entity,
                color,
                ...p,
                imgOptions: {
                    color: Cesium.Color.fromCssColorString(color),
                    image: window.CESIUM_BASE_URL + '/images/circle.svg'
                },
                availability
            })
        }
    }

    // data.forEach(p => {
    //     let _st = Cesium.JulianDate.fromDate(new Date(p.time))
    //     this.drawPoint({
    //         parent: entity,
    //         color,
    //         ...p,
    //         availability: new Cesium.TimeIntervalCollection([
    //             new Cesium.TimeInterval({
    //                 start: _st,
    //                 stop: stopTime,
    //                 // isStopIncluded: false,
    //             }),
    //         ])
    //     })
    // })

}

/**
 *
 *  获取矩形框内数据
 * @memberof GisMap
 * @param {entity | string} entity 点id
 * @return {*}
 */
function getDataInArea(area) {
    let _entity = area;
    if (typeof area === 'string') {
        _entity = this.viewer.entities.getById(area);
    }
    const { viewer } = this;
    const { ellipsoid } = viewer.scene.globe;
    const time = viewer.clock.currentTime
    const datas = [];
    //圆形 处理
    if (_entity.ellipse) {
        const r = _entity.ellipse.semiMajorAxis.getValue(time)
        this.viewer.entities.values.forEach((entity) => {
            const { id } = entity;
            if (entity.point && id !== _entity.id && entity.position?.getValue(time)) {
                const cartographic = ellipsoid.cartesianToCartographic(entity.position.getValue(time));
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                const { height } = cartographic;
                let _r = Cesium.Cartesian3.distance(_entity.position.getValue(time), entity.position.getValue(time))
                // 判断元素点是否在圆形内
                const status = _r < r
                // 判断元素点是否在矩形内
                // const status = Cesium.Rectangle.contains(rectangle, cartographic);

                if (status) {
                    datas.push({
                        latitude,
                        longitude,
                        height,
                        id,
                        type: 'point',
                        entity
                    });
                }
            }
        });

    }
    // 矩形处理
    if (_entity.rectangle) {
        this.viewer.entities.values.forEach((entity) => {
            const { id } = entity;
            if (entity.point && id !== _entity.id && entity.position?.getValue(time)) {
                const cartographic = ellipsoid.cartesianToCartographic(entity.position.getValue(time));
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                const { height } = cartographic;
                // 判断元素点是否在矩形内
                const status = Cesium.Rectangle.contains(_entity.rectangle.coordinates.getValue(time), cartographic);
                if (status) {
                    datas.push({
                        latitude,
                        longitude,
                        height,
                        id,
                        type: 'point',
                        entity
                    });
                }
            }
        });

    }


    return datas;
}



export default {
    setPoint,
    getPoint,
    highlightPoint,
    unhighlightPoint,
    setImgPoint,
    setPointFlash,
    highlightLine,
    unhighlightLine,
    linePush,
    lineSplice,
    renderLine,
    renderLinePoint,
    pathLineDeletePoint,
    pathLineSetMode,
    pathLineSetBillboard,
    pathLinePush,
    renderPathPoint,
    getDataInArea,
}