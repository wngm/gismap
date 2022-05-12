declare interface IPosition {
    longitude: number
    latitude: number
    altitude?: number
}

type CssColor = String
declare interface IKeyValue {
    [key: string]: any
}
interface IMenuItem {
    isShow: boolean
    content: [any, any]
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

interface tMenuItem {

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
    contextMenuItem: IMenuItem
    [key: string]: any
}

type weather = 'rain ' | 'snow' | 'fog'


class GisMap {
    cSetView(data: IPosition): void {

    }
    cSetDefaultPosition(data: IPosition): void {

    }
    cZoomIn(scale: number): scale {
    }
    cZoomout(scale: number): scale {
    }
    cSetsceneMode2D3D(mode: 2 | 3): void {

    }
    cDrawMpoint(data: IPoint)
    setWeather(weather: weather): void
    clearWeather(): void
}


export default GisMap