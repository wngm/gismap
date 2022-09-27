import { BillboardGraphics, LabelGraphics, Viewer, PrimitiveCollection, Entity } from 'cesium'
import EventEmitter from "eventemitter3"

export interface LayerProp {
  // 图层名
  layer: string
  // children 图层下的元素集id
  children: Array<{ id: string }>
  // 图层下元素数量
  length: number
}

export interface DrawEntity {
  longitude?: number
  latitude?: number
  height?: number
  type?: string
  id: string,
  entity: Entity
}

export interface PaintEntity {
  id: string,
  entity: Entity,
  positions?: [],
  // 中心点 [longitude,latitude]
  center?: [number, number]
  // 半径长度
  radius?: number,
}
// id参数 Fun
export interface IfnId {
  (id: stirng): void
}

export interface AreaEvent {
  event: EventEmitter
  add: IfnId
  remove: IfnId
  addArea: IfnId
  remove: IfnId
  [key: string]: any
}

export interface IPosition {
  longitude?: number
  latitude?: number
  height?: number
  heading?: number
  pitch?: number
  roll?: number
}

declare type CssColor = String
declare interface IKeyValue {
  [key: string]: any
}

type Placement = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
export interface Tip {
  show?: boolean
  placement?: Placement
  mode?: 'table' | 'html'
  content: {
    title?: string
    items?: { key: string, value: string }[]
    htmlContent?: string
  }
  style?: {}
  className?: string
}

export interface CircleProps extends IPoint {
  radius: number // meter
}
export interface EllipseProps extends IPoint {
  semiMinorAxis: number // meter
  semiMajorAxis: number // meter
}
export interface RectProps extends IPoint {
  coordinates: [
    [number, number],
    [number, number]
  ]
}
export interface RadarProps {
  longitude: number
  latitude: number
  r: number
  scanColor: any
  interval: number
}
export interface PolygonProps extends IPoint {
  coordinates: [number, number, number][]
}

export interface MenuItem {
  text: string
  type: string
  icon?: string
}

export interface Menu {
  show?: boolean
  menuItems: MenuItem[]
  style?: {}
  className?: string
  onSelect?(key: string, entity?: Entity): void
}
export interface IPoint extends IPosition {
  //类型
  type?: string

  // uid
  key?: string
  name?: string
  // 点大小
  pixelSize?: number
  color?: string
  // 标签
  label?: LabelGraphics.ConstructorOptions | { fillColor?: string }
  // 提示信息
  tip?: Tip
  menu?: Menu
  highlight?: boolean
  isHighlight?: boolean
  showDefaultMenu?: boolean
  highlightColor?: string
  [key: string]: any
}
export interface ITimePoint extends IPoint {
  time?: string
}

export interface ImgPoint extends IPoint {
  imgOptions: BillboardGraphics.ConstructorOptions
}

type lineType = 'normal' | 'animate'
export interface ILineOPtions {
  lineType?: lineType
  tip?: Tip
  menu?: Menu
}
// 圆柱形
export interface CylinderProps {
  longitude: number
  latitude: number
  height: number
  color: string
  [key: string]: any
}

// 圆锥形
export interface CylinderWaveProps {
  longitude: number
  latitude: number
  height: number
  color: string
  count: number
  [key: string]: any
}

type weather = 'rain ' | 'snow' | 'fog'


export interface PaintCallback {
  (paint: PaintEntity): void;
}
export interface PositionEvent {
  (position: IPosition): void;
}

enum PathModeKey {
  'show' = '显示',
  'none' = '隐藏',
  'trail' = '线索',
  'lead' = '燃尽',
}

type PathMode = keyof typeof PathModeKey;



