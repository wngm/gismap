# 使用说明

## 安装
```
npm i  @kdhy/gismap
```
--------

## 使用前注意事项
> 因为使用cesium，需要配置静态资源目录
1.服务配置静态资源目录 
2.window['CESIUM_BASE_URL'] = '/static/Cesium/**'

参考目录： **node_modules/@kdhy/gismap/build/Cesium**
--------

## 使用
```
import GisMap from "@kdhy/gismap"

const gisMap = new GisMap('cesium')
```


## 基础方法

### methods

｜方法名｜说明｜类型｜
｜---｜---｜---｜
｜cSetView｜设置视角｜(position) => void｜
｜cZoomIn｜放大｜() => void｜
｜cZoomOut｜缩小｜() => void｜
｜cDrawMpoint｜ 绘制点｜(options) => point｜

### position 

｜ 名称 ｜ 说明 ｜类型 ｜
｜---｜---｜---｜
｜longitude｜经度｜number｜
｜latitude｜纬度｜number｜
｜altitude｜高度｜number｜
