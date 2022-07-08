function load (Cesium){
    class CircleWaveMaterialProperty {
        constructor(options) {
            options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = options.color;
            this.duration = Cesium.defaultValue(options.duration, 1e3);
            this.count = Cesium.defaultValue(options.count, 2);
            if (this.count <= 0) this.count = 1;
            this.gradient = Cesium.defaultValue(options.gradient, 0.1);
            if (this.gradient < 0) this.gradient = 0;
            else if (this.gradient > 1) this.gradient = 1;
            this._time = (new Date()).getTime();
        }
    }
    Object.defineProperties(CircleWaveMaterialProperty.prototype, {
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
    CircleWaveMaterialProperty.prototype.getType = function(time) {
        return Cesium.Material.CircleWaveMaterialType;
    }
    CircleWaveMaterialProperty.prototype.getValue = function(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        result.count = this.count;
        result.gradient = 1 + 10 * (1 - this.gradient);
        return result;
    }
    CircleWaveMaterialProperty.prototype.equals = function(other) {
        return this === other ||
            (other instanceof CircleWaveMaterialProperty &&
                Cesium.Property.equals(this._color, other._color))
    }
    Cesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial';
    
    Cesium.Material.CircleWaveSource = `czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        material.diffuse = 1.5 * color.rgb;
        vec2 st = materialInput.st;
        vec3 str = materialInput.str;
        float dis = distance(st, vec2(0.5, 0.5));
        float per = fract(time);
        if (abs(str.z) > 0.001) {
          discard;
        }
        if (dis > 0.5) {
          discard;
        } else {
          float perDis = 0.5 / count;
          float disNum;
          float bl = .0;
          for (int i = 0; i <= 6; i++) {
            if (float(i) <= count) {
              disNum = perDis *float(i) - dis + per / count;
              if (disNum > 0.0) {
                if (disNum < perDis) {
                  bl = 1.0 - disNum / perDis;
                } else if(disNum - perDis < perDis) {
                  bl = 1.0 - abs(1.0 - disNum / perDis);
                }
                material.alpha = pow(bl, 2.0);
              }
            }
          }
        }
        material.shininess = 0.0;
        material.specular = 0.0;
        return material;
      }`;
    
    
    Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleWaveMaterialType, {
        fabric: {
            type: Cesium.Material.CircleWaveMaterialType,
                uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
                time: 1,
                count: 1,
                gradient: 0.1
            },
            source: Cesium.Material.CircleWaveSource
        },
        translucent: function(material) {
            return !0;
        }
    });
    
    Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty;


    // 2


  class RadarMaterialProperty {
      constructor(options) {
          options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
          this._definitionChanged = new Cesium.Event();
          this._color = undefined;
          this._colorSubscription = undefined;
          this.color = options.color;
          this.duration = Cesium.defaultValue(options.duration, 2e3);
          this.count = Cesium.defaultValue(options.count, 2);
          if (this.count <= 0) this.count = 1;
          this.gradient = Cesium.defaultValue(options.gradient, 0.1);
          if (this.gradient < 0) this.gradient = 0;
          else if (this.gradient > 1) this.gradient = 1;
          this._time = (new Date()).getTime();
      }
  }
  Object.defineProperties(RadarMaterialProperty.prototype, {
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
  RadarMaterialProperty.prototype.getType = function(time) {
      return Cesium.Material.RadarMaterialType;
  }
  RadarMaterialProperty.prototype.getValue = function(time, result) {
      if (!Cesium.defined(result)) {
          result = {};
      }
      result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
      result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
      result.count = this.count;
      result.pi = Math.PI;
      result.gradient = 1 + 10 * (1 - this.gradient);
      return result;
  }
  RadarMaterialProperty.prototype.equals = function(other) {
      return this === other ||
          (other instanceof RadarMaterialProperty &&
              Cesium.Property.equals(this._color, other._color))
  }
  Cesium.Material.RadarMaterialType = 'RadarMaterial';
  
  Cesium.Material.RadarSource = `czm_material czm_getMaterial(czm_materialInput materialInput) {
      czm_material material = czm_getDefaultMaterial(materialInput);
      material.diffuse = 1.0 * color.rgb;
      vec2 st = materialInput.st;
      vec3 str = materialInput.str;
      float dis = distance(st, vec2(0.5, 0.5));
      float per = fract(time);
      vec2 ang = st - vec2(0.5, 0.5);
      float vl = atan(ang.y, ang.x);
      float size = 2.0;
      float border = 0.015;
      float jd =  per * 2.0 * pi - pi;
      float dbjd = jd+pi+pi;
      if ( dis >= 0.5-border  && dis < 0.5) {
        material.alpha = 1.0;
      } else {
        material.alpha = 0.0;
        if(vl <= jd && vl >= (jd-size)) {
          float t = 1.0 - ((jd-vl) / size);
          material.alpha = pow(t,2.0);
        }

        if(jd < size - pi && vl >= dbjd - size){
          float tt = 1.0 - ((dbjd-vl) / size);
          material.alpha = pow(tt,2.0);
        }
      }
      material.shininess = 0.0;
      material.specular = 0.0;
      material.emission = vec3(0.2,0.2,0.2);
      return material;
    }`;
  
  
  Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarMaterialType, {
      fabric: {
          type: Cesium.Material.CircleWaveMaterialType,
              uniforms: {
              color: new Cesium.Color.fromCssColorString('#009900'),
              time: 1,
              count: 1,
              gradient: 0.1,
              pi:Math.PI
          },
          source: Cesium.Material.RadarSource
      },
      translucent: function(material) {
          return !0;
      }
  });
  Cesium.RadarMaterialProperty = RadarMaterialProperty;


  // 自定义角度
  class RadarAngleMaterialProperty {
    constructor(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = options.color;
        this.start =  Cesium.defaultValue(options.start, -Math.PI);
        this.end =  Cesium.defaultValue(options.end, Math.PI);
        this.duration = Cesium.defaultValue(options.duration, 2e3);
        this.count = Cesium.defaultValue(options.count, 2);
        if (this.count <= 0) this.count = 1;
        this.gradient = Cesium.defaultValue(options.gradient, 0.1);
        if (this.gradient < 0) this.gradient = 0;
        else if (this.gradient > 1) this.gradient = 1;
        this._time = (new Date()).getTime();
    }
}
Object.defineProperties(RadarAngleMaterialProperty.prototype, {
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
RadarAngleMaterialProperty.prototype.getType = function(time) {
    return Cesium.Material.RadarAngleMaterialType;
}
RadarAngleMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    result.count = this.count;
    result.pi = Math.PI;
    result.gradient = 1 + 10 * (1 - this.gradient);
    result.start=  this.start;
    result.end =   this.end;
    return result;
}
RadarAngleMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof RadarAngleMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.Material.RadarAngleMaterialType = 'RadarAngleMaterial';

Cesium.Material.RadarAngleSource = `czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = 1.0 * color.rgb;
    vec2 st = materialInput.st;
    vec3 str = materialInput.str;
    float dis = distance(st, vec2(0.5, 0.5));
    float per = fract(time);
    float border = 0.01;
    vec2 ang = st - vec2(0.5, 0.5);
    vec2 ang2 = st - vec2(0.5+border*1.1, 0.5);
    float vl = atan(ang.y, ang.x);
    float vl2 = atan(ang2.y, ang2.x);
    float angVal = abs(vl2-vl);
    float size = 2.0;
    float jd =  per * 2.0 * pi - pi;
    float dbjd = jd+pi+pi;
    if(vl >= start && vl <= end){
        if ( dis >= 0.5-border  && dis <= 0.5) {
            material.alpha = 1.0;
          } else {
            material.alpha = 0.0;
            if(vl <= jd && vl >= (jd-size)) {
              float t = 1.0 - ((jd-vl) / size);
              material.alpha = pow(t,2.0);
            }
      
            if(jd < size - pi && vl >= dbjd - size){
              float tt = 1.0 - ((dbjd-vl) / size);
              material.alpha = pow(tt,2.0);
            }
        }
        if(vl > start && vl < start+angVal){
            material.alpha = 1.0;
        }
        if(vl < end && vl > end - angVal){
            material.alpha = 1.0;
        }
    }else {
        material.alpha = 0.0;
    }
    material.shininess = 0.0;
    material.specular = 0.0;
    material.emission = vec3(0.2,0.2,0.2);
    return material;
  }`;


Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarAngleMaterialType, {
    fabric: {
        type: Cesium.Material.CircleWaveMaterialType,
            uniforms: {
            color: new Cesium.Color.fromCssColorString('#009900'),
            time: 1,
            count: 1,
            gradient: 0.1,
            pi:Math.PI,
            start: -Math.PI/4,
            end: Math.PI/4
        },
        source: Cesium.Material.RadarAngleSource
    },
    translucent: function(material) {
        return !0;
    }
});
Cesium.RadarAngleMaterialProperty = RadarAngleMaterialProperty;

}
export default load
