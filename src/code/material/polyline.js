import dashImg from './image/dash3.png';
// import line from './image/line.png';
// import line2 from './image/line2.png';
// import line3 from './image/line3.png';

function run(Cesium) {
  function PolylineMp(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = new Date().getTime();
  }

  Object.defineProperties(PolylineMp.prototype, {
    isConstant: {
      get() {
        return false;
      },
    },
    definitionChanged: {
      get() {
        return this._definitionChanged;
      },
    },
    color: Cesium.createPropertyDescriptor('color'),
  });

  PolylineMp.prototype.getType = function (time) {
    return 'PolylineTrailLink';
  };

  PolylineMp.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
    );
    result.image = Cesium.Material.PolylineTrailLinkImage;
    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration;
    return result;
  };

  PolylineMp.prototype.equals = function (other) {
    return (
      this === other
      || (other instanceof PolylineMp
        && Cesium.Property.equals(this._color, other._color))
    );
  };

  Cesium.PolylineMp = PolylineMp;
  Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
  Cesium.Material.PolylineTrailLinkImage = dashImg;
  Cesium.Material.PolylineTrailLinkSource = ` czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = repeat * materialInput.st;
      vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
      material.alpha = colorImage.a;
      material.diffuse = color.rgb;
      return material;
  }`;
  Cesium.Material._materialCache.addMaterial(
    Cesium.Material.PolylineTrailLinkType,
    {
      fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
          image: Cesium.Material.PolylineTrailLinkImage,
          time: 20,
          repeat: {
            x: 10,
            y: 1,
          },
        },
        source: Cesium.Material.PolylineTrailLinkSource,
      },
      translucent(material) {
        return true;
      },
    },
  );
}

export default run;
