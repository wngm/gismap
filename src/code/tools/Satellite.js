
import { twoline2satrec, gstime, sgp4, propagate, eciToEcf } from 'satellite.js';
import * as Cesium from 'cesium'

class Satellite {
    constructor() {
        console.log(Satellite, 111)
    }

    /**
    * 处理tle数据返回轨道坐标信息
    * @param tle1 第一根tle
    * @param tle2 第二根tle
    * @param startTime 场景开始时间
    * @param stopTime 场景结束时间
    * @param step 步长
    * @returns SampledPosition对象
    */
    static getTleSampledPosition(tle1, tle2, startTime, stopTime, step = 20) {
        const sampledPosition = new Cesium.SampledPositionProperty();
        const start = new Date(startTime);
        const stop = new Date(stopTime);
        const time = new Date(startTime)
        if (!tle1 || !tle2) return;
        const satrec = twoline2satrec(tle1, tle2);
        start.setTime(start.getTime() + step * 1000 * 0);
        let gmst = gstime(start);
        let long = (stop - start) / (step * 1000)
        for (let i = 0; i < long; i++) {
            // time.setTime(start.getTime() + step * 1000 * i);
            time.setTime(start.getTime() + 1000 * step * i);
            gmst = gstime(time);
            const position = this._read(satrec, time, gmst);
            sampledPosition.addSample(Cesium.JulianDate.fromDate(time), position);
        }
        this._setInterpolation(sampledPosition);
        return sampledPosition;
    }

    static _read(satrec, time, gmst) {
        const positionAndVelocity = propagate(satrec, time);
        const positionEci = positionAndVelocity.position;
        if (!positionEci) {
            console.error("获取位置错误")
            return;
        }
        const { x, y, z } = eciToEcf(positionEci, gmst);
        const position = Cesium.Cartesian3.fromElements(
            x * 1000,
            y * 1000,
            z * 1000
        );
        return position;
    }

    /**
     *插值算法：拉格朗日插值
     */
    static _setInterpolation(position) {
        const interpolationOptions = {
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        };
        position.setInterpolationOptions(interpolationOptions);
    }

    /**
    * 根据tle数据返回轨道线信息
    * @param tle1 第一根tle
    * @param tle2 第二根tle
    * @param startTime 场景开始时间
    * @param stopTime 场景结束时间
    * @param step 步长
    * @returns SampledPosition对象
    */
    static getPassLineFormTle(tle1, tle2, startTime, stopTime, step = 10, gisMap) {
        const start = new Date(startTime);
        const stop = new Date(stopTime);
        const time = new Date(startTime)
        const satrec = twoline2satrec(tle1, tle2);
        const sampledPosition = new Cesium.SampledPositionProperty();
        const positionList = []
        let s = propagate(satrec, start);
        let long = (stop - start) / (step * 1000)
        for (let i = 0; i < long; i++) {
            time.setTime(start.getTime() + step * 1000 * i);
            let gmst = gstime(time);
            let positionAndVelocity = propagate(satrec, time);
            let position = positionAndVelocity.position
            if (!position) {
                console.error("获取位置错误")
                return;
            }
            const { x, y, z } = eciToEcf(position, gmst);
            const cPosition = Cesium.Cartesian3.fromElements(x * 1000, y * 1000, z * 1000)
            sampledPosition.addSample(Cesium.JulianDate.fromDate(time), cPosition);

            positionList.push({ position: cPosition, startTime: start, endTime: stop })

        }
        return {
            sampledPosition,
            positionList
        }
    }

    static drawPath(startTime, endTime, position) {
        let obj = {
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: Cesium.JulianDate.fromDate(startTime),
                    stop: Cesium.JulianDate.fromDate(endTime)
                })
            ]),
            position,
            orientation: new Cesium.VelocityOrientationProperty(position),
            path: {
                // leadTime: 0,
                resolution: 1,
                material: Cesium.Color.LIGHTGREEN,
                with: 5
            }
        }

        return new Cesium.Entity(obj)

    }
    static bindEntity2Position(entity, _position, startTime, stopTime, gisMap) {
        let step = 10;
        const { ellipsoid } = gisMap.viewer.scene.globe
        const start = new Date(startTime);
        const stop = new Date(stopTime);
        const time = new Date(startTime)
        let long = (stop - start) / (step * 1000)
        let property = new Cesium.SampledPositionProperty();
        let property2 = new Cesium.SampledProperty(Number);
        for (var i = 0; i < long; i++) {
            time.setTime(start.getTime() + step * 1000 * i);
            let _time = Cesium.JulianDate.fromDate(time)
            var position = _position.getValue(_time);
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude),
                lng = Cesium.Math.toDegrees(cartographic.longitude),
                hei = cartographic.height / 2;
            property.addSample(_time, Cesium.Cartesian3.fromDegrees(lng, lat, hei));
            property2.addSample(_time, hei * 2);

        }

        const interpolationOptions = {
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        };
        property.setInterpolationOptions(interpolationOptions)
        entity.position = property;
        entity.cylinder.length = property2;
        entity.cylinder.length.setInterpolationOptions({
            interpolationDegree: 1,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });
    }

}


export default Satellite