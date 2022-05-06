define(["exports","./RuntimeError-8952249c","./defaultValue-81eec7ed","./WebGLConstants-508b9636"],(function(e,r,t,n){"use strict";var i=function(e){null==e&&(e=(new Date).getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,e.constructor==Array?this.init_by_array(e,e.length):this.init_seed(e)};i.prototype.init_seed=function(e){for(this.mt[0]=e>>>0,this.mti=1;this.mti<this.N;this.mti++)e=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&e)>>>16)<<16)+1812433253*(65535&e)+this.mti,this.mt[this.mti]>>>=0},i.prototype.init_by_array=function(e,r){var t,n,i;for(this.init_seed(19650218),t=1,n=0,i=this.N>r?this.N:r;i;i--){var o=this.mt[t-1]^this.mt[t-1]>>>30;this.mt[t]=(this.mt[t]^(1664525*((4294901760&o)>>>16)<<16)+1664525*(65535&o))+e[n]+n,this.mt[t]>>>=0,n++,++t>=this.N&&(this.mt[0]=this.mt[this.N-1],t=1),n>=r&&(n=0)}for(i=this.N-1;i;i--)o=this.mt[t-1]^this.mt[t-1]>>>30,this.mt[t]=(this.mt[t]^(1566083941*((4294901760&o)>>>16)<<16)+1566083941*(65535&o))-t,this.mt[t]>>>=0,++t>=this.N&&(this.mt[0]=this.mt[this.N-1],t=1);this.mt[0]=2147483648},i.prototype.random_int=function(){var e,r=new Array(0,this.MATRIX_A);if(this.mti>=this.N){var t;for(this.mti==this.N+1&&this.init_seed(5489),t=0;t<this.N-this.M;t++)e=this.mt[t]&this.UPPER_MASK|this.mt[t+1]&this.LOWER_MASK,this.mt[t]=this.mt[t+this.M]^e>>>1^r[1&e];for(;t<this.N-1;t++)e=this.mt[t]&this.UPPER_MASK|this.mt[t+1]&this.LOWER_MASK,this.mt[t]=this.mt[t+(this.M-this.N)]^e>>>1^r[1&e];e=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^e>>>1^r[1&e],this.mti=0}return e=this.mt[this.mti++],e^=e>>>11,e^=e<<7&2636928640,e^=e<<15&4022730752,(e^=e>>>18)>>>0},i.prototype.random_int31=function(){return this.random_int()>>>1},i.prototype.random_incl=function(){return this.random_int()*(1/4294967295)},i.prototype.random=function(){return this.random_int()*(1/4294967296)},i.prototype.random_excl=function(){return(this.random_int()+.5)*(1/4294967296)},i.prototype.random_long=function(){return(67108864*(this.random_int()>>>5)+(this.random_int()>>>6))*(1/9007199254740992)};var o=i;const a={EPSILON1:.1,EPSILON2:.01,EPSILON3:.001,EPSILON4:1e-4,EPSILON5:1e-5,EPSILON6:1e-6,EPSILON7:1e-7,EPSILON8:1e-8,EPSILON9:1e-9,EPSILON10:1e-10,EPSILON11:1e-11,EPSILON12:1e-12,EPSILON13:1e-13,EPSILON14:1e-14,EPSILON15:1e-15,EPSILON16:1e-16,EPSILON17:1e-17,EPSILON18:1e-18,EPSILON19:1e-19,EPSILON20:1e-20,EPSILON21:1e-21,GRAVITATIONALPARAMETER:3986004418e5,SOLAR_RADIUS:6955e5,LUNAR_RADIUS:1737400,SIXTY_FOUR_KILOBYTES:65536,FOUR_GIGABYTES:4294967296};a.sign=t.defaultValue(Math.sign,(function(e){return 0==(e=+e)||e!=e?e:e>0?1:-1})),a.signNotZero=function(e){return e<0?-1:1},a.toSNorm=function(e,r){return r=t.defaultValue(r,255),Math.round((.5*a.clamp(e,-1,1)+.5)*r)},a.fromSNorm=function(e,r){return r=t.defaultValue(r,255),a.clamp(e,0,r)/r*2-1},a.normalize=function(e,r,t){return 0===(t=Math.max(t-r,0))?0:a.clamp((e-r)/t,0,1)},a.sinh=t.defaultValue(Math.sinh,(function(e){return(Math.exp(e)-Math.exp(-e))/2})),a.cosh=t.defaultValue(Math.cosh,(function(e){return(Math.exp(e)+Math.exp(-e))/2})),a.lerp=function(e,r,t){return(1-t)*e+t*r},a.PI=Math.PI,a.ONE_OVER_PI=1/Math.PI,a.PI_OVER_TWO=Math.PI/2,a.PI_OVER_THREE=Math.PI/3,a.PI_OVER_FOUR=Math.PI/4,a.PI_OVER_SIX=Math.PI/6,a.THREE_PI_OVER_TWO=3*Math.PI/2,a.TWO_PI=2*Math.PI,a.ONE_OVER_TWO_PI=1/(2*Math.PI),a.RADIANS_PER_DEGREE=Math.PI/180,a.DEGREES_PER_RADIAN=180/Math.PI,a.RADIANS_PER_ARCSECOND=a.RADIANS_PER_DEGREE/3600,a.toRadians=function(e){if(!t.defined(e))throw new r.DeveloperError("degrees is required.");return e*a.RADIANS_PER_DEGREE},a.toDegrees=function(e){if(!t.defined(e))throw new r.DeveloperError("radians is required.");return e*a.DEGREES_PER_RADIAN},a.convertLongitudeRange=function(e){if(!t.defined(e))throw new r.DeveloperError("angle is required.");const n=a.TWO_PI,i=e-Math.floor(e/n)*n;return i<-Math.PI?i+n:i>=Math.PI?i-n:i},a.clampToLatitudeRange=function(e){if(!t.defined(e))throw new r.DeveloperError("angle is required.");return a.clamp(e,-1*a.PI_OVER_TWO,a.PI_OVER_TWO)},a.negativePiToPi=function(e){if(!t.defined(e))throw new r.DeveloperError("angle is required.");return e>=-a.PI&&e<=a.PI?e:a.zeroToTwoPi(e+a.PI)-a.PI},a.zeroToTwoPi=function(e){if(!t.defined(e))throw new r.DeveloperError("angle is required.");if(e>=0&&e<=a.TWO_PI)return e;const n=a.mod(e,a.TWO_PI);return Math.abs(n)<a.EPSILON14&&Math.abs(e)>a.EPSILON14?a.TWO_PI:n},a.mod=function(e,n){if(!t.defined(e))throw new r.DeveloperError("m is required.");if(!t.defined(n))throw new r.DeveloperError("n is required.");if(0===n)throw new r.DeveloperError("divisor cannot be 0.");return a.sign(e)===a.sign(n)&&Math.abs(e)<Math.abs(n)?e:(e%n+n)%n},a.equalsEpsilon=function(e,n,i,o){if(!t.defined(e))throw new r.DeveloperError("left is required.");if(!t.defined(n))throw new r.DeveloperError("right is required.");i=t.defaultValue(i,0),o=t.defaultValue(o,i);const a=Math.abs(e-n);return a<=o||a<=i*Math.max(Math.abs(e),Math.abs(n))},a.lessThan=function(e,n,i){if(!t.defined(e))throw new r.DeveloperError("first is required.");if(!t.defined(n))throw new r.DeveloperError("second is required.");if(!t.defined(i))throw new r.DeveloperError("absoluteEpsilon is required.");return e-n<-i},a.lessThanOrEquals=function(e,n,i){if(!t.defined(e))throw new r.DeveloperError("first is required.");if(!t.defined(n))throw new r.DeveloperError("second is required.");if(!t.defined(i))throw new r.DeveloperError("absoluteEpsilon is required.");return e-n<i},a.greaterThan=function(e,n,i){if(!t.defined(e))throw new r.DeveloperError("first is required.");if(!t.defined(n))throw new r.DeveloperError("second is required.");if(!t.defined(i))throw new r.DeveloperError("absoluteEpsilon is required.");return e-n>i},a.greaterThanOrEquals=function(e,n,i){if(!t.defined(e))throw new r.DeveloperError("first is required.");if(!t.defined(n))throw new r.DeveloperError("second is required.");if(!t.defined(i))throw new r.DeveloperError("absoluteEpsilon is required.");return e-n>-i};const s=[1];a.factorial=function(e){if("number"!=typeof e||e<0)throw new r.DeveloperError("A number greater than or equal to 0 is required.");const t=s.length;if(e>=t){let r=s[t-1];for(let n=t;n<=e;n++){const e=r*n;s.push(e),r=e}}return s[e]},a.incrementWrap=function(e,n,i){if(i=t.defaultValue(i,0),!t.defined(e))throw new r.DeveloperError("n is required.");if(n<=i)throw new r.DeveloperError("maximumValue must be greater than minimumValue.");return++e>n&&(e=i),e},a.isPowerOfTwo=function(e){if("number"!=typeof e||e<0||e>4294967295)throw new r.DeveloperError("A number between 0 and (2^32)-1 is required.");return 0!==e&&0==(e&e-1)},a.nextPowerOfTwo=function(e){if("number"!=typeof e||e<0||e>2147483648)throw new r.DeveloperError("A number between 0 and 2^31 is required.");return--e,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,++e},a.previousPowerOfTwo=function(e){if("number"!=typeof e||e<0||e>4294967295)throw new r.DeveloperError("A number between 0 and (2^32)-1 is required.");return e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,((e|=e>>32)>>>0)-(e>>>1)},a.clamp=function(e,t,n){return r.Check.typeOf.number("value",e),r.Check.typeOf.number("min",t),r.Check.typeOf.number("max",n),e<t?t:e>n?n:e};let u=new o;a.setRandomNumberSeed=function(e){if(!t.defined(e))throw new r.DeveloperError("seed is required.");u=new o(e)},a.nextRandomNumber=function(){return u.random()},a.randomBetween=function(e,r){return a.nextRandomNumber()*(r-e)+e},a.acosClamped=function(e){if(!t.defined(e))throw new r.DeveloperError("value is required.");return Math.acos(a.clamp(e,-1,1))},a.asinClamped=function(e){if(!t.defined(e))throw new r.DeveloperError("value is required.");return Math.asin(a.clamp(e,-1,1))},a.chordLength=function(e,n){if(!t.defined(e))throw new r.DeveloperError("angle is required.");if(!t.defined(n))throw new r.DeveloperError("radius is required.");return 2*n*Math.sin(.5*e)},a.logBase=function(e,n){if(!t.defined(e))throw new r.DeveloperError("number is required.");if(!t.defined(n))throw new r.DeveloperError("base is required.");return Math.log(e)/Math.log(n)},a.cbrt=t.defaultValue(Math.cbrt,(function(e){const r=Math.pow(Math.abs(e),1/3);return e<0?-r:r})),a.log2=t.defaultValue(Math.log2,(function(e){return Math.log(e)*Math.LOG2E})),a.fog=function(e,r){const t=e*r;return 1-Math.exp(-t*t)},a.fastApproximateAtan=function(e){return r.Check.typeOf.number("x",e),e*(-.1784*Math.abs(e)-.0663*e*e+1.0301)},a.fastApproximateAtan2=function(e,t){let n;r.Check.typeOf.number("x",e),r.Check.typeOf.number("y",t);let i=Math.abs(e);n=Math.abs(t);const o=Math.max(i,n);n=Math.min(i,n);const s=n/o;if(isNaN(s))throw new r.DeveloperError("either x or y must be nonzero");return i=a.fastApproximateAtan(s),i=Math.abs(t)>Math.abs(e)?a.PI_OVER_TWO-i:i,i=e<0?a.PI-i:i,i=t<0?-i:i,i};const E={BYTE:n.WebGLConstants.BYTE,UNSIGNED_BYTE:n.WebGLConstants.UNSIGNED_BYTE,SHORT:n.WebGLConstants.SHORT,UNSIGNED_SHORT:n.WebGLConstants.UNSIGNED_SHORT,INT:n.WebGLConstants.INT,UNSIGNED_INT:n.WebGLConstants.UNSIGNED_INT,FLOAT:n.WebGLConstants.FLOAT,DOUBLE:n.WebGLConstants.DOUBLE,getSizeInBytes:function(e){if(!t.defined(e))throw new r.DeveloperError("value is required.");switch(e){case E.BYTE:return Int8Array.BYTES_PER_ELEMENT;case E.UNSIGNED_BYTE:return Uint8Array.BYTES_PER_ELEMENT;case E.SHORT:return Int16Array.BYTES_PER_ELEMENT;case E.UNSIGNED_SHORT:return Uint16Array.BYTES_PER_ELEMENT;case E.INT:return Int32Array.BYTES_PER_ELEMENT;case E.UNSIGNED_INT:return Uint32Array.BYTES_PER_ELEMENT;case E.FLOAT:return Float32Array.BYTES_PER_ELEMENT;case E.DOUBLE:return Float64Array.BYTES_PER_ELEMENT;default:throw new r.DeveloperError("componentDatatype is not a valid value.")}},fromTypedArray:function(e){return e instanceof Int8Array?E.BYTE:e instanceof Uint8Array?E.UNSIGNED_BYTE:e instanceof Int16Array?E.SHORT:e instanceof Uint16Array?E.UNSIGNED_SHORT:e instanceof Int32Array?E.INT:e instanceof Uint32Array?E.UNSIGNED_INT:e instanceof Float32Array?E.FLOAT:e instanceof Float64Array?E.DOUBLE:void 0},validate:function(e){return t.defined(e)&&(e===E.BYTE||e===E.UNSIGNED_BYTE||e===E.SHORT||e===E.UNSIGNED_SHORT||e===E.INT||e===E.UNSIGNED_INT||e===E.FLOAT||e===E.DOUBLE)},createTypedArray:function(e,n){if(!t.defined(e))throw new r.DeveloperError("componentDatatype is required.");if(!t.defined(n))throw new r.DeveloperError("valuesOrLength is required.");switch(e){case E.BYTE:return new Int8Array(n);case E.UNSIGNED_BYTE:return new Uint8Array(n);case E.SHORT:return new Int16Array(n);case E.UNSIGNED_SHORT:return new Uint16Array(n);case E.INT:return new Int32Array(n);case E.UNSIGNED_INT:return new Uint32Array(n);case E.FLOAT:return new Float32Array(n);case E.DOUBLE:return new Float64Array(n);default:throw new r.DeveloperError("componentDatatype is not a valid value.")}},createArrayBufferView:function(e,n,i,o){if(!t.defined(e))throw new r.DeveloperError("componentDatatype is required.");if(!t.defined(n))throw new r.DeveloperError("buffer is required.");switch(i=t.defaultValue(i,0),o=t.defaultValue(o,(n.byteLength-i)/E.getSizeInBytes(e)),e){case E.BYTE:return new Int8Array(n,i,o);case E.UNSIGNED_BYTE:return new Uint8Array(n,i,o);case E.SHORT:return new Int16Array(n,i,o);case E.UNSIGNED_SHORT:return new Uint16Array(n,i,o);case E.INT:return new Int32Array(n,i,o);case E.UNSIGNED_INT:return new Uint32Array(n,i,o);case E.FLOAT:return new Float32Array(n,i,o);case E.DOUBLE:return new Float64Array(n,i,o);default:throw new r.DeveloperError("componentDatatype is not a valid value.")}},fromName:function(e){switch(e){case"BYTE":return E.BYTE;case"UNSIGNED_BYTE":return E.UNSIGNED_BYTE;case"SHORT":return E.SHORT;case"UNSIGNED_SHORT":return E.UNSIGNED_SHORT;case"INT":return E.INT;case"UNSIGNED_INT":return E.UNSIGNED_INT;case"FLOAT":return E.FLOAT;case"DOUBLE":return E.DOUBLE;default:throw new r.DeveloperError("name is not a valid value.")}}};var h=Object.freeze(E);e.CesiumMath=a,e.ComponentDatatype=h}));