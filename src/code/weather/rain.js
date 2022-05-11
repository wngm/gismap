
import * as Cesium from "@modules/cesium/Source/Cesium";

class Rain {
    constructor(viewer){
        this.viewer = viewer
        // this.viewer = new Cesium.viewer()

    }
    init(){
        this.collecttion = this.viewer.scene.postProcessStages;
        this._rain= new Cesium.PostProcessStage({
            name:'rain',
            fragmentShader:this.getRain()
        })
        this.collecttion.add(this._rain)

        this.viewer.scene.fog.density = 0.001;
        this.viewer.scene.fog.minimumBrightness = 0.8;
    }
    getRain(){
        return `uniform sampler2D colorTexture;
        varying vec2 v_textureCoordinates;
   	 	float hash(float x){
   	 	     return fract(sin(x*133.3)*13.13);
   	 	}
   	 	void main(void){
   	 	     float time = czm_frameNumber / 60.0;
   	 	     vec2 resolution = czm_viewport.zw; 
   	 	     vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
   	 	     vec3 c=vec3(.6,.7,.8); 
   	 	     float a=-.4;
   	 	     float si=sin(a),co=cos(a);
   	 	     uv*=mat2(co,-si,si,co);
   	 	     uv*=length(uv+vec2(0,4.9))*.3+1.;
   	 	     float v=1.-sin(hash(floor(uv.x*100.))*2.);
   	 	     float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
   	 	     c*=v*b; 
   	 	     gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); 
   	 	}`
    }
    destroy(){
        this.viewer.scene.postProcessStages.remove(this._rain)
    }
}

export default Rain