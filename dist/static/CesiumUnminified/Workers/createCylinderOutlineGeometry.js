define(["./GeometryOffsetAttribute-2bff0974","./Transforms-4ee811db","./Matrix2-c430e55a","./RuntimeError-8952249c","./ComponentDatatype-9e86ac8f","./CylinderGeometryLibrary-0fa93765","./defaultValue-81eec7ed","./GeometryAttribute-51ed9bde","./GeometryAttributes-32b29525","./IndexDatatype-bed3935d","./_commonjsHelpers-3aae1032-26891ab7","./combine-3c023bda","./WebGLConstants-508b9636"],(function(t,e,i,o,r,n,s,a,u,f,d,c,b){"use strict";const l=new i.Cartesian2;function m(e){const i=(e=s.defaultValue(e,s.defaultValue.EMPTY_OBJECT)).length,r=e.topRadius,n=e.bottomRadius,a=s.defaultValue(e.slices,128),u=Math.max(s.defaultValue(e.numberOfVerticalLines,16),0);if(o.Check.typeOf.number("options.positions",i),o.Check.typeOf.number("options.topRadius",r),o.Check.typeOf.number("options.bottomRadius",n),o.Check.typeOf.number.greaterThanOrEquals("options.slices",a,3),s.defined(e.offsetAttribute)&&e.offsetAttribute===t.GeometryOffsetAttribute.TOP)throw new o.DeveloperError("GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.");this._length=i,this._topRadius=r,this._bottomRadius=n,this._slices=a,this._numberOfVerticalLines=u,this._offsetAttribute=e.offsetAttribute,this._workerName="createCylinderOutlineGeometry"}m.packedLength=6,m.pack=function(t,e,i){return o.Check.typeOf.object("value",t),o.Check.defined("array",e),i=s.defaultValue(i,0),e[i++]=t._length,e[i++]=t._topRadius,e[i++]=t._bottomRadius,e[i++]=t._slices,e[i++]=t._numberOfVerticalLines,e[i]=s.defaultValue(t._offsetAttribute,-1),e};const p={length:void 0,topRadius:void 0,bottomRadius:void 0,slices:void 0,numberOfVerticalLines:void 0,offsetAttribute:void 0};return m.unpack=function(t,e,i){o.Check.defined("array",t),e=s.defaultValue(e,0);const r=t[e++],n=t[e++],a=t[e++],u=t[e++],f=t[e++],d=t[e];return s.defined(i)?(i._length=r,i._topRadius=n,i._bottomRadius=a,i._slices=u,i._numberOfVerticalLines=f,i._offsetAttribute=-1===d?void 0:d,i):(p.length=r,p.topRadius=n,p.bottomRadius=a,p.slices=u,p.numberOfVerticalLines=f,p.offsetAttribute=-1===d?void 0:d,new m(p))},m.createGeometry=function(o){let d=o._length;const c=o._topRadius,b=o._bottomRadius,m=o._slices,p=o._numberOfVerticalLines;if(d<=0||c<0||b<0||0===c&&0===b)return;const y=2*m,h=n.CylinderGeometryLibrary.computePositions(d,c,b,m,!1);let _,A=2*m;if(p>0){const t=Math.min(p,m);_=Math.round(m/t),A+=t}const O=f.IndexDatatype.createTypedArray(y,2*A);let C,R=0;for(C=0;C<m-1;C++)O[R++]=C,O[R++]=C+1,O[R++]=C+m,O[R++]=C+1+m;if(O[R++]=m-1,O[R++]=0,O[R++]=m+m-1,O[R++]=m,p>0)for(C=0;C<m;C+=_)O[R++]=C,O[R++]=C+m;const G=new u.GeometryAttributes;G.position=new a.GeometryAttribute({componentDatatype:r.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:h}),l.x=.5*d,l.y=Math.max(b,c);const V=new e.BoundingSphere(i.Cartesian3.ZERO,i.Cartesian2.magnitude(l));if(s.defined(o._offsetAttribute)){d=h.length;const e=new Uint8Array(d/3),i=o._offsetAttribute===t.GeometryOffsetAttribute.NONE?0:1;t.arrayFill(e,i),G.applyOffset=new a.GeometryAttribute({componentDatatype:r.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:e})}return new a.Geometry({attributes:G,indices:O,primitiveType:a.PrimitiveType.LINES,boundingSphere:V,offsetAttribute:o._offsetAttribute})},function(t,e){return s.defined(e)&&(t=m.unpack(t,e)),m.createGeometry(t)}}));