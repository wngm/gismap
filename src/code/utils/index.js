function computeCircle(radius, step = 15) {
  const positions = [];
  let i = 0;
  while (i < 360) {
    const radians = Cesium.Math.toRadians(i);
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians),
      ),
    );
    i += step;// 如果去掉管横截面就是圆，但是影响渲染
  }
  return positions;
}

export {
  computeCircle,
};
