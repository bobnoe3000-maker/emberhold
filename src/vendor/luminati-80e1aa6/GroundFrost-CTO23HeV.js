import { Et as e, Jt as t, Kn as n, L as r, St as i, T as a, Y as o, _t as s, bt as c, c as l, dr as u, fr as d, j as f, l as p, nr as m, q as h, qt as g, ur as _, vt as v } from "./three.core-D9_Fol79.js";
import { c as y, f as b, r as x } from "./math-Du_SWpiD.js";
import { r as S } from "./ThawField-D3Wx0alo.js";
import { r as ee, t as C } from "./PixelCanvas-eFVXy-5o.js";
//#region src/engine/fx/IceCrystals.js
var w = 4, T = 4, E = 32, D = 64, O = [
	{
		part: 0,
		sides: 6,
		rings: [
			[-.06, 1],
			[.24, .92],
			[.66, .56]
		],
		tip: 1
	},
	{
		part: 1,
		sides: 5,
		rings: [[-.15, 1], [.52, .64]],
		tip: 1
	},
	{
		part: 2,
		sides: 5,
		rings: [[-.15, 1], [.52, .64]],
		tip: 1
	}
], k = {
	part: 3,
	sides: 12,
	rings: [[0, .8], [0, 2.3]]
}, A = "\nattribute vec4 aIce;    // part, ring (= tip ring for the tip), facet k, side (0: corner k, 1: corner k + 1)\nattribute vec4 iShape;  // height, radius, seed, rise\nattribute vec4 iFx;     // crack, glint, glow, -\n\nfloat iceHash( vec3 p ) {\n	p = fract( p * vec3( 0.1031, 0.1030, 0.0973 ) );\n	p += dot( p, p.yxz + 33.33 );\n	return fract( ( p.x + p.y ) * p.z );\n}\n\nfloat iceSides( float part ) { return part < 0.5 ? 6.0 : part < 2.5 ? 5.0 : 12.0; }\nfloat iceTipRing( float part ) { return part < 0.5 ? 3.0 : 2.0; }\n\n// a ring of a part: ( y, radius ) in part units\nvec2 iceRing( float part, float ring ) {\n	if ( part < 0.5 ) return ring < 0.5 ? vec2( -0.06, 1.0 ) : ring < 1.5 ? vec2( 0.24, 0.92 ) : vec2( 0.66, 0.56 );\n	if ( part < 2.5 ) return ring < 0.5 ? vec2( -0.15, 1.0 ) : vec2( 0.52, 0.64 );\n	return ring < 0.5 ? vec2( 0.0, 0.8 ) : vec2( 0.0, 2.3 );\n}\n\n// a corner in part units, jittered by the seed (facet widths, radii); the skirt is regular\nvec3 iceCorner( float part, float ring, float k, float seed ) {\n	float n = iceSides( part );\n	float kk = mod( k, n );\n	float sk = part > 2.5 ? 0.0 : 1.0;\n	float jit = ( iceHash( vec3( seed, part * 13.0 + 1.0, kk ) ) - 0.5 ) * 0.55 * sk;\n	float a = ( k + jit ) * 6.2831853 / n + iceHash( vec3( seed, part + 3.0, 91.0 ) ) * 6.2831853 * sk;\n	vec2 yr = iceRing( part, ring );\n	float rj = 1.0 + ( iceHash( vec3( seed, part * 7.0 + ring, kk + 17.0 ) ) - 0.5 ) * 0.24 * sk;\n	return vec3( cos( a ) * yr.y * rj, yr.x, sin( a ) * yr.y * rj );\n}\n\n// thinner while it shoots up and when it overshoots (squash and stretch)\nfloat iceWidth( float rise ) {\n	return mix( 0.5, 1.0, smoothstep( 0.0, 0.85, rise ) ) * inversesqrt( max( rise, 1.0 ) );\n}\n\n// one side shard (part 1 or 2) of a crystal: on (0 / 1), length, radius (world), angle, lean, foot height (world)\nvoid iceSub( float part, float seed, float h, float r, out float on, out float len, out float rad, out float phi, out float lean, out float hb ) {\n	float j = part - 1.0;\n	on = step( iceHash( vec3( seed, 5.0 + j, 2.0 ) ), j < 0.5 ? 0.72 : 0.42 );\n	len = h * mix( j < 0.5 ? 0.3 : 0.2, j < 0.5 ? 0.48 : 0.34, iceHash( vec3( seed, 6.0 + j, 3.0 ) ) );\n	rad = r * mix( 0.5, 0.7, iceHash( vec3( seed, 7.0 + j, 4.0 ) ) );\n	float p0 = iceHash( vec3( seed, 8.0, 5.0 ) ) * 6.2831853;\n	phi = j < 0.5 ? p0 : p0 + 3.14159 * mix( 0.6, 1.4, iceHash( vec3( seed, 9.0, 6.0 ) ) );\n	lean = mix( 0.42, 0.78, iceHash( vec3( seed, 10.0 + j, 7.0 ) ) );\n	hb = h * mix( 0.0, 0.12, iceHash( vec3( seed, 11.0 + j, 8.0 ) ) );\n}\n\n// part units → crystal-local world units (relative to the foot, before the instance matrix)\nvec3 icePlace( float part, vec3 q, float seed, float h, float r, float rise ) {\n	if ( part < 0.5 ) {\n		float w = r * iceWidth( rise );\n		return vec3( q.x * w, q.y * h * rise, q.z * w );\n	}\n	if ( part > 2.5 ) {\n		float s = r * smoothstep( 0.0, 0.6, rise );\n		return vec3( q.x * s, 0.05, q.z * s );\n	}\n	float on, len, rad, phi, lean, hb;\n	iceSub( part, seed, h, r, on, len, rad, phi, lean, hb );\n	float g = clamp( ( rise - 0.2 ) / 0.8, 0.0, 1.2 ) * on;\n	float w = rad * iceWidth( g ) * step( 0.001, g );\n	vec3 s = vec3( q.x * w, q.y * len * g, q.z * w );\n	float cl = cos( lean ), sl = sin( lean );\n	s = vec3( s.x * cl + s.y * sl, - s.x * sl + s.y * cl, s.z );\n	float cp = cos( phi ), sp = sin( phi );\n	s = vec3( s.x * cp - s.z * sp, s.y, s.x * sp + s.z * cp );\n	float wm = r * iceWidth( rise );\n	return s + vec3( cp * 0.5 * wm, hb * min( rise, 1.0 ), sp * 0.5 * wm );\n}\n\nvec3 iceTip( float part, float seed ) {\n	vec2 o = vec2( iceHash( vec3( seed, part, 31.0 ) ), iceHash( vec3( seed, part, 37.0 ) ) ) - 0.5;\n	return vec3( o.x * 0.35, 1.0, o.y * 0.35 );\n}\n", te = "\n#ifdef ICE_COLOR\nvarying vec2 vIceTc;     // texel coordinates (16 per world unit)\nvarying vec2 vIceEdge;   // distance to the facet's left / right seam (world)\nvarying vec2 vIceY;      // height above the part's foot in texels (pre-rise), the part's height in texels\nvarying vec4 vIceFx;     // crack, glint, glow, seed\nvarying float vIcePart;\nvarying vec3 vIceW;      // world position\nvarying vec3 vIceA;      // the part's foot (world)\nvarying vec3 vIceU;      // the part's axis (world, unit)\nvarying float vIceR;     // the crystal's radius (world)\n#endif\n\nvec3 iceVertex() {\n	float part = aIce.x, ring = aIce.y, k = aIce.z, side = aIce.w;\n	float h = iShape.x, r = iShape.y, seed = iShape.z, rise = iShape.w;\n	float tipRing = iceTipRing( part );\n	bool tip = part < 2.5 && ring > tipRing - 0.5;\n	vec3 qL = iceCorner( part, ring, k, seed );\n	vec3 qR = iceCorner( part, ring, k + 1.0, seed );\n	vec3 q = tip ? iceTip( part, seed ) : ( side > 0.5 ? qR : qL );\n	vec3 p = icePlace( part, q, seed, h, r, rise );\n#ifdef ICE_DEPTH\n	if ( part > 2.5 ) p = vec3( 0.0 );  // the skirt casts no shadow\n#endif\n#ifdef ICE_COLOR\n	vec3 pL = icePlace( part, qL, seed, h, r, rise );\n	vec3 pR = icePlace( part, qR, seed, h, r, rise );\n	float w = tip ? 0.0 : length( pR - pL );\n	float d = tip ? 0.0 : side * w;\n	vIceEdge = vec2( d, w - d );\n	// the part's own height (pre-rise) and this vertex's height along it, in texels\n	float ph = h;\n	if ( part > 0.5 && part < 2.5 ) {\n		float on, len, rad, phi, lean, hb;\n		iceSub( part, seed, h, r, on, len, rad, phi, lean, hb );\n		ph = len;\n	}\n	float yq = clamp( q.y, 0.0, 1.0 );\n	vIceY = vec2( yq * ph * 16.0, ph * 16.0 );\n	// u: the seam distance plus a facet offset (neighbouring facets show other texels)\n	float u0 = k * 9.0 + floor( iceHash( vec3( seed, part, 41.0 ) ) * 32.0 );\n	vIceTc = vec2( u0 + ( tip ? 0.0 : d * 16.0 ), q.y * ph * 16.0 + part * 23.0 );\n	vIceFx = vec4( iFx.xyz, seed );\n	vIcePart = part;\n	mat4 iceM = modelMatrix * instanceMatrix;\n	vIceW = ( iceM * vec4( p, 1.0 ) ).xyz;\n	vec3 a0 = icePlace( part, vec3( 0.0 ), seed, h, r, rise );\n	vec3 a1 = icePlace( part, vec3( 0.0, 1.0, 0.0 ), seed, h, r, rise );\n	vIceA = ( iceM * vec4( part > 2.5 ? vec3( 0.0 ) : a0, 1.0 ) ).xyz;\n	vec3 ax = ( iceM * vec4( a1, 1.0 ) ).xyz - ( iceM * vec4( a0, 1.0 ) ).xyz;\n	vIceU = length( ax ) > 1e-5 ? normalize( ax ) : vec3( 0.0, 1.0, 0.0 );\n	vIceR = r;\n#endif\n	return p;\n}\n", j = "\nuniform sampler2D uIceMap;\nuniform vec2 uIceMapSize;\nuniform float uIceTime;\nuniform float uIceNight;\nuniform vec4 uIceLook;   // core, rim, seams, glint strengths\nvarying vec2 vIceTc;\nvarying vec2 vIceEdge;\nvarying vec2 vIceY;\nvarying vec4 vIceFx;\nvarying float vIcePart;\nvarying vec3 vIceW;\nvarying vec3 vIceA;\nvarying vec3 vIceU;\nvarying float vIceR;\n\nfloat iceBayer( vec2 p ) {\n	ivec2 q = ivec2( mod( floor( p ), 4.0 ) );\n	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );\n	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;\n}\nfloat iceHash2( vec2 p ) {\n	vec3 q = fract( vec3( p.xyx ) * 0.1031 );\n	q += dot( q, q.yzx + 33.33 );\n	return fract( ( q.x + q.y ) * q.z );\n}\n\n// the ice ramp (linear): albedo, the light's hue shift, the HDR glow terms\nconst vec3 ICE_DEEP = vec3( 0.05, 0.11, 0.30 );\nconst vec3 ICE_PALE = vec3( 0.22, 0.42, 0.68 );\nconst vec3 ICE_FROST = vec3( 0.52, 0.66, 0.84 );\nconst vec3 ICE_HIGH = vec3( 0.42, 0.70, 0.86 );\nconst vec3 ICE_SHADE = vec3( 0.66, 0.56, 1.16 );   // shadowed facets lean blue-violet\nconst vec3 ICE_LIT = vec3( 0.90, 1.04, 1.10 );     // lit facets lean cyan\nconst vec3 ICE_CORE = vec3( 0.04, 0.22, 0.62 );\nconst vec3 ICE_RIM = vec3( 0.30, 0.90, 1.40 );\nconst vec3 ICE_SEAM = vec3( 0.40, 1.00, 1.50 );\nconst vec3 ICE_GLINT = vec3( 0.80, 1.60, 2.00 );\nconst vec3 ICE_CRACK = vec3( 0.55, 1.35, 1.95 );\nconst vec3 ICE_SHADOW = vec3( 0.05, 0.055, 0.12 );\nconst vec3 ICE_LUMA = vec3( 0.2126, 0.7152, 0.0722 );\n", ne = "\n	vec3 iceEd = reflectedLight.directDiffuse;\n	vec3 iceEt = iceEd + reflectedLight.indirectDiffuse;\n	// the light's strength by its brightest channel (a blue night light does not inflate the blue)\n	float iceIt = max( max( iceEt.r, max( iceEt.g, iceEt.b ) ), 1e-5 );\n	// the shade ramp: 4 steps from shadowed (ambient only) to fully sunlit\n	float iceSh = floor( clamp( max( iceEd.r, max( iceEd.g, iceEd.b ) ) / iceIt, 0.0, 1.0 ) * 4.0 + 0.5 ) / 4.0;\n	// the light in half-stop bands, its hue kept in part\n	float iceIq = exp2( floor( log2( iceIt ) * 2.0 + 0.5 ) * 0.5 );\n	// a soft knee: a strong light (the spell's flash, a lamp at arm's length) pales the ice toward\n	// cyan instead of burning it white\n	if ( iceIq > 0.7 ) iceIq = 0.7 + ( iceIq - 0.7 ) / ( 1.0 + ( iceIq - 0.7 ) * 1.3 );\n	vec3 iceHue = mix( vec3( 1.0 ), iceEt / iceIt, 0.6 );\n	vec3 iceL = iceIq * iceHue * mix( ICE_SHADE, ICE_LIT, iceSh );\n	float iceGlow = vIceFx.z;\n	vec3 outgoingLight;\n	if ( vIcePart > 2.5 ) {\n		// the skirt: frost rubble texels, then a dithered contact shadow (world texel grid)\n		vec2 g = floor( vIceW.xz * 16.0 ) + 0.5;\n		float dr = length( g / 16.0 - vIceA.xz ) / max( vIceR, 1e-3 );\n		float hr = iceHash2( g + vIceFx.w * 7.13 );\n		float rubble = ( 1.0 - smoothstep( 0.8, 1.35, dr ) ) * 0.7;\n		float shade = 1.0 - smoothstep( 1.1, 1.75, dr );\n		if ( hr < rubble ) {\n			vec3 alb = mix( ICE_PALE, ICE_FROST, step( 0.5, iceHash2( g * 1.7 ) ) );\n			outgoingLight = alb * iceL + ICE_CORE * 0.12 * iceGlow;\n		} else if ( iceBayer( g ) < shade ) {\n			outgoingLight = ICE_SHADOW * iceL;\n		} else discard;\n	} else {\n		vec2 tc = floor( vIceTc ) + 0.5;\n		vec4 tx = texture2D( uIceMap, tc / uIceMapSize );\n		float bay = iceBayer( tc );\n		float crack = vIceFx.x;\n		float yT = floor( vIceY.x ) + 0.5;               // texel row above the part's foot\n		float yF = yT / max( vIceY.y, 1.0 );             // 0 foot … 1 tip\n		float yW = yT / 16.0;                            // world units above the foot (pre-rise)\n		// albedo: tone streaks, a frosted foot, darker at the very foot (contact), darker when cracked\n		vec3 alb = mix( ICE_DEEP, ICE_PALE, tx.r );\n		// facets turned to the light pale toward cyan (the ramp's highlight hue)\n		alb = mix( alb, ICE_HIGH, 0.45 * smoothstep( 0.5, 1.0, iceSh ) );\n		float frost = 1.0 - smoothstep( 0.03, 0.4, yW );\n		if ( iceHash2( tc + 3.1 ) < frost * 0.9 ) alb = ICE_FROST;\n		alb *= mix( 0.55, 1.0, smoothstep( 0.0, 0.18, yW ) );\n		// fractured ice clouds over and dims (greyer, darker) as it is about to shatter, so the\n		// bright crack lines stand out\n		alb = mix( alb, vec3( dot( alb, ICE_LUMA ) ) * vec3( 0.8, 0.92, 1.12 ), 0.55 * crack ) * ( 1.0 - 0.35 * crack );\n		vec3 col = alb * iceL;\n		// view terms (flat facet normal)\n		vec3 nw = normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );\n		vec3 vd = normalize( vIceW - cameraPosition );\n		float ndv = clamp( abs( dot( nw, vd ) ), 0.0, 1.0 );\n		float rim = 1.0 - ndv;\n		rim = rim > 0.82 ? 1.0 : rim > 0.66 ? 0.45 : 0.0;\n		// the core: how close the view ray passes to the shard's axis here\n		vec3 w = vIceW - vIceA;\n		float along = dot( w, vIceU );\n		float radial = length( w - along * vIceU );\n		vec3 nn = cross( vd, vIceU );\n		float nl = length( nn );\n		float dist = nl > 1e-3 ? abs( dot( w, nn ) ) / nl : radial;\n		float core = clamp( 1.0 - dist / max( radial, 1e-3 ), 0.0, 1.0 ) + ( bay - 0.5 ) * 0.22;\n		float coreQ = core > 0.64 ? 1.0 : core > 0.32 ? 0.5 : 0.16;\n		coreQ *= smoothstep( 0.0, 0.18, yF ) * mix( 1.0, 0.4, yF ) * ( 1.0 - 0.55 * crack );\n		vec3 emis = ICE_CORE * coreQ * iceGlow * uIceLook.x;\n		emis += ICE_RIM * rim * ( 0.5 + 0.5 * iceGlow ) * uIceLook.y;\n		// inner fracture lines (seen through the core) and sparkle texels\n		if ( abs( tx.g - 0.5 ) < 0.12 ) emis += ICE_CORE * 0.55 * clamp( core, 0.0, 1.0 ) * iceGlow;\n		if ( tx.g > 0.9 ) emis += ICE_GLINT * 0.6 * iceGlow * step( 0.55, fract( uIceTime * 0.9 + tx.b * 7.0 + vIceFx.w * 0.013 ) );\n		// seams: the facet edges as 1-texel lines (the lit side brighter), the tip's last texels\n		float eL = floor( vIceEdge.x * 16.0 ), eR = floor( vIceEdge.y * 16.0 );\n		float seam = eL < 0.5 ? 0.15 + 0.85 * iceSh * iceSh : eR < 0.5 ? 0.08 : 0.0;\n		// a facet under 3 texels wide is all seam: only its lit edge then, and softer\n		if ( ( vIceEdge.x + vIceEdge.y ) * 16.0 < 3.0 ) seam *= eL < 0.5 ? 0.6 : 0.0;\n		if ( yF > 0.93 ) seam = max( seam, 0.8 );\n		emis += ICE_SEAM * seam * ( 0.55 + 0.45 * iceGlow ) * uIceLook.z;\n		// the shadowed side's edge as a dark line (the facet's turn, as a pixel artist draws it)\n		if ( eR < 0.5 && eL >= 0.5 && iceSh < 0.5 && ( vIceEdge.x + vIceEdge.y ) * 16.0 >= 3.0 ) col *= 0.6;\n		// the glint: a diagonal band sliding from the tip down to the foot\n		float across = vIceEdge.x / max( vIceEdge.x + vIceEdge.y, 1e-3 );\n		float gb = abs( yT - ( mix( 1.12, -0.12, vIceFx.y ) + ( across - 0.5 ) * 0.14 ) * vIceY.y );\n		float gl = gb < 1.0 ? 1.0 : gb < 2.5 ? 0.3 : 0.0;\n		emis += ICE_GLINT * gl * uIceLook.w;\n		// cracks: lines lighting up in their reveal order\n		if ( tx.b < crack ) {\n			// the crack's newest texels flare, older ones settle to a cold line\n			float fresh = 1.0 - smoothstep( 0.0, 0.18, crack - tx.b );\n			col *= 0.35;\n			emis = emis * 0.4 + ICE_CRACK * ( 0.45 + 0.9 * fresh );\n		}\n		// the exposure rises at night: the self-glow holds back so the facets keep their shape\n		outgoingLight = col + emis * mix( 1.0, 0.7, uIceNight );\n	}\n";
function re() {
	let e = new C(E, D), t = new x(7397), n = /* @__PURE__ */ new Float32Array(2048), r = /* @__PURE__ */ new Float32Array(2048), i = (/* @__PURE__ */ new Float32Array(2048)).fill(1), a = (e, t) => (t % D + D) % D * E + (e % E + E) % E;
	for (let e = 0; e < E; e++) for (let t = 0; t < D; t++) n[a(e, t)] = .42 + .16 * y(e >> 2, t >> 3, 11) + .05 * y(e, t >> 2, 12);
	for (let e = 0; e < 12; e++) {
		let e = t.int(0, 31), r = t.int(0, 63), i = t.int(9, 22), o = t.chance(.5) ? 1 : -1, s = t.int(3, 5);
		for (let t = 0; t < i; t++) n[a(e, r + t)] = .95, t % s === s - 1 && (e += o);
	}
	for (let e = 0; e < 7; e++) {
		let e = t.int(0, 31), r = t.int(0, 63), i = t.int(3, 8);
		for (let t = 0; t < i; t++) n[a(e + +(t > i / 2), r + t)] = .1;
	}
	for (let e = 0; e < 5; e++) {
		let e = t.int(0, 31), n = t.int(0, 63), i = t.chance(.5) ? 1 : -1, o = t.int(8, 18), s = t.range(.4, 1.6);
		for (let t = 0; t < o; t++) r[a(Math.round(e), Math.round(n))] = .5, e += i * (s < 1 ? 1 : 1 / s), n += s < 1 ? s : 1;
	}
	for (let e = 0; e < 22; e++) r[a(t.int(0, 31), t.int(0, 63))] = 1;
	let o = (e, n, r, s, c, l, u) => {
		for (let d = 0; d < l; d++) {
			let f = a(e, n);
			i[f] = Math.min(i[f], Math.max(.03, s + d / l * (c - s))), n += 1, t.chance(.7) && (e += r), t.chance(.14) && (r = -r), u < 2 && t.chance(.08) && o(e - r, n, -r, s + d / l * (c - s), c, Math.floor((l - d) * .5), u + 1);
		}
	};
	for (let e = 0; e < 7; e++) o(Math.floor(e * E / 7 + t.int(0, 2)), t.int(0, 8), t.chance(.5) ? 1 : -1, t.range(.02, .14), t.range(.5, .8), t.int(34, 60), 0);
	for (let t = 0; t < D; t++) for (let o = 0; o < E; o++) {
		let s = a(o, t);
		e.set(o, t, [
			Math.round(Math.min(1, Math.max(0, n[s])) * 255),
			Math.round(r[s] * 255),
			Math.round(i[s] * 255),
			255
		]);
	}
	return e;
}
function ie() {
	let e = [], t = [], n = (e, t, n, r, i) => {
		if (i) return [
			0,
			1,
			0
		];
		let [a, o] = e.rings[t], s = (n + r) * Math.PI * 2 / e.sides;
		return [
			Math.cos(s) * o,
			e.part === 3 ? 0 : a,
			Math.sin(s) * o
		];
	}, i = (r, i) => {
		let a = r.map((e) => n(e[0], e[1], e[2], e[3], e[4])), o = [
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
		for (let n of l) {
			e.push(...a[n]);
			let i = r[n];
			t.push(i[0].part, i[4] ? i[0].rings.length : i[1], i[2], i[3]);
		}
	};
	for (let e of O) for (let t = 0; t < e.sides; t++) {
		let n = (t + .5) * Math.PI * 2 / e.sides, r = [
			Math.cos(n),
			.25,
			Math.sin(n)
		];
		for (let n = 0; n < e.rings.length - 1; n++) i([
			[
				e,
				n,
				t,
				0,
				!1
			],
			[
				e,
				n,
				t,
				1,
				!1
			],
			[
				e,
				n + 1,
				t,
				0,
				!1
			]
		], r), i([
			[
				e,
				n,
				t,
				1,
				!1
			],
			[
				e,
				n + 1,
				t,
				1,
				!1
			],
			[
				e,
				n + 1,
				t,
				0,
				!1
			]
		], r);
		let a = e.rings.length - 1;
		i([
			[
				e,
				a,
				t,
				0,
				!1
			],
			[
				e,
				a,
				t,
				1,
				!1
			],
			[
				e,
				a,
				t,
				0,
				!0
			]
		], [
			r[0],
			.6,
			r[2]
		]);
	}
	for (let e = 0; e < k.sides; e++) i([
		[
			k,
			0,
			e,
			0,
			!1
		],
		[
			k,
			0,
			e,
			1,
			!1
		],
		[
			k,
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
			k,
			0,
			e,
			1,
			!1
		],
		[
			k,
			1,
			e,
			1,
			!1
		],
		[
			k,
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
	let a = new p();
	return a.setAttribute("position", new r(e, 3)), a.setAttribute("aIce", new r(t, 4)), a.computeVertexNormals(), a;
}
var ae = class {
	constructor({ capacity: e = 64 } = {}) {
		this.capacity = e;
		let t = ie();
		this._shape = new h(new Float32Array(e * w), w), this._fx = new h(new Float32Array(e * T), T), this._shape.setUsage(f), this._fx.setUsage(f), t.setAttribute("iShape", this._shape), t.setAttribute("iFx", this._fx), this.texture = ee(re().toCanvas(), {
			wrap: "repeat",
			srgb: !1,
			name: "fx:iceCrystals"
		}), this.uniforms = {
			uIceMap: { value: this.texture },
			uIceMapSize: { value: new _(E, D) },
			uIceTime: S.uTime,
			uIceNight: S.uNight,
			uIceLook: { value: new d(1, 1, 1, 1) }
		};
		let n = this.uniforms;
		this.material = new i({
			color: 16777215,
			flatShading: !0
		}), this.material.onBeforeCompile = (e) => {
			Object.assign(e.uniforms, n), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define ICE_COLOR\n${A}\n${te}`).replace("#include <begin_vertex>", "vec3 transformed = iceVertex();"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n${j}`).replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;", ne);
		}, this.material.customProgramCacheKey = () => "luminati-icecrystals-v1", this.depthMaterial = new c({ depthPacking: g }), this.depthMaterial.onBeforeCompile = (e) => {
			e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define ICE_DEPTH\n${A}\n${te}`).replace("#include <begin_vertex>", "vec3 transformed = iceVertex();");
		}, this.depthMaterial.customProgramCacheKey = () => "luminati-icecrystals-depth-v1", this.object = new o(t, this.material, e), this.object.name = "fx:iceCrystals", this.object.count = 0, this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !0, this.object.receiveShadow = !0, this.object.customDepthMaterial = this.depthMaterial, this.object.instanceMatrix.setUsage(f), this._items = Array(e).fill(null), this._live = 0, this._m = new s(), this._warm = -1;
	}
	spawn(e) {
		let t = this._items.indexOf(null);
		return t < 0 ? -1 : (this._items[t] = {
			x: e.x,
			y: e.y,
			z: e.z,
			height: Math.max(.05, e.height ?? 1.6),
			radius: Math.max(.02, e.radius ?? .25),
			yaw: e.yaw ?? 0,
			tiltX: e.tiltX ?? 0,
			tiltZ: e.tiltZ ?? 0,
			seed: ((e.seed ?? t) >>> 0) % 8192,
			rise: 0,
			crack: 0,
			glint: 0,
			glow: 1
		}, this._live++, t);
	}
	set(e, t) {
		let n = this._items[e];
		n && (t.rise !== void 0 && (n.rise = t.rise), t.crack !== void 0 && (n.crack = t.crack), t.glint !== void 0 && (n.glint = t.glint), t.glow !== void 0 && (n.glow = t.glow));
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
			r[0] = a, r[1] = 0, r[2] = -o, r[3] = 0, r[4] = e.tiltX / e.height, r[5] = 1, r[6] = e.tiltZ / e.height, r[7] = 0, r[8] = o, r[9] = 0, r[10] = a, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this.object.setMatrixAt(i, this._m), t[i * w] = e.height, t[i * w + 1] = e.radius, t[i * w + 2] = e.seed, t[i * w + 3] = e.rise, n[i * T] = e.crack, n[i * T + 1] = e.glint, n[i * T + 2] = e.glow, n[i * T + 3] = 0, i++;
		}
		this.object.count = i, this.object.visible = i > 0, i > 0 && (this.object.instanceMatrix.needsUpdate = !0, this._shape.needsUpdate = !0, this._fx.needsUpdate = !0);
	}
	dispose() {
		this.object.removeFromParent(), this.object.geometry.dispose(), this.material.dispose(), this.depthMaterial.dispose(), this.texture.dispose(), this.object.dispose?.();
	}
}, M = 16, N = 256, oe = 4, P = N / oe, F = 2048, se = 384, I = 2432, L = 8, R = 12, ce = 16, le = 16, z = .34, ue = .012, de = .12, B = 255, V = Object.freeze({
	main: .42,
	ring: .82,
	spoke: .12,
	splinter: .06,
	star0: .8,
	star1: 1
}), fe = 16711935, pe = Object.freeze([
	1,
	.82,
	.55,
	.3,
	.16,
	.08,
	.05
]), me = Object.freeze([
	-1,
	-1,
	0,
	-1,
	1,
	-1,
	-1,
	0,
	1,
	0,
	-1,
	1,
	0,
	1,
	1,
	1,
	-2,
	0,
	2,
	0,
	0,
	-2,
	0,
	2
]), H = () => typeof performance < "u" ? performance.now() : 0, U = "\nattribute float aFrostSlot;\nattribute vec4 aTuft; // a tuft's corner: across (±0.5), up (0 / 1), threshold, 1 + variant (0: a ground cell)\nuniform vec4 uFrostA[ GF_CAP ]; // spread, fade, cracks, glow\nuniform vec4 uFrostB[ GF_CAP ]; // origin texel x, z, slot row, 0\nuniform float uCameraYaw;\nvarying vec2 vFrostXZ;\nvarying vec2 vTuftUV;\nflat varying vec2 vTuftInfo; // variant (−1: ground), threshold\nflat varying vec4 vFrostA;\nflat varying vec4 vFrostB;\n", he = `
	{
		int gfSlot = int( aFrostSlot + 0.5 );
		vFrostA = uFrostA[ gfSlot ];
		vFrostB = uFrostB[ gfSlot ];
		vTuftInfo = vec2( - 1.0, 0.0 );
		vTuftUV = vec2( 0.0 );
		if ( aTuft.w > 0.5 ) {
			// a frozen tuft: upright, turned to the camera yaw, rising out of the ground as the
			// spread passes its threshold (its texels stay put on the quad: no squash)
			float grow = clamp( ( vFrostA.x - aTuft.z ) * ( 1.0 / 0.14 ), 0.0, 1.0 );
			vec3 across = vec3( cos( uCameraYaw ), 0.0, - sin( uCameraYaw ) );
			transformed += across * ( aTuft.x * ${(L / M).toFixed(4)} ) + vec3( 0.0, ( aTuft.y - 1.0 + grow ) * ${(R / M).toFixed(4)}, 0.0 );
			vTuftUV = vec2( ( aTuft.x + 0.5 ) * ${L.toFixed(1)}, aTuft.y * ${R.toFixed(1)} );
			vTuftInfo = vec2( aTuft.w - 1.0, aTuft.z );
		}
		vFrostXZ = ( modelMatrix * vec4( transformed, 1.0 ) ).xz;
	}
`, ge = "\nuniform sampler2D uFrostTex;\nuniform float uTime;\nvarying vec2 vFrostXZ;\nvarying vec2 vTuftUV;\nflat varying vec2 vTuftInfo;\nflat varying vec4 vFrostA;\nflat varying vec4 vFrostB;\n\nfloat gfBayer4( vec2 p ) {\n	ivec2 q = ivec2( mod( p, 4.0 ) );\n	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );\n	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;\n}\nfloat gfHash( vec2 p ) {\n	return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );\n}\n", W = `
	vec3 gfEmissive = vec3( 0.0 );
	{
		bool tuft = vTuftInfo.x >= 0.0;
		vec2 tw;
		ivec2 at;
		if ( tuft ) {
			// a tuft's texel in the sprite strip
			tw = floor( vTuftUV );
			if ( tw.x < 0.0 || tw.y < 0.0 || tw.x >= ${L.toFixed(1)} || tw.y >= ${R.toFixed(1)} ) discard;
			at = ivec2( tw ) + ivec2( int( vTuftInfo.x + 0.5 ) * ${L}, GF_STRIP );
		} else {
			tw = floor( vFrostXZ * ${M.toFixed(1)} );
			ivec2 tl = ivec2( tw - vFrostB.xy );
			if ( tl.x < 0 || tl.y < 0 || tl.x >= ${N} || tl.y >= ${N} ) discard;
			at = ivec2( tl.x, tl.y + int( vFrostB.z ) );
		}
		ivec4 v = ivec4( texelFetch( uFrostTex, at, 0 ) * 255.0 + 0.5 );
		float spread = vFrostA.x;
		float fade = vFrostA.y;
		float cracks = vFrostA.z;
		float glow = vFrostA.w;
		float bay = gfBayer4( tw );
		float th = tuft ? vTuftInfo.y : float( v.r ) / 254.0;
		float arr = float( v.b ) / 254.0;
		int cls = v.a;

		// frost: frozen once the spread passes the texel's threshold; the newest band dithers in
		// (a tuft rises instead)
		bool frost = v.r < ${B} && spread > 0.0 && th <= spread;
		float behind = spread - th;
		if ( frost && ! tuft && behind < 0.07 && behind * ( 1.0 / 0.07 ) <= bay ) frost = false;
		// cracks: the cleft and its lit lip as the run passes; the rime a moment later, dithered
		bool crack = cls > 0 && v.b < ${B} && cracks > 0.0 && arr <= cracks;
		if ( crack && cls == 3 && ( cracks - arr ) * ( 1.0 / 0.08 ) <= bay ) crack = false;
		// fade: the edge (late threshold) first, in Bayer steps; the veins and the clefts last
		if ( fade > 0.0 ) {
			float k = frost ? 1.0 - th : 1.0 - arr * 0.5;
			if ( fade >= 0.999 || 0.5 * bay + 0.5 * k < fade ) { frost = false; crack = false; }
		}
		if ( ! frost && ! crack ) discard;

		int tone = v.g & 3;
		bool sparkle = ( v.g & 4 ) != 0;
		float phase = float( v.g >> 3 ) * ( 6.2831853 / 32.0 );
		vec3 alb;
		if ( crack && cls == 1 ) {
			// the cleft: dark, lit from inside — a cold blue core, a bright tip racing ahead
			alb = vec3( 0.03, 0.04, 0.1 );
			float pulse = 0.7 + 0.3 * sin( uTime * 3.1 + arr * 23.0 );
			gfEmissive = vec3( 0.05, 0.19, 0.5 ) * pulse;
			float tip = ( 1.0 - smoothstep( 0.0, 0.06, cracks - arr ) ) * step( cracks, 0.999 );
			gfEmissive += vec3( 0.55, 1.7, 3.2 ) * tip;
		} else if ( crack && cls == 2 ) {
			// the lit lip: pale ice catching the light
			alb = vec3( 0.48, 0.66, 0.92 );
			float tip = ( 1.0 - smoothstep( 0.0, 0.06, cracks - arr ) ) * step( cracks, 0.999 );
			gfEmissive = vec3( 0.04, 0.1, 0.22 ) + vec3( 0.3, 0.8, 1.4 ) * tip;
		} else {
			// frost (or rime): four tones from deep blue-violet to the pale cyan of a vein
			alb = tone == 0 ? vec3( 0.15, 0.19, 0.44 ) : tone == 1 ? vec3( 0.33, 0.44, 0.63 ) : tone == 2 ? vec3( 0.45, 0.6, 0.79 ) : vec3( 0.58, 0.8, 0.93 );
			if ( ! frost ) alb = vec3( 0.45, 0.6, 0.79 );
			// a tuft: frozen grass — dark teal-blue blades, rimed pale-cyan tips
			if ( tuft ) alb = tone == 0 ? vec3( 0.06, 0.1, 0.16 ) : tone == 1 ? vec3( 0.14, 0.24, 0.36 ) : tone == 2 ? vec3( 0.3, 0.46, 0.64 ) : vec3( 0.55, 0.78, 0.93 );
			gfEmissive = alb * ( tone == 3 ? vec3( 0.2, 0.36, 0.5 ) : vec3( 0.09, 0.13, 0.2 ) );
			if ( frost && sparkle ) {
				float s = max( 0.0, sin( uTime * 2.2 + phase * 3.0 + gfHash( tw + vTuftInfo.y * 917.0 ) * 6.2831853 ) );
				s *= s; s *= s; s *= s;
				gfEmissive += vec3( 1.5, 2.3, 3.1 ) * ( 0.12 + s );
			}
			// the moving front glows faintly
			if ( frost && ! tuft && spread < 0.999 && behind < 0.035 ) gfEmissive += vec3( 0.3, 0.62, 1.0 ) * ( 1.0 - behind * ( 1.0 / 0.035 ) );
		}
		gfEmissive *= glow;
		diffuseColor.rgb = alb;
	}
`;
function _e(e, t, n, r, i) {
	let a = Math.max(1, Math.ceil(Math.max(Math.abs(n - e), Math.abs(r - t)) * 2)), o = Math.floor(e), s = Math.floor(t);
	i(o, s, 0);
	for (let c = 1; c <= a; c++) {
		let l = c / a, u = Math.floor(e + (n - e) * l), d = Math.floor(t + (r - t) * l);
		(u !== o || d !== s) && (u !== o && d !== s && i(u, s, l), i(u, d, l), o = u, s = d);
	}
}
function G(e, t) {
	for (let n = t * N * 4, r = (t + le) * N * 4; n < r; n += 4) e[n] = B, e[n + 1] = 0, e[n + 2] = B, e[n + 3] = 0;
	let n = (n, r, i, a, o, s) => {
		if (r < 0 || r >= L || i < 0 || i >= R) return;
		let c = ((t + i) * N + n * L + r) * 4;
		e[c] === 0 && (e[c + 1] & 3) > a || (e[c] = 0, e[c + 1] = a | (o ? 4 : 0) | s << 3);
	};
	for (let e = 0; e < ce; e++) {
		let t = new x(2135587861 + e * 977), r = 4 + t.int(0, 2);
		for (let i = 0; i < r; i++) {
			let r = 1 + t.next() * 5, i = Math.min(11, Math.round(4 + t.next() * 7)), a = (t.next() - .5) * 3 + (r - L / 2 + .5) * .6, o = (t.next() - .5) * 2.5, s = Math.round(i * (.35 + t.next() * .25)), c = t.int(0, 31);
			for (let l = 0; l <= i; l++) {
				let u = l / i, d = Math.floor(r + a * u + o * u * u);
				if (l < 2) {
					n(e, d, l, 0, !1, c), n(e, d + 1, l, 0, !1, c);
					continue;
				}
				if (l === i) {
					n(e, d, l, 3, t.next() < .5, c);
					continue;
				}
				n(e, d, l, l > i - 3 ? 3 : 2, !1, c), l < s && n(e, d + 1, l, 1, !1, c);
			}
		}
	}
}
function ve(e, t, n, r, i, a, o, s, c, l) {
	e.fill(0, 0, t * n);
	let u = 1, d = 0;
	for (let f = 0; f < s; f++) {
		let s = o * (1 << f), p = Math.floor(r * s), m = Math.floor(i * s), h = Math.floor((r + (t - 1) * a) * s) - p + 2, g = Math.floor((i + (n - 1) * a) * s) - m + 2;
		if (h * g > l.length) continue;
		let _ = c + f * 101;
		for (let e = 0; e < g; e++) for (let t = 0; t < h; t++) l[e * h + t] = y(p + t, m + e, _);
		for (let o = 0; o < n; o++) {
			let n = (i + o * a) * s - m, c = Math.floor(n), d = n - c;
			d = d * d * (3 - 2 * d);
			for (let n = 0; n < t; n++) {
				let i = (r + n * a) * s - p, f = Math.floor(i), m = i - f;
				m = m * m * (3 - 2 * m);
				let g = c * h + f, _ = l[g] + (l[g + 1] - l[g]) * m, v = l[g + h] + (l[g + h + 1] - l[g + h]) * m;
				e[o * t + n] += u * (_ + (v - _) * d);
			}
		}
		d += u, u *= .5;
	}
	if (d > 0) for (let r = 0, i = t * n; r < i; r++) e[r] /= d;
}
function K(e, t, n, r, i, a, o) {
	let s = [
		t,
		n,
		r,
		i
	], c = a;
	for (let t = 0; t < o; t++) {
		let t = [s[0], s[1]];
		for (let n = 0; n + 3 < s.length; n += 2) {
			let r = s[n], i = s[n + 1], a = s[n + 2], o = s[n + 3], l = Math.hypot(a - r, o - i), u = (e.next() * 2 - 1) * c * l, d = l > 1e-6 ? -(o - i) / l : 0, f = l > 1e-6 ? (a - r) / l : 0;
			t.push((r + a) / 2 + d * u, (i + o) / 2 + f * u, a, o);
		}
		s = t, c *= .6;
	}
	return s;
}
var q = class {
	constructor({ heightField: r = null, capacity: o = 8, tufts: s = !0 } = {}) {
		this.heightField = r, this.capacity = Math.max(1, o | 0), this.tufts = s;
		let c = this.capacity;
		this.paintMs = 0, this.sliceMs = 0, this._data = new Uint8Array(N * (N * c + le) * 4), this.texture = new a(this._data, N, N * c + le, t, m), G(this._data, N * c), this.texture.name = "fx:groundFrost", this.texture.magFilter = e, this.texture.minFilter = e, this.texture.generateMipmaps = !1, this.texture.colorSpace = "", this.texture.needsUpdate = !0;
		let h = c * I * 4, g = new p();
		this._pos = new l(new Float32Array(h * 3), 3), this._nrm = new l(new Float32Array(h * 3), 3), this._tuft = new l(new Float32Array(h * 4), 4);
		for (let e of [
			this._pos,
			this._nrm,
			this._tuft
		]) e.setUsage(f);
		let _ = new Float32Array(h);
		for (let e = 0; e < c; e++) _.fill(e, e * I * 4, (e + 1) * I * 4);
		let y = new Uint32Array(c * I * 6);
		for (let e = 0, t = c * I; e < t; e++) {
			let t = e * 4;
			y.set([
				t,
				t + 2,
				t + 1,
				t + 1,
				t + 2,
				t + 3
			], e * 6);
		}
		g.setIndex(new l(y, 1)), g.setAttribute("position", this._pos), g.setAttribute("normal", this._nrm), g.setAttribute("aTuft", this._tuft), g.setAttribute("aFrostSlot", new l(_, 1)), g.setDrawRange(0, 0), g.boundingSphere = new n(new u(), 1e6), this.geometry = g, this._uA = Array.from({ length: c }, () => new d(0, 0, 0, 1)), this._uB = Array.from({ length: c }, (e, t) => new d(0, 0, t * N, 0));
		let b = new i({
			color: 16777215,
			polygonOffset: !0,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -4
		});
		b.name = "GroundFrost";
		let x = {
			uFrostTex: { value: this.texture },
			uFrostA: { value: this._uA },
			uFrostB: { value: this._uB },
			uTime: S.uTime,
			uCameraYaw: S.uCameraYaw
		};
		b.onBeforeCompile = (e) => {
			Object.assign(e.uniforms, x), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define GF_CAP ${c}\n${U}`).replace("#include <begin_vertex>", `#include <begin_vertex>\n${he}`), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n#define GF_STRIP ${N * c}\n${ge}`).replace("#include <map_fragment>", W).replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n	totalEmissiveRadiance += gfEmissive;");
		}, b.customProgramCacheKey = () => `luminati-groundfrost-v1-${c}`, this.material = b, this.object = new v(g, b), this.object.name = "fx:groundFrost", this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !1, this.object.receiveShadow = !0, this.object.matrixAutoUpdate = !1, this._items = Array(c).fill(null), this._warm = -1, this._rangeDirty = !1, this._warnedCells = !1, this._data32 = new Uint32Array(this._data.buffer), this._vein = new Uint8Array(N * N), this._used = /* @__PURE__ */ new Uint8Array(4096), this._noise = /* @__PURE__ */ new Float32Array(16641), this._clump = /* @__PURE__ */ new Float32Array(16641), this._lattice = /* @__PURE__ */ new Float32Array(25600), this._clefts = /* @__PURE__ */ new Int32Array(16384);
	}
	get count() {
		return this._items.reduce((e, t) => e + +!!t, 0);
	}
	add(e) {
		let t = this._items.indexOf(null);
		return t < 0 ? -1 : (this._items[t] = {
			x: e.x,
			z: e.z,
			radius: Math.max(.25, Math.min(7, e.radius ?? 3)),
			seed: (e.seed ?? 1) | 0,
			from: null,
			cells: 0,
			tufts: 0,
			dirty: !0,
			warm: !1,
			paths: [],
			painter: null
		}, this._uA[t].set(0, 0, 0, 1), this._rangeDirty = !0, t);
	}
	set(e, t) {
		let n = e >= 0 && e < this.capacity ? this._items[e] : null;
		if (!n) return;
		let r = this._uA[e];
		if (t.spread !== void 0 && (r.x = Math.max(0, Math.min(1, t.spread))), t.fade !== void 0 && (r.y = Math.max(0, Math.min(1, t.fade))), t.cracks !== void 0 && (r.z = Math.max(0, Math.min(1, t.cracks))), t.glow !== void 0 && (r.w = Math.max(0, t.glow)), t.crackFrom !== void 0) {
			let e = t.crackFrom, r = n.from;
			(e ? !r || Math.abs(e.x - r.x) > 1 / M || Math.abs(e.z - r.z) > 1 / M : r) && (n.from = e ? {
				x: e.x,
				z: e.z
			} : null, n.dirty = !0, n.painter = null);
		}
	}
	crackTips(e, t) {
		let n = e >= 0 && e < this.capacity ? this._items[e] : null;
		if (!n || n.dirty) return 0;
		let r = this._uA[e].z, i = 0;
		for (let e = 0; e < n.paths.length && i < t.length; e++) {
			let a = n.paths[e];
			for (let e = 0; e < a.length; e++) {
				let o = a[e];
				if (r < o[4] || r >= o[5]) continue;
				let s = o[5] > o[4] ? (r - o[4]) / (o[5] - o[4]) : 0, c = t[i++];
				c.x = o[0] + (o[2] - o[0]) * s, c.z = o[1] + (o[3] - o[1]) * s, c.y = this._height(n, c.x, c.z);
				break;
			}
		}
		return i;
	}
	free(e) {
		let t = e >= 0 && e < this.capacity ? this._items[e] : null;
		t && (this._clearQuads(e, 0, t.cells), this._clearQuads(e, F, F + t.tufts), this._items[e] = null, this._uA[e].set(0, 0, 0, 1), this._rangeDirty = !0);
	}
	warm() {
		if (this._warm >= 0) return;
		let e = this.add({
			x: 0,
			z: 0,
			radius: 3.5,
			seed: 1
		});
		if (e < 0) return;
		let t = this._items[e];
		t.warm = !0, t.from = {
			x: 0,
			z: 7
		}, this._uA[e].set(1, 0, 1, 1), this._warm = e;
		for (let n = 0; n < 3; n++) t.seed = 1 + n, this._paint(e);
		this._applyRange();
	}
	unwarm() {
		this._warm < 0 || (this.free(this._warm), this._warm = -1, this._applyRange());
	}
	update(e) {
		for (let e = 0; e < this.capacity; e++) {
			let t = this._items[e];
			if (t && t.dirty) {
				t.painter ??= this._painter(e), t.painter.next().done && (t.painter = null);
				break;
			}
		}
		this._rangeDirty && this._applyRange();
	}
	painting() {
		return this._items.some((e) => !!e && e.dirty);
	}
	ready(e) {
		let t = e >= 0 && e < this.capacity ? this._items[e] : null;
		return !!t && !t.dirty;
	}
	dispose() {
		this.object.removeFromParent(), this.geometry.dispose(), this.material.dispose(), this.texture.dispose();
	}
	_applyRange() {
		this._rangeDirty = !1;
		let e = -1;
		for (let t = 0; t < this.capacity; t++) this._items[t] && this._items[t].cells > 0 && (e = t);
		let t = this._items.some(Boolean);
		if (e < 0) {
			this.geometry.setDrawRange(0, 0), this.object.visible = !1;
			return;
		}
		let n = this._items[e];
		this.geometry.setDrawRange(0, (e * I + (n.tufts > 0 ? F + n.tufts : n.cells)) * 6), this.object.visible = t;
	}
	_clearQuads(e, t, n) {
		if (n <= t) return;
		let r = e * I + t, i = e * I + n;
		this._pos.array.fill(0, r * 12, i * 12), this._nrm.array.fill(0, r * 12, i * 12), this._tuft.array.fill(0, r * 16, i * 16), this._mark(r, i - r);
	}
	_mark(e, t) {
		if (!(t <= 0)) for (let n of [
			this._pos,
			this._nrm,
			this._tuft
		]) n.addUpdateRange(e * n.itemSize * 4, t * n.itemSize * 4), n.needsUpdate = !0;
	}
	_height(e, t, n) {
		if (e.warm) return -500;
		let r = this.heightField;
		if (!r) return 0;
		let i = r.surface ? r.surface(t, n) : r.sample(t, n);
		return Number.isFinite(i) ? i : 0;
	}
	_paint(e) {
		let t = this._items[e];
		if (!t) return;
		t.painter = null;
		let n = this._painter(e);
		for (; !n.next().done;);
	}
	*_painter(e) {
		let t = H(), n = 0, r = 0, i = () => {
			let e = H();
			n += e - t, r = Math.max(r, e - t), t = e;
		}, a = this._items[e];
		this._clearQuads(e, 0, a.cells), this._clearQuads(e, F, F + a.tufts), a.cells = 0, a.tufts = 0, a.paths = [], this._rangeDirty = !0;
		let o = a.radius, s = a.seed | 0, c = new x((s * 2654435761 ^ 5369127) >>> 0), l = a.from;
		if (l) {
			let e = N / M - o - 2, t = l.x - a.x, n = l.z - a.z, r = Math.max(Math.abs(t), Math.abs(n));
			r > e && (l = {
				x: a.x + t * e / r,
				z: a.z + n * e / r
			});
		}
		let u = a.x - o - 1, d = a.z - o - 1, f = a.x + o + 1, p = a.z + o + 1;
		l && (u = Math.min(u, l.x - .5), d = Math.min(d, l.z - .5), f = Math.max(f, l.x + .5), p = Math.max(p, l.z + .5));
		let m = Math.floor((u + f) / 2 * M) - N / 2, h = Math.floor((d + p) / 2 * M) - N / 2;
		this._uB[e].set(m, h, e * N, 0);
		let g = this._data, _ = e * N * N * 4;
		this._data32.fill(fe, e * N * N, (e + 1) * N * N);
		let v = this._used;
		v.fill(0);
		let S = (e, t) => e >= 0 && t >= 0 && e < N && t < N, ee = a.x * M - m, C = a.z * M - h, w = (o * 1.15 + .1) * M, T = Math.max(0, Math.floor(ee - w)), E = Math.min(255, Math.ceil(ee + w)), D = Math.max(0, Math.floor(C - w)), O = Math.min(255, Math.ceil(C + w)), k = this._vein;
		for (let e = D; e <= O; e++) k.fill(6, e * N + T, e * N + E + 1);
		let A = (e, t) => e >= T && t >= D && e <= E && t <= O, te = (e, t, n, r, i) => {
			let a = e, o = t, s = n, l = Math.floor(r * 2), u = 4 + c.next() * 7, d = c.next() < .5 ? 1 : -1;
			for (let e = 0; e < l; e++) {
				s += (c.next() - .5) * .2, a += Math.cos(s) * .5, o += Math.sin(s) * .5;
				let t = Math.floor(a), n = Math.floor(o);
				A(t, n) && (k[n * N + t] = 0), i < 2 && e * .5 >= u && (u = e * .5 + (i ? 3 : 4) + c.next() * (i ? 4 : 6), te(a, o, s + Math.PI / 3 * d * (.85 + c.next() * .3), (r - e * .5) * (.3 + c.next() * .25), i + 1), d = -d);
			}
		};
		{
			let e = 7 + c.int(0, 3), t = c.next() * Math.PI * 2;
			for (let n = 0; n < e; n++) te(ee, C, t + n / e * Math.PI * 2 + (c.next() - .5) * .4, o * M * (.75 + c.next() * .35), 0);
		}
		for (let e = D; e <= O; e++) for (let t = T; t <= E; t++) {
			let n = e * N + t, r = k[n];
			r !== 0 && (t > T && (r = Math.min(r, k[n - 1] + 1)), e > D && (r = Math.min(r, k[n - N] + 1), t > T && (r = Math.min(r, k[n - N - 1] + 1)), t < E && (r = Math.min(r, k[n - N + 1] + 1))), k[n] = r);
		}
		for (let e = O; e >= D; e--) for (let t = E; t >= T; t--) {
			let n = e * N + t, r = k[n];
			r !== 0 && (t < E && (r = Math.min(r, k[n + 1] + 1)), e < O && (r = Math.min(r, k[n + N] + 1), t < E && (r = Math.min(r, k[n + N + 1] + 1)), t > T && (r = Math.min(r, k[n + N - 1] + 1))), k[n] = r);
		}
		let j = (E - T >> 1) + 1, ne = (O - D >> 1) + 1, re = this._noise, ie = this._clump, ae = (m + T + 1) / M, L = (h + D + 1) / M;
		ve(re, j, ne, ae, L, 2 / M, .9, 3, s * 31 + 7, this._lattice), ve(ie, j, ne, ae, L, 2 / M, 3.2, 2, s * 31 + 19, this._lattice);
		for (let e = 0, t = j * ne; e < t; e++) ie[e] = Math.min(1, Math.max(0, (ie[e] - .5) * 1.9 + .5));
		i(), yield, t = H();
		let R = 1 / (o * M), le = Math.ceil((O - D + 1) / 3);
		for (let e = D; e <= O; e++) {
			e > D && (e - D) % le === 0 && (i(), yield, t = H());
			let n = (e + .5 - C) * R;
			for (let t = T; t <= E; t++) {
				let r = (t + .5 - ee) * R, i = Math.sqrt(r * r + n * n);
				if (i > 1.15) continue;
				let a = e * N + t, o = k[a], c = (e - D >> 1) * j + (t - T >> 1), l = re[c], u = y(m + t, h + e, s) * 4294967296 >>> 0, d = (u & 255) / 256, f = (u >>> 8 & 255) / 256, p = (u >>> 16 & 255) / 256, x = 1 - b(.2, .6, i), S = pe[o] * (1 - b(.92, 1.12, i)), C = Math.max(x, S) + (l - .5) * .3;
				if (o > 0 && .65 * ie[c] + .35 * f > C) continue;
				let w = i * .85 + (l - .5) * .3 + (d - .5) * .05 - (o <= 1 ? .1 : 0);
				if (w > .995) continue;
				w < 0 && (w = 0);
				let E;
				E = o === 0 ? 3 : t > 0 && e > 0 && k[a - N - 1] === 0 && k[a - N] !== 0 ? 0 : o === 1 ? p < .75 ? 2 : 1 : i > .7 && o > 2 && p < .4 ? 0 : l > .57 ? 2 : 1;
				let O = o === 0 ? p < .1 : p > .975, A = _ + a * 4;
				g[A] = Math.round(w * 254), g[A + 1] = E | (O ? 4 : 0) | u >>> 27 << 3, v[(e >> 2) * P + (t >> 2)] = 1;
			}
		}
		i(), yield, t = H();
		let U = [], he = [
			[],
			[],
			[]
		], ge = (e, t) => {
			for (let n = t; n < U.length; n++) e.push(U[n]);
		}, W = (e, t, n) => {
			let r = 0;
			for (let t = 0; t + 3 < e.length; t += 2) r += Math.hypot(e[t + 2] - e[t], e[t + 3] - e[t + 1]);
			let i = 0;
			for (let a = 0; a + 3 < e.length; a += 2) {
				let o = Math.hypot(e[a + 2] - e[a], e[a + 3] - e[a + 1]), s = t + (n - t) * i / (r || 1);
				i += o, U.push([
					e[a],
					e[a + 1],
					e[a + 2],
					e[a + 3],
					s,
					t + (n - t) * i / (r || 1)
				]);
			}
		}, G = new x((s * 2246822507 ^ 739982445) >>> 0), q;
		if (l) {
			q = Math.atan2(l.z - a.z, l.x - a.x);
			let e = a.x + Math.cos(q) * o * .97, t = a.z + Math.sin(q) * o * .97, n = K(G, l.x, l.z, e, t, .16, 4);
			W(n, 0, V.main), ge(he[0], 0);
			for (let r = 0; r < 3; r++) {
				let r = 2 * Math.floor((.2 + .6 * G.next()) * (n.length / 2 - 1)), i = n[r], a = n[r + 1], o = Math.atan2(t - l.z, e - l.x) + (G.next() < .5 ? 1 : -1) * (.6 + G.next() * .5), s = .3 + G.next() * .5, c = V.main * r / Math.max(1, n.length - 2);
				W(K(G, i, a, i + Math.cos(o) * s, a + Math.sin(o) * s, .2, 2), c, c + V.splinter);
			}
		} else q = G.next() * Math.PI * 2, W(K(G, a.x, a.z, a.x + Math.cos(q) * o * .97, a.z + Math.sin(q) * o * .97, .16, 3), 0, V.main), ge(he[0], 0);
		let J = Math.ceil(Math.PI / .2);
		for (let e of [1, -1]) {
			let t = he[e > 0 ? 1 : 2], n = a.x + Math.cos(q) * o * .97, r = a.z + Math.sin(q) * o * .97;
			for (let i = 1; i <= J; i++) {
				let s = q + i / J * e * Math.PI, c = o * (.97 + (i === J ? 0 : (G.next() - .5) * .06)), l = a.x + Math.cos(s) * c, u = a.z + Math.sin(s) * c, d = V.main + (V.ring - V.main) * (i - 1) / J, f = V.main + (V.ring - V.main) * i / J, p = U.length;
				if (W(K(G, n, r, l, u, .12, 1), d, f), ge(t, p), i < J && G.next() < .42) {
					if (G.next() < .7) {
						let e = o * (.22 + G.next() * .33), t = s + (G.next() - .5) * .5;
						W(K(G, l, u, l - Math.cos(t) * e, u - Math.sin(t) * e, .18, 2), f, Math.min(1, f + V.spoke));
					} else {
						let e = .2 + G.next() * .3;
						W(K(G, l, u, l + Math.cos(s) * e, u + Math.sin(s) * e, .2, 1), f, Math.min(1, f + V.splinter));
					}
				}
				n = l, r = u;
			}
		}
		let ye = 4 + G.int(0, 2);
		for (let e = 0; e < ye; e++) {
			let e = G.next() * Math.PI * 2, t = o * (.15 + G.next() * .22);
			W(K(G, a.x, a.z, a.x + Math.cos(e) * t, a.z + Math.sin(e) * t, .2, 2), V.star0, V.star1);
		}
		let be = this._clefts, xe = 0;
		for (let [e, t, n, r, i, a] of U) _e(e * M - m, t * M - h, n * M - m, r * M - h, (e, t, n) => {
			if (!S(e, t)) return;
			let r = t * N + e, o = _ + r * 4, s = Math.min(253, Math.round((i + (a - i) * n) * 254));
			g[o + 3] === 1 ? s < g[o + 2] && (g[o + 2] = s) : (g[o + 3] = 1, g[o + 2] = s, xe < be.length && (be[xe++] = r), v[(t >> 2) * P + (e >> 2)] = 1);
		});
		for (let e = 0; e < xe; e++) {
			let t = be[e], n = t % N, r = (t - n) / N, i = _ + t * 4, a = g[i + 2], o = r + 1 < N ? i + N * 4 : -1, c = n + 1 < N ? i + 4 : -1, l = o >= 0 && g[o + 3] !== 1 ? o : c >= 0 && g[c + 3] !== 1 ? c : -1;
			if (l >= 0 && (g[l + 3] !== 2 || a < g[l + 2])) {
				g[l + 2] = a, g[l + 3] = 2;
				let e = l - _ >> 2;
				v[(e / N >> 2) * P + (e % N >> 2)] = 1;
			}
			for (let e = 0; e < me.length; e += 2) {
				let t = n + me[e], i = r + me[e + 1];
				if (!S(t, i)) continue;
				let o = _ + (i * N + t) * 4;
				g[o + 3] !== 0 || y(m + t, h + i, s + 404) >= .24 || (g[o + 2] = Math.min(253, a + 6), g[o + 3] = 3, v[(i >> 2) * P + (t >> 2)] = 1);
			}
		}
		i(), yield, t = H();
		let Y = this._pos.array, X = this._nrm.array, Se = this._tuft.array, Z = e * I, Q = 0;
		for (let e = 0; e < 4096; e++) {
			if (!v[e]) continue;
			if (Q >= F) {
				this._warnedCells || (this._warnedCells = !0, console.warn(`[GroundFrost] a patch needs more than ${F} cells: the rest is dropped`));
				break;
			}
			let t = e % P, n = (e - t) / P, r = (m + t * oe) / M, i = (h + n * oe) / M, o = r + oe / M, s = i + oe / M, c = this._height(a, (r + o) / 2, (i + s) / 2), l = 1e-4, u = this._height(a, r + l, i + l), d = this._height(a, o - l, i + l), f = this._height(a, r + l, s - l), p = this._height(a, o - l, s - l);
			Math.abs(u - c) > de && (u = c), Math.abs(d - c) > de && (d = c), Math.abs(f - c) > de && (f = c), Math.abs(p - c) > de && (p = c);
			let g = (Z + Q) * 12;
			Y[g] = r, Y[g + 1] = u + ue, Y[g + 2] = i, Y[g + 3] = o, Y[g + 4] = d + ue, Y[g + 5] = i, Y[g + 6] = r, Y[g + 7] = f + ue, Y[g + 8] = s, Y[g + 9] = o, Y[g + 10] = p + ue, Y[g + 11] = s;
			let _ = (d + p - u - f) / (2 * (o - r)), y = (f + p - u - d) / (2 * (s - i)), b = Math.hypot(_, 1, y);
			for (let e = 0; e < 12; e += 3) X[g + e] = -_ / b, X[g + e + 1] = 1 / b, X[g + e + 2] = -y / b;
			Se.fill(0, (Z + Q) * 16, (Z + Q + 1) * 16), Q++;
		}
		let Ce = Q, $ = 0;
		if (this.tufts) {
			let e = Math.floor((m + T) / M / z), t = Math.ceil((m + E) / M / z), n = Math.floor((h + D) / M / z), r = Math.ceil((h + O) / M / z);
			for (let i = n; i <= r && $ < se; i++) for (let n = e; n <= t && $ < se; n++) {
				let e = y(n, i, s + 505) * 4294967296 >>> 0;
				if ((e & 255) / 256 > .24) continue;
				let t = (n + .15 + (e >>> 8 & 255) / 256 * .7) * z, r = (i + .15 + (e >>> 16 & 255) / 256 * .7) * z, o = Math.floor(t * M) - m, c = Math.floor(r * M) - h;
				if (!S(o, c)) continue;
				let l = _ + (c * N + o) * 4;
				if (g[l] === B || g[l] > 190.5 || g[l + 3] === 1) continue;
				let u = Math.min(.995, g[l] / 254 + .03), d = this._height(a, t, r), f = Z + F + $, p = f * 12, v = f * 16, b = 1 + (e >>> 24) % ce;
				for (let e = 0; e < 4; e++) Y[p + e * 3] = t, Y[p + e * 3 + 1] = d, Y[p + e * 3 + 2] = r, X[p + e * 3] = 0, X[p + e * 3 + 1] = .55, X[p + e * 3 + 2] = .835, Se[v + e * 4] = e & 1 ? -.5 : .5, Se[v + e * 4 + 1] = e >> 1, Se[v + e * 4 + 2] = u, Se[v + e * 4 + 3] = b;
				$++;
			}
		}
		this._mark(Z, Ce), this._mark(Z + F, $), a.cells = Ce, a.tufts = $, a.paths = he, a.dirty = !1, this.texture.needsUpdate = !0, this._rangeDirty = !0, i(), this.paintMs = Math.round(n * 100) / 100, this.sliceMs = Math.round(r * 100) / 100;
	}
};
//#endregion
export { ae as n, q as t };
