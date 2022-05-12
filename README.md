# 使用说明

## 安装
```
npm i  @kdhy/gismap
```
--------

## 使用前注意事项
> 因为使用cesium，需要配置静态资源目录

1.服务配置静态资源目录 

2.window['CESIUM_BASE_URL'] = '/static/Cesium'

Cesium使用静态资目录： **node_modules/@kdhy/gismap/build/Cesium**


--------

## 使用
```
import GisMap from "@kdhy/gismap"

const gisMap = new GisMap('cesium')
```


## 基础方法

### methods

| 方法名            | 说明         | 类型                                          |
| :---------------- | :----------- | :-------------------------------------------- |
| cSetView          | 设置视角     | ([position](#position)) => void               |
| cZoomIn           | 放大         | () => void                                    |
| cZoomOut          | 缩小         | () => void                                    |
| cSetsceneMode2D3D | 2/3维转换    | （type: 2 \| 3）=> void                       |
| cDrawMpoint       | 绘制点       | ([drawMpointOptions](#pointOptions)) => point |
| remove            | 移除元素节点 | (id \| Entity)=>void                          |

-----------------------------

### <div id="position">position:{}</div> 

| 名称      | 说明 | 类型   |
| :-------- | :--- | :----- |
| longitude | 经度 | number |
| latitude  | 纬度 | number |
| altitude  | 高度 | number |

-----------------------------

### <div id="pointOptions">pointOptions:{}</div> 

| 名称      | 说明      | 类型            |
| :-------- | :-------- | :-------------- |
| longitude | 经度      | number          |
| latitude  | 纬度      | number          |
| altitude  | 高度      | number          |
| label     | label展示 | [Label](#label) |
| tip       | 单击展示  | [Tip](#tip)     |
| menu      | 右键展示  | [Menu](#menu)   |

-----------------------------

### <div id="label">Label:{}</div> 

| 名称         | 说明         | 类型     |
| :----------- | :----------- | :------- |
| show         | 是否展示     | number   |
| text         | 文本内容     | string   |
| fillColor    | 标签填充颜色 | CssColor |
| outlineColor | 标签字体轮廓 | CssColor |

--------------------------------

### <div id="tip">Tip:{}</div> 

| 名称      | 说明     | 类型        |
| :-------- | :------- | :---------- |
| show      | 是否展示 | number      |
| content   | 内容     | HtmlString  |
| style     | 样式     | {key:value} |
| className | 外层类名 | string      |

--------------------------------


### <div id="menu">Menu:{}</div> 

| 名称      | 说明     | 类型                             |
| :-------- | :------- | :------------------------------- |
| show      | 是否展示 | number                           |
| style     | 样式     | {key:value}                      |
| className | 外层类名 | string                           |
| menuItems | 右键菜单 | Array<{text:string,type:string}> |
| onSelect  | 选中回调 | function(type,Entity)            |


--------------------------------

### 天气
| 方法名       | 说明     | 类型                                         |
| :----------- | :------- | :------------------------------------------- |
| setWeather   | 设置天气 | (wether:'rain' \| 'snow' \| 'fog'  ) => void |
| clearWeather | 关闭天气 |                                              |