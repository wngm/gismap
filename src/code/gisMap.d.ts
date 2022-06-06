import { BillboardGraphics, LabelGraphics } from 'cesium'

interface IPosition {
  longitude: number
  latitude: number
  height?: number
}

declare type CssColor = String
declare interface IKeyValue {
  [key: string]: any
}

interface Tip {
  show?: boolean
  content: string
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
  onSelect?: function (key): void
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


type weather = 'rain ' | 'snow' | 'fog'


class GisMap {
  constructor(dom: any) {

  }
  setView(data: IPosition): void {

  }
  setDefaultPosition(data: IPosition): void {
  }
  zoomIn(scale: number): scale {
  }
  zoomoOut(scale: number): scale {
  }
  setSceneMode2D3D(mode: 2 | 3): void { }
  drawPoint(data: IPoint)
  drawImgPoint(data: ImgPoint)
  drawCircle(data: CircleProps)
  drawEllipse(data: EllipseProps)
  drawRect(data: RectProps)
  drawPolygon(data: RadarProps)
  addCircleScan(data: RadarProps)
  addRadarScan(data: PolygonProps)
  drawLine(start: IPoint, end: IPoint, options: ILineOPtions): void { }
  drawAnimateLine(start: IPoint, end: IPoint, options: ILineOPtions): void { }
  setWeather(weather: weather): void
  clearWeather(): void
  setSky(urls: Array<string>): void
  clearSky(): void
  resetSky(): void
  canvas2image(type?: 'file' | 'base64' | 'img', width?: number, height?: number): any
  measureLine(): void
  measurePolygn(): void
  remove(id: string): void { }
  paintPoint(data: IPoint, callback: () => {})
  paintImgPoint(data: ImgPoint, callback: () => {})
}


export default GisMap