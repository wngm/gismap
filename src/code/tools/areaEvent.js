import * as Cesium from 'cesium';
import Eventemitter from 'eventemitter3'

//  区域监控识别
class AreaEvent {
    constructor(viewer,options={}){
        this.viewer = viewer
        this.timer = null
        //轮询检测时间
        this.duration = 1000
            // 监听区域 
        this.plotes= []
        // 被监听对象
        this.animateEntities= [],
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

    addArea(id){
        if(!this.plotes.find(i => i===id)){
            this.plotes.push(id)
        }
    }

    removeArea(id){
        let index = this.plotes.findIndex(i=> i === id)
        if(index >-1){
            this.plotes.splice(index,1)
        }
    }

    add(id){
        if(!this.animateEntities.find(i => i===id)){ß
            this.animateEntities.push(id)
        }
    }

    remove(id){
        let index = this.animateEntities.findIndex(i=> i === id)
        if(index >-1){
            this.animateEntities.splice(index,1)
        }
    }

    start(){
        console.log('start',this)
        this.timer= setInterval(()=>{this.check()},1000)
    }

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
              // console.log('isInRect', status)
            }
          })
        })
      }

    isInArea(position, entity) {
        console.log(entity)
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
    destroy(){
        this.stop()
    }
}

export default AreaEvent