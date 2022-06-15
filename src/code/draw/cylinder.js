import {
    Entity, ArcType, Cartesian3, Color,PolylineTrailLinkMaterialProperty
  } from 'cesium';
  
  let _id = 10000;
  /**
     *
     * 绘制动态圆柱体
     * @param {Point[]} points
     * @param {Object} [options={}]
     * @memberof GisMap
     * @returns {*}
     */
  function drawAnimateCylinder(points, options = {}) {
    _id += 1;
    if (points.length < 2) {
      return;
    }
  
    const pointsArray = points.reduce((a, b) => a.concat(b), []);
    const entity = new Entity({
      id: _id,
      // show: true,
      // tip:{show:true,content:'这是圆柱体'},
      width: 2,
      ...options,
      polyCylinder: {
        positions: Cartesian3.fromDegreesArrayHeights(pointsArray),
        // material:  Cesium.Material.fromType(Cesium.Material.PolyCylinderTrailLinkType),
        material: new PolyCylinderTrailLinkMaterialProperty(
          Color.fromCssColorString(options.color || '#0099cc'),
          2000,
        ),
        arcType: ArcType.GEODESIC,
        // clampToGround: true,
      },
    });
  
    const Cylinder = this.viewer.entities.add(entity);
  
    return Cylinder;
  }
  
  /**
     *
     * 绘制圆柱体
     * @param {Object} data
     * @param {Object} [options={}]
     * @memberof GisMap
     * @returns {*} Entity
     */
  function drawCylinder(data = {}, options = {}) {

    const {
        longitude,
        latitude,
        height
    } = data
    const entity = new Entity({
      // show: true,
      // tip:{show:true,content:'这是圆柱体'},
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      ...options,
      cylinder: {
        topRadius:0,
        bottomRadius:200000,
        bottomSurface:true,
        length:800000,
        slices:128,
        material:Cesium.Color.CHARTREUSE.withAlpha(0.5),
        disableDepthTestDistance: 0
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
        color = "#0099cc"
    } = data

    const dashImg = window.CESIUM_BASE_URL +'/image/dash3.png'
    let material = new Cesium.Material({
        fabric : {
          type : 'DiffuseMap',
          uniforms : {
            image : dashImg,
            repeat : {
              x : 10,
              y : 2
            }
          }
        }
      });
    const entity = new Entity({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height/2),
        cylinder: {
          topRadius:0,
          bottomRadius: height * 0.3, //半径
          bottomSurface:true,
          length:height,
          slices:128,
        //   material:Cesium.Color.fromCssColorString(color),
          material:new PolylineTrailLinkMaterialProperty(
            Color.fromCssColorString('#ff0000'),
            2000,
          ),
          disableDepthTestDistance: 0
        },
      });
    this.viewer.entities.add(entity);
    return entity;
  }
  
  export default {
    drawAnimateCylinder,
    drawCylinder,
    cylinderWave,
  };
  