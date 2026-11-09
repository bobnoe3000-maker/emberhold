import { L as e, St as t, Vn as n, Y as r, _t as i, bt as a, dr as o, j as s, l as c, q as l, qn as u, qt as d, tr as f, ur as p, vt as m } from "./three.core-D9_Fol79.js";
import { G as h } from "./SmallProps-E2A3GsnG.js";
import { c as g, r as _ } from "./math-Du_SWpiD.js";
import { r as v } from "./ThawField-D3Wx0alo.js";
import { r as y, t as b } from "./PixelCanvas-eFVXy-5o.js";
//#region src/engine/fx/WardDome.js
var x = 16, S = .6, C = .8, w = `
#include <common>
#include <fog_pars_vertex>

varying vec3 vWd;   // world position
varying vec3 vNd;   // world normal (the ellipsoid's)
varying vec3 vPd;   // unit-hemisphere position

void main() {
	vec4 wp = modelMatrix * vec4( position, 1.0 );
	vWd = wp.xyz;
	vPd = position;
	vNd = normalize( normal * vec3( 1.0, 1.0 / ${C.toFixed(2)}, 1.0 ) );
	vec4 mvPosition = viewMatrix * wp;
	gl_Position = projectionMatrix * mvPosition;
	#include <fog_vertex>
}
`, T = `
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
	float top = uRadius * ${C.toFixed(2)};
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
	if ( dot( vNd.xz, toCam ) > 0.0 && wdHash( cell ) >= ${S.toFixed(2)} ) discard;
	// the dissolve, top-down
	float gone = clamp( ( hn - ( 1.0 - uDissolve * 1.35 ) ) / 0.3, 0.0, 1.0 );
	if ( gone > 0.0 && bay < gone ) discard;
	col *= mix( 1.0, 0.55, uNight );
	gl_FragColor = vec4( col, 1.0 );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}
`, E = class {
	constructor() {
		let e = new u(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2);
		this.uniforms = {
			...f.clone(h.fog),
			uFogStart: v.uFogStart,
			uNight: v.uNight,
			uRadius: { value: 3 },
			uCell: { value: new p(x, 43.2) },
			uCells: { value: 18 },
			uRise: { value: 0 },
			uDissolve: { value: 0 },
			uSweep: { value: new p(-9, -9) },
			uArtPx: { value: 2 },
			uCentre: { value: new o() }
		}, this.material = new n({
			name: "WardDome",
			uniforms: this.uniforms,
			vertexShader: w,
			fragmentShader: T,
			side: 2,
			transparent: !1,
			depthWrite: !0,
			fog: !0
		}), this.material.customProgramCacheKey = () => "luminati-warddome-v1", this.object = new m(e, this.material), this.object.name = "fx:wardDome", this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !1, this.object.receiveShadow = !1, this._warm = !1;
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
		let r = Math.PI * 2 * t * 16, i = Math.max(6, Math.round(r / x));
		n.uCell.value.set(r / i, 16 * t * .9), n.uCells.value = i, n.uCentre.value.set(e.x, e.y, e.z), n.uRise.value = 0, n.uDissolve.value = 0, n.uSweep.value.set(-9, -9), this.object.position.set(e.x, e.y, e.z), this.object.scale.set(t, t * C, t), this.object.updateMatrix(), this.object.updateMatrixWorld(!0), this.object.visible = !0;
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
}, D = 4, O = 4, k = 32, A = 64, j = {
	part: 0,
	sides: 5,
	rings: [
		[-.06, 1],
		[.3, .88],
		[.6, .62],
		[.84, .36]
	]
}, M = {
	part: 1,
	sides: 12,
	rings: [[0, .8], [0, 2.2]]
}, N = "\nattribute vec4 aRock;   // part, ring (4 = the tip), facet k, side (0: corner k, 1: corner k + 1)\nattribute vec4 iShape;  // height, radius, seed, rise\nattribute vec4 iFx;     // crack, aspect, -, -\n\nfloat rockHash( vec3 p ) {\n	p = fract( p * vec3( 0.1031, 0.1030, 0.0973 ) );\n	p += dot( p, p.yxz + 33.33 );\n	return fract( ( p.x + p.y ) * p.z );\n}\n\n// a ring of a part: ( y, radius ) in part units\nvec2 rockRing( float part, float ring ) {\n	if ( part < 0.5 ) return ring < 0.5 ? vec2( -0.06, 1.0 ) : ring < 1.5 ? vec2( 0.3, 0.88 ) : ring < 2.5 ? vec2( 0.6, 0.62 ) : vec2( 0.84, 0.36 );\n	return ring < 0.5 ? vec2( 0.0, 0.8 ) : vec2( 0.0, 2.2 );\n}\n\n// a corner in part units: the spike's jittered by the seed (facet widths, a twist per ring, radii,\n// ring heights) so its faces break into planes; the skirt is regular\nvec3 rockCorner( float part, float ring, float k, float seed ) {\n	float n = part < 0.5 ? 5.0 : 12.0;\n	float kk = mod( k, n );\n	float sk = part < 0.5 ? 1.0 : 0.0;\n	float jit = ( rockHash( vec3( seed, 1.0, kk ) ) - 0.5 ) * 0.62 * sk;\n	float twist = ( rockHash( vec3( seed, 5.0 + ring, kk ) ) - 0.5 ) * 0.34 * sk;\n	float a = ( k + jit + twist ) * 6.2831853 / n + rockHash( vec3( seed, 3.0, 91.0 ) ) * 6.2831853 * sk;\n	vec2 yr = rockRing( part, ring );\n	float rj = 1.0 + ( rockHash( vec3( seed, 7.0 + ring, kk + 17.0 ) ) - 0.5 ) * 0.42 * sk;\n	float yj = ring > 0.5 ? ( rockHash( vec3( seed, ring + 40.0, kk ) ) - 0.5 ) * 0.1 * sk : 0.0;\n	return vec3( cos( a ) * yr.y * rj, yr.x + yj, sin( a ) * yr.y * rj );\n}\n\n// the blunt tip, off the axis by seed\nvec3 rockTip( float seed ) {\n	vec2 o = vec2( rockHash( vec3( seed, 9.0, 31.0 ) ), rockHash( vec3( seed, 9.0, 37.0 ) ) ) - 0.5;\n	return vec3( o.x * 0.36, 1.0, o.y * 0.36 );\n}\n\n// thinner while it shoots up and when it overshoots (squash and stretch; stone gives less than ice)\nfloat rockWidth( float rise ) {\n	return mix( 0.6, 1.0, smoothstep( 0.0, 0.85, rise ) ) * inversesqrt( max( rise, 1.0 ) );\n}\n\n// part units → spike-local world units (relative to the foot, before the instance matrix)\nvec3 rockPlace( float part, vec3 q, float h, float r, float rise, float aspect ) {\n	if ( part > 0.5 ) {\n		float s = r * smoothstep( 0.0, 0.6, rise );\n		return vec3( q.x * s, 0.05, q.z * s );\n	}\n	float w = r * rockWidth( rise );\n	return vec3( q.x * w, q.y * h * rise, q.z * w * aspect );\n}\n", P = "\n#ifdef ROCK_COLOR\nvarying vec2 vRockTc;    // texel coordinates (16 per world unit)\nvarying vec2 vRockEdge;  // distance to the facet's left / right seam (world)\nvarying vec2 vRockY;     // height above the foot in texels (pre-rise), the spike's height in texels\nvarying vec2 vRockFx;    // crack, seed\nvarying float vRockPart;\nvarying vec3 vRockW;     // world position\nvarying vec3 vRockA;     // the foot (world)\nvarying float vRockR;    // the spike's radius (world)\n#endif\n\nvec3 rockVertex() {\n	float part = aRock.x, ring = aRock.y, k = aRock.z, side = aRock.w;\n	float h = iShape.x, r = iShape.y, seed = iShape.z, rise = iShape.w;\n	float aspect = iFx.y;\n	bool tip = part < 0.5 && ring > 3.5;\n	vec3 qL = rockCorner( part, ring, k, seed );\n	vec3 qR = rockCorner( part, ring, k + 1.0, seed );\n	vec3 q = tip ? rockTip( seed ) : ( side > 0.5 ? qR : qL );\n	vec3 p = rockPlace( part, q, h, r, rise, aspect );\n#ifdef ROCK_DEPTH\n	if ( part > 0.5 ) p = vec3( 0.0 );  // the skirt casts no shadow\n#endif\n#ifdef ROCK_COLOR\n	vec3 pL = rockPlace( part, qL, h, r, rise, aspect );\n	vec3 pR = rockPlace( part, qR, h, r, rise, aspect );\n	float w = tip ? 0.0 : length( pR - pL );\n	float d = tip ? 0.0 : side * w;\n	vRockEdge = vec2( d, w - d );\n	float yq = clamp( q.y, 0.0, 1.0 );\n	vRockY = vec2( yq * h * 16.0, h * 16.0 );\n	// u: the seam distance plus a facet offset (neighbouring facets show other texels)\n	float u0 = k * 9.0 + floor( rockHash( vec3( seed, 0.0, 41.0 ) ) * 32.0 );\n	vRockTc = vec2( u0 + ( tip ? 0.0 : d * 16.0 ), q.y * h * 16.0 );\n	vRockFx = vec2( iFx.x, seed );\n	vRockPart = part;\n	mat4 rockM = modelMatrix * instanceMatrix;\n	vRockW = ( rockM * vec4( p, 1.0 ) ).xyz;\n	vRockA = ( rockM * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;\n	vRockR = r;\n#endif\n	return p;\n}\n", F = "\nuniform sampler2D uRockMap;\nuniform vec2 uRockMapSize;\nuniform vec3 uRockSun;\nuniform vec3 uRockSunDir;\nvarying vec2 vRockTc;\nvarying vec2 vRockEdge;\nvarying vec2 vRockY;\nvarying vec2 vRockFx;\nvarying float vRockPart;\nvarying vec3 vRockW;\nvarying vec3 vRockA;\nvarying float vRockR;\n\nfloat rockBayer( vec2 p ) {\n	ivec2 q = ivec2( mod( floor( p ), 4.0 ) );\n	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );\n	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;\n}\nfloat rockHash2( vec2 p ) {\n	vec3 q = fract( vec3( p.xyx ) * 0.1031 );\n	q += dot( q, q.yzx + 33.33 );\n	return fract( ( q.x + q.y ) * q.z );\n}\n\n// the stone ramp (linear): albedo and the light's hue shift; nothing emissive\nconst vec3 ROCK_DEEP = vec3( 0.12, 0.075, 0.05 );\nconst vec3 ROCK_PALE = vec3( 0.55, 0.38, 0.23 );\nconst vec3 ROCK_FLECK = vec3( 0.66, 0.52, 0.34 );\nconst vec3 ROCK_DUST = vec3( 0.52, 0.40, 0.27 );\nconst vec3 ROCK_EDGE = vec3( 0.58, 0.46, 0.32 );\nconst vec3 ROCK_SHADE = vec3( 0.62, 0.54, 0.72 );  // shadowed faces lean violet-brown\nconst vec3 ROCK_LIT = vec3( 1.08, 0.98, 0.82 );    // lit faces lean warm\nconst vec3 ROCK_SHADOW = vec3( 0.05, 0.045, 0.04 );\nconst vec3 ROCK_BOUNCE = vec3( 1.0, 0.82, 0.62 );  // the sun thrown back off the ground: warm\n", I = "\n	vec3 rkEd = reflectedLight.directDiffuse;\n	vec3 rkEt = rkEd + reflectedLight.indirectDiffuse;\n	// the light's strength by its brightest channel\n	float rkIt = max( max( rkEt.r, max( rkEt.g, rkEt.b ) ), 1e-5 );\n	// the shade ramp: 4 steps from shadowed (ambient only) to fully sunlit\n	float rkSh = floor( clamp( max( rkEd.r, max( rkEd.g, rkEd.b ) ) / rkIt, 0.0, 1.0 ) * 4.0 + 0.5 ) / 4.0;\n	// the light in half-stop bands, its hue kept in part, with the ice's soft knee: a strong light\n	// (the slam's flash, the noon sun) pales the stone, never burns it white\n	float rkIq = exp2( floor( log2( rkIt ) * 2.0 + 0.5 ) * 0.5 );\n	if ( rkIq > 0.7 ) rkIq = 0.7 + ( rkIq - 0.7 ) / ( 1.0 + ( rkIq - 0.7 ) * 1.3 );\n	vec3 rkHue = mix( vec3( 1.0 ), rkEt / rkIt, 0.6 );\n	vec3 rkL = rkIq * rkHue * mix( ROCK_SHADE, ROCK_LIT, rkSh );\n	// the faces turned from the sun catch its bounce off the ground (stone in shade is never black),\n	// as strong as the ground is lit — the sun's colour × its height: a low sun (golden hour) throws\n	// little back, so the shaded side stays dark and the silhouette reads against the sunlit ground\n	rkL += uRockSun * ( 0.33 * max( uRockSunDir.y, 0.0 ) ) * ROCK_BOUNCE * ( 1.0 - rkSh );\n	vec3 outgoingLight;\n	if ( vRockPart > 0.5 ) {\n		// the skirt: torn-earth rubble texels, then a dithered contact shadow (world texel grid)\n		vec2 g = floor( vRockW.xz * 16.0 ) + 0.5;\n		float dr = length( g / 16.0 - vRockA.xz ) / max( vRockR, 1e-3 );\n		float hr = rockHash2( g + vRockFx.y * 7.13 );\n		float rubble = ( 1.0 - smoothstep( 0.8, 1.4, dr ) ) * 0.75;\n		float shade = 1.0 - smoothstep( 1.05, 1.8, dr );\n		if ( hr < rubble ) {\n			vec3 alb = mix( ROCK_DEEP * 1.8, ROCK_DUST, step( 0.45, rockHash2( g * 1.7 ) ) );\n			outgoingLight = alb * rkL;\n		} else if ( rockBayer( g ) < shade * 0.85 ) {\n			outgoingLight = ROCK_SHADOW * rkL;\n		} else discard;\n	} else {\n		vec2 tc = floor( vRockTc ) + 0.5;\n		vec4 tx = texture2D( uRockMap, tc / uRockMapSize );\n		float crack = vRockFx.x;\n		float yW = ( floor( vRockY.x ) + 0.5 ) / 16.0;   // world units above the foot (pre-rise)\n		// albedo: tone blocks, strata, pits, flecks; each spike a little lighter or darker\n		vec3 alb = mix( ROCK_DEEP, ROCK_PALE, tx.r ) * ( 0.94 + 0.12 * rockHash2( vec2( vRockFx.y, 5.0 ) ) );\n		float feat = tx.g;\n		if ( feat > 0.2 && feat < 0.45 ) alb *= 0.72;\n		else if ( feat > 0.55 && feat < 0.8 ) alb *= 0.5;\n		else if ( feat > 0.9 ) alb = ROCK_FLECK;\n		// torn earth over the lowest 0.25 u, the very foot darker (the contact)\n		float dust = 1.0 - smoothstep( 0.05, 0.25, yW );\n		if ( rockHash2( tc + 3.1 ) < dust * 0.95 ) alb = ROCK_DUST * mix( 0.78, 1.0, rockHash2( tc * 1.3 + 0.7 ) );\n		alb *= mix( 0.55, 1.0, smoothstep( 0.0, 0.18, yW ) );\n		vec3 col = alb * rkL;\n		// the facets' edges as a pixel artist draws them: a lit seam on the lit side, a dark line\n		// where the face turns away (only on facets at least 3 texels wide)\n		float eL = floor( vRockEdge.x * 16.0 ), eR = floor( vRockEdge.y * 16.0 );\n		bool wide = ( vRockEdge.x + vRockEdge.y ) * 16.0 >= 3.0;\n		if ( eL < 0.5 && wide ) col *= mix( 1.0, 1.3, rkSh );\n		else if ( eR < 0.5 && wide && rkSh < 0.5 ) col *= 0.6;\n		// cracks: dark lines in their reveal order, a 1-texel pale dust edge beside them\n		if ( tx.b < crack ) col *= 0.35;\n		else if ( crack > 0.0 ) {\n			float nb = min( min( texture2D( uRockMap, ( tc + vec2( 1.0, 0.0 ) ) / uRockMapSize ).b, texture2D( uRockMap, ( tc - vec2( 1.0, 0.0 ) ) / uRockMapSize ).b ),\n				texture2D( uRockMap, ( tc + vec2( 0.0, 1.0 ) ) / uRockMapSize ).b );\n			if ( nb < crack ) col = ROCK_EDGE * rkL;\n		}\n		outgoingLight = col;\n	}\n";
function L() {
	let e = new b(k, A), t = new _(356414), n = 2048, r = new Float32Array(n), i = new Float32Array(n), a = new Float32Array(n).fill(1), o = (e, t) => (t % A + A) % A * k + (e % k + k) % k;
	for (let e = 0; e < k; e++) for (let t = 0; t < A; t++) r[o(e, t)] = .38 + .3 * g(e >> 3, t >> 3, 21) + .08 * g(e >> 1, t, 22);
	let s = t.int(1, 4);
	for (; s < A;) {
		let e = t.range(0, Math.PI * 2), n = t.range(.6, 1.4);
		for (let t = 0; t < k; t++) g(t >> 2, s, 23) < .18 || (i[o(t, s + Math.round(Math.sin(t * .39 + e) * n))] = 1 / 3);
		s += t.int(5, 7);
	}
	for (let e = 0; e < 16; e++) {
		let e = t.int(0, 31), n = t.int(0, 63);
		i[o(e, n)] = 2 / 3, t.chance(.5) && (i[o(e + 1, n)] = 2 / 3);
	}
	for (let e = 0; e < 26; e++) i[o(t.int(0, 31), t.int(0, 63))] = 1;
	let c = (e, n, r, i, s, l, u) => {
		for (let d = 0; d < l; d++) {
			let f = o(e, n);
			a[f] = Math.min(a[f], Math.max(.03, i + d / l * (s - i))), n += 1, t.chance(.35) && (e += r), t.chance(.12) && (r = -r), u < 1 && t.chance(.06) && c(e - r, n, -r, i + d / l * (s - i), s, Math.floor((l - d) * .5), u + 1);
		}
	};
	for (let e = 0; e < 4; e++) c(Math.floor(e * k / 4 + t.int(0, 3)), t.int(0, 6), t.chance(.5) ? 1 : -1, t.range(.03, .2), t.range(.6, .95), t.int(24, 44), 0);
	for (let t = 0; t < A; t++) for (let n = 0; n < k; n++) {
		let s = o(n, t);
		e.set(n, t, [
			Math.round(Math.min(1, Math.max(0, r[s])) * 255),
			Math.round(i[s] * 255),
			Math.round(a[s] * 255),
			255
		]);
	}
	return e;
}
function R() {
	let t = [], n = [], r = (e, t, n, r, i) => {
		if (i) return [
			0,
			1,
			0
		];
		let [a, o] = e.rings[t], s = (n + r) * Math.PI * 2 / e.sides;
		return [
			Math.cos(s) * o,
			e.part === 1 ? 0 : a,
			Math.sin(s) * o
		];
	}, i = (e, i) => {
		let a = e.map((e) => r(e[0], e[1], e[2], e[3], e[4])), o = [
			a[1][0] - a[0][0],
			a[1][1] - a[0][1],
			a[1][2] - a[0][2]
		], s = [
			a[2][0] - a[0][0],
			a[2][1] - a[0][1],
			a[2][2] - a[0][2]
		], c = [
			o[1] * s[2] - o[2] * s[1],
			o[2] * s[0] - o[0] * s[2],
			o[0] * s[1] - o[1] * s[0]
		], l = c[0] * i[0] + c[1] * i[1] + c[2] * i[2] < 0 ? [
			0,
			2,
			1
		] : [
			0,
			1,
			2
		];
		for (let r of l) {
			t.push(...a[r]);
			let i = e[r];
			n.push(i[0].part, i[4] ? i[0].rings.length : i[1], i[2], i[3]);
		}
	}, a = j;
	for (let e = 0; e < a.sides; e++) {
		let t = (e + .5) * Math.PI * 2 / a.sides, n = [
			Math.cos(t),
			.3,
			Math.sin(t)
		];
		for (let t = 0; t < a.rings.length - 1; t++) i([
			[
				a,
				t,
				e,
				0,
				!1
			],
			[
				a,
				t,
				e,
				1,
				!1
			],
			[
				a,
				t + 1,
				e,
				0,
				!1
			]
		], n), i([
			[
				a,
				t,
				e,
				1,
				!1
			],
			[
				a,
				t + 1,
				e,
				1,
				!1
			],
			[
				a,
				t + 1,
				e,
				0,
				!1
			]
		], n);
		let r = a.rings.length - 1;
		i([
			[
				a,
				r,
				e,
				0,
				!1
			],
			[
				a,
				r,
				e,
				1,
				!1
			],
			[
				a,
				r,
				e,
				0,
				!0
			]
		], [
			n[0],
			.7,
			n[2]
		]);
	}
	for (let e = 0; e < M.sides; e++) i([
		[
			M,
			0,
			e,
			0,
			!1
		],
		[
			M,
			0,
			e,
			1,
			!1
		],
		[
			M,
			1,
			e,
			0,
			!1
		]
	], [
		0,
		1,
		0
	]), i([
		[
			M,
			0,
			e,
			1,
			!1
		],
		[
			M,
			1,
			e,
			1,
			!1
		],
		[
			M,
			1,
			e,
			0,
			!1
		]
	], [
		0,
		1,
		0
	]);
	let o = new c();
	return o.setAttribute("position", new e(t, 3)), o.setAttribute("aRock", new e(n, 4)), o.computeVertexNormals(), o;
}
var z = class {
	constructor({ capacity: e = 24 } = {}) {
		this.capacity = e;
		let n = R();
		this._shape = new l(new Float32Array(e * D), D), this._fx = new l(new Float32Array(e * O), O), this._shape.setUsage(s), this._fx.setUsage(s), n.setAttribute("iShape", this._shape), n.setAttribute("iFx", this._fx), this.texture = y(L().toCanvas(), {
			wrap: "repeat",
			srgb: !1,
			name: "fx:rockSpikes"
		}), this.texture.flipY = !1, this.uniforms = {
			uRockMap: { value: this.texture },
			uRockMapSize: { value: new p(k, A) },
			uRockSun: v.uSunColor,
			uRockSunDir: v.uSunDirection
		};
		let o = this.uniforms;
		this.material = new t({
			color: 16777215,
			flatShading: !0
		}), this.material.onBeforeCompile = (e) => {
			Object.assign(e.uniforms, o), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define ROCK_COLOR\n${N}\n${P}`).replace("#include <begin_vertex>", "vec3 transformed = rockVertex();"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n${F}`).replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;", I);
		}, this.material.customProgramCacheKey = () => "luminati-rockspikes-v1", this.depthMaterial = new a({ depthPacking: d }), this.depthMaterial.onBeforeCompile = (e) => {
			e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define ROCK_DEPTH\n${N}\n${P}`).replace("#include <begin_vertex>", "vec3 transformed = rockVertex();");
		}, this.depthMaterial.customProgramCacheKey = () => "luminati-rockspikes-depth-v1", this.object = new r(n, this.material, e), this.object.name = "fx:rockSpikes", this.object.count = 0, this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !0, this.object.receiveShadow = !0, this.object.customDepthMaterial = this.depthMaterial, this.object.instanceMatrix.setUsage(s), this._items = Array(e).fill(null), this._live = 0, this._m = new i(), this._warm = -1;
	}
	spawn(e) {
		let t = this._items.indexOf(null);
		if (t < 0) return -1;
		let n = Math.max(.05, e.height ?? 1.2);
		return this._items[t] = {
			x: e.x,
			y: e.y,
			z: e.z,
			height: n,
			radius: Math.max(.02, e.radius ?? .35),
			yaw: e.yaw ?? 0,
			leanX: (e.tiltX ?? 0) / n,
			leanZ: (e.tiltZ ?? 0) / n,
			seed: ((e.seed ?? t) >>> 0) % 8192,
			aspect: Math.min(1, Math.max(.3, e.aspect ?? 1)),
			rise: 0,
			crack: 0
		}, this._live++, t;
	}
	set(e, t) {
		let n = this._items[e];
		n && (t.rise !== void 0 && (n.rise = t.rise), t.crack !== void 0 && (n.crack = t.crack), t.height !== void 0 && (n.height = Math.max(.05, t.height)), t.radius !== void 0 && (n.radius = Math.max(.02, t.radius)));
	}
	free(e) {
		e >= 0 && e < this.capacity && this._items[e] && (this._items[e] = null, this._live--);
	}
	get count() {
		return this._live;
	}
	warm() {
		this._warm < 0 && (this._warm = this.spawn({
			x: 0,
			y: -500,
			z: 0,
			seed: 1
		}), this.set(this._warm, { rise: 1 }), this.update(0));
	}
	unwarm() {
		this._warm >= 0 && (this.free(this._warm), this._warm = -1, this.update(0));
	}
	update(e) {
		let t = this._shape.array, n = this._fx.array, r = this._m.elements, i = 0;
		for (let e of this._items) {
			if (!e || e.rise <= .001) continue;
			let a = Math.cos(e.yaw), o = Math.sin(e.yaw);
			r[0] = a, r[1] = 0, r[2] = -o, r[3] = 0, r[4] = e.leanX, r[5] = 1, r[6] = e.leanZ, r[7] = 0, r[8] = o, r[9] = 0, r[10] = a, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this.object.setMatrixAt(i, this._m), t[i * D] = e.height, t[i * D + 1] = e.radius, t[i * D + 2] = e.seed, t[i * D + 3] = e.rise, n[i * O] = e.crack, n[i * O + 1] = e.aspect, n[i * O + 2] = 0, n[i * O + 3] = 0, i++;
		}
		this.object.count = i, this.object.visible = i > 0, i > 0 && (this.object.instanceMatrix.needsUpdate = !0, this._shape.needsUpdate = !0, this._fx.needsUpdate = !0);
	}
	dispose() {
		this.object.removeFromParent(), this.object.geometry.dispose(), this.material.dispose(), this.depthMaterial.dispose(), this.texture.dispose(), this.object.dispose?.();
	}
};
//#endregion
export { E as n, z as t };
