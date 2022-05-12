import * as Cesium from "@modules/cesium/Source/Cesium";


function getLabelOptions(options){

    const {
        show,
        fillColor,
        outlineColor,
        text,
        pixelSize=30
    }= options

    return {
        text ,
        font : '14pt Source Han Sans CN',    //字体样式
        fillColor:fillColor? Cesium.Color.fromCssColorString(fillColor):Cesium.Color.BLACK,        //字体颜色
        outlineColor:outlineColor? Cesium.Color.fromCssColorString(outlineColor):Cesium.Color.TRANSPARENT,
        backgroundColor:Cesium.Color.AQUA,    //背景颜色
        showBackground:false,                //是否显示背景颜色
        heightReference:Cesium.HeightReference.NONE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,        //label样式
        outlineWidth : 2,                    
        verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
        horizontalOrigin :Cesium.HorizontalOrigin.CENTER,//水平位置
        pixelOffset:new Cesium.Cartesian2(0,-pixelSize/2) ,          //偏移
        eyeOffset:Cesium.Cartesian3.ZERO,           //偏移
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 40000000),
        disableDepthTestDistance:10

    }
}


function getPointOptions(options ) {
    let { 
      color ,
      pixelSize = 30,
      heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
    } =options
    color =color? Cesium.Color.fromCssColorString(color):''
    return {
        // show: true,
        pixelSize,
        heightReference: heightReference,
        color: color || Cesium.Color.LIME,
        // outlineWidth: 10,,
        // outlineColor: Cesium.Color.LIME,
        // outlineWidth: 10,
        scaleByDistance: new Cesium.NearFarScalar(1500, 1, 200000, 0.3),
        // translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 20000, 0.2),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000)
    }
  }
export  {
    getLabelOptions,
    getPointOptions
} 
export default {
    getLabelOptions,
    getPointOptions
}