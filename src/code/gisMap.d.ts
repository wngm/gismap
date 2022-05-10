declare interface IPosition {
    longitude: number
    latitude: number
    altitude?: number
}
declare interface IKeyValue {
    [key: string]: any
}
interface IMenuItem {
    isShow: boolean
    content: [any, any]
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
    // 标签字体轮廓
    lbloutlineColor?: string
    // 标签字体
    lbllfillColor?: string
    // 提示信息
    tip?: Array<IKeyValue>
    contextMenuItem: IMenuItem
    isShowLabel?: boolean
    [key: string]: any
}


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
}


export default GisMap