declare class GisMap {
  static Cesium: Cesium
  static version: string
  constructor(dom: any, options?: any)
  viewer: Viewer
  primitives: PrimitiveCollection
  // 事件中心 事件名称 ['click'|'dbClick','contextmenu','moveIn','moveOut']
  event: EventEmitter
  // 设置摄像机视角
  setView(data: IPosition): void
  setDefaultPosition(data: IPosition): void
  zoomIn(scale?: number): number
  zoomOut(scale?: number): number
  setSceneMode2D3D(mode?: 2 | 3): (2 | 3)
  drawPoint(data: IPoint): DrawEntity
  drawMarkerPoint(data: IPoint): DrawEntity
  drawImgPoint(data: ImgPoint): DrawEntity
  drawFlashPoint(data: IPoint): DrawEntity
  drawFlashPointClock(data: IPoint): DrawEntity
  drawCircle(data: CircleProps): DrawEntity
  drawEllipse(data: EllipseProps): drawEllipse
  drawRect(data: RectProps): drawRect
  drawPolygon(data: RadarProps): drawPolygon
  addCircleScan(data: RadarProps)
  drawCylinder(data: CylinderProps)
  cylinderWave(data: CylinderWaveProps)
  drawCircleRadar(data: any)
  drawCircleRadarAngle(data: any)
  addRadarScan(data: PolygonProps)
  drawLine(points: number[][], options: IPoint): DrawEntity
  drawLineWithPoints(points: Array<number[] | IPoint>, options: IPoint): DrawEntity
  drawAnimateLine(point: IPoint[], options: ILineOPtions): DrawEntity
  setWeather(weather: weather): void
  clearWeather(): void
  setSky(urls: Array<string>): void
  clearSky(): void
  resetSky(): void
  canvas2image(type?: 'file' | 'base64' | 'img', width?: number, height?: number): any
  measureLine(): void
  measurePolygn(): void
  selectRect(): object
  selectCircle(): Object
  loadCzml(): object
  areaEvent(options?: any): AreaEvent
  addCameraEvent(event: string, callback: PositionEvent)
  removeCameraEvent(event: string, callback: PositionEvent)
  addMouseEvent(event: string, callback: PositionEvent)
  removeMouseEvent(event: string, callback: PositionEvent)
  remove(id: string): void
  removeAll(id?: string): void
  paintPoint(data: IPoint, callback?: () => {})
  paintFlashPoint(data: IPoint, callback?: () => {})
  paintImgPoint(data: ImgPoint, callback?: () => {})
  paintLine(data: IPoint, callback?: () => {})
  paintLineWithPoints(data: IPoint, callback?: () => {})
  paintRect(data: IPoint, callback?: PaintCallback)
  paintCircle(data: IPoint, callback?: PaintCallback)
  paintPolygon(data: IPoint, callback?: PaintCallback)
  clearLayer(layer: string): void
  //图像高质量模式
  hightQuality(): void
  // 图像低质量模式（效率优先）
  lowQuality(): void
  //图层管理
  getLayer(): LayerProp[]
  //获取layer下 元素id
  getLayerValues(layer: string): { id: string }[]
  // 隐藏图层 【mode 值为 '2d'时 特殊处理 2d 模式下展示】
  layerHide(layer: string, mode?: string): void
  // 显示图层 【mode 值为 '2d'时 特殊处理 2d 模式下展示】
  layerShow(layer: string, mode?: string): void
  // 移除图层
  layerRemove(layer: string): void
  // 高亮点 @params {cssSting} value 自定义颜色 
  highlightPoint(id, value?: string): void
  // 取消高亮
  unhighlightPoint(id: string, value?: string): void
  // 定时闪烁
  setPointFlash(id: string, time?: number)
  // 修改图标点 属性 values => ({image:string})
  setImgPoint(id: string, values: any)
  // 高亮线段 @params {cssSting} value 自定义颜色 
  highlightLine(id: string, value?: string): void
  // 取消高亮线
  unhighlightLine(id: string, value?: string): void
  // 线 增加点
  linePush(id: string, data: number[] | IPoint): void
  // 线 删除点
  lineSplice(id: string, startIndex: number, length: number): void
  // 路径回放 
  drawPathLine(data: ITimePoint[], options?: any): DrawEntity
  //路径回放动态插入点
  pathLinePush(id: string, value: ITimePoint)
  //路径回放 删除点
  pathLineDeletePoint(pathId: string, pointId: string)
  // 路径回放模式
  pathLineSetMode(pathId: string, mode: PathMode)
  // 路径回放设置图标
  pathLineSetBillboard(pathId: string, options: any)
  //对像获取点属性
  getPoint(entity: any): IPoint
  //cartesian3类型 对象转经纬度高
  getPositionByCartesian(cartesian3: any): IPosition
  //获取区域内元素 area 元素ID 或 entity 对象
  getDataInArea(area: Entity | string): DrawEntity[]
  // 地球自转开始
  globeRotateStart(speed?: number)
  // 地球自转停止
  globeRotateStop()
}

export default GisMap