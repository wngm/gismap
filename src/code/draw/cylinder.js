import {
    HeightReference,
    Entity, ArcType, Cartesian3, Color,PolylineTrailLinkMaterialProperty
  } from 'cesium';
  
  let _id = 10000;
  /**
     *
     * 绘制圆柱体
     * @param {CylinderOptions} data
     * @param {Object} [options={}]
     * @memberof GisMap
     * @returns {*} Entity
     */
  function drawCylinder(data = {}, options = {}) {

    const {
        longitude,
        latitude,
        height,
        color = "#0099cc",
        bottomRadius,
        key
    } = data
    const entity = new Entity({
      id:key,
      layer: data.layer || 'default',
      // show: true,
      // tip:{show:true,content:'这是圆柱体'},
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height/2),
      ...options,
      cylinder: {
        topRadius:0,
        bottomRadius:bottomRadius || height * 0.3, //半径
        bottomSurface:false,
        length:height,
        slices:128,
        material:Color.fromCssColorString(color||'#00cc99')
      },
      
    });
    this.viewer.entities.add(entity);
    return entity;
  }

  /**
   *    
   * 雷达放射波 cylinderWave 参数
   * @typedef {Object} CylinderOptions 雷达放射波参数 
   * @property {number} longitude 经度
   * @property {number} latitude 维度
   * @property {number} height 高度
   * @property {string} [color] 颜色 默认值#0099cc
   * @property {number} [count = 4] 波形数量
   */


  /**
   * 雷达放射波
   * @param {CylinderOptions} data
   * @param {Object} [options={}]
   * @memberof GisMap
   * @returns {*} Entity
  */
  function cylinderWave(data ={}){
    const {
        longitude,
        latitude,
        height,
        color = "#0dfcff",
        count = 4,
        bottomRadius,
        key
    } = data

    // const dashImg = window.CESIUM_BASE_URL +'/image/dash3.png'
    // let material = new Cesium.Material({
    //     fabric : {
    //       type : 'DiffuseMap',
    //       uniforms : {
    //         image : dashImg,
    //         repeat : {
    //           x : 10,
    //           y : 2
    //         }
    //       }
    //     }
    //   });
    const entity = new Entity({
        id:key,
        layer: data.layer || 'default',
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height/2),
        cylinder: {
          topRadius:0,
          bottomRadius: bottomRadius || height * 0.3, //半径
          bottomSurface:false,
          length:height,
          slices:128,
        //   material:Cesium.Color.fromCssColorString(color),
          material: new Cesium.CircleWaveMaterialProperty({
            duration:2000,
            count,
            gradient:1,
            color: Color.fromCssColorString(color||'#00cc99')
          }),
        //   material:new PolylineTrailLinkMaterialProperty(
        //     Color.fromCssColorString('#ff0000'),
        //     2000,
        //   ),
          disableDepthTestDistance: 0
        },
      });
    this.viewer.entities.add(entity);
    return entity;
  }




   /**
   * 雷达扫描
   * @param {Objec} data
   * @param {Object} [options={}]
   * @memberof GisMap
   * @returns {*} Entity
  */function drawCircleRadar(data = {}, options = {}) {

    const {
        longitude,
        latitude,
        height,
        color = "#0dfcff",
        radius,
        key
    } = data
    const _color = Color.fromCssColorString(color||'#990000')
    const entity = new Entity({
      id:key,
      layer: data.layer || 'default',
      // show: true,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      ...options,
      cylinder: {
        topRadius:radius,
        bottomRadius:radius,
        bottomSurface:true,
        topSurface:false,
        length:1.0,
        slices:128,
        material:new Cesium.RadarMaterialProperty({
            duration:2000,
            count:2,
            gradient:1,
            color: _color
        })
      },
      // ellipse: {
      //   semiMinorAxis:radius,
      //   semiMajorAxis:radius,
      //   height:10,
      //   extrudedHeightReference:HeightReference.RELATIVE_TO_GROUND,
      //   outlineColor:Cesium.Color.RED,
      //   // outlineWidth: 10.0,
      //   // outline:true,
      //   // outlineWidth:20.0,
      //   // material: _color,
      //   material:new Cesium.RadarMaterialProperty({
      //       duration:2000,
      //       count:2,
      //       gradient:1,
      //       color: _color
      //   }),
      // },
      
    });
    this.viewer.entities.add(entity);
    return entity;
  }

   /**
   * 雷达扫描
   * @param {Objec} data
   * @param {Object} [options={}]
   * @memberof GisMap
   * @returns {*} Entity
   * 
   */
  function drawCircleRadarAngle(data = {}, options = {}) {

    const {
        longitude,
        latitude,
        height,
        color = "#0dfcff",
        radius,
        key,
        start = -Math.PI,
        end = Math.PI
    } = data
    const entity = new Entity({
      id:key,
      layer: data.layer || 'default',
      // show: true,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      ...options,
      cylinder: {
        topRadius:radius,
        bottomRadius:radius,
        bottomSurface:true,
        topSurface:false,
        length:1.0,
        slices:128,
        heightReference:HeightReference.NONE,
        material:new Cesium.RadarAngleMaterialProperty({
          duration:2000,
          count:2,
          gradient:1,
          color: Color.fromCssColorString(color||'#990000'),
          start,
          end,
      }),
      },
      // ellipse: {
      //   semiMinorAxis:radius,
      //   semiMajorAxis:radius,
      //   height:10,
      //   material:new Cesium.RadarAngleMaterialProperty({
      //       duration:2000,
      //       count:2,
      //       gradient:1,
      //       color: Color.fromCssColorString(color||'#990000'),
      //       start,
      //       end,
      //   }),
      //   outline: false,
      // },
      
    });
    this.viewer.entities.add(entity);
    return entity;
  }
  
  export default {
    drawCylinder,
    cylinderWave,
    drawCircleRadar,
    drawCircleRadarAngle
  };
  