import { BillboardGraphics, LabelGraphics } from 'cesium'

interface IPosition {
  longitude: number
  latitude: number
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
    items: {key: string, value:string}[]
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
}

interface Menu {
  show?: boolean
  menuItems: MenuItem[]
  style?: {}
  className?: string
  onSelect?(key: string): void
}
interface IPoint extends IPosition {
  //类型
  type?: string
  // uid
  key: string
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
  constructor(dom: any, options?: any)
  setView(data: IPosition): void
  setDefaultPosition(data: IPosition): void
  zoomIn(scale: number): number
  zoomoOut(scale: number): number
  setSceneMode2D3D(mode: 2 | 3): void
  drawPoint(data: IPoint)
  drawMarkerPoint(data: IPoint)
  drawImgPoint(data: ImgPoint)
  drawFlashPoint(data: IPoint)
  drawFlashPointClock(data: IPoint)
  drawCircle(data: CircleProps)
  drawEllipse(data: EllipseProps)
  drawRect(data: RectProps)
  drawPolygon(data: RadarProps)
  addCircleScan(data: RadarProps)
  drawCylinder(data: CylinderProps)
  cylinderWave(data: CylinderWaveProps)
  addRadarScan(data: PolygonProps)
  drawLine(points: number[][], options: IPoint): void
  drawLineWithPoints(points: number[][], options: IPoint): void
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
  selectCircle(): object
  loadCzml(): object
  areaEvent(): object
  remove(id: string): void
  removeAll(id: string): void
  paintPoint(data: IPoint, callback: () => {})
  paintFlashPoint(data: IPoint, callback: () => {})
  paintImgPoint(data: ImgPoint, callback: () => {})
  paintLine(data: IPoint, callback: () => {})
  paintLineWithPoints(data: IPoint, callback: () => {})
  paintRect(data: IPoint, callback: () => {})
  paintCircle(data: IPoint, callback: () => {})
  paintPolygon(data: IPoint, callback: () => {})
  clearLayer(layer: string): void
}


export default GisMap