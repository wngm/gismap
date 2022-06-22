define(["exports","./AxisAlignedBoundingBox-0ddf9b79","./Matrix2-37e55508","./RuntimeError-8952249c","./defaultValue-81eec7ed","./IntersectionTests-ee135b8e","./Plane-6ee42cab","./Transforms-dca21951"],(function(t,e,n,i,o,r,s,a){"use strict";const l=new n.Cartesian4;function c(t,e){t=(e=o.defaultValue(e,n.Ellipsoid.WGS84)).scaleToGeodeticSurface(t);const i=a.Transforms.eastNorthUpToFixedFrame(t,e);this._ellipsoid=e,this._origin=t,this._xAxis=n.Cartesian3.fromCartesian4(n.Matrix4.getColumn(i,0,l)),this._yAxis=n.Cartesian3.fromCartesian4(n.Matrix4.getColumn(i,1,l));const r=n.Cartesian3.fromCartesian4(n.Matrix4.getColumn(i,2,l));this._plane=s.Plane.fromPointNormal(t,r)}Object.defineProperties(c.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},origin:{get:function(){return this._origin}},plane:{get:function(){return this._plane}},xAxis:{get:function(){return this._xAxis}},yAxis:{get:function(){return this._yAxis}},zAxis:{get:function(){return this._plane.normal}}});const d=new e.AxisAlignedBoundingBox;c.fromPoints=function(t,n){return new c(e.AxisAlignedBoundingBox.fromPoints(t,d).center,n)};const p=new r.Ray,u=new n.Cartesian3;c.prototype.projectPointOntoPlane=function(t,e){const i=p;i.origin=t,n.Cartesian3.normalize(t,i.direction);let s=r.IntersectionTests.rayPlane(i,this._plane,u);if(o.defined(s)||(n.Cartesian3.negate(i.direction,i.direction),s=r.IntersectionTests.rayPlane(i,this._plane,u)),o.defined(s)){const t=n.Cartesian3.subtract(s,this._origin,s),i=n.Cartesian3.dot(this._xAxis,t),r=n.Cartesian3.dot(this._yAxis,t);return o.defined(e)?(e.x=i,e.y=r,e):new n.Cartesian2(i,r)}},c.prototype.projectPointsOntoPlane=function(t,e){o.defined(e)||(e=[]);let n=0;const i=t.length;for(let r=0;r<i;r++){const i=this.projectPointOntoPlane(t[r],e[n]);o.defined(i)&&(e[n]=i,n++)}return e.length=n,e},c.prototype.projectPointToNearestOnPlane=function(t,e){o.defined(e)||(e=new n.Cartesian2);const i=p;i.origin=t,n.Cartesian3.clone(this._plane.normal,i.direction);let s=r.IntersectionTests.rayPlane(i,this._plane,u);o.defined(s)||(n.Cartesian3.negate(i.direction,i.direction),s=r.IntersectionTests.rayPlane(i,this._plane,u));const a=n.Cartesian3.subtract(s,this._origin,s),l=n.Cartesian3.dot(this._xAxis,a),c=n.Cartesian3.dot(this._yAxis,a);return e.x=l,e.y=c,e},c.prototype.projectPointsToNearestOnPlane=function(t,e){o.defined(e)||(e=[]);const n=t.length;e.length=n;for(let i=0;i<n;i++)e[i]=this.projectPointToNearestOnPlane(t[i],e[i]);return e};const f=new n.Cartesian3;c.prototype.projectPointOntoEllipsoid=function(t,e){o.defined(e)||(e=new n.Cartesian3);const i=this._ellipsoid,r=this._origin,s=this._xAxis,a=this._yAxis,l=f;return n.Cartesian3.multiplyByScalar(s,t.x,l),e=n.Cartesian3.add(r,l,e),n.Cartesian3.multiplyByScalar(a,t.y,l),n.Cartesian3.add(e,l,e),i.scaleToGeocentricSurface(e,e),e},c.prototype.projectPointsOntoEllipsoid=function(t,e){const n=t.length;o.defined(e)?e.length=n:e=new Array(n);for(let i=0;i<n;++i)e[i]=this.projectPointOntoEllipsoid(t[i],e[i]);return e},t.EllipsoidTangentPlane=c}));