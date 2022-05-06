define(["./defaultValue-81eec7ed","./Matrix2-c430e55a","./ArcType-fc72c06c","./GeometryOffsetAttribute-2bff0974","./Transforms-4ee811db","./RuntimeError-8952249c","./ComponentDatatype-9e86ac8f","./EllipsoidTangentPlane-0152c019","./GeometryAttribute-51ed9bde","./GeometryAttributes-32b29525","./GeometryInstance-68d87064","./GeometryPipeline-7b7ac762","./IndexDatatype-bed3935d","./PolygonGeometryLibrary-8e4bde12","./PolygonPipeline-0605b100","./_commonjsHelpers-3aae1032-26891ab7","./combine-3c023bda","./WebGLConstants-508b9636","./AxisAlignedBoundingBox-52bc7e5b","./IntersectionTests-4d132f79","./Plane-7e828ad8","./AttributeCompression-046b70bd","./EncodedCartesian3-a57a8b60","./arrayRemoveDuplicates-1a15bd09","./EllipsoidRhumbLine-c86f0674"],(function(e,t,i,o,r,n,a,s,l,y,p,u,d,c,g,f,h,m,b,P,E,A,_,G,T){"use strict";const H=[],L=[];function C(e,t,o,r,n){const u=s.EllipsoidTangentPlane.fromPoints(t,e).projectPointsOntoPlane(t,H);let f,h;g.PolygonPipeline.computeWindingOrder2D(u)===g.WindingOrder.CLOCKWISE&&(u.reverse(),t=t.slice().reverse());let m=t.length,b=0;if(r)for(f=new Float64Array(2*m*3),h=0;h<m;h++){const e=t[h],i=t[(h+1)%m];f[b++]=e.x,f[b++]=e.y,f[b++]=e.z,f[b++]=i.x,f[b++]=i.y,f[b++]=i.z}else{let r=0;if(n===i.ArcType.GEODESIC)for(h=0;h<m;h++)r+=c.PolygonGeometryLibrary.subdivideLineCount(t[h],t[(h+1)%m],o);else if(n===i.ArcType.RHUMB)for(h=0;h<m;h++)r+=c.PolygonGeometryLibrary.subdivideRhumbLineCount(e,t[h],t[(h+1)%m],o);for(f=new Float64Array(3*r),h=0;h<m;h++){let r;n===i.ArcType.GEODESIC?r=c.PolygonGeometryLibrary.subdivideLine(t[h],t[(h+1)%m],o,L):n===i.ArcType.RHUMB&&(r=c.PolygonGeometryLibrary.subdivideRhumbLine(e,t[h],t[(h+1)%m],o,L));const a=r.length;for(let e=0;e<a;++e)f[b++]=r[e]}}m=f.length/3;const P=2*m,E=d.IndexDatatype.createTypedArray(m,P);for(b=0,h=0;h<m-1;h++)E[b++]=h,E[b++]=h+1;return E[b++]=m-1,E[b++]=0,new p.GeometryInstance({geometry:new l.Geometry({attributes:new y.GeometryAttributes({position:new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:f})}),indices:E,primitiveType:l.PrimitiveType.LINES})})}function v(e,t,o,r,n){const u=s.EllipsoidTangentPlane.fromPoints(t,e).projectPointsOntoPlane(t,H);let f,h;g.PolygonPipeline.computeWindingOrder2D(u)===g.WindingOrder.CLOCKWISE&&(u.reverse(),t=t.slice().reverse());let m=t.length;const b=new Array(m);let P=0;if(r)for(f=new Float64Array(2*m*3*2),h=0;h<m;++h){b[h]=P/3;const e=t[h],i=t[(h+1)%m];f[P++]=e.x,f[P++]=e.y,f[P++]=e.z,f[P++]=i.x,f[P++]=i.y,f[P++]=i.z}else{let r=0;if(n===i.ArcType.GEODESIC)for(h=0;h<m;h++)r+=c.PolygonGeometryLibrary.subdivideLineCount(t[h],t[(h+1)%m],o);else if(n===i.ArcType.RHUMB)for(h=0;h<m;h++)r+=c.PolygonGeometryLibrary.subdivideRhumbLineCount(e,t[h],t[(h+1)%m],o);for(f=new Float64Array(3*r*2),h=0;h<m;++h){let r;b[h]=P/3,n===i.ArcType.GEODESIC?r=c.PolygonGeometryLibrary.subdivideLine(t[h],t[(h+1)%m],o,L):n===i.ArcType.RHUMB&&(r=c.PolygonGeometryLibrary.subdivideRhumbLine(e,t[h],t[(h+1)%m],o,L));const a=r.length;for(let e=0;e<a;++e)f[P++]=r[e]}}m=f.length/6;const E=b.length,A=2*(2*m+E),_=d.IndexDatatype.createTypedArray(m+E,A);for(P=0,h=0;h<m;++h)_[P++]=h,_[P++]=(h+1)%m,_[P++]=h+m,_[P++]=(h+1)%m+m;for(h=0;h<E;h++){const e=b[h];_[P++]=e,_[P++]=e+m}return new p.GeometryInstance({geometry:new l.Geometry({attributes:new y.GeometryAttributes({position:new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:f})}),indices:_,primitiveType:l.PrimitiveType.LINES})})}function O(o){if(n.Check.typeOf.object("options",o),n.Check.typeOf.object("options.polygonHierarchy",o.polygonHierarchy),o.perPositionHeight&&e.defined(o.height))throw new n.DeveloperError("Cannot use both options.perPositionHeight and options.height");if(e.defined(o.arcType)&&o.arcType!==i.ArcType.GEODESIC&&o.arcType!==i.ArcType.RHUMB)throw new n.DeveloperError("Invalid arcType. Valid options are ArcType.GEODESIC and ArcType.RHUMB.");const r=o.polygonHierarchy,s=e.defaultValue(o.ellipsoid,t.Ellipsoid.WGS84),l=e.defaultValue(o.granularity,a.CesiumMath.RADIANS_PER_DEGREE),y=e.defaultValue(o.perPositionHeight,!1),p=y&&e.defined(o.extrudedHeight),u=e.defaultValue(o.arcType,i.ArcType.GEODESIC);let d=e.defaultValue(o.height,0),g=e.defaultValue(o.extrudedHeight,d);if(!p){const e=Math.max(d,g);g=Math.min(d,g),d=e}this._ellipsoid=t.Ellipsoid.clone(s),this._granularity=l,this._height=d,this._extrudedHeight=g,this._arcType=u,this._polygonHierarchy=r,this._perPositionHeight=y,this._perPositionHeightExtrude=p,this._offsetAttribute=o.offsetAttribute,this._workerName="createPolygonOutlineGeometry",this.packedLength=c.PolygonGeometryLibrary.computeHierarchyPackedLength(r)+t.Ellipsoid.packedLength+8}O.pack=function(i,o,r){return n.Check.typeOf.object("value",i),n.Check.defined("array",o),r=e.defaultValue(r,0),r=c.PolygonGeometryLibrary.packPolygonHierarchy(i._polygonHierarchy,o,r),t.Ellipsoid.pack(i._ellipsoid,o,r),r+=t.Ellipsoid.packedLength,o[r++]=i._height,o[r++]=i._extrudedHeight,o[r++]=i._granularity,o[r++]=i._perPositionHeightExtrude?1:0,o[r++]=i._perPositionHeight?1:0,o[r++]=i._arcType,o[r++]=e.defaultValue(i._offsetAttribute,-1),o[r]=i.packedLength,o};const D=t.Ellipsoid.clone(t.Ellipsoid.UNIT_SPHERE),x={polygonHierarchy:{}};return O.unpack=function(i,o,r){n.Check.defined("array",i),o=e.defaultValue(o,0);const a=c.PolygonGeometryLibrary.unpackPolygonHierarchy(i,o);o=a.startingIndex,delete a.startingIndex;const s=t.Ellipsoid.unpack(i,o,D);o+=t.Ellipsoid.packedLength;const l=i[o++],y=i[o++],p=i[o++],u=1===i[o++],d=1===i[o++],g=i[o++],f=i[o++],h=i[o];return e.defined(r)||(r=new O(x)),r._polygonHierarchy=a,r._ellipsoid=t.Ellipsoid.clone(s,r._ellipsoid),r._height=l,r._extrudedHeight=y,r._granularity=p,r._perPositionHeight=d,r._perPositionHeightExtrude=u,r._arcType=g,r._offsetAttribute=-1===f?void 0:f,r.packedLength=h,r},O.fromPositions=function(t){return t=e.defaultValue(t,e.defaultValue.EMPTY_OBJECT),n.Check.defined("options.positions",t.positions),new O({polygonHierarchy:{positions:t.positions},height:t.height,extrudedHeight:t.extrudedHeight,ellipsoid:t.ellipsoid,granularity:t.granularity,perPositionHeight:t.perPositionHeight,arcType:t.arcType,offsetAttribute:t.offsetAttribute})},O.createGeometry=function(t){const i=t._ellipsoid,n=t._granularity,s=t._polygonHierarchy,y=t._perPositionHeight,p=t._arcType,d=c.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(s,!y,i);if(0===d.length)return;let f;const h=[],m=a.CesiumMath.chordLength(n,i.maximumRadius),b=t._height,P=t._extrudedHeight;let E,A;if(t._perPositionHeightExtrude||!a.CesiumMath.equalsEpsilon(b,P,0,a.CesiumMath.EPSILON2))for(A=0;A<d.length;A++){if(f=v(i,d[A],m,y,p),f.geometry=c.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(f.geometry,b,P,i,y),e.defined(t._offsetAttribute)){const e=f.geometry.attributes.position.values.length/3;let i=new Uint8Array(e);t._offsetAttribute===o.GeometryOffsetAttribute.TOP?i=o.arrayFill(i,1,0,e/2):(E=t._offsetAttribute===o.GeometryOffsetAttribute.NONE?0:1,i=o.arrayFill(i,E)),f.geometry.attributes.applyOffset=new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:i})}h.push(f)}else for(A=0;A<d.length;A++){if(f=C(i,d[A],m,y,p),f.geometry.attributes.position.values=g.PolygonPipeline.scaleToGeodeticHeight(f.geometry.attributes.position.values,b,i,!y),e.defined(t._offsetAttribute)){const e=f.geometry.attributes.position.values.length,i=new Uint8Array(e/3);E=t._offsetAttribute===o.GeometryOffsetAttribute.NONE?0:1,o.arrayFill(i,E),f.geometry.attributes.applyOffset=new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:i})}h.push(f)}const _=u.GeometryPipeline.combineInstances(h)[0],G=r.BoundingSphere.fromVertices(_.attributes.position.values);return new l.Geometry({attributes:_.attributes,indices:_.indices,primitiveType:_.primitiveType,boundingSphere:G,offsetAttribute:t._offsetAttribute})},function(i,o){return e.defined(o)&&(i=O.unpack(i,o)),i._ellipsoid=t.Ellipsoid.clone(i._ellipsoid),O.createGeometry(i)}}));