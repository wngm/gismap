
function formatDate() {

}


// Cartesian 转 经纬度坐标
function getPositionByCartesian(Cartesian3) {
    const { viewer, Cesium } = this

    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartesian3 = new Cesium.cartesian3(x, y, z);
    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
    var latitude = Cesium.Math.toDegrees(cartograhphic.latitude);

    var longitude = Cesium.Math.toDegrees(cartograhpinc.longitude);

    var height = cartographic.height;

    return {
        longitude,
        latitude,
        height
    }
}


export default {
    getPositionByCartesian
}