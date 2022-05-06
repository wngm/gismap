define(["exports","./GeometryOffsetAttribute-2bff0974","./Transforms-4ee811db","./Matrix2-c430e55a","./ComponentDatatype-9e86ac8f","./defaultValue-81eec7ed","./RuntimeError-8952249c","./EllipseGeometryLibrary-688714cd","./GeometryAttribute-51ed9bde","./GeometryAttributes-32b29525","./IndexDatatype-bed3935d"],(function(e,t,i,r,n,o,a,s,l,u,d){"use strict";const c=new r.Cartesian3;let f=new r.Cartesian3;const p=new i.BoundingSphere,m=new i.BoundingSphere;function h(e){const t=(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).center,i=o.defaultValue(e.ellipsoid,r.Ellipsoid.WGS84),s=e.semiMajorAxis,l=e.semiMinorAxis,u=o.defaultValue(e.granularity,n.CesiumMath.RADIANS_PER_DEGREE);if(!o.defined(t))throw new a.DeveloperError("center is required.");if(!o.defined(s))throw new a.DeveloperError("semiMajorAxis is required.");if(!o.defined(l))throw new a.DeveloperError("semiMinorAxis is required.");if(s<l)throw new a.DeveloperError("semiMajorAxis must be greater than or equal to the semiMinorAxis.");if(u<=0)throw new a.DeveloperError("granularity must be greater than zero.");const d=o.defaultValue(e.height,0),c=o.defaultValue(e.extrudedHeight,d);this._center=r.Cartesian3.clone(t),this._semiMajorAxis=s,this._semiMinorAxis=l,this._ellipsoid=r.Ellipsoid.clone(i),this._rotation=o.defaultValue(e.rotation,0),this._height=Math.max(c,d),this._granularity=u,this._extrudedHeight=Math.min(c,d),this._numberOfVerticalLines=Math.max(o.defaultValue(e.numberOfVerticalLines,16),0),this._offsetAttribute=e.offsetAttribute,this._workerName="createEllipseOutlineGeometry"}h.packedLength=r.Cartesian3.packedLength+r.Ellipsoid.packedLength+8,h.pack=function(e,t,i){if(!o.defined(e))throw new a.DeveloperError("value is required");if(!o.defined(t))throw new a.DeveloperError("array is required");return i=o.defaultValue(i,0),r.Cartesian3.pack(e._center,t,i),i+=r.Cartesian3.packedLength,r.Ellipsoid.pack(e._ellipsoid,t,i),i+=r.Ellipsoid.packedLength,t[i++]=e._semiMajorAxis,t[i++]=e._semiMinorAxis,t[i++]=e._rotation,t[i++]=e._height,t[i++]=e._granularity,t[i++]=e._extrudedHeight,t[i++]=e._numberOfVerticalLines,t[i]=o.defaultValue(e._offsetAttribute,-1),t};const y=new r.Cartesian3,b=new r.Ellipsoid,A={center:y,ellipsoid:b,semiMajorAxis:void 0,semiMinorAxis:void 0,rotation:void 0,height:void 0,granularity:void 0,extrudedHeight:void 0,numberOfVerticalLines:void 0,offsetAttribute:void 0};h.unpack=function(e,t,i){if(!o.defined(e))throw new a.DeveloperError("array is required");t=o.defaultValue(t,0);const n=r.Cartesian3.unpack(e,t,y);t+=r.Cartesian3.packedLength;const s=r.Ellipsoid.unpack(e,t,b);t+=r.Ellipsoid.packedLength;const l=e[t++],u=e[t++],d=e[t++],c=e[t++],f=e[t++],p=e[t++],m=e[t++],_=e[t];return o.defined(i)?(i._center=r.Cartesian3.clone(n,i._center),i._ellipsoid=r.Ellipsoid.clone(s,i._ellipsoid),i._semiMajorAxis=l,i._semiMinorAxis=u,i._rotation=d,i._height=c,i._granularity=f,i._extrudedHeight=p,i._numberOfVerticalLines=m,i._offsetAttribute=-1===_?void 0:_,i):(A.height=c,A.extrudedHeight=p,A.granularity=f,A.rotation=d,A.semiMajorAxis=l,A.semiMinorAxis=u,A.numberOfVerticalLines=m,A.offsetAttribute=-1===_?void 0:_,new h(A))},h.createGeometry=function(e){if(e._semiMajorAxis<=0||e._semiMinorAxis<=0)return;const a=e._height,h=e._extrudedHeight,y=!n.CesiumMath.equalsEpsilon(a,h,0,n.CesiumMath.EPSILON2);e._center=e._ellipsoid.scaleToGeodeticSurface(e._center,e._center);const b={center:e._center,semiMajorAxis:e._semiMajorAxis,semiMinorAxis:e._semiMinorAxis,ellipsoid:e._ellipsoid,rotation:e._rotation,height:a,granularity:e._granularity,numberOfVerticalLines:e._numberOfVerticalLines};let A;if(y)b.extrudedHeight=h,b.offsetAttribute=e._offsetAttribute,A=function(e){const a=e.center,f=e.ellipsoid,h=e.semiMajorAxis;let y=r.Cartesian3.multiplyByScalar(f.geodeticSurfaceNormal(a,c),e.height,c);p.center=r.Cartesian3.add(a,y,p.center),p.radius=h,y=r.Cartesian3.multiplyByScalar(f.geodeticSurfaceNormal(a,y),e.extrudedHeight,y),m.center=r.Cartesian3.add(a,y,m.center),m.radius=h;let b=s.EllipseGeometryLibrary.computeEllipsePositions(e,!1,!0).outerPositions;const A=new u.GeometryAttributes({position:new l.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:s.EllipseGeometryLibrary.raisePositionsToHeight(b,e,!0)})});b=A.position.values;const _=i.BoundingSphere.union(p,m);let g=b.length/3;if(o.defined(e.offsetAttribute)){let i=new Uint8Array(g);if(e.offsetAttribute===t.GeometryOffsetAttribute.TOP)i=t.arrayFill(i,1,0,g/2);else{const r=e.offsetAttribute===t.GeometryOffsetAttribute.NONE?0:1;i=t.arrayFill(i,r)}A.applyOffset=new l.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:i})}let E=o.defaultValue(e.numberOfVerticalLines,16);E=n.CesiumMath.clamp(E,0,g/2);const x=d.IndexDatatype.createTypedArray(g,2*g+2*E);g/=2;let M,w,v=0;for(M=0;M<g;++M)x[v++]=M,x[v++]=(M+1)%g,x[v++]=M+g,x[v++]=(M+1)%g+g;if(E>0){const e=Math.min(E,g);w=Math.round(g/e);const t=Math.min(w*E,g);for(M=0;M<t;M+=w)x[v++]=M,x[v++]=M+g}return{boundingSphere:_,attributes:A,indices:x}}(b);else if(A=function(e){const t=e.center;f=r.Cartesian3.multiplyByScalar(e.ellipsoid.geodeticSurfaceNormal(t,f),e.height,f),f=r.Cartesian3.add(t,f,f);const o=new i.BoundingSphere(f,e.semiMajorAxis),a=s.EllipseGeometryLibrary.computeEllipsePositions(e,!1,!0).outerPositions,c=new u.GeometryAttributes({position:new l.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:s.EllipseGeometryLibrary.raisePositionsToHeight(a,e,!1)})}),p=a.length/3,m=d.IndexDatatype.createTypedArray(p,2*p);let h=0;for(let e=0;e<p;++e)m[h++]=e,m[h++]=(e+1)%p;return{boundingSphere:o,attributes:c,indices:m}}(b),o.defined(e._offsetAttribute)){const i=A.attributes.position.values.length,r=new Uint8Array(i/3),o=e._offsetAttribute===t.GeometryOffsetAttribute.NONE?0:1;t.arrayFill(r,o),A.attributes.applyOffset=new l.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:r})}return new l.Geometry({attributes:A.attributes,indices:A.indices,primitiveType:l.PrimitiveType.LINES,boundingSphere:A.boundingSphere,offsetAttribute:e._offsetAttribute})},e.EllipseOutlineGeometry=h}));