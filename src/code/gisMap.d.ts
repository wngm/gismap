declare interface IPosition {
    longitude: number
    latitude: number
    altitude: number
}
declare interface IKeyValue {
    [key: string]: any
}
interface IPoint extends IPosition {
    type?: string
    key: string
    name: string
    pixelSize?: number
    color?: string
    lbloutlineColor?: string
    lbllfillColor?: string
    tip?: Array<IKeyValue>
    [key: string]: any
}


class GisMap {
    cSetView(data: IPosition): void {

    }
    cSetDefaultPosition(data: IPosition): void {

    }
    cZoomIn(scale: number): scale {
        return scale
    }
    cZoomout(scale: number): scale {
        return scale
    }
    cSetsceneMode2D3D(mode: 2 | 3): void {

    }
    cDrawMpoint(data: IPoint)
}


export default GisMap