import { BillboardGraphics, LabelGraphics, Viewer, PrimitiveCollection, Entity } from 'cesium'
import EventEmitter from "eventemitter3"

interface LayerProp {
  // 图层名
  layer: string
  // children 图层下的元素集id
  children: Array<{ id: string }>
  // 图层下元素数量
  length: number
}

interface DrawEntity {
  longitude?: number
  latitude?: number
  height?: number
  id: string,
  entity: Entity
}
// id参数 Fun
interface IfnId {
  (id: stirng): void
}

interface AreaEvent {
  event: EventEmitter
  add: IfnId
  remove: IfnId
  addArea: IfnId
  remove: IfnId
  [key: string]: any
}

interface IPosition {
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

interface Tip {
  show?: boolean
  content: {
    title: string
    items: { key: string, value: string }[]
  }
  style?: {}
  className?: string
}

interface CircleProps extends IPoint {
  radius: number // meter
}
interface EllipseProps extends IPoint {
  semiMinorAxis: number // meter
  semiMajorAxis: number // meter
}
interface RectProps extends IPoint {
  coordinates: [
    [number, number],
    [number, number]
  ]
}
interface RadarProps {
  longitude: number
  latitude: number
  r: number
  scanColor: any
  interval: number
}
interface PolygonProps extends IPoint {
  coordinates: [number, number, number][]
}

interface MenuItem {
  text: string
  type: string
  icon?: string
}

interface Menu {
  show?: boolean
  menuItems: MenuItem[]
  style?: {}
  className?: string
  onSelect?(key: string, entity?: Entity): void
}
interface IPoint extends IPosition {
  //类型
  type?: string
  // uid
  key?: string
  name?: string
  // 点大小
  pixelSize?: number
  color?: string
  // 标签
  label?: LabelGraphics.ConstructorOptions
  // 提示信息
  tip?: Tip
  menu?: Menu
  highlight?: boolean
  isHighlight?: boolean
  showDefaultMenu?: boolean
  highlightColor?: string
  [key: string]: any
}

interface ImgPoint extends IPoint {
  imgOptions: BillboardGraphics.ConstructorOptions
}

type lineType = 'normal' | 'animate'
interface ILineOPtions {
  lineType?: lineType
  tip?: Tip
  menu?: Menu
}
// 圆柱形
interface CylinderProps {
  longitude: number
  latitude: number
  height: number
  color: string
  [key: string]: any
}

// 圆锥形
interface CylinderWaveProps {
  longitude: number
  latitude: number
  height: number
  color: string
  count: number
  [key: string]: any
}

type weather = 'rain ' | 'snow' | 'fog'


declare class GisMap {
  static Cesium: Cesium
  static version: string
  constructor(dom: any, options?: any)
  viewer: Viewer
  primitives: PrimitiveCollection
  // 事件中心 事件名称 ['click'|'dbClick','contextmenu']
  event: EventEmitter
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
  drawCircle(data: CircleProps)
  drawEllipse(data: EllipseProps)
  drawRect(data: RectProps)
  drawPolygon(data: RadarProps)
  addCircleScan(data: RadarProps)
  drawCylinder(data: CylinderProps)
  cylinderWave(data: CylinderWaveProps)
  drawCircleRadar(data: any)
  drawCircleRadarAngle(data: any)
  addRadarScan(data: PolygonProps)
  drawLine(points: number[][], options: IPoint): void
  drawLineWithPoints(points: Array<number[] | IPoint>, options: IPoint): void
  drawAnimateLine(point: IPoint[], options: ILineOPtions): void
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
  remove(id: string): void
  removeAll(id?: string): void
  paintPoint(data: IPoint, callback?: () => {})
  paintFlashPoint(data: IPoint, callback?: () => {})
  paintImgPoint(data: ImgPoint, callback?: () => {})
  paintLine(data: IPoint, callback?: () => {})
  paintLineWithPoints(data: IPoint, callback?: () => {})
  paintRect(data: IPoint, callback?: () => {})
  paintCircle(data: IPoint, callback?: () => {})
  paintPolygon(data: IPoint, callback?: () => {})
  clearLayer(layer: string): void
  //图像高质量模式
  hightQuality(): void
  // 图像低质量模式（效率优先）
  lowQuality(): void
  //图层管理
  getLayer(): LayerProp[]
  //获取layer下 元素id
  getLayerValues(layer: string): { id: string }[]
  // 隐藏图层
  layerHide(layer: string): void
  // 显示图层
  layerShow(layer: string): void
  // 移除图层
  layerRemove(layer: string): void
  // 高亮点 @params {cssSting} value 自定义颜色 
  highlightPoint(id, value?: string): void
  // 取消高亮
  unhighlightPoint(id, value?: string): void
  // 高亮线段 @params {cssSting} value 自定义颜色 
  highlightLine(id, value?: string): void
  // 取消高亮线
  unhighlightLine(id, value?: string): void
}

export default GisMap