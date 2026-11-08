import { $ as e, Mn as t, Sn as n, hn as r, jn as i, vn as a } from "./three.core-BsXWN4b8.js";
import { G as o } from "./SmallProps-DjD8mkZ7.js";
import { r as s } from "./ThawField-CelnRTY2.js";
//#region src/engine/fx/WardDome.js
var c = 16, l = .6, u = .8, d = `
#include <common>
#include <fog_pars_vertex>

varying vec3 vWd;   // world position
varying vec3 vNd;   // world normal (the ellipsoid's)
varying vec3 vPd;   // unit-hemisphere position

void main() {
	vec4 wp = modelMatrix * vec4( position, 1.0 );
	vWd = wp.xyz;
	vPd = position;
	vNd = normalize( normal * vec3( 1.0, 1.0 / ${u.toFixed(2)}, 1.0 ) );
	vec4 mvPosition = viewMatrix * wp;
	gl_Position = projectionMatrix * mvPosition;
	#include <fog_vertex>
}
`, f = `
#include <common>
#include <fog_pars_fragment>

uniform float uRadius;
uniform vec2 uCell;      // the cell's width in texels (fitted round the base), the meridian's texels per radian
uniform float uCells;    // cells round the base (a whole number)
uniform float uRise;
uniform float uDissolve;
uniform vec2 uSweep;     // two highlight bands' heights (0 … 1; < 0 none)
uniform float uArtPx;
uniform float uNight;
uniform vec3 uCentre;

varying vec3 vWd;
varying vec3 vNd;
varying vec3 vPd;

const vec3 WARD_BODY = vec3( 0.06, 0.18, 0.55 );
const vec3 WARD_LIT = vec3( 0.15, 0.40, 1.25 );

float wdBayer( vec2 p ) {
	ivec2 q = ivec2( mod( floor( p ), 4.0 ) );
	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );
	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;
}

// the distance (cell units) from a point to its nearest hex cell's edge (flat sides left / right);
// cell: that cell's id (whole numbers: twice its centre's x, its row)
float wdHexEdge( vec2 uv, out vec2 cell ) {
	const vec2 r = vec2( 1.0, 1.7320508 );
	const vec2 hh = r * 0.5;
	vec2 a = mod( uv, r ) - hh;
	vec2 b = mod( uv - hh, r ) - hh;
	vec2 g = dot( a, a ) < dot( b, b ) ? a : b;
	vec2 c = uv - g;
	cell = floor( vec2( c.x * 2.0, c.y / 0.8660254 ) + 0.5 );
	float d = max( dot( abs( g ), normalize( r ) ), abs( g.x ) );
	return 0.5 - d;
}

float wdHash( vec2 id ) {
	return fract( sin( dot( id, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

void main() {
	// surface texels: along the base's arc (the azimuth × the radius) and up the meridian
	float az = atan( vPd.z, vPd.x );
	float el = asin( clamp( vPd.y, 0.0, 1.0 ) );
	vec2 s = vec2( az * uRadius * 16.0, el * uCell.y );
	vec2 tc = floor( s ) + 0.5;
	float h = vWd.y - uCentre.y;                 // height above the base (u)
	float top = uRadius * ${u.toFixed(2)};
	float hn = h / top;
	// the rise: nothing above it; its leading row lit
	float riseH = uRise * top;
	if ( h > riseH ) discard;
	bool lead = uRise < 0.999 && riseH - h < 1.5 / 16.0;
	// the view's angle to the surface
	vec3 vd = normalize( cameraPosition - vWd );
	float f = 1.0 - abs( dot( vNd, vd ) );
	// texels per screen pixel here (world derivative: no seam), the lines' width in texels
	float tp = length( fwidth( vWd ) ) * 16.0;
	float lineW = max( 2.0, uArtPx * tp );
	vec2 cell;
	float edge = wdHexEdge( tc / uCell.x, cell ) * uCell.x;
	bool line = edge < 0.5 * lineW;
	// (round the base the ids wrap: the cells on the azimuth's seam are one)
	cell.x = mod( cell.x, 2.0 * uCells );
	bool base = h * 16.0 < 2.0;
	float bay = wdBayer( tc );
	// the sweeps: lines inside a band light up, and the band shows a little further in
	float band = min( abs( hn - uSweep.x ), abs( hn - uSweep.y ) ) * top * 16.0;
	bool swept = band < 1.6;
	vec3 col;
	if ( base ) col = WARD_BODY;
	else if ( lead && f > 0.35 ) col = WARD_LIT;
	else if ( f > 0.78 ) {
		if ( line ) col = WARD_LIT;
		else if ( h > 1.4 && bay < 0.25 ) col = WARD_BODY;
		else discard;
	} else if ( f > 0.5 || ( swept && f > 0.4 ) ) {
		if ( !line ) discard;
		col = swept ? WARD_LIT : WARD_BODY;
	} else discard;
	// the camera's half of the dome: whole cells left out by a hash, so whole hexes stay
	vec2 toCam = cameraPosition.xz - uCentre.xz;
	if ( dot( vNd.xz, toCam ) > 0.0 && wdHash( cell ) >= ${l.toFixed(2)} ) discard;
	// the dissolve, top-down
	float gone = clamp( ( hn - ( 1.0 - uDissolve * 1.35 ) ) / 0.3, 0.0, 1.0 );
	if ( gone > 0.0 && bay < gone ) discard;
	col *= mix( 1.0, 0.55, uNight );
	gl_FragColor = vec4( col, 1.0 );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}
`, p = class {
	constructor() {
		let l = new a(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2);
		this.uniforms = {
			...n.clone(o.fog),
			uFogStart: s.uFogStart,
			uNight: s.uNight,
			uRadius: { value: 3 },
			uCell: { value: new i(c, 43.2) },
			uCells: { value: 18 },
			uRise: { value: 0 },
			uDissolve: { value: 0 },
			uSweep: { value: new i(-9, -9) },
			uArtPx: { value: 2 },
			uCentre: { value: new t() }
		}, this.material = new r({
			name: "WardDome",
			uniforms: this.uniforms,
			vertexShader: d,
			fragmentShader: f,
			side: 2,
			transparent: !1,
			depthWrite: !0,
			fog: !0
		}), this.material.customProgramCacheKey = () => "luminati-warddome-v1", this.object = new e(l, this.material), this.object.name = "fx:wardDome", this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !1, this.object.receiveShadow = !1, this._warm = !1;
	}
	get shown() {
		return this.object.visible;
	}
	get artPx() {
		return this.uniforms.uArtPx.value;
	}
	set artPx(e) {
		this.uniforms.uArtPx.value = Math.max(1, e | 0);
	}
	show(e) {
		let t = Math.max(.5, e.radius), n = this.uniforms;
		n.uRadius.value = t;
		let r = Math.PI * 2 * t * 16, i = Math.max(6, Math.round(r / c));
		n.uCell.value.set(r / i, 16 * t * .9), n.uCells.value = i, n.uCentre.value.set(e.x, e.y, e.z), n.uRise.value = 0, n.uDissolve.value = 0, n.uSweep.value.set(-9, -9), this.object.position.set(e.x, e.y, e.z), this.object.scale.set(t, t * u, t), this.object.updateMatrix(), this.object.updateMatrixWorld(!0), this.object.visible = !0;
	}
	set(e) {
		let t = this.uniforms;
		e.rise !== void 0 && (t.uRise.value = Math.max(0, Math.min(1, e.rise))), e.dissolve !== void 0 && (t.uDissolve.value = Math.max(0, Math.min(1, e.dissolve))), e.sweepA !== void 0 && (t.uSweep.value.x = e.sweepA), e.sweepB !== void 0 && (t.uSweep.value.y = e.sweepB);
	}
	hide() {
		this.object.visible = !1;
	}
	warm() {
		this.show({
			x: 0,
			y: -500,
			z: 0,
			radius: 3
		}), this.set({ rise: 1 }), this._warm = !0;
	}
	unwarm() {
		this._warm && (this._warm = !1, this.hide());
	}
	dispose() {
		this.object.removeFromParent(), this.object.geometry.dispose(), this.material.dispose();
	}
};
//#endregion
export { p as t };
