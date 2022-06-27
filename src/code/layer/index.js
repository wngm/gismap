// 图层管理


/**
 *
 * @typedef {Object} LayerProps 图层数据
 * @property {string} layer 图层名
 * @property { Array<{id:string}>} children 图层下的元素集
 * @property {number} length 图层下元素数量
 */


/**
 *
 * 获取图层数据
 * @returns {LayerProps[]} 所有的图层
 * @memberof GisMap
 */
function getLayer() {
    const {viewer} = this
    const layersMap = {}
    let layers =[]
    viewer.entities.values.forEach(e => {
        if(e.layer){
            if(layersMap[e.layer]){
                layers[layersMap[e.layer]].children.push({id:e.id,entity:e})
                layers[layersMap[e.layer]].length +=1
            }else{
                layersMap[e.layer] = layers.length
                layers.push({
                    layer:e.layer,
                    children:[{id:e.id,entity:e}],
                    length:1
                })
            }
        }
    });
    return layers

 }
 /**
  *
  * 获取图层下元素
  * @param {string} [layer='default'] 图层名 
  * @returns {Array<{id:string}>}  图层下元素数组
  * @memberof GisMap
  */
 function getLayerValues(layer='default'){
    const {viewer} = this
    let children =[]
    viewer.entities.values.forEach(e => {
        if(e.layer === layer){
            children.push({id:e.id,entity:e})
        }

    })
    return children
 }

  /**
  *
  * 隐藏图层
  * @param {string} [layer='default'] 图层名 
  * @returns {Array<{id:string}>}  图层下元素数组
  * @memberof GisMap
  */
 function layerHide(layer='default'){
    const {viewer} = this
    let children =[]
    viewer.entities.values.forEach(e => {
        if(e.layer === layer){
            children.push({id:e.id,entity:e})
            e.show = false
        }

    })
    return children
 }

 /**
  *
  * 显示图层
  * @param {string} [layer='default'] 图层名 
  * @returns {Array<{id:string}>}  图层下元素数组
  * @memberof GisMap
  */
function layerShow(layer='default'){
    const {viewer} = this
    let children =[]
    viewer.entities.values.forEach(e => {
        if(e.layer === layer){
            children.push({id:e.id,entity:e})
            e.show = true
        }

    })
    return children
}

 /**
  *
  * 删除图层
  * @param {string} [layer='default'] 图层名 
  * @returns {Array<{id:string}>}  图层下元素数组
  * @memberof GisMap
  */
  function layerRemove(layer='default'){
    const {viewer} = this
    let children =[]
    viewer.entities.values.forEach(e => {
        if(e.layer === layer){
            children.push({id:e.id})
            viewer.entities.remove(e)
        }

    })
    return children
 }

export default {
    getLayer,
    getLayerValues,
    layerHide,
    layerShow,
    layerRemove
 }