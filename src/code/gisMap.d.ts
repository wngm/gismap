interface Ia { }
interface IPosition {
    longitude: number
    latitude: number
    altitude: umber
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
}


export default GisMap