
  import * as Cesium from 'cesium';


/**
 * 测量工具可选配配置项
 * @typedef {Object} czmlOptions
 * @property {string} czml - czml文件地址
 * @property {function} onReady - 加载完毕回调函数
  */



/**
 *
 * 加载 CZML 文件
 * @class LoadCzml
 */
class LoadCzml {
    /**
     *Creates an instance of LoadCzml.
     * @param {czmlOptions} [options={}]
     * @memberof LoadCzml
     */
    constructor(viewer,options={}){
        this.czmlDataSource = null
        this.dataSource = null
        this.czml =options.czml
        this.viewer = viewer
        this.bindEnteries =[]
        this.onReady = () => {
            options.onReady&& options.onReady(this)
        }
        this.load()
    }

    /**
     *
     * 加载czml文件
     * @memberof LoadCzml
     */
    load(){
        if(!this.czml){
            console.error('czml 地址缺少')
            return 
        }
        this.czmlDataSource = new Cesium.CzmlDataSource.load(this.czml)
        this.czmlDataSource.then(data=>{
            this.dataSource = data
            this.viewer.dataSources.add(data).then((dataSource2)=>{
                this.onReady()
          })
          })

    }
    /**
     *
     * 绑定与czml中的同轨 （跟随）
     * @param {string} id czml卫星 id
     * @param {*} entery
     * @memberof LoadCzml
     */
    bindStallite(id,entery){
        const viewer = this.viewer
        const { ellipsoid } = this.viewer.scene.globe;
        const entity2 = entery 
        this.bindEnteries.push(entery)
        //  gisMap.cylinderWave({
        //     longitude: 149,
        //     latitude: 42,
        //     height: 1000000,
        //     color:"#009900"
        // });
        let satellite = this.dataSource.entities.getById(id);
        let property = new Cesium.SampledPositionProperty();
        let property2 = new Cesium.SampledProperty(Number);
        for (var ind = 0; ind < 292; ind++) {
            var time = Cesium.JulianDate.addSeconds(viewer.clock.currentTime, 300*ind, new Cesium.JulianDate());
            var position = satellite.position.getValue(time);
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude),
            lng = Cesium.Math.toDegrees(cartographic.longitude),
            hei = cartographic.height / 2;
            property.addSample(time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
            property2.addSample(time, hei*2);
        }
        entity2.position = property;
        entity2.cylinder.length = property2;
        entity2.cylinder.length.setInterpolationOptions({
            interpolationDegree : 1,
            interpolationAlgorithm : Cesium.HermitePolynomialApproximation
            });
        entity2.position.setInterpolationOptions({
            interpolationDegree: 5,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        });

    }
    /**
     *
     * 解除绑定与czml中的元素的绑定
     * @memberof LoadCzml
     */
    unbindStallite(){
        this.bindEnteries.forEach(entity=>{
            this.viewer.entities.remove(entity);
        })

    }
    /**
     *
     * 移除加载的czml 数据
     * @memberof LoadCzml
     */
    remove(){
        if(this.dataSource){
            this.unbindStallite()
            this.viewer.dataSources.remove(this.dataSource)
        }
    }
}

export default  LoadCzml