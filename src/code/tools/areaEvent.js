import * as Cesium from 'cesium';
import Eventemitter from 'eventemitter3'

//  区域监控
class AreaEvent {
    /**
     * 创建区域识别实例 AreaEvent.
     * @param {*} [options={}]
     * @memberof AreaEvent
     */
    constructor(viewer,options={}){
        this.viewer = viewer
        this.timer = null
        //轮询检测时间
        this.duration = 1000
            // 监听区域 
        this.plotes= []
        // 被监听对象
        this.animateEntities= []
        // 监听区域状态记录
        this.record= {
            //  1 里 0 外
            // [plotesId]:{
            //   [animateId]:{status:0}
            // }
        },
        //事件中心
        this.event = new Eventemitter()
        this.init()
       
    }
    init(){
        this.start()
    }
    /**
     *
     * 添加监听区域
     * @param {string} id 监听区域ID
     * @memberof AreaEvent
     */
    addArea(id){
        if(!this.plotes.find(i => i===id)){
            this.plotes.push(id)
        }
    }

     /**
     *
     * 移除监听区域
     * @param {string} id 监听区域ID
     * @memberof AreaEvent
     */
    removeArea(id){
        let index = this.plotes.findIndex(i=> i === id)
        if(index >-1){
            this.plotes.splice(index,1)
        }
    }

    /**
     *
     * 添加监听物体
     * @param {string} id 监听物体ID
     * @memberof AreaEvent
     */
    add(id){
        if(!this.animateEntities.find(i => i===id)){
            this.animateEntities.push(id)
        }
    }

    /**
     *
     * 移除监听物体
     * @param {string} id 监听物体ID
     * @memberof AreaEvent
     */
    remove(id){
        let index = this.animateEntities.findIndex(i=> i === id)
        if(index >-1){
            this.animateEntities.splice(index,1)
        }
    }

    /**
     *
     * 开始监听
     * @memberof AreaEvent
     */
    start(){
        this.timer= setInterval(()=>{this.check()},1000)
    }
    /**
     *
     * 停止监听
     * @memberof AreaEvent
     */
    stop(){
        clearInterval(this.timer)
    }
     // 状态检测 当前只支持 矩形和正圆形
    check() {
        const {viewer} = this 
        this.plotes.forEach(plot => {
          let plotEntity = viewer.entities.values.find(i => i.id === plot)
          this.animateEntities.forEach(a => {
            let animateEntity = viewer.entities.values.find(i => i.id === a)
            let position = animateEntity.position.getValue(viewer.clock.currentTime)
            if (position) {
              let status = this.isInArea(position, plotEntity)
              if (!this.record[plot]) {
                this.record[plot] = {}
              }
              if (!this.record[plot][a]) {
                this.record[plot][a] = {
                  status
                } 
              }else{
                // 触发事件
                if(this.record[plot][a].status !== status) {
                  let eventName = status?'in': 'out'
                  this.event.emit(eventName, {
                    area:{
                      id:plot,
                      name:plotEntity.name,
                      entity:plotEntity
  
                    },
                    animate:{
                      id:a,
                      name:animateEntity.name,
                      entity:animateEntity
                    }
                  })
                }
                this.record[plot][a] = {
                  status
                } 
              }
            }
          })
        })
      }

    isInArea(position, entity) {
        // 圆形区域
        if(entity.ellipse){
          const radius = entity.ellipse.semiMinorAxis.getValue()
          let center = entity.position._value
          let r = Cesium.Cartesian3.distance(position,center)
          if(r){
            return r < radius
          }
        }
        // 矩形区域
        if(entity.rectangle){
          let rectanglePosition = entity.rectangle.coordinates.getValue()
          let rectangle = new Cesium.Rectangle(rectanglePosition.west, rectanglePosition.south, rectanglePosition.east, rectanglePosition.north)
          if (position) {
            const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            // 判断元素点是否在矩形内
            const status = Cesium.Rectangle.contains(rectangle, cartographic);
            return status
          }
        }
        return false;
    }
    /**
     *
     * 销毁区域监控工具
     * @memberof AreaEvent
     */
    destroy(){
        this.stop()
        this.event.removeAllListeners()
        this.plotes= []
        this.animateEntities= []
    }
}

export default AreaEvent