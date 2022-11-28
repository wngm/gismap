
import * as Cesium from 'cesium'

const mode2Option = {
    'show': {
        leadTime: undefined,
        trailTime: undefined,
    },
    'none': {
        leadTime: 0,
        trailTime: 0,
    },
    'trail': {
        leadTime: 0,
        trailTime: undefined,
    },
    'lead': {
        leadTime: undefined,
        trailTime: 0,
    },
}


function drawPathLine(points, options = {}) {
    const { viewer } = this

    const {
        mode = 'trail',
        color = window.Cesium.highlightColor,
        key,
        layer = 'default',
        billboard = {
            width: 30,
            height: 40,
            image: window.CESIUM_BASE_URL + "/images/img-point.png",
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            // eyeOffset: new Cesium.Cartesian3(0, 0, 10),
        },
        width = 1,
        showPoint
    } = options
    let pointsList = points.map((item) => {
        const {
            longitude,
            latitude,
            height = 0,
            time
        } = item
        if (!time) {
            throw new Error('drawPathLine data 缺少参数time')
        }
        let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
        let _time = Cesium.JulianDate.fromDate(new Date(time));
        return {
            position,
            time: _time
        }
    });
    var property = new Cesium.SampledPositionProperty();
    pointsList.forEach(i => {
        property.addSample(i.time, i.position);
    })
    let startTime = pointsList[0].time
    // let stopTime = pointsList[pointsList.length - 1].time
    let stopTime = new Cesium.JulianDate.fromDate(new Date())
    let _billboard = { ...billboard }
    // rotation 存在角度则跟随旋转
    if (billboard.rotation !== undefined) {
        _billboard.alignedAxis = new Cesium.VelocityVectorProperty(property, true)
    }
    let entityOptions = {
        ...options,
        id: key,
        layer: layer,
        sourceData: points,
        sourceType: 'pathLineByTime',
        sourceOptions: options,
        position: property,
        availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
                start: startTime,
                stop: stopTime,
                // isStopIncluded: false,
            }),
        ]),
        orientation: new Cesium.VelocityOrientationProperty(property),
        path: {
            // leadTime: 0,
            // trailTime: 0,
            ...mode2Option[mode],
            resolution: 100,
            width: width,
            // material: Cesium.PolylineDashMaterialProperty({
            //     color: Cesium.Color.fromCssColorString(color),
            //     gapColor: Cesium.Color.TRANSPARENT,
            //     dashLength: 1000
            // })
            material: Cesium.Color.fromCssColorString(color),
        },
        billboard: _billboard,

    }

    let entity = viewer.entities.add(entityOptions)

    if (showPoint) {
        points.forEach(p => {
            let _st = Cesium.JulianDate.fromDate(new Date(p.time))
            let availability = new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: _st,
                    stop: stopTime,
                    // isStopIncluded: false,
                }),
            ])
            if (p.imgOptions) {
                this.drawMarkerPoint({
                    parent: entity,
                    ...p,
                    availability
                })
            } else {
                // this.drawPoint({
                //     parent: entity,
                //     color,
                //     ...p,
                //     availability
                // })
                this.drawMarkerPoint({
                    parent: entity,
                    color,
                    ...p,
                    imgOptions: {
                        color: Cesium.Color.fromCssColorString(color),
                        image: window.CESIUM_BASE_URL + '/images/circle.svg'
                    },
                    availability
                })
            }

        })
    }
    return {
        id: entity._id,
        entity
    }

}

export default { drawPathLine }