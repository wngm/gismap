
import * as Cesium from 'cesium'


function drawPathLine(points, options = {}) {
    const { viewer } = this

    const {
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

    let entityOptions = {
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
            leadTime: 0,
            // trailTime: 0,
            resolution: 100,
            width: 1,
            // material: Cesium.PolylineDashMaterialProperty({
            //     color: Cesium.Color.fromCssColorString(color),
            //     gapColor: Cesium.Color.TRANSPARENT,
            //     dashLength: 1000
            // })
            material: Cesium.Color.fromCssColorString(color),
        },
        billboard,

    }

    let entity = viewer.entities.add(entityOptions)

    if (showPoint) {
        points.forEach(p => {
            let _st = Cesium.JulianDate.fromDate(new Date(p.time))
            this.drawPoint({
                parent: entity,
                color,
                ...p,
                availability: new Cesium.TimeIntervalCollection([
                    new Cesium.TimeInterval({
                        start: _st,
                        stop: stopTime,
                        // isStopIncluded: false,
                    }),
                ])
            })
        })
    }
    return {
        id: entity._id,
        entity
    }

}

export default { drawPathLine }