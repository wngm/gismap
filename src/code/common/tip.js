import * as Cesium from "@modules/cesium/Source/Cesium";
import "./tip.css"
class Tip {
    constructor(viewer,entity){
        this.container =viewer.container
        this.viewer = viewer
        this.show = false
        // 当前绑定目标
        this.bindEntity = entity
        this.dom = null
        this.handleEvent =null
        this.init()

    }

    init(){
        console.log(this.bindEntity)
        this.dom= document.createElement('div')
        this.dom.className="kdyh-cesium-tip"
        this.dom.innerHTML=this.bindEntity.id.tip.content || '该节点缺少 tip 字段'
        this.container.appendChild( this.dom)
        let position= Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.bindEntity.primitive.position)
        this.setAt(position)
        this.handle()
        console.log('created tip')

    }
    destroy(){  
        console.log('destroy tip')
        this.handleEvent.destroy()
        this.container.removeChild(this.dom)
    }

    handle(){
        this.handleEvent = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

        this.handleEvent.setInputAction(()=> {
            let position= Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.bindEntity.primitive.position)
            this.setAt(position)
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    show(){
        this.dom.style.display= 'block'
    }
    hide(){
        this.dom.style.display= 'none'
    }
    setAt(position){
        this.dom.style.left = `${position.x + 24}px`
        this.dom.style.top = `${position.y - 20}px`
    }

}

export default Tip