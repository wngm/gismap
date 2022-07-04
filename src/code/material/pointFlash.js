function load (Cesium){
  class PointFlashMaterialProperty {
      constructor(options) {
          options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
          this._definitionChanged = new Cesium.Event();
          this._color = undefined;
          this._colorSubscription = undefined;
          this.color = options.color;
          this.duration = Cesium.defaultValue(options.duration, 1e3);
          this.count = Cesium.defaultValue(options.count, 2);
          this.flashTime =Cesium.defaultValue(options.flashTime, 5000);
          if (this.count <= 0) this.count = 1;
          this.gradient = Cesium.defaultValue(options.gradient, 0.1);
          if (this.gradient < 0) this.gradient = 0;
          else if (this.gradient > 1) this.gradient = 1;
          this._time = (new Date()).getTime();
      }
  }
  Object.defineProperties(PointFlashMaterialProperty.prototype, {
      isConstant: {
          get: function() {
              return false;
          }
      },
      definitionChanged: {
          get: function() {
              return this._definitionChanged;  
          }
      },
        color: Cesium.createPropertyDescriptor('color')
  });
  PointFlashMaterialProperty.prototype.getType = function(time) {
      return Cesium.Material.PointFlashType;
  }
  PointFlashMaterialProperty.prototype.getValue = function(time, result) {
      if (!Cesium.defined(result)) {
          result = {};
      }
      result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
      let nDate = new Date()
      if( this.flashTime >=0 && this.flashTime > 0 && nDate.getTime()-this._time > this.flashTime){
        result.time =0.999
      }else{
        result.time = ((nDate.getTime() - this._time) % this.duration) / this.duration;
      }
      result.count = this.count;
      result.gradient = 1 + 10 * (1 - this.gradient);
      return result;
  }
  PointFlashMaterialProperty.prototype.equals = function(other) {
      return this === other ||
          (other instanceof PointFlashMaterialProperty &&
              Cesium.Property.equals(this._color, other._color))
  }
  Cesium.Material.PointFlashType = 'PointFlash';
  
  Cesium.Material.CircleWaveSource = `czm_material czm_getMaterial(czm_materialInput materialInput) {
      czm_material material = czm_getDefaultMaterial(materialInput);
      material.diffuse = 1.5 * color.rgb;
      float per = fract(time);
      if(per>0.5){
        material.alpha = 1.0;
      }else{
        material.alpha = 0.1;
      }      
      return material;
    }`;
  
  
  Cesium.Material._materialCache.addMaterial(Cesium.Material.PointFlashType, {
      fabric: {
          type: Cesium.Material.PointFlashType,
              uniforms: {
              color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
              time: 1,
              count: 6,
              gradient: 0.1
          },
          source: Cesium.Material.CircleWaveSource
      },
      translucent: function(material) {
          return !0;
      }
  });
  
  Cesium.PointFlashMaterialProperty = PointFlashMaterialProperty;

}
export default load
