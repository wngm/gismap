/*
 * @Author: R10
 * @Date: 2022-05-30 16:10:16
 * @LastEditTime: 2022-05-31 17:29:00
 * @LastEditors: R10
 * @Description: 
 * @FilePath: /gismap/src/code/gisMap.d.ts
 */
import { BillboardGraphics } from 'cesium'

interface IPosition {
    longitude: number
    latitude: number
    height?: number
}

declare type CssColor = String
declare interface IKeyValue {
    [key: string]: any
}
interface Label {
    show?: boolean
    text: string
    fillColor?: CssColor // 标签填充颜色
    outlineColor?: CssColor // 标签字体轮廓
}

interface Tip {
    show?: boolean
    content: string
    style?: {}
    className?: string
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
    label?: Label
    // 提示信息
    tip?: Tip
    menu?: Menu
    [key: string]: any
}

interface ImgPoint extends IPoint {
  billboard: BillboardGraphics.ConstructorOptions
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
    drawLine(start: IPoint, end: IPoint, options: ILineOPtions): void { }
    drawAnimateLine(start: IPoint, end: IPoint, options: ILineOPtions): void { }
    setWeather(weather: weather): void
    clearWeather(): void
    setSky(urls: Array<string>): void
    clearSky(): void
    resetSky(): void
    remove(id: string): void { }
}


export default GisMap