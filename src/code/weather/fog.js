
import * as Cesium from "@modules/cesium/Source/Cesium";

class Fog {
    constructor(viewer){
        this.viewer = viewer
        // this.viewer = new Cesium.viewer()

    }
    init(){
        this.collecttion = this.viewer.scene.postProcessStages;
        this._fog= new Cesium.PostProcessStage({
            name:'fog',
            fragmentShader:this.getFog()
        })
        this.collecttion.add(this._fog)

        this.viewer.scene.fog.density = 0.001;
        this.viewer.scene.fog.minimumBrightness = 0.8;
    }
    getFog(){

        return `uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        varying vec2 v_textureCoordinates;
        void main(void){
            vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);
            vec4 fogcolor=vec4(0.8,0.8,0.8,0.5);
            float depth = czm_readDepth(depthTexture, v_textureCoordinates);
            vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);
            float f=(depthcolor.r-0.22);
            if(f<0.0) f=0.0;
            else if(f>1.0) f=1.0;
            gl_FragColor = mix(origcolor,fogcolor,f);
        }
        `

    }
    destory(){
        this.viewer.scene.postProcessStages.remove(this._fog)
    }
}

export default Fog