import { At as e, Bn as t, C as n, Cr as r, Ct as i, D as a, Dn as o, Dr as s, Dt as c, Er as l, F as u, Ft as d, Gt as f, It as p, K as m, Lt as h, Mn as g, Nn as _, O as v, On as y, Or as b, Ot as x, P as S, Pn as C, Pt as w, R as T, Sr as E, St as D, T as O, Tr as ee, U as k, Un as A, V as j, Vn as M, W as N, Xt as te, Zn as P, Zt as ne, _ as F, _r as re, b as ie, br as ae, bt as I, c as oe, cr as se, dr as ce, dt as le, fr as L, ft as R, g as z, gr as ue, h as de, i as fe, ir as pe, it as me, k as he, kn as ge, kr as _e, kt as ve, l as ye, lr as be, lt as B, mr as xe, nr as V, or as Se, pr as H, pt as Ce, rr as we, s as Te, tr as Ee, ur as De, ut as Oe, vr as ke, vt as U, w as W, wr as Ae, x as je, xr as Me, xt as Ne, y as Pe, yr as Fe, yt as Ie, z as Le } from "./three.core-DTUh_wZY.js";
import { i as G, t as Re } from "./Palette-D7TB3xJk.js";
import { a as K, c as ze, f as q, u as Be } from "./math-Du_SWpiD.js";
import { r as J } from "./ThawField-CqfJ9kmh.js";
import { n as Y } from "./own-rp3p7qEo.js";
import { l as Ve } from "./PixelCanvas-BltpHpzu.js";
import { i as He, l as Ue } from "./ObjectCatalog-CLBSNnc2.js";
//#region node_modules/three/build/three.module.js
function We() {
	let e = null, t = !1, n = null, r = null;
	function i(t, a) {
		r = e.requestAnimationFrame(i), n(t, a);
	}
	return {
		start: function() {
			t !== !0 && n !== null && e !== null && (r = e.requestAnimationFrame(i), t = !0);
		},
		stop: function() {
			e !== null && e.cancelAnimationFrame(r), t = !1;
		},
		setAnimationLoop: function(e) {
			n = e;
		},
		setContext: function(t) {
			e = t;
		}
	};
}
function Ge(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(t, n) {
		let r = t.array, i = t.usage, a = r.byteLength, o = e.createBuffer();
		e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback();
		let s;
		if (r instanceof Float32Array) s = e.FLOAT;
		else if (typeof Float16Array < "u" && r instanceof Float16Array) s = e.HALF_FLOAT;
		else if (r instanceof Uint16Array) s = t.isFloat16BufferAttribute ? e.HALF_FLOAT : e.UNSIGNED_SHORT;
		else if (r instanceof Int16Array) s = e.SHORT;
		else if (r instanceof Uint32Array) s = e.UNSIGNED_INT;
		else if (r instanceof Int32Array) s = e.INT;
		else if (r instanceof Int8Array) s = e.BYTE;
		else if (r instanceof Uint8Array) s = e.UNSIGNED_BYTE;
		else if (r instanceof Uint8ClampedArray) s = e.UNSIGNED_BYTE;
		else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: " + r);
		return {
			buffer: o,
			type: s,
			bytesPerElement: r.BYTES_PER_ELEMENT,
			version: t.version,
			size: a
		};
	}
	function r(t, n, r) {
		let i = n.array, a = n.updateRanges;
		if (e.bindBuffer(r, t), a.length === 0) e.bufferSubData(r, 0, i);
		else {
			a.sort((e, t) => e.start - t.start);
			let t = 0;
			for (let e = 1; e < a.length; e++) {
				let n = a[t], r = a[e];
				r.start <= n.start + n.count + 1 ? n.count = Math.max(n.count, r.start + r.count - n.start) : (++t, a[t] = r);
			}
			a.length = t + 1;
			for (let t = 0, n = a.length; t < n; t++) {
				let n = a[t];
				e.bufferSubData(r, n.start * i.BYTES_PER_ELEMENT, i, n.start, n.count);
			}
			n.clearUpdateRanges();
		}
		n.onUploadCallback();
	}
	function i(e) {
		return e.isInterleavedBufferAttribute && (e = e.data), t.get(e);
	}
	function a(n) {
		n.isInterleavedBufferAttribute && (n = n.data);
		let r = t.get(n);
		r && (e.deleteBuffer(r.buffer), t.delete(n));
	}
	function o(e, i) {
		if (e.isInterleavedBufferAttribute && (e = e.data), e.isGLBufferAttribute) {
			let n = t.get(e);
			(!n || n.version < e.version) && t.set(e, {
				buffer: e.buffer,
				type: e.type,
				bytesPerElement: e.elementSize,
				version: e.version
			});
			return;
		}
		let a = t.get(e);
		if (a === void 0) t.set(e, n(e, i));
		else if (a.version < e.version) {
			if (a.size !== e.array.byteLength) throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
			r(a.buffer, e, i), a.version = e.version;
		}
	}
	return {
		get: i,
		remove: a,
		update: o
	};
}
var X = {
	alphahash_fragment: "#ifdef USE_ALPHAHASH\n	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif",
	alphahash_pars_fragment: "#ifdef USE_ALPHAHASH\n	const float ALPHA_HASH_SCALE = 0.05;\n	float hash2D( vec2 value ) {\n		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n	}\n	float hash3D( vec3 value ) {\n		return hash2D( vec2( hash2D( value.xy ), value.z ) );\n	}\n	float getAlphaHashThreshold( vec3 position ) {\n		float maxDeriv = max(\n			length( dFdx( position.xyz ) ),\n			length( dFdy( position.xyz ) )\n		);\n		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n		vec2 pixScales = vec2(\n			exp2( floor( log2( pixScale ) ) ),\n			exp2( ceil( log2( pixScale ) ) )\n		);\n		vec2 alpha = vec2(\n			hash3D( floor( pixScales.x * position.xyz ) ),\n			hash3D( floor( pixScales.y * position.xyz ) )\n		);\n		float lerpFactor = fract( log2( pixScale ) );\n		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n		float a = min( lerpFactor, 1.0 - lerpFactor );\n		vec3 cases = vec3(\n			x * x / ( 2.0 * a * ( 1.0 - a ) ),\n			( x - 0.5 * a ) / ( 1.0 - a ),\n			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n		);\n		float threshold = ( x < ( 1.0 - a ) )\n			? ( ( x < a ) ? cases.x : cases.y )\n			: cases.z;\n		return clamp( threshold , 1.0e-6, 1.0 );\n	}\n#endif",
	alphamap_fragment: "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif",
	alphamap_pars_fragment: "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	alphatest_fragment: "#ifdef USE_ALPHATEST\n	#ifdef ALPHA_TO_COVERAGE\n	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );\n	if ( diffuseColor.a == 0.0 ) discard;\n	#else\n	if ( diffuseColor.a < alphaTest ) discard;\n	#endif\n#endif",
	alphatest_pars_fragment: "#ifdef USE_ALPHATEST\n	uniform float alphaTest;\n#endif",
	aomap_fragment: "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_CLEARCOAT ) \n		clearcoatSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_SHEEN ) \n		sheenSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD )\n		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n	#endif\n#endif",
	aomap_pars_fragment: "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif",
	batching_pars_vertex: "#ifdef USE_BATCHING\n	#if ! defined( GL_ANGLE_multi_draw )\n	#define gl_DrawID _gl_DrawID\n	uniform int _gl_DrawID;\n	#endif\n	uniform highp sampler2D batchingTexture;\n	uniform highp usampler2D batchingIdTexture;\n	mat4 getBatchingMatrix( const in float i ) {\n		int size = textureSize( batchingTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n	float getIndirectIndex( const in int i ) {\n		int size = textureSize( batchingIdTexture, 0 ).x;\n		int x = i % size;\n		int y = i / size;\n		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );\n	}\n#endif\n#ifdef USE_BATCHING_COLOR\n	uniform sampler2D batchingColorTexture;\n	vec4 getBatchingColor( const in float i ) {\n		int size = textureSize( batchingColorTexture, 0 ).x;\n		int j = int( i );\n		int x = j % size;\n		int y = j / size;\n		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );\n	}\n#endif",
	batching_vertex: "#ifdef USE_BATCHING\n	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );\n#endif",
	begin_vertex: "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n	vPosition = vec3( position );\n#endif",
	beginnormal_vertex: "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n	vec3 objectTangent = vec3( tangent.xyz );\n#endif",
	bsdfs: "float G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( specularColor, 1.0, dotVH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n} // validated",
	iridescence_fragment: "#ifdef USE_IRIDESCENCE\n	const mat3 XYZ_TO_REC709 = mat3(\n		 3.2404542, -0.9692660,  0.0556434,\n		-1.5371385,  1.8760108, -0.2040259,\n		-0.4985314,  0.0415560,  1.0572252\n	);\n	vec3 Fresnel0ToIor( vec3 fresnel0 ) {\n		vec3 sqrtF0 = sqrt( fresnel0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n	}\n	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n	}\n	float IorToFresnel0( float transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n	}\n	vec3 evalSensitivity( float OPD, vec3 shift ) {\n		float phase = 2.0 * PI * OPD * 1.0e-9;\n		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n		xyz /= 1.0685e-7;\n		vec3 rgb = XYZ_TO_REC709 * xyz;\n		return rgb;\n	}\n	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n		vec3 I;\n		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n		float cosTheta2Sq = 1.0 - sinTheta2Sq;\n		if ( cosTheta2Sq < 0.0 ) {\n			return vec3( 1.0 );\n		}\n		float cosTheta2 = sqrt( cosTheta2Sq );\n		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n		float R12 = F_Schlick( R0, 1.0, cosTheta1 );\n		float T121 = 1.0 - R12;\n		float phi12 = 0.0;\n		if ( iridescenceIOR < outsideIOR ) phi12 = PI;\n		float phi21 = PI - phi12;\n		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n		vec3 phi23 = vec3( 0.0 );\n		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n		vec3 phi = vec3( phi21 ) + phi23;\n		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n		vec3 r123 = sqrt( R123 );\n		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n		vec3 C0 = R12 + Rs;\n		I = C0;\n		vec3 Cm = Rs - T121;\n		for ( int m = 1; m <= 2; ++ m ) {\n			Cm *= r123;\n			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n			I += Cm * Sm;\n		}\n		return max( I, vec3( 0.0 ) );\n	}\n#endif",
	bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vBumpMapUv );\n		vec2 dSTdy = dFdy( vBumpMapUv );\n		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 ) * faceDirection;\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif",
	clipping_planes_fragment: "#if NUM_CLIPPING_PLANES > 0\n	vec4 plane;\n	#ifdef ALPHA_TO_COVERAGE\n		float distanceToPlane, distanceGradient;\n		float clipOpacity = 1.0;\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n			distanceGradient = fwidth( distanceToPlane ) / 2.0;\n			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			if ( clipOpacity == 0.0 ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			float unionClipOpacity = 1.0;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n				distanceGradient = fwidth( distanceToPlane ) / 2.0;\n				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			}\n			#pragma unroll_loop_end\n			clipOpacity *= 1.0 - unionClipOpacity;\n		#endif\n		diffuseColor.a *= clipOpacity;\n		if ( diffuseColor.a == 0.0 ) discard;\n	#else\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			bool clipped = true;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n			}\n			#pragma unroll_loop_end\n			if ( clipped ) discard;\n		#endif\n	#endif\n#endif",
	clipping_planes_pars_fragment: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
	clipping_planes_pars_vertex: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n#endif",
	clipping_planes_vertex: "#if NUM_CLIPPING_PLANES > 0\n	vClipPosition = - mvPosition.xyz;\n#endif",
	color_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	diffuseColor *= vColor;\n#endif",
	color_pars_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#endif",
	color_pars_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	varying vec4 vColor;\n#endif",
	color_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	vColor = vec4( 1.0 );\n#endif\n#ifdef USE_COLOR_ALPHA\n	vColor *= color;\n#elif defined( USE_COLOR )\n	vColor.rgb *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.rgb *= instanceColor.rgb;\n#endif\n#ifdef USE_BATCHING_COLOR\n	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );\n#endif",
	common: "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n	float precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n	float precisionSafeLength( vec3 v ) {\n		float maxComponent = max3( abs( v ) );\n		return length( v / maxComponent ) * maxComponent;\n	}\n#endif\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n	varying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n#define inverseTransformDirection transformDirectionByInverseViewMatrix\nvec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );\n}\nvec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n	return m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n	return vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated",
	cube_uv_reflection_fragment: "#ifdef ENVMAP_TYPE_CUBE_UV\n	#define cubeUV_minMipLevel 4.0\n	#define cubeUV_minTileSize 16.0\n	float getFace( vec3 direction ) {\n		vec3 absDirection = abs( direction );\n		float face = - 1.0;\n		if ( absDirection.x > absDirection.z ) {\n			if ( absDirection.x > absDirection.y )\n				face = direction.x > 0.0 ? 0.0 : 3.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		} else {\n			if ( absDirection.z > absDirection.y )\n				face = direction.z > 0.0 ? 2.0 : 5.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		}\n		return face;\n	}\n	vec2 getUV( vec3 direction, float face ) {\n		vec2 uv;\n		if ( face == 0.0 ) {\n			uv = vec2( direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 1.0 ) {\n			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n		} else if ( face == 2.0 ) {\n			uv = vec2( - direction.x, direction.y ) / abs( direction.z );\n		} else if ( face == 3.0 ) {\n			uv = vec2( - direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 4.0 ) {\n			uv = vec2( - direction.x, direction.z ) / abs( direction.y );\n		} else {\n			uv = vec2( direction.x, direction.y ) / abs( direction.z );\n		}\n		return 0.5 * ( uv + 1.0 );\n	}\n	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n		float face = getFace( direction );\n		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n		mipInt = max( mipInt, cubeUV_minMipLevel );\n		float faceSize = exp2( mipInt );\n		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n		if ( face > 2.0 ) {\n			uv.y += faceSize;\n			face -= 3.0;\n		}\n		uv.x += face * faceSize;\n		uv.x += filterInt * 3.0 * cubeUV_minTileSize;\n		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n		uv.x *= CUBEUV_TEXEL_WIDTH;\n		uv.y *= CUBEUV_TEXEL_HEIGHT;\n		#ifdef texture2DGradEXT\n			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n		#else\n			return texture2D( envMap, uv ).rgb;\n		#endif\n	}\n	#define cubeUV_r0 1.0\n	#define cubeUV_m0 - 2.0\n	#define cubeUV_r1 0.8\n	#define cubeUV_m1 - 1.0\n	#define cubeUV_r4 0.4\n	#define cubeUV_m4 2.0\n	#define cubeUV_r5 0.305\n	#define cubeUV_m5 3.0\n	#define cubeUV_r6 0.21\n	#define cubeUV_m6 4.0\n	float roughnessToMip( float roughness ) {\n		float mip = 0.0;\n		if ( roughness >= cubeUV_r1 ) {\n			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n		} else if ( roughness >= cubeUV_r4 ) {\n			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n		} else if ( roughness >= cubeUV_r5 ) {\n			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n		} else if ( roughness >= cubeUV_r6 ) {\n			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n		} else {\n			mip = - 2.0 * log2( 1.16 * roughness );		}\n		return mip;\n	}\n	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n		float mipF = fract( mip );\n		float mipInt = floor( mip );\n		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n		if ( mipF == 0.0 ) {\n			return vec4( color0, 1.0 );\n		} else {\n			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n			return vec4( mix( color0, color1, mipF ), 1.0 );\n		}\n	}\n#endif",
	defaultnormal_vertex: "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n	vec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n	mat3 bm = mat3( batchingMatrix );\n	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n	transformedNormal = bm * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = bm * transformedTangent;\n	#endif\n#endif\n#ifdef USE_INSTANCING\n	mat3 im = mat3( instanceMatrix );\n	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n	transformedNormal = im * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = im * transformedTangent;\n	#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n	transformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n#endif",
	displacementmap_pars_vertex: "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif",
	displacementmap_vertex: "#ifdef USE_DISPLACEMENTMAP\n	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif",
	emissivemap_fragment: "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE\n		emissiveColor = sRGBTransferEOTF( emissiveColor );\n	#endif\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
	emissivemap_pars_fragment: "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif",
	colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
	colorspace_pars_fragment: "vec4 LinearTransferOETF( in vec4 value ) {\n	return value;\n}\nvec4 sRGBTransferEOTF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}",
	envmap_fragment: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vec3 cameraToFrag;\n		if ( isOrthographic ) {\n			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToFrag = normalize( vWorldPosition - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToFrag, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );\n		#ifdef ENVMAP_BLENDING_MULTIPLY\n			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_MIX )\n			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_ADD )\n			outgoingLight += envColor.xyz * specularStrength * reflectivity;\n		#endif\n	#endif\n#endif",
	envmap_common_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float envMapIntensity;\n	uniform mat3 envMapRotation;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n#endif",
	envmap_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float reflectivity;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		varying vec3 vWorldPosition;\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif",
	envmap_pars_vertex: "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif",
	envmap_physical_pars_fragment: "#ifdef USE_ENVMAP\n	vec3 getIBLIrradiance( const in vec3 normal ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );\n			return PI * envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 reflectVec = reflect( - viewDir, normal );\n			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );\n			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n			return envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	#ifdef USE_RETROREFLECTION\n		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );\n				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );\n				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );\n				return envMapColor.rgb * envMapIntensity;\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n	#endif\n	#ifdef USE_ANISOTROPY\n		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 bentNormal = cross( bitangent, viewDir );\n				bentNormal = normalize( cross( bentNormal, bitangent ) );\n				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n				return getIBLRadiance( viewDir, bentNormal, roughness );\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n		#ifdef USE_RETROREFLECTION\n			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n				#ifdef ENVMAP_TYPE_CUBE_UV\n					vec3 bentNormal = cross( bitangent, viewDir );\n					bentNormal = normalize( cross( bentNormal, bitangent ) );\n					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n					return getIBLRetroRadiance( viewDir, bentNormal, roughness );\n				#else\n					return vec3( 0.0 );\n				#endif\n			}\n		#endif\n	#endif\n#endif",
	envmap_vertex: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex;\n		if ( isOrthographic ) {\n			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif",
	fog_vertex: "#ifdef USE_FOG\n	vFogDepth = - mvPosition.z;\n#endif",
	fog_pars_vertex: "#ifdef USE_FOG\n	varying float vFogDepth;\n#endif",
	fog_fragment: "#ifdef USE_FOG\n	#ifdef FOG_EXP2\n		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
	fog_pars_fragment: "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	varying float vFogDepth;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif",
	gradientmap_pars_fragment: "#ifdef USE_GRADIENTMAP\n	uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n	float dotNL = dot( normal, lightDirection );\n	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n	#ifdef USE_GRADIENTMAP\n		return vec3( texture2D( gradientMap, coord ).r );\n	#else\n		vec2 fw = fwidth( coord ) * 0.5;\n		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n	#endif\n}",
	lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif",
	lights_lambert_fragment: "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;",
	lights_lambert_pars_fragment: "varying vec3 vViewPosition;\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Lambert\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert",
	lights_pars_begin: "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n	uniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n	float x = normal.x, y = normal.y, z = normal.z;\n	vec3 result = shCoefficients[ 0 ] * 0.886227;\n	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n	return result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n	return irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	return irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n	if ( cutoffDistance > 0.0 ) {\n		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n	}\n	return distanceFalloff;\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n	return smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_SUN_LIGHTS > 0\n	struct SunLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];\n	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {\n		light.color = sunLight.color;\n		light.direction = sunLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n		light.color = directionalLight.color;\n		light.direction = directionalLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = pointLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		light.color = pointLight.color;\n		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n		light.visible = ( light.color != vec3( 0.0 ) );\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = spotLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float angleCos = dot( light.direction, spotLight.direction );\n		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n		if ( spotAttenuation > 0.0 ) {\n			float lightDistance = length( lVector );\n			light.color = spotLight.color * spotAttenuation;\n			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n			light.visible = ( light.color != vec3( 0.0 ) );\n		} else {\n			light.color = vec3( 0.0 );\n			light.visible = false;\n		}\n	}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n	struct RectAreaLight {\n		vec3 color;\n		vec3 position;\n		vec3 halfWidth;\n		vec3 halfHeight;\n	};\n	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;\n	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n		float dotNL = dot( normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		return irradiance;\n	}\n#endif\n#include <lightprobes_pars_fragment>",
	lights_toon_fragment: "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
	lights_toon_pars_fragment: "varying vec3 vViewPosition;\nstruct ToonMaterial {\n	vec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Toon\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon",
	lights_phong_fragment: "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
	lights_phong_pars_fragment: "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n	vec3 diffuseColor;\n	vec3 specularColor;\n	float specularShininess;\n	float specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong",
	lights_physical_fragment: "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.metalness = metalnessFactor;\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n	material.ior = ior;\n	#ifdef USE_SPECULAR\n		float specularIntensityFactor = specularIntensity;\n		vec3 specularColorFactor = specularColor;\n		#ifdef USE_SPECULAR_COLORMAP\n			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n		#endif\n		#ifdef USE_SPECULAR_INTENSITYMAP\n			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n		#endif\n		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n	#else\n		float specularIntensityFactor = 1.0;\n		vec3 specularColorFactor = vec3( 1.0 );\n		material.specularF90 = 1.0;\n	#endif\n	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = vec3( 0.04 );\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n	material.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n	material.clearcoat = clearcoat;\n	material.clearcoatRoughness = clearcoatRoughness;\n	material.clearcoatF0 = vec3( 0.04 );\n	material.clearcoatF90 = 1.0;\n	#ifdef USE_CLEARCOATMAP\n		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n	#endif\n	#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n	#endif\n	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n	material.clearcoatRoughness += geometryRoughness;\n	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_DISPERSION\n	material.dispersion = dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	material.retroreflectivity = retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	material.iridescence = iridescence;\n	material.iridescenceIOR = iridescenceIOR;\n	#ifdef USE_IRIDESCENCEMAP\n		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n	#endif\n	#ifdef USE_IRIDESCENCE_THICKNESSMAP\n		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n	#else\n		material.iridescenceThickness = iridescenceThicknessMaximum;\n	#endif\n#endif\n#ifdef USE_SHEEN\n	material.sheenColor = sheenColor;\n	#ifdef USE_SHEEN_COLORMAP\n		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n	#endif\n	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	#ifdef USE_ANISOTROPYMAP\n		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n	#else\n		vec2 anisotropyV = anisotropyVector;\n	#endif\n	material.anisotropy = length( anisotropyV );\n	if( material.anisotropy == 0.0 ) {\n		anisotropyV = vec2( 1.0, 0.0 );\n	} else {\n		anisotropyV /= material.anisotropy;\n		material.anisotropy = saturate( material.anisotropy );\n	}\n	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif",
	lights_physical_pars_fragment: "uniform sampler2D dfgLUT;\nstruct PhysicalMaterial {\n	vec3 diffuseColor;\n	vec3 diffuseContribution;\n	vec3 specularColor;\n	vec3 specularColorBlended;\n	float roughness;\n	float metalness;\n	float specularF90;\n	float dispersion;\n	vec2 dfg;\n	vec3 multiScatteringCompensation;\n	#ifdef USE_RETROREFLECTION\n		float retroreflectivity;\n	#endif\n	#ifdef USE_CLEARCOAT\n		float clearcoat;\n		float clearcoatRoughness;\n		vec3 clearcoatF0;\n		float clearcoatF90;\n	#endif\n	#ifdef USE_IRIDESCENCE\n		float iridescence;\n		float iridescenceIOR;\n		float iridescenceThickness;\n		vec3 iridescenceFresnel;\n		vec3 iridescenceF0Dielectric;\n		vec3 iridescenceF0Metallic;\n	#endif\n	#ifdef USE_SHEEN\n		vec3 sheenColor;\n		float sheenRoughness;\n	#endif\n	#ifdef IOR\n		float ior;\n	#endif\n	#ifdef USE_TRANSMISSION\n		float transmission;\n		float transmissionAlpha;\n		float thickness;\n		float attenuationDistance;\n		vec3 attenuationColor;\n	#endif\n	#ifdef USE_ANISOTROPY\n		float anisotropy;\n		float alphaT;\n		vec3 anisotropyT;\n		vec3 anisotropyB;\n	#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n		return 0.5 / max( gv + gl, EPSILON );\n	}\n	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n		float a2 = alphaT * alphaB;\n		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n		highp float v2 = dot( v, v );\n		float w2 = a2 / v2;\n		return RECIPROCAL_PI * a2 * pow2 ( w2 );\n	}\n#endif\n#ifdef USE_CLEARCOAT\n	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n		vec3 f0 = material.clearcoatF0;\n		float f90 = material.clearcoatF90;\n		float roughness = material.clearcoatRoughness;\n		float alpha = pow2( roughness );\n		vec3 halfDir = normalize( lightDir + viewDir );\n		float dotNL = saturate( dot( normal, lightDir ) );\n		float dotNV = saturate( dot( normal, viewDir ) );\n		float dotNH = saturate( dot( normal, halfDir ) );\n		float dotVH = saturate( dot( viewDir, halfDir ) );\n		vec3 F = F_Schlick( f0, f90, dotVH );\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n		return F * ( V * D );\n	}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 f0 = material.specularColorBlended;\n	float f90 = material.specularF90;\n	float roughness = material.roughness;\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( f0, f90, dotVH );\n	#ifdef USE_IRIDESCENCE\n		F = mix( F, material.iridescenceFresnel, material.iridescence );\n	#endif\n	#ifdef USE_ANISOTROPY\n		float dotTL = dot( material.anisotropyT, lightDir );\n		float dotTV = dot( material.anisotropyT, viewDir );\n		float dotTH = dot( material.anisotropyT, halfDir );\n		float dotBL = dot( material.anisotropyB, lightDir );\n		float dotBV = dot( material.anisotropyB, viewDir );\n		float dotBH = dot( material.anisotropyB, halfDir );\n		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n	#else\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n	#endif\n	return F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n	const float LUT_SIZE = 64.0;\n	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n	const float LUT_BIAS = 0.5 / LUT_SIZE;\n	float dotNV = saturate( dot( N, V ) );\n	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n	uv = uv * LUT_SCALE + LUT_BIAS;\n	return uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n	float l = length( f );\n	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n	float x = dot( v1, v2 );\n	float y = abs( x );\n	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n	float v = a / b;\n	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n	return cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n	vec3 lightNormal = cross( v1, v2 );\n	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n	vec3 T1, T2;\n	T1 = normalize( V - N * dot( V, N ) );\n	T2 = - cross( N, T1 );\n	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );\n	vec3 coords[ 4 ];\n	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n	coords[ 0 ] = normalize( coords[ 0 ] );\n	coords[ 1 ] = normalize( coords[ 1 ] );\n	coords[ 2 ] = normalize( coords[ 2 ] );\n	coords[ 3 ] = normalize( coords[ 3 ] );\n	vec3 vectorFormFactor = vec3( 0.0 );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n	return vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n	float alpha = pow2( roughness );\n	float invAlpha = 1.0 / alpha;\n	float cos2h = dotNH * dotNH;\n	float sin2h = max( 1.0 - cos2h, 0.0078125 );\n	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float D = D_Charlie( sheenRoughness, dotNH );\n	float V = V_Neubelt( dotNV, dotNL );\n	return sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float r2 = roughness * roughness;\n	float rInv = 1.0 / ( roughness + 0.1 );\n	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;\n	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;\n	float DG = exp( a * dotNV + b );\n	return saturate( DG );\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;\n	return specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n	#ifdef USE_IRIDESCENCE\n		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n	#else\n		vec3 Fr = specularColor;\n	#endif\n	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n	float Ess = fab.x + fab.y;\n	float Ems = 1.0 - Ess;\n	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n	singleScatter += FssEss;\n	multiScatter += Fms * Ems;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n		vec3 normal = geometryNormal;\n		vec3 viewDir = geometryViewDir;\n		vec3 position = geometryPosition;\n		vec3 lightPos = rectAreaLight.position;\n		vec3 halfWidth = rectAreaLight.halfWidth;\n		vec3 halfHeight = rectAreaLight.halfHeight;\n		vec3 lightColor = rectAreaLight.color;\n		float roughness = material.roughness;\n		vec3 rectCoords[ 4 ];\n		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n		vec2 uv = LTC_Uv( normal, viewDir, roughness );\n		vec4 t1 = texture2D( ltc_1, uv );\n		vec4 t2 = texture2D( ltc_2, uv );\n		mat3 mInv = mat3(\n			vec3( t1.x, 0, t1.y ),\n			vec3(    0, 1,    0 ),\n			vec3( t1.z, 0, t1.w )\n		);\n		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );\n		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n		#ifdef USE_CLEARCOAT\n			vec3 Ncc = geometryClearcoatNormal;\n			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );\n			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );\n			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );\n			mat3 mInvClearcoat = mat3(\n				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),\n				vec3(             0, 1,             0 ),\n				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )\n			);\n			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;\n			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );\n		#endif\n	}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifdef USE_CLEARCOAT\n		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n		vec3 ccIrradiance = dotNLcc * directLight.color;\n		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n	#endif\n	#ifdef USE_SHEEN\n \n 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n \n 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );\n \n 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );\n \n 		irradiance *= sheenEnergyComp;\n \n 	#endif\n	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );\n		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );\n		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;\n	vec3 halfDir = normalize( directLight.direction + geometryViewDir );\n	float dotVH = saturate( dot( geometryViewDir, halfDir ) );\n	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );\n		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );\n		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );\n		F = mix( F, retroF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 singleScattering = vec3( 0.0 );\n	vec3 multiScattering = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );\n	#endif\n	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		diffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectDiffuse += diffuse;\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n	#ifdef USE_CLEARCOAT\n		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;\n 	#endif\n	vec3 singleScatteringDielectric = vec3( 0.0 );\n	vec3 multiScatteringDielectric = vec3( 0.0 );\n	vec3 singleScatteringMetallic = vec3( 0.0 );\n	vec3 multiScatteringMetallic = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );\n	#endif\n	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );\n	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );\n	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;\n	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );\n	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n	vec3 indirectSpecular = radiance * singleScattering;\n	indirectSpecular += multiScattering * cosineWeightedIrradiance;\n	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		indirectSpecular *= sheenEnergyComp;\n		indirectDiffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectSpecular += indirectSpecular;\n	reflectedLight.indirectDiffuse += indirectDiffuse;\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_Direct_RectArea		RE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
	lights_fragment_begin: "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n	geometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n	float dotNVi = saturate( dot( normal, geometryViewDir ) );\n	if ( material.iridescenceThickness == 0.0 ) {\n		material.iridescence = 0.0;\n	} else {\n		material.iridescence = saturate( material.iridescence );\n	}\n	if ( material.iridescence > 0.0 ) {\n		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );\n		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );\n		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );\n		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );\n	}\n#endif\n#ifdef STANDARD\n	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );\n	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;\n	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )\n		float EssMs = material.dfg.x + material.dfg.y;\n		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );\n	#endif\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointLightInfo( pointLight, geometryPosition, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n		pointLightShadow = pointLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	vec4 spotColor;\n	vec3 spotLightCoord;\n	bool inSpotLightMap;\n	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotLightInfo( spotLight, geometryPosition, directLight );\n		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n		#else\n		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#endif\n		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n		#endif\n		#undef SPOT_LIGHT_MAP_INDEX\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		spotLightShadow = spotLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )\n	SunLight sunLight;\n	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {\n		sunLight = sunLights[ i ];\n		getSunLightInfo( sunLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )\n		sunLightShadow = sunLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalLightInfo( directionalLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n		directionalLightShadow = directionalLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n	RectAreaLight rectAreaLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n		rectAreaLight = rectAreaLights[ i ];\n		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 iblIrradiance = vec3( 0.0 );\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#if defined( USE_LIGHT_PROBES )\n		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n		}\n		#pragma unroll_loop_end\n	#endif\n	#ifdef USE_LIGHT_PROBES_GRID\n		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;\n		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );\n		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );\n	#endif\n#endif\n#if defined( RE_IndirectSpecular )\n	vec3 radiance = vec3( 0.0 );\n	vec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
	lights_fragment_maps: "#if defined( RE_IndirectDiffuse )\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n		irradiance += lightMapIrradiance;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )\n		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )\n			iblIrradiance += getIBLIrradiance( geometryNormal );\n		#endif\n	#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	#ifdef USE_ANISOTROPY\n		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n	#else\n		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n	#endif\n	#ifdef USE_RETROREFLECTION\n		#ifdef USE_ANISOTROPY\n			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n		#else\n			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );\n		#endif\n		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );\n	#endif\n	radiance += iblRadiance;\n	#ifdef USE_CLEARCOAT\n		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n	#endif\n#endif",
	lights_fragment_end: "#if defined( RE_IndirectDiffuse )\n	#if defined( LAMBERT ) || defined( PHONG )\n		irradiance += iblIrradiance;\n	#endif\n	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif",
	lightprobes_pars_fragment: "#ifdef USE_LIGHT_PROBES_GRID\nuniform highp sampler3D probesSH;\nuniform vec3 probesMin;\nuniform vec3 probesMax;\nuniform vec3 probesResolution;\nvec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {\n	vec3 res = probesResolution;\n	vec3 gridRange = probesMax - probesMin;\n	vec3 resMinusOne = res - 1.0;\n	vec3 probeSpacing = gridRange / resMinusOne;\n	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;\n	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );\n	uvw = uvw * resMinusOne / res + 0.5 / res;\n	float nz          = res.z;\n	float paddedSlices = nz + 2.0;\n	float atlasDepth  = 7.0 * paddedSlices;\n	float uvZBase     = uvw.z * nz + 1.0;\n	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );\n	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );\n	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );\n	vec3 c0 = s0.xyz;\n	vec3 c1 = vec3( s0.w, s1.xy );\n	vec3 c2 = vec3( s1.zw, s2.x );\n	vec3 c3 = s2.yzw;\n	vec3 c4 = s3.xyz;\n	vec3 c5 = vec3( s3.w, s4.xy );\n	vec3 c6 = vec3( s4.zw, s5.x );\n	vec3 c7 = s5.yzw;\n	vec3 c8 = s6.xyz;\n	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;\n	vec3 result = c0 * 0.886227;\n	result += c1 * 2.0 * 0.511664 * y;\n	result += c2 * 2.0 * 0.511664 * z;\n	result += c3 * 2.0 * 0.511664 * x;\n	result += c4 * 2.0 * 0.429043 * x * y;\n	result += c5 * 2.0 * 0.429043 * y * z;\n	result += c6 * ( 0.743125 * z * z - 0.247708 );\n	result += c7 * 2.0 * 0.429043 * x * z;\n	result += c8 * 0.429043 * ( x * x - y * y );\n	return max( result, vec3( 0.0 ) );\n}\n#endif",
	logdepthbuf_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
	logdepthbuf_pars_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	uniform float logDepthBufFC;\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_pars_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	vFragDepth = 1.0 + gl_Position.w;\n	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n#endif",
	map_fragment: "#ifdef USE_MAP\n	vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );\n	#endif\n	diffuseColor *= sampledDiffuseColor;\n#endif",
	map_pars_fragment: "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif",
	map_particle_fragment: "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n	#if defined( USE_POINTS_UV )\n		vec2 uv = vUv;\n	#else\n		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n	#endif\n#endif\n#ifdef USE_MAP\n	diffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
	map_particle_pars_fragment: "#if defined( USE_POINTS_UV )\n	varying vec2 vUv;\n#else\n	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n		uniform mat3 uvTransform;\n	#endif\n#endif\n#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	metalnessmap_fragment: "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n	metalnessFactor *= texelMetalness.b;\n#endif",
	metalnessmap_pars_fragment: "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif",
	morphinstance_vertex: "#ifdef USE_INSTANCING_MORPH\n	float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;\n	}\n#endif",
	morphcolor_vertex: "#if defined( USE_MORPHCOLORS )\n	vColor *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		#if defined( USE_COLOR_ALPHA )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n		#elif defined( USE_COLOR )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n		#endif\n	}\n#endif",
	morphnormal_vertex: "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n	#ifndef USE_INSTANCING_MORPH\n		uniform float morphTargetBaseInfluence;\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	#endif\n	uniform sampler2DArray morphTargetsTexture;\n	uniform ivec2 morphTargetsTextureSize;\n	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n		int y = texelIndex / morphTargetsTextureSize.x;\n		int x = texelIndex - y * morphTargetsTextureSize.x;\n		ivec3 morphUV = ivec3( x, y, morphTargetIndex );\n		return texelFetch( morphTargetsTexture, morphUV, 0 );\n	}\n#endif",
	morphtarget_vertex: "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	normal_fragment_begin: "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal *= faceDirection;\n	#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n	#ifdef USE_TANGENT\n		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn = getTangentFrame( - vViewPosition, normal,\n		#if defined( USE_NORMALMAP )\n			vNormalMapUv\n		#elif defined( USE_CLEARCOAT_NORMALMAP )\n			vClearcoatNormalMapUv\n		#else\n			vUv\n		#endif\n		);\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn[0] *= faceDirection;\n		tbn[1] *= faceDirection;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	#ifdef USE_TANGENT\n		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn2[0] *= faceDirection;\n		tbn2[1] *= faceDirection;\n	#endif\n#endif\nvec3 nonPerturbedNormal = normal;",
	normal_fragment_maps: "#ifdef USE_NORMALMAP_OBJECTSPACE\n	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#ifdef FLIP_SIDED\n		normal = - normal;\n	#endif\n	#ifdef DOUBLE_SIDED\n		normal = normal * faceDirection;\n	#endif\n	normal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#if defined( USE_PACKED_NORMALMAP )\n		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );\n	#endif\n	mapN.xy *= normalScale;\n	normal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif",
	normal_pars_fragment: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_pars_vertex: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_vertex: "#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n	#ifdef USE_TANGENT\n		vTangent = normalize( transformedTangent );\n		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n		#ifdef FLIP_SIDED\n			vBitangent = - vBitangent;\n		#endif\n	#endif\n#endif",
	normalmap_pars_fragment: "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n	uniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		vec3 N = surf_norm;\n		vec3 q1perp = cross( q1, N );\n		vec3 q0perp = cross( N, q0 );\n		vec3 T = q1perp * st0.x + q0perp * st1.x;\n		vec3 B = q1perp * st0.y + q0perp * st1.y;\n		float det = max( dot( T, T ), dot( B, B ) );\n		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n		return mat3( T * scale, B * scale, N );\n	}\n#endif",
	clearcoat_normal_fragment_begin: "#ifdef USE_CLEARCOAT\n	vec3 clearcoatNormal = nonPerturbedNormal;\n#endif",
	clearcoat_normal_fragment_maps: "#ifdef USE_CLEARCOAT_NORMALMAP\n	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n	clearcoatMapN.xy *= clearcoatNormalScale;\n	clearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif",
	clearcoat_pars_fragment: "#ifdef USE_CLEARCOATMAP\n	uniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform sampler2D clearcoatNormalMap;\n	uniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform sampler2D clearcoatRoughnessMap;\n#endif",
	iridescence_pars_fragment: "#ifdef USE_IRIDESCENCEMAP\n	uniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform sampler2D iridescenceThicknessMap;\n#endif",
	opaque_fragment: "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );",
	packing: "vec3 packNormalToRGB( const in vec3 normal ) {\n	return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n	return 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;\nconst float Inv255 = 1. / 255.;\nconst vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );\nconst vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );\nconst vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );\nconst vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );\nvec4 packDepthToRGBA( const in float v ) {\n	if( v <= 0.0 )\n		return vec4( 0., 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec4( 1., 1., 1., 1. );\n	float vuf;\n	float af = modf( v * PackFactors.a, vuf );\n	float bf = modf( vuf * ShiftRight8, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );\n}\nvec3 packDepthToRGB( const in float v ) {\n	if( v <= 0.0 )\n		return vec3( 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec3( 1., 1., 1. );\n	float vuf;\n	float bf = modf( v * PackFactors.b, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec3( vuf * Inv255, gf * PackUpscale, bf );\n}\nvec2 packDepthToRG( const in float v ) {\n	if( v <= 0.0 )\n		return vec2( 0., 0. );\n	if( v >= 1.0 )\n		return vec2( 1., 1. );\n	float vuf;\n	float gf = modf( v * 256., vuf );\n	return vec2( vuf * Inv255, gf );\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors4 );\n}\nfloat unpackRGBToDepth( const in vec3 v ) {\n	return dot( v, UnpackFactors3 );\n}\nfloat unpackRGToDepth( const in vec2 v ) {\n	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;\n}\nvec4 pack2HalfToRGBA( const in vec2 v ) {\n	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( const in vec4 v ) {\n	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n	\n		return depth * ( far - near ) - far;\n	#else\n		return depth * ( near - far ) - near;\n	#endif\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		return ( near * far ) / ( ( near - far ) * depth - near );\n	#else\n		return ( near * far ) / ( ( far - near ) * depth - far );\n	#endif\n}",
	premultiplied_alpha_fragment: "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif",
	project_vertex: "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n	mvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n	mvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
	dithering_fragment: "#ifdef DITHERING\n	gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
	dithering_pars_fragment: "#ifdef DITHERING\n	vec3 dithering( vec3 color ) {\n		float grid_position = rand( gl_FragCoord.xy );\n		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n		return color + dither_shift_RGB;\n	}\n#endif",
	roughnessmap_fragment: "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n	roughnessFactor *= texelRoughness.g;\n#endif",
	roughnessmap_pars_fragment: "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif",
	shadowmap_pars_fragment: "#if NUM_SPOT_LIGHT_COORDS > 0\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		#define SUN_LIGHT_CASCADES 2\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#endif\n		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n		struct SunLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#endif\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#elif defined( SHADOWMAP_TYPE_BASIC )\n			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float interleavedGradientNoise( vec2 position ) {\n			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );\n		}\n		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {\n			const float goldenAngle = 2.399963229728653;\n			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );\n			float theta = float( sampleIndex ) * goldenAngle + phi;\n			return vec2( cos( theta ), sin( theta ) ) * r;\n		}\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			shadowCoord.z += shadowBias;\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n				float radius = shadowRadius * texelSize.x;\n				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n				shadow = (\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )\n				) * 0.2;\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#elif defined( SHADOWMAP_TYPE_VSM )\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;\n				float mean = distribution.x;\n				float variance = distribution.y * distribution.y;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					float hard_shadow = step( mean, shadowCoord.z );\n				#else\n					float hard_shadow = step( shadowCoord.z, mean );\n				#endif\n				\n				if ( hard_shadow == 1.0 ) {\n					shadow = 1.0;\n				} else {\n					variance = max( variance, 0.0000001 );\n					float d = shadowCoord.z - mean;\n					float p_max = variance / ( variance + d * d );\n					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );\n					shadow = max( hard_shadow, p_max );\n				}\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#else\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				float depth = texture2D( shadowMap, shadowCoord.xy ).r;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					shadow = step( depth, shadowCoord.z );\n				#else\n					shadow = step( shadowCoord.z, depth );\n				#endif\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#endif\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		float getSunShadow(\n			#if defined( SHADOWMAP_TYPE_PCF )\n				sampler2DShadow shadowMap,\n			#else\n				sampler2D shadowMap,\n			#endif\n			SunLightShadow sunLightShadow,\n			int shadowIndex\n		) {\n			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );\n			float viewDepth = vSunShadowWorldPosition.w;\n			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;\n			float shadow = 1.0;\n			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {\n				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];\n				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {\n					float cascadeShadow = getShadow(\n						shadowMap,\n						sunLightShadow.shadowMapSize,\n						sunLightShadow.shadowIntensity,\n						sunLightShadow.shadowBias,\n						sunLightShadow.shadowRadius,\n						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition\n					);\n					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );\n				}\n			}\n			return shadow;\n		}\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n	#if defined( SHADOWMAP_TYPE_PCF )\n	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp -= shadowBias;\n			#else\n				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp += shadowBias;\n			#endif\n			float texelSize = shadowRadius / shadowMapSize.x;\n			vec3 absDir = abs( bd3D );\n			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );\n			tangent = normalize( cross( bd3D, tangent ) );\n			vec3 bitangent = cross( bd3D, tangent );\n			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n			vec2 sample0 = vogelDiskSample( 0, 5, phi );\n			vec2 sample1 = vogelDiskSample( 1, 5, phi );\n			vec2 sample2 = vogelDiskSample( 2, 5, phi );\n			vec2 sample3 = vogelDiskSample( 3, 5, phi );\n			vec2 sample4 = vogelDiskSample( 4, 5, phi );\n			shadow = (\n				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )\n			) * 0.2;\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#elif defined( SHADOWMAP_TYPE_BASIC )\n	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n			dp += shadowBias;\n			vec3 bd3D = normalize( lightToPosition );\n			float depth = textureCube( shadowMap, bd3D ).r;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				depth = 1.0 - depth;\n			#endif\n			shadow = step( dp, depth );\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#endif\n	#endif\n#endif",
	shadowmap_pars_vertex: "#if NUM_SPOT_LIGHT_COORDS > 0\n	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n#endif",
	shadowmap_vertex: "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n	#ifdef HAS_NORMAL\n		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n	#else\n		vec3 shadowWorldNormal = vec3( 0.0 );\n	#endif\n	vec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );\n		vSunShadowWorldNormal = shadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n		shadowWorldPosition = worldPosition;\n		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n		#endif\n		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n	}\n	#pragma unroll_loop_end\n#endif",
	shadowmask_pars_fragment: "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {\n		sunLight = sunLightShadows[ i ];\n		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n		directionalLight = directionalLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n		spotLight = spotLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n	PointLightShadow pointLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n		pointLight = pointLightShadows[ i ];\n		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#endif\n	return shadow;\n}",
	skinbase_vertex: "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
	skinning_pars_vertex: "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	uniform highp sampler2D boneTexture;\n	mat4 getBoneMatrix( const in float i ) {\n		int size = textureSize( boneTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif",
	skinning_vertex: "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	transformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
	skinnormal_vertex: "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n	#ifdef USE_TANGENT\n		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n	#endif\n#endif",
	specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif",
	specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif",
	tonemapping_fragment: "#if defined( TONE_MAPPING )\n	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
	tonemapping_pars_fragment: "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n	return saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	return saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 CineonToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	color = max( vec3( 0.0 ), color - 0.004 );\n	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n	return a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n	const mat3 ACESInputMat = mat3(\n		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),\n		vec3( 0.04823, 0.01566, 0.83777 )\n	);\n	const mat3 ACESOutputMat = mat3(\n		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),\n		vec3( -0.07367, -0.00605,  1.07602 )\n	);\n	color *= toneMappingExposure / 0.6;\n	color = ACESInputMat * color;\n	color = RRTAndODTFit( color );\n	color = ACESOutputMat * color;\n	return saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n	vec3( 1.6605, - 0.1246, - 0.0182 ),\n	vec3( - 0.5876, 1.1329, - 0.1006 ),\n	vec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n	vec3( 0.6274, 0.0691, 0.0164 ),\n	vec3( 0.3293, 0.9195, 0.0880 ),\n	vec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n	vec3 x2 = x * x;\n	vec3 x4 = x2 * x2;\n	return + 15.5 * x4 * x2\n		- 40.14 * x4 * x\n		+ 31.96 * x4\n		- 6.868 * x2 * x\n		+ 0.4298 * x2\n		+ 0.1191 * x\n		- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n	const mat3 AgXInsetMatrix = mat3(\n		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n	);\n	const mat3 AgXOutsetMatrix = mat3(\n		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n	);\n	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;\n	color *= toneMappingExposure;\n	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n	color = AgXInsetMatrix * color;\n	color = max( color, 1e-10 );	color = log2( color );\n	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n	color = clamp( color, 0.0, 1.0 );\n	color = agxDefaultContrastApprox( color );\n	color = AgXOutsetMatrix * color;\n	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n	color = clamp( color, 0.0, 1.0 );\n	return color;\n}\nvec3 NeutralToneMapping( vec3 color ) {\n	const float StartCompression = 0.8 - 0.04;\n	const float Desaturation = 0.15;\n	color *= toneMappingExposure;\n	float x = min( color.r, min( color.g, color.b ) );\n	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n	color -= offset;\n	float peak = max( color.r, max( color.g, color.b ) );\n	if ( peak < StartCompression ) return color;\n	float d = 1. - StartCompression;\n	float newPeak = 1. - d * d / ( peak + d - StartCompression );\n	color *= newPeak / peak;\n	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n	return mix( color, vec3( newPeak ), g );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
	transmission_fragment: "#ifdef USE_TRANSMISSION\n	material.transmission = transmission;\n	material.transmissionAlpha = 1.0;\n	material.thickness = thickness;\n	material.attenuationDistance = attenuationDistance;\n	material.attenuationColor = attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n	#endif\n	vec3 pos = vWorldPosition;\n	vec3 v = normalize( cameraPosition - pos );\n	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec4 transmitted = getIBLVolumeRefraction(\n		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,\n		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,\n		material.attenuationColor, material.attenuationDistance );\n	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif",
	transmission_pars_fragment: "#ifdef USE_TRANSMISSION\n	uniform float transmission;\n	uniform float thickness;\n	uniform float attenuationDistance;\n	uniform vec3 attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		uniform sampler2D transmissionMap;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		uniform sampler2D thicknessMap;\n	#endif\n	uniform vec2 transmissionSamplerSize;\n	uniform sampler2D transmissionSamplerMap;\n	uniform mat4 modelMatrix;\n	uniform mat4 projectionMatrix;\n	varying vec3 vWorldPosition;\n	float w0( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n	}\n	float w1( float a ) {\n		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n	}\n	float w2( float a ){\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n	}\n	float w3( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * a * a );\n	}\n	float g0( float a ) {\n		return w0( a ) + w1( a );\n	}\n	float g1( float a ) {\n		return w2( a ) + w3( a );\n	}\n	float h0( float a ) {\n		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n	}\n	float h1( float a ) {\n		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n	}\n	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n		uv = uv * texelSize.zw + 0.5;\n		vec2 iuv = floor( uv );\n		vec2 fuv = fract( uv );\n		float g0x = g0( fuv.x );\n		float g1x = g1( fuv.x );\n		float h0x = h0( fuv.x );\n		float h1x = h1( fuv.x );\n		float h0y = h0( fuv.y );\n		float h1y = h1( fuv.y );\n		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n	}\n	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n		vec2 fLodSizeInv = 1.0 / fLodSize;\n		vec2 cLodSizeInv = 1.0 / cLodSize;\n		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n		return mix( fSample, cSample, fract( lod ) );\n	}\n	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n		vec3 modelScale;\n		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n		return normalize( refractionVector ) * thickness * modelScale;\n	}\n	float applyIorToRoughness( const in float roughness, const in float ior ) {\n		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n	}\n	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n	}\n	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n		if ( isinf( attenuationDistance ) ) {\n			return vec3( 1.0 );\n		} else {\n			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;\n		}\n	}\n	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,\n		const in vec3 attenuationColor, const in float attenuationDistance ) {\n		vec4 transmittedLight;\n		vec3 transmittance;\n		#ifdef USE_DISPERSION\n			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;\n			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );\n			for ( int i = 0; i < 3; i ++ ) {\n				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );\n				vec3 refractedRayExit = position + transmissionRay;\n				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n				vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n				refractionCoords += 1.0;\n				refractionCoords /= 2.0;\n				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );\n				transmittedLight[ i ] = transmissionSample[ i ];\n				transmittedLight.a += transmissionSample.a;\n				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];\n			}\n			transmittedLight.a /= 3.0;\n		#else\n			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n			vec3 refractedRayExit = position + transmissionRay;\n			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n			vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n			refractionCoords += 1.0;\n			refractionCoords /= 2.0;\n			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n		#endif\n		vec3 attenuatedColor = transmittance * transmittedLight.rgb;\n		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n	}\n#endif",
	uv_pars_fragment: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_pars_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	uniform mat3 mapTransform;\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform mat3 alphaMapTransform;\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	uniform mat3 lightMapTransform;\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	uniform mat3 aoMapTransform;\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	uniform mat3 bumpMapTransform;\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	uniform mat3 normalMapTransform;\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	uniform mat3 displacementMapTransform;\n	varying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	uniform mat3 emissiveMapTransform;\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	uniform mat3 metalnessMapTransform;\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	uniform mat3 roughnessMapTransform;\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	uniform mat3 anisotropyMapTransform;\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	uniform mat3 clearcoatMapTransform;\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform mat3 clearcoatNormalMapTransform;\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform mat3 clearcoatRoughnessMapTransform;\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	uniform mat3 sheenColorMapTransform;\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	uniform mat3 sheenRoughnessMapTransform;\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	uniform mat3 iridescenceMapTransform;\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform mat3 iridescenceThicknessMapTransform;\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	uniform mat3 specularMapTransform;\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	uniform mat3 specularColorMapTransform;\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	uniform mat3 specularIntensityMapTransform;\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	vUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif",
	worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n	vec4 worldPosition = vec4( transformed, 1.0 );\n	#ifdef USE_BATCHING\n		worldPosition = batchingMatrix * worldPosition;\n	#endif\n	#ifdef USE_INSTANCING\n		worldPosition = instanceMatrix * worldPosition;\n	#endif\n	worldPosition = modelMatrix * worldPosition;\n#endif",
	background_vert: "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	gl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
	background_frag: "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n	vec4 texColor = texture2D( t2D, vUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	backgroundCube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	backgroundCube_frag: "#ifdef ENVMAP_TYPE_CUBE\n	uniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n	uniform sampler2D envMap;\n#endif\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nuniform mat3 backgroundRotation;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );\n	#elif defined( ENVMAP_TYPE_CUBE_UV )\n		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );\n	#else\n		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	cube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	cube_frag: "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n	gl_FragColor = texColor;\n	gl_FragColor.a *= opacity;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	depth_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vHighPrecisionZW = gl_Position.zw;\n}",
	depth_frag: "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <logdepthbuf_fragment>\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];\n	#else\n		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;\n	#endif\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( fragCoordZ );\n	#elif DEPTH_PACKING == 3202\n		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );\n	#elif DEPTH_PACKING == 3203\n		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );\n	#endif\n}",
	distance_vert: "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition.xyz;\n}",
	distance_frag: "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	float dist = length( vWorldPosition - referencePosition );\n	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n	dist = saturate( dist );\n	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );\n}",
	equirect_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n}",
	equirect_frag: "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vec3 direction = normalize( vWorldDirection );\n	vec2 sampleUV = equirectUv( direction );\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	linedashed_vert: "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vLineDistance = scale * lineDistance;\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	linedashed_frag: "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	meshbasic_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinbase_vertex>\n		#include <skinnormal_vertex>\n		#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <fog_vertex>\n}",
	meshbasic_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n	#else\n		reflectedLight.indirectDiffuse += vec3( 1.0 );\n	#endif\n	#include <aomap_fragment>\n	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshlambert_vert: "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshlambert_frag: "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_lambert_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshmatcap_vert: "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n	vViewPosition = - mvPosition.xyz;\n}",
	meshmatcap_frag: "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	vec3 viewDir = normalize( vViewPosition );\n	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n	vec3 y = cross( viewDir, x );\n	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n	#ifdef USE_MATCAP\n		vec4 matcapColor = texture2D( matcap, uv );\n	#else\n		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n	#endif\n	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshnormal_vert: "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	vViewPosition = - mvPosition.xyz;\n#endif\n}",
	meshnormal_frag: "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );\n	#ifdef OPAQUE\n		gl_FragColor.a = 1.0;\n	#endif\n}",
	meshphong_vert: "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshphong_frag: "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshphysical_vert: "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n	varying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n	vWorldPosition = worldPosition.xyz;\n#endif\n}",
	meshphysical_frag: "#define STANDARD\n#ifdef PHYSICAL\n	#define IOR\n	#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n	uniform float ior;\n#endif\n#ifdef USE_SPECULAR\n	uniform float specularIntensity;\n	uniform vec3 specularColor;\n	#ifdef USE_SPECULAR_COLORMAP\n		uniform sampler2D specularColorMap;\n	#endif\n	#ifdef USE_SPECULAR_INTENSITYMAP\n		uniform sampler2D specularIntensityMap;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT\n	uniform float clearcoat;\n	uniform float clearcoatRoughness;\n#endif\n#ifdef USE_DISPERSION\n	uniform float dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	uniform float retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	uniform float iridescence;\n	uniform float iridescenceIOR;\n	uniform float iridescenceThicknessMinimum;\n	uniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n	uniform vec3 sheenColor;\n	uniform float sheenRoughness;\n	#ifdef USE_SHEEN_COLORMAP\n		uniform sampler2D sheenColorMap;\n	#endif\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		uniform sampler2D sheenRoughnessMap;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	uniform vec2 anisotropyVector;\n	#ifdef USE_ANISOTROPYMAP\n		uniform sampler2D anisotropyMap;\n	#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <clearcoat_normal_fragment_begin>\n	#include <clearcoat_normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n	#include <transmission_fragment>\n	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n	#ifdef USE_SHEEN\n \n		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;\n \n 	#endif\n	#ifdef USE_CLEARCOAT\n		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n	#endif\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshtoon_vert: "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshtoon_frag: "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_toon_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	points_vert: "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n	varying vec2 vUv;\n	uniform mat3 uvTransform;\n#endif\nvoid main() {\n	#ifdef USE_POINTS_UV\n		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	#endif\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	gl_PointSize = size;\n	#ifdef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <fog_vertex>\n}",
	points_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	shadow_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	shadow_frag: "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	#include <logdepthbuf_fragment>\n	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	sprite_vert: "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	vec4 mvPosition = modelViewMatrix[ 3 ];\n	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );\n	#ifndef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) scale *= - mvPosition.z;\n	#endif\n	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n	vec2 rotatedPosition;\n	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n	mvPosition.xy += rotatedPosition;\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	sprite_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}"
}, Z = {
	common: {
		diffuse: { value: /*@__PURE__*/ new z(16777215) },
		opacity: { value: 1 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new U() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new U() },
		alphaTest: { value: 0 }
	},
	specularmap: {
		specularMap: { value: null },
		specularMapTransform: { value: /*@__PURE__*/ new U() }
	},
	envmap: {
		envMap: { value: null },
		envMapRotation: { value: /*@__PURE__*/ new U() },
		reflectivity: { value: 1 },
		ior: { value: 1.5 },
		refractionRatio: { value: .98 },
		dfgLUT: { value: null }
	},
	aomap: {
		aoMap: { value: null },
		aoMapIntensity: { value: 1 },
		aoMapTransform: { value: /*@__PURE__*/ new U() }
	},
	lightmap: {
		lightMap: { value: null },
		lightMapIntensity: { value: 1 },
		lightMapTransform: { value: /*@__PURE__*/ new U() }
	},
	bumpmap: {
		bumpMap: { value: null },
		bumpMapTransform: { value: /*@__PURE__*/ new U() },
		bumpScale: { value: 1 }
	},
	normalmap: {
		normalMap: { value: null },
		normalMapTransform: { value: /*@__PURE__*/ new U() },
		normalScale: { value: /*@__PURE__*/ new L(1, 1) }
	},
	displacementmap: {
		displacementMap: { value: null },
		displacementMapTransform: { value: /*@__PURE__*/ new U() },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }
	},
	emissivemap: {
		emissiveMap: { value: null },
		emissiveMapTransform: { value: /*@__PURE__*/ new U() }
	},
	metalnessmap: {
		metalnessMap: { value: null },
		metalnessMapTransform: { value: /*@__PURE__*/ new U() }
	},
	roughnessmap: {
		roughnessMap: { value: null },
		roughnessMapTransform: { value: /*@__PURE__*/ new U() }
	},
	gradientmap: { gradientMap: { value: null } },
	fog: {
		fogDensity: { value: 25e-5 },
		fogNear: { value: 1 },
		fogFar: { value: 2e3 },
		fogColor: { value: /*@__PURE__*/ new z(16777215) }
	},
	lights: {
		ambientLightColor: { value: [] },
		lightProbe: { value: [] },
		sunLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		sunLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		sunShadowMatrix: { value: [] },
		sunShadowCascade: { value: [] },
		directionalLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		directionalLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		directionalShadowMatrix: { value: [] },
		spotLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				direction: {},
				distance: {},
				coneCos: {},
				penumbraCos: {},
				decay: {}
			}
		},
		spotLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		spotLightMap: { value: [] },
		spotLightMatrix: { value: [] },
		pointLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				decay: {},
				distance: {}
			}
		},
		pointLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
				shadowCameraNear: {},
				shadowCameraFar: {}
			}
		},
		pointShadowMatrix: { value: [] },
		hemisphereLights: {
			value: [],
			properties: {
				direction: {},
				skyColor: {},
				groundColor: {}
			}
		},
		rectAreaLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				width: {},
				height: {}
			}
		},
		ltc_1: { value: null },
		ltc_2: { value: null },
		probesSH: { value: null },
		probesMin: { value: /*@__PURE__*/ new H() },
		probesMax: { value: /*@__PURE__*/ new H() },
		probesResolution: { value: /*@__PURE__*/ new H() }
	},
	points: {
		diffuse: { value: /*@__PURE__*/ new z(16777215) },
		opacity: { value: 1 },
		size: { value: 1 },
		scale: { value: 1 },
		map: { value: null },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new U() },
		alphaTest: { value: 0 },
		uvTransform: { value: /*@__PURE__*/ new U() }
	},
	sprite: {
		diffuse: { value: /*@__PURE__*/ new z(16777215) },
		opacity: { value: 1 },
		center: { value: /*@__PURE__*/ new L(.5, .5) },
		rotation: { value: 0 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new U() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new U() },
		alphaTest: { value: 0 }
	}
}, Ke = {
	basic: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.specularmap,
			Z.envmap,
			Z.aomap,
			Z.lightmap,
			Z.fog
		]),
		vertexShader: X.meshbasic_vert,
		fragmentShader: X.meshbasic_frag
	},
	lambert: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.specularmap,
			Z.envmap,
			Z.aomap,
			Z.lightmap,
			Z.emissivemap,
			Z.bumpmap,
			Z.normalmap,
			Z.displacementmap,
			Z.fog,
			Z.lights,
			{
				emissive: { value: /*@__PURE__*/ new z(0) },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: X.meshlambert_vert,
		fragmentShader: X.meshlambert_frag
	},
	phong: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.specularmap,
			Z.envmap,
			Z.aomap,
			Z.lightmap,
			Z.emissivemap,
			Z.bumpmap,
			Z.normalmap,
			Z.displacementmap,
			Z.fog,
			Z.lights,
			{
				emissive: { value: /*@__PURE__*/ new z(0) },
				specular: { value: /*@__PURE__*/ new z(1118481) },
				shininess: { value: 30 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: X.meshphong_vert,
		fragmentShader: X.meshphong_frag
	},
	standard: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.envmap,
			Z.aomap,
			Z.lightmap,
			Z.emissivemap,
			Z.bumpmap,
			Z.normalmap,
			Z.displacementmap,
			Z.roughnessmap,
			Z.metalnessmap,
			Z.fog,
			Z.lights,
			{
				emissive: { value: /*@__PURE__*/ new z(0) },
				roughness: { value: 1 },
				metalness: { value: 0 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: X.meshphysical_vert,
		fragmentShader: X.meshphysical_frag
	},
	toon: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.aomap,
			Z.lightmap,
			Z.emissivemap,
			Z.bumpmap,
			Z.normalmap,
			Z.displacementmap,
			Z.gradientmap,
			Z.fog,
			Z.lights,
			{ emissive: { value: /*@__PURE__*/ new z(0) } }
		]),
		vertexShader: X.meshtoon_vert,
		fragmentShader: X.meshtoon_frag
	},
	matcap: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.bumpmap,
			Z.normalmap,
			Z.displacementmap,
			Z.fog,
			{ matcap: { value: null } }
		]),
		vertexShader: X.meshmatcap_vert,
		fragmentShader: X.meshmatcap_frag
	},
	points: {
		uniforms: /*@__PURE__*/ l([Z.points, Z.fog]),
		vertexShader: X.points_vert,
		fragmentShader: X.points_frag
	},
	dashed: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.fog,
			{
				scale: { value: 1 },
				dashSize: { value: 1 },
				totalSize: { value: 2 }
			}
		]),
		vertexShader: X.linedashed_vert,
		fragmentShader: X.linedashed_frag
	},
	depth: {
		uniforms: /*@__PURE__*/ l([Z.common, Z.displacementmap]),
		vertexShader: X.depth_vert,
		fragmentShader: X.depth_frag
	},
	normal: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.bumpmap,
			Z.normalmap,
			Z.displacementmap,
			{ opacity: { value: 1 } }
		]),
		vertexShader: X.meshnormal_vert,
		fragmentShader: X.meshnormal_frag
	},
	sprite: {
		uniforms: /*@__PURE__*/ l([Z.sprite, Z.fog]),
		vertexShader: X.sprite_vert,
		fragmentShader: X.sprite_frag
	},
	background: {
		uniforms: {
			uvTransform: { value: /*@__PURE__*/ new U() },
			t2D: { value: null },
			backgroundIntensity: { value: 1 }
		},
		vertexShader: X.background_vert,
		fragmentShader: X.background_frag
	},
	backgroundCube: {
		uniforms: {
			envMap: { value: null },
			backgroundBlurriness: { value: 0 },
			backgroundIntensity: { value: 1 },
			backgroundRotation: { value: /*@__PURE__*/ new U() }
		},
		vertexShader: X.backgroundCube_vert,
		fragmentShader: X.backgroundCube_frag
	},
	cube: {
		uniforms: {
			tCube: { value: null },
			tFlip: { value: -1 },
			opacity: { value: 1 }
		},
		vertexShader: X.cube_vert,
		fragmentShader: X.cube_frag
	},
	equirect: {
		uniforms: { tEquirect: { value: null } },
		vertexShader: X.equirect_vert,
		fragmentShader: X.equirect_frag
	},
	distance: {
		uniforms: /*@__PURE__*/ l([
			Z.common,
			Z.displacementmap,
			{
				referencePosition: { value: /*@__PURE__*/ new H() },
				nearDistance: { value: 1 },
				farDistance: { value: 1e3 }
			}
		]),
		vertexShader: X.distance_vert,
		fragmentShader: X.distance_frag
	},
	shadow: {
		uniforms: /*@__PURE__*/ l([
			Z.lights,
			Z.fog,
			{
				color: { value: /*@__PURE__*/ new z(0) },
				opacity: { value: 1 }
			}
		]),
		vertexShader: X.shadow_vert,
		fragmentShader: X.shadow_frag
	}
};
Ke.physical = {
	uniforms: /*@__PURE__*/ l([Ke.standard.uniforms, {
		clearcoat: { value: 0 },
		clearcoatMap: { value: null },
		clearcoatMapTransform: { value: /*@__PURE__*/ new U() },
		clearcoatNormalMap: { value: null },
		clearcoatNormalMapTransform: { value: /*@__PURE__*/ new U() },
		clearcoatNormalScale: { value: /*@__PURE__*/ new L(1, 1) },
		clearcoatRoughness: { value: 0 },
		clearcoatRoughnessMap: { value: null },
		clearcoatRoughnessMapTransform: { value: /*@__PURE__*/ new U() },
		dispersion: { value: 0 },
		retroreflectivity: { value: 0 },
		iridescence: { value: 0 },
		iridescenceMap: { value: null },
		iridescenceMapTransform: { value: /*@__PURE__*/ new U() },
		iridescenceIOR: { value: 1.3 },
		iridescenceThicknessMinimum: { value: 100 },
		iridescenceThicknessMaximum: { value: 400 },
		iridescenceThicknessMap: { value: null },
		iridescenceThicknessMapTransform: { value: /*@__PURE__*/ new U() },
		sheen: { value: 0 },
		sheenColor: { value: /*@__PURE__*/ new z(0) },
		sheenColorMap: { value: null },
		sheenColorMapTransform: { value: /*@__PURE__*/ new U() },
		sheenRoughness: { value: 1 },
		sheenRoughnessMap: { value: null },
		sheenRoughnessMapTransform: { value: /*@__PURE__*/ new U() },
		transmission: { value: 0 },
		transmissionMap: { value: null },
		transmissionMapTransform: { value: /*@__PURE__*/ new U() },
		transmissionSamplerSize: { value: /*@__PURE__*/ new L() },
		transmissionSamplerMap: { value: null },
		thickness: { value: 0 },
		thicknessMap: { value: null },
		thicknessMapTransform: { value: /*@__PURE__*/ new U() },
		attenuationDistance: { value: 0 },
		attenuationColor: { value: /*@__PURE__*/ new z(0) },
		specularColor: { value: /*@__PURE__*/ new z(1, 1, 1) },
		specularColorMap: { value: null },
		specularColorMapTransform: { value: /*@__PURE__*/ new U() },
		specularIntensity: { value: 1 },
		specularIntensityMap: { value: null },
		specularIntensityMapTransform: { value: /*@__PURE__*/ new U() },
		anisotropyVector: { value: /*@__PURE__*/ new L() },
		anisotropyMap: { value: null },
		anisotropyMapTransform: { value: /*@__PURE__*/ new U() }
	}]),
	vertexShader: X.meshphysical_vert,
	fragmentShader: X.meshphysical_frag
};
var qe = {
	r: 0,
	b: 0,
	g: 0
}, Je = /*@__PURE__*/ new Ie(), Ye = /*@__PURE__*/ new U();
Ye.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function Xe(e, t, n, r, i, a) {
	let o = new z(0), s = i === !0 ? 0 : 1, c, l, u = null, d = 0, f = null;
	function p(e) {
		let n = e.isScene === !0 ? e.background : null;
		if (n && n.isTexture) {
			let r = e.backgroundBlurriness > 0;
			n = t.get(n, r);
		}
		return n;
	}
	function m(t) {
		let r = !1, i = p(t);
		i === null ? _(o, s) : i && i.isColor && (_(i, 1), r = !0);
		let c = e.xr.getEnvironmentBlendMode();
		c === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : c === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (e.autoClear || r) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil));
	}
	function g(t, n) {
		let i = p(n);
		i && (i.isCubeTexture || i.mapping === 306) ? (l === void 0 && (l = new I(new Te(1, 1, 1), new A({
			name: "BackgroundCubeMaterial",
			uniforms: Fe(Ke.backgroundCube.uniforms),
			vertexShader: Ke.backgroundCube.vertexShader,
			fragmentShader: Ke.backgroundCube.fragmentShader,
			side: 1,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), l.geometry.deleteAttribute("normal"), l.geometry.deleteAttribute("uv"), l.onBeforeRender = function(e, t, n) {
			this.matrixWorld.copyPosition(n.matrixWorld);
		}, Object.defineProperty(l.material, "envMap", { get: function() {
			return this.uniforms.envMap.value;
		} }), r.update(l)), l.material.uniforms.envMap.value = i, l.material.uniforms.backgroundBlurriness.value = n.backgroundBlurriness, l.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, l.material.uniforms.backgroundRotation.value.setFromMatrix4(Je.makeRotationFromEuler(n.backgroundRotation)).transpose(), i.isCubeTexture && i.isRenderTargetTexture === !1 && l.material.uniforms.backgroundRotation.value.premultiply(Ye), l.material.toneMapped = F.getTransfer(i.colorSpace) !== M, (u !== i || d !== i.version || f !== e.toneMapping) && (l.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), l.layers.enableAll(), t.unshift(l, l.geometry, l.material, 0, 0, null)) : i && i.isTexture && (c === void 0 && (c = new I(new h(2, 2), new A({
			name: "BackgroundMaterial",
			uniforms: Fe(Ke.background.uniforms),
			vertexShader: Ke.background.vertexShader,
			fragmentShader: Ke.background.fragmentShader,
			side: 0,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
			return this.uniforms.t2D.value;
		} }), r.update(c)), c.material.uniforms.t2D.value = i, c.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, c.material.toneMapped = F.getTransfer(i.colorSpace) !== M, i.matrixAutoUpdate === !0 && i.updateMatrix(), c.material.uniforms.uvTransform.value.copy(i.matrix), (u !== i || d !== i.version || f !== e.toneMapping) && (c.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), c.layers.enableAll(), t.unshift(c, c.geometry, c.material, 0, 0, null));
	}
	function _(t, r) {
		t.getRGB(qe, Ae(e)), n.buffers.color.setClear(qe.r, qe.g, qe.b, r, a);
	}
	function v() {
		l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
	}
	return {
		getClearColor: function() {
			return o;
		},
		setClearColor: function(e, t = 1) {
			o.set(e), s = t, _(o, s);
		},
		getClearAlpha: function() {
			return s;
		},
		setClearAlpha: function(e) {
			s = e, _(o, s);
		},
		render: m,
		addToRenderList: g,
		dispose: v
	};
}
function Ze(e, t) {
	let n = e.getParameter(e.MAX_VERTEX_ATTRIBS), r = {}, i = f(null), a = i, o = !1;
	function s(n, r, i, s, c) {
		let u = !1, f = d(n, s, i, r);
		a !== f && (a = f, l(a.object)), u = p(n, s, i, c), u && m(n, s, i, c), c !== null && t.update(c, e.ELEMENT_ARRAY_BUFFER), (u || o) && (o = !1, b(n, r, i, s), c !== null && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(c).buffer));
	}
	function c() {
		return e.createVertexArray();
	}
	function l(t) {
		return e.bindVertexArray(t);
	}
	function u(t) {
		return e.deleteVertexArray(t);
	}
	function d(e, t, n, i) {
		let a = i.wireframe === !0, o = r[t.id];
		o === void 0 && (o = {}, r[t.id] = o);
		let s = e.isInstancedMesh === !0 ? e.id : 0, l = o[s];
		l === void 0 && (l = {}, o[s] = l);
		let u = l[n.id];
		u === void 0 && (u = {}, l[n.id] = u);
		let d = u[a];
		return d === void 0 && (d = f(c()), u[a] = d), d;
	}
	function f(e) {
		let t = [], r = [], i = [];
		for (let e = 0; e < n; e++) t[e] = 0, r[e] = 0, i[e] = 0;
		return {
			geometry: null,
			program: null,
			wireframe: !1,
			newAttributes: t,
			enabledAttributes: r,
			attributeDivisors: i,
			object: e,
			attributes: {},
			index: null
		};
	}
	function p(e, t, n, r) {
		let i = a.attributes, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = i[t], r = o[t];
			if (r === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (r = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (r = e.instanceColor)), n === void 0 || n.attribute !== r || r && n.data !== r.data) return !0;
			s++;
		}
		return a.attributesNum !== s || a.index !== r;
	}
	function m(e, t, n, r) {
		let i = {}, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = o[t];
			n === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (n = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (n = e.instanceColor));
			let r = {};
			r.attribute = n, n && n.data && (r.data = n.data), i[t] = r, s++;
		}
		a.attributes = i, a.attributesNum = s, a.index = r;
	}
	function h() {
		let e = a.newAttributes;
		for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
	}
	function g(e) {
		_(e, 0);
	}
	function _(t, n) {
		let r = a.newAttributes, i = a.enabledAttributes, o = a.attributeDivisors;
		r[t] = 1, i[t] === 0 && (e.enableVertexAttribArray(t), i[t] = 1), o[t] !== n && (e.vertexAttribDivisor(t, n), o[t] = n);
	}
	function v() {
		let t = a.newAttributes, n = a.enabledAttributes;
		for (let r = 0, i = n.length; r < i; r++) n[r] !== t[r] && (e.disableVertexAttribArray(r), n[r] = 0);
	}
	function y(t, n, r, i, a, o, s) {
		s === !0 ? e.vertexAttribIPointer(t, n, r, a, o) : e.vertexAttribPointer(t, n, r, i, a, o);
	}
	function b(n, r, i, a) {
		h();
		let o = a.attributes, s = i.getAttributes(), c = r.defaultAttributeValues;
		for (let r in s) {
			let i = s[r];
			if (i.location >= 0) {
				let s = o[r];
				if (s === void 0 && (r === "instanceMatrix" && n.instanceMatrix && (s = n.instanceMatrix), r === "instanceColor" && n.instanceColor && (s = n.instanceColor)), s !== void 0) {
					let r = s.normalized, o = s.itemSize, c = t.get(s);
					if (c === void 0) continue;
					let l = c.buffer, u = c.type, d = c.bytesPerElement, f = u === e.INT || u === e.UNSIGNED_INT || s.gpuType === 1013;
					if (s.isInterleavedBufferAttribute) {
						let t = s.data, c = t.stride, p = s.offset;
						if (t.isInstancedInterleavedBuffer) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, t.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = t.meshPerAttribute * t.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, c * d, (p + o / i.locationSize * e) * d, f);
					} else {
						if (s.isInstancedBufferAttribute) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, s.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = s.meshPerAttribute * s.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, o * d, o / i.locationSize * e * d, f);
					}
				} else if (c !== void 0) {
					let t = c[r];
					if (t !== void 0) switch (t.length) {
						case 2:
							e.vertexAttrib2fv(i.location, t);
							break;
						case 3:
							e.vertexAttrib3fv(i.location, t);
							break;
						case 4:
							e.vertexAttrib4fv(i.location, t);
							break;
						default: e.vertexAttrib1fv(i.location, t);
					}
				}
			}
		}
		v();
	}
	function x() {
		T();
		for (let e in r) {
			let t = r[e];
			for (let e in t) {
				let n = t[e];
				for (let e in n) {
					let t = n[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete n[e];
				}
			}
			delete r[e];
		}
	}
	function S(e) {
		if (r[e.id] === void 0) return;
		let t = r[e.id];
		for (let e in t) {
			let n = t[e];
			for (let e in n) {
				let t = n[e];
				for (let e in t) u(t[e].object), delete t[e];
				delete n[e];
			}
		}
		delete r[e.id];
	}
	function C(e) {
		for (let t in r) {
			let n = r[t];
			for (let t in n) {
				let r = n[t];
				if (r[e.id] === void 0) continue;
				let i = r[e.id];
				for (let e in i) u(i[e].object), delete i[e];
				delete r[e.id];
			}
		}
	}
	function w(e) {
		for (let t in r) {
			let n = r[t], i = e.isInstancedMesh === !0 ? e.id : 0, a = n[i];
			if (a !== void 0) {
				for (let e in a) {
					let t = a[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete a[e];
				}
				delete n[i], Object.keys(n).length === 0 && delete r[t];
			}
		}
	}
	function T() {
		E(), o = !0, a !== i && (a = i, l(a.object));
	}
	function E() {
		i.geometry = null, i.program = null, i.wireframe = !1;
	}
	return {
		setup: s,
		reset: T,
		resetDefaultState: E,
		dispose: x,
		releaseStatesOfGeometry: S,
		releaseStatesOfObject: w,
		releaseStatesOfProgram: C,
		initAttributes: h,
		enableAttribute: g,
		disableUnusedAttributes: v
	};
}
function Qe(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	function a(t, i) {
		e.drawArrays(r, t, i), n.update(i, r, 1);
	}
	function o(t, i, a) {
		a !== 0 && (e.drawArraysInstanced(r, t, i, a), n.update(i, r, a));
	}
	function s(e, i, a) {
		if (a === 0) return;
		t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r, e, 0, i, 0, a);
		let o = 0;
		for (let e = 0; e < a; e++) o += i[e];
		n.update(o, r, 1);
	}
	this.setMode = i, this.render = a, this.renderInstances = o, this.renderMultiDraw = s;
}
function $e(e, t, n, r) {
	let i;
	function a() {
		if (i !== void 0) return i;
		if (t.has("EXT_texture_filter_anisotropic") === !0) {
			let n = t.get("EXT_texture_filter_anisotropic");
			i = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		} else i = 0;
		return i;
	}
	function o(t) {
		return t === 1023 || r.convert(t) === e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT);
	}
	function s(n) {
		let i = n === 1016 && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
		return !(n !== 1009 && n !== 1015 && !i && r.convert(n) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE));
	}
	function c(t) {
		if (t === "highp") {
			if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
			t = "mediump";
		}
		return t === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
	}
	let l = n.precision === void 0 ? "highp" : n.precision, u = c(l);
	u !== l && (b("WebGLRenderer:", l, "not supported, using", u, "instead."), l = u);
	let d = n.logarithmicDepthBuffer === !0, f = n.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
	n.reversedDepthBuffer === !0 && f === !1 && b("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
	let p = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), m = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), h = e.getParameter(e.MAX_TEXTURE_SIZE), g = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), _ = e.getParameter(e.MAX_VERTEX_ATTRIBS), v = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), y = e.getParameter(e.MAX_VARYING_VECTORS), x = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), S = e.getParameter(e.MAX_SAMPLES), C = e.getParameter(e.SAMPLES);
	return {
		isWebGL2: !0,
		getMaxAnisotropy: a,
		getMaxPrecision: c,
		textureFormatReadable: o,
		textureTypeReadable: s,
		precision: l,
		logarithmicDepthBuffer: d,
		reversedDepthBuffer: f,
		maxTextures: p,
		maxVertexTextures: m,
		maxTextureSize: h,
		maxCubemapSize: g,
		maxAttributes: _,
		maxVertexUniforms: v,
		maxVaryings: y,
		maxFragmentUniforms: x,
		maxSamples: S,
		samples: C
	};
}
function et(e) {
	let t = this, n = null, r = 0, i = !1, a = !1, o = new p(), s = new U(), c = {
		value: null,
		needsUpdate: !1
	};
	this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e, t) {
		let n = e.length !== 0 || t || r !== 0 || i;
		return i = t, r = e.length, n;
	}, this.beginShadows = function() {
		a = !0, u(null);
	}, this.endShadows = function() {
		a = !1;
	}, this.setGlobalState = function(e, t) {
		n = u(e, t, 0);
	}, this.setState = function(t, o, s) {
		let d = t.clippingPlanes, f = t.clipIntersection, p = t.clipShadows, m = e.get(t);
		if (!i || d === null || d.length === 0 || a && !p) a ? u(null) : l();
		else {
			let e = a ? 0 : r, t = e * 4, i = m.clippingState || null;
			c.value = i, i = u(d, o, t, s);
			for (let e = 0; e !== t; ++e) i[e] = n[e];
			m.clippingState = i, this.numIntersection = f ? this.numPlanes : 0, this.numPlanes += e;
		}
	};
	function l() {
		c.value !== n && (c.value = n, c.needsUpdate = r > 0), t.numPlanes = r, t.numIntersection = 0;
	}
	function u(e, n, r, i) {
		let a = e === null ? 0 : e.length, l = null;
		if (a !== 0) {
			if (l = c.value, i !== !0 || l === null) {
				let t = r + a * 4, i = n.matrixWorldInverse;
				s.getNormalMatrix(i), (l === null || l.length < t) && (l = new Float32Array(t));
				for (let t = 0, n = r; t !== a; ++t, n += 4) o.copy(e[t]).applyMatrix4(i, s), o.normal.toArray(l, n), l[n + 3] = o.constant;
			}
			c.value = l, c.needsUpdate = !0;
		}
		return t.numPlanes = a, t.numIntersection = 0, l;
	}
}
var tt = 4, nt = 6, rt = 20, it = 256, at = /*@__PURE__*/ new w(), ot = /*@__PURE__*/ new z(), st = null, ct = 0, lt = 0, Q = !1, ut = /*@__PURE__*/ new H(), dt = /*@__PURE__*/ new H(), ft = class {
	constructor(e) {
		this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
	}
	fromScene(e, t = 0, n = .1, r = 100, i = {}) {
		let { size: a = 256, position: o = ut } = i;
		st = this._renderer.getRenderTarget(), ct = this._renderer.getActiveCubeFace(), lt = this._renderer.getActiveMipmapLevel(), Q = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
		let s = this._allocateTargets();
		return s.depthBuffer = !0, this._sceneToCubeUV(e, n, r, s, o), t > 0 && this._blur(s, 0, 0, t), this._applyPMREM(s), this._cleanup(s), s;
	}
	fromEquirectangular(e, t = null) {
		return this._fromTexture(e, t);
	}
	fromCubemap(e, t = null) {
		return this._fromTexture(e, t);
	}
	compileCubemapShader() {
		this._cubemapMaterial === null && (this._cubemapMaterial = yt(), this._compileMaterial(this._cubemapMaterial));
	}
	compileEquirectangularShader() {
		this._equirectMaterial === null && (this._equirectMaterial = vt(), this._compileMaterial(this._equirectMaterial));
	}
	dispose() {
		this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
	}
	_setSize(e) {
		this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = 2 ** this._lodMax;
	}
	_dispose() {
		this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
		for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
	}
	_cleanup(e) {
		this._renderer.setRenderTarget(st, ct, lt), this._renderer.xr.enabled = Q, e.scissorTest = !1, ht(e, 0, 0, e.width, e.height);
	}
	_fromTexture(e, t) {
		e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), st = this._renderer.getRenderTarget(), ct = this._renderer.getActiveCubeFace(), lt = this._renderer.getActiveMipmapLevel(), Q = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
		let n = t || this._allocateTargets();
		return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
	}
	_allocateTargets() {
		let e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
			magFilter: B,
			minFilter: B,
			generateMipmaps: !1,
			type: N,
			format: te,
			colorSpace: R,
			depthBuffer: !1
		}, r = mt(e, t, n);
		if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
			this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = mt(e, t, n);
			let { _lodMax: r } = this;
			({lodMeshes: this._lodMeshes, sizeLods: this._sizeLods} = pt(r)), this._blurMaterial = _t(r, e, t), this._ggxMaterial = gt(r, e, t);
		}
		return r;
	}
	_compileMaterial(e) {
		let t = new I(new ye(), e);
		this._renderer.compile(t, at);
	}
	_sceneToCubeUV(e, t, n, r, i) {
		let a = new d(90, 1, t, n), o = [
			1,
			-1,
			1,
			1,
			1,
			1
		], s = [
			1,
			1,
			1,
			-1,
			-1,
			-1
		], c = this._renderer, l = c.autoClear, u = c.toneMapping;
		c.getClearColor(ot), c.toneMapping = 0, c.autoClear = !1, c.state.buffers.depth.getReversed() && (c.setRenderTarget(r), c.clearDepth(), c.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new I(new Te(), new Ne({
			name: "PMREM.Background",
			side: 1,
			depthWrite: !1,
			depthTest: !1
		})));
		let f = this._backgroundBox, p = f.material, m = !1, h = e.background;
		h ? h.isColor && (p.color.copy(h), e.background = null, m = !0) : (p.color.copy(ot), m = !0);
		for (let t = 0; t < 6; t++) {
			let n = t % 3;
			n === 0 ? (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x + s[t], i.y, i.z)) : n === 1 ? (a.up.set(0, 0, o[t]), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y + s[t], i.z)) : (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y, i.z + s[t]));
			let l = this._cubeSize;
			ht(r, n * l, t > 2 ? l : 0, l, l), c.setRenderTarget(r), m && c.render(f, a), c.render(e, a);
		}
		c.toneMapping = u, c.autoClear = l, e.background = h;
	}
	_textureToCubeUV(e, t) {
		let n = this._renderer, r = e.mapping === 301 || e.mapping === 302;
		r ? (this._cubemapMaterial === null && (this._cubemapMaterial = yt()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = vt());
		let i = r ? this._cubemapMaterial : this._equirectMaterial, a = this._lodMeshes[0];
		a.material = i;
		let o = i.uniforms;
		o.envMap.value = e;
		let s = this._cubeSize;
		ht(t, 0, 0, 3 * s, 2 * s), n.setRenderTarget(t), n.render(a, at);
	}
	_applyPMREM(e) {
		let t = this._renderer, n = t.autoClear;
		t.autoClear = !1;
		let r = this._lodMeshes.length;
		for (let t = 1; t < r; t++) this._applyGGXFilter(e, t - 1, t);
		t.autoClear = n;
	}
	_applyGGXFilter(e, t, n) {
		let r = this._renderer, i = this._pingPongRenderTarget, a = this._ggxMaterial, o = this._lodMeshes[n];
		o.material = a;
		let s = a.uniforms, c = n / (this._lodMeshes.length - 1), l = t / (this._lodMeshes.length - 1), u = Math.sqrt(c * c - l * l) * (c * 1.25), { _lodMax: d } = this, f = this._sizeLods[n], p = 3 * f * (n > d - tt ? n - d + tt : 0), m = 4 * (this._cubeSize - f);
		s.envMap.value = e.texture, s.roughness.value = u, s.mipInt.value = d - t, ht(i, p, m, 3 * f, 2 * f), r.setRenderTarget(i), r.render(o, at), s.envMap.value = i.texture, s.roughness.value = 0, s.mipInt.value = d - n, ht(e, p, m, 3 * f, 2 * f), r.setRenderTarget(e), r.render(o, at);
	}
	_blur(e, t, n, r) {
		let i = this._pingPongRenderTarget, a = Math.min(r, Math.PI) / Math.SQRT2;
		this._blurPass(e, i, t, n, a), this._blurPass(i, e, n, n, a);
	}
	_blurPass(e, t, n, r, i) {
		let a = this._renderer, o = this._blurMaterial, s = this._lodMeshes[r];
		s.material = o;
		let c = o.uniforms;
		c.envMap.value = e.texture, c.sigma.value = i, c.mipInt.value = this._lodMax - n;
		let l = this._sizeLods[r];
		ht(t, 3 * l * (r > this._lodMax - tt ? r - this._lodMax + tt : 0), 4 * (this._cubeSize - l), 3 * l, 2 * l), a.setRenderTarget(t), a.render(s, at);
	}
};
function pt(e) {
	let t = [], n = [], r = e, i = e - tt + 1 + nt;
	for (let e = 0; e < i; e++) {
		let e = 2 ** r;
		t.push(e);
		let i = 1 / (e - 2), a = -i, o = 1 + i, s = [
			a,
			a,
			o,
			a,
			o,
			o,
			a,
			a,
			o,
			o,
			a,
			o
		], c = /* @__PURE__ */ new Float32Array(108), l = /* @__PURE__ */ new Float32Array(108);
		for (let e = 0; e < 6; e++) {
			let t = e % 3 * 2 / 3 - 1, n = e > 2 ? 0 : -1, r = [
				t,
				n,
				0,
				t + 2 / 3,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n + 1,
				0
			];
			c.set(r, 18 * e);
			for (let t = 0; t < 6; t++) {
				let n = s[t * 2] * 2 - 1, r = s[t * 2 + 1] * 2 - 1;
				e === 0 ? dt.set(1, r, n) : e === 1 ? dt.set(-n, 1, -r) : e === 2 ? dt.set(-n, r, 1) : e === 3 ? dt.set(-1, r, -n) : e === 4 ? dt.set(-n, -1, r) : dt.set(n, r, -1), dt.toArray(l, (e * 6 + t) * 3);
			}
		}
		let u = new ye();
		u.setAttribute("position", new oe(c, 3)), u.setAttribute("outputDirection", new oe(l, 3)), n.push(new I(u, null)), r > tt && r--;
	}
	return {
		lodMeshes: n,
		sizeLods: t
	};
}
function mt(e, t, n) {
	let r = new re(e, t, n);
	return r.texture.mapping = 306, r.texture.name = "PMREM.cubeUv", r.scissorTest = !0, r;
}
function ht(e, t, n, r, i) {
	e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i);
}
function gt(e, t, n) {
	return new A({
		name: "PMREMGGXConvolution",
		defines: {
			GGX_SAMPLES: it,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			roughness: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: bt(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float roughness;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n\n			// Van der Corput radical inverse\n			float radicalInverse_VdC(uint bits) {\n				bits = (bits << 16u) | (bits >> 16u);\n				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\n				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\n				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\n				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\n				return float(bits) * 2.3283064365386963e-10; // / 0x100000000\n			}\n\n			// Hammersley sequence\n			vec2 hammersley(uint i, uint N) {\n				return vec2(float(i) / float(N), radicalInverse_VdC(i));\n			}\n\n			// GGX VNDF importance sampling (Eric Heitz 2018)\n			// \"Sampling the GGX Distribution of Visible Normals\"\n			// https://jcgt.org/published/0007/04/01/\n			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {\n				float alpha = roughness * roughness;\n\n				// Section 4.1: Orthonormal basis\n				vec3 T1 = vec3(1.0, 0.0, 0.0);\n				vec3 T2 = cross(V, T1);\n\n				// Section 4.2: Parameterization of projected area\n				float r = sqrt(Xi.x);\n				float phi = 2.0 * PI * Xi.y;\n				float t1 = r * cos(phi);\n				float t2 = r * sin(phi);\n				float s = 0.5 * (1.0 + V.z);\n				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;\n\n				// Section 4.3: Reprojection onto hemisphere\n				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;\n\n				// Section 3.4: Transform back to ellipsoid configuration\n				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));\n			}\n\n			void main() {\n				vec3 N = normalize(vOutputDirection);\n				vec3 V = N; // Assume view direction equals normal for pre-filtering\n\n				vec3 prefilteredColor = vec3(0.0);\n				float totalWeight = 0.0;\n\n				// For very low roughness, just sample the environment directly\n				if (roughness < 0.001) {\n					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);\n					return;\n				}\n\n				// Tangent space basis for VNDF sampling\n				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);\n				vec3 tangent = normalize(cross(up, N));\n				vec3 bitangent = cross(N, tangent);\n\n				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {\n					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));\n\n					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)\n					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);\n\n					// Transform H back to world space\n					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);\n					vec3 L = normalize(2.0 * dot(V, H) * H - V);\n\n					float NdotL = max(dot(N, L), 0.0);\n\n					if(NdotL > 0.0) {\n						// Sample environment at fixed mip level\n						// VNDF importance sampling handles the distribution filtering\n						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);\n\n						// Weight by NdotL for the split-sum approximation\n						// VNDF PDF naturally accounts for the visible microfacet distribution\n						prefilteredColor += sampleColor * NdotL;\n						totalWeight += NdotL;\n					}\n				}\n\n				if (totalWeight > 0.0) {\n					prefilteredColor = prefilteredColor / totalWeight;\n				}\n\n				gl_FragColor = vec4(prefilteredColor, 1.0);\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function _t(e, t, n) {
	return new A({
		name: "SphericalGaussianBlur",
		defines: {
			SAMPLES: rt,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			sigma: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: bt(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float sigma;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n			#define GOLDEN_ANGLE 2.39996322973\n\n			void main() {\n\n				if ( sigma == 0.0 ) {\n\n					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );\n					return;\n\n				}\n\n				vec3 outputDirection = normalize( vOutputDirection );\n\n				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );\n				vec3 tangent = normalize( cross( up, outputDirection ) );\n				vec3 bitangent = cross( outputDirection, tangent );\n\n				// Truncate the kernel at three standard deviations or at the antipode.\n				float thetaMax = min( 3.0 * sigma, PI );\n				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );\n\n				vec3 accumColor = vec3( 0.0 );\n				float accumWeight = 0.0;\n\n				for ( int i = 0; i < SAMPLES; i ++ ) {\n\n					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.\n					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );\n					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );\n					float phi = float( i ) * GOLDEN_ANGLE;\n\n					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;\n					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;\n\n					// Correct the planar sample density to solid angle.\n					float weight = sin( theta ) / theta;\n\n					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );\n					accumWeight += weight;\n\n				}\n\n				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function vt() {
	return new A({
		name: "EquirectangularToCubeUV",
		uniforms: { envMap: { value: null } },
		vertexShader: bt(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n\n			#include <common>\n\n			void main() {\n\n				vec3 outputDirection = normalize( vOutputDirection );\n				vec2 uv = equirectUv( outputDirection );\n\n				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function yt() {
	return new A({
		name: "CubemapToCubeUV",
		uniforms: {
			envMap: { value: null },
			flipEnvMap: { value: -1 }
		},
		vertexShader: bt(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			uniform float flipEnvMap;\n\n			varying vec3 vOutputDirection;\n\n			uniform samplerCube envMap;\n\n			void main() {\n\n				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function bt() {
	return "\n\n		precision mediump float;\n		precision mediump int;\n\n		attribute vec3 outputDirection;\n\n		varying vec3 vOutputDirection;\n\n		void main() {\n\n			vOutputDirection = outputDirection;\n			gl_Position = vec4( position, 1.0 );\n\n		}\n	";
}
var xt = class extends re {
	constructor(e = 1, t = {}) {
		super(e, e, t), this.isWebGLCubeRenderTarget = !0;
		let n = {
			width: e,
			height: e,
			depth: 1
		}, r = [
			n,
			n,
			n,
			n,
			n,
			n
		];
		this.texture = new je(r), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
	}
	fromEquirectangularTexture(e, t) {
		this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
		let n = {
			uniforms: { tEquirect: { value: null } },
			vertexShader: "\n\n				varying vec3 vWorldDirection;\n\n				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n				}\n\n				void main() {\n\n					vWorldDirection = transformDirection( position, modelMatrix );\n\n					#include <begin_vertex>\n					#include <project_vertex>\n\n				}\n			",
			fragmentShader: "\n\n				uniform sampler2D tEquirect;\n\n				varying vec3 vWorldDirection;\n\n				#include <common>\n\n				void main() {\n\n					vec3 direction = normalize( vWorldDirection );\n\n					vec2 sampleUV = equirectUv( direction );\n\n					gl_FragColor = texture2D( tEquirect, sampleUV );\n\n				}\n			"
		}, r = new Te(5, 5, 5), i = new A({
			name: "CubemapFromEquirect",
			uniforms: Fe(n.uniforms),
			vertexShader: n.vertexShader,
			fragmentShader: n.fragmentShader,
			side: 1,
			blending: 0
		});
		i.uniforms.tEquirect.value = t;
		let a = new I(r, i), o = t.minFilter;
		return t.minFilter === 1008 && (t.minFilter = B), new Pe(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
	}
	clear(e, t = !0, n = !0, r = !0) {
		let i = e.getRenderTarget();
		for (let i = 0; i < 6; i++) e.setRenderTarget(this, i), e.clear(t, n, r);
		e.setRenderTarget(i);
	}
};
function St(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = null;
	function i(e, t = !1) {
		return e == null ? null : t ? o(e) : a(e);
	}
	function a(n) {
		if (n && n.isTexture) {
			let r = n.mapping;
			if (r === 303 || r === 304) {
				if (t.has(n)) {
					let e = t.get(n).texture;
					return s(e, n.mapping);
				}
				{
					let r = n.image;
					if (r && r.height > 0) {
						let i = new xt(r.height);
						return i.fromEquirectangularTexture(e, n), t.set(n, i), n.addEventListener("dispose", l), s(i.texture, n.mapping);
					}
					return null;
				}
			}
		}
		return n;
	}
	function o(t) {
		if (t && t.isTexture) {
			let i = t.mapping, a = i === 303 || i === 304, o = i === 301 || i === 302;
			if (a || o) {
				let i = n.get(t), s = i === void 0 ? 0 : i.texture.pmremVersion;
				if (t.isRenderTargetTexture && t.pmremVersion !== s) return r === null && (r = new ft(e)), i = a ? r.fromEquirectangular(t, i) : r.fromCubemap(t, i), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), i.texture;
				if (i !== void 0) return i.texture;
				{
					let s = t.image;
					return a && s && s.height > 0 || o && s && c(s) ? (r === null && (r = new ft(e)), i = a ? r.fromEquirectangular(t) : r.fromCubemap(t), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), t.addEventListener("dispose", u), i.texture) : null;
				}
			}
		}
		return t;
	}
	function s(e, t) {
		return t === 303 ? e.mapping = 301 : t === 304 && (e.mapping = 302), e;
	}
	function c(e) {
		let t = 0;
		for (let n = 0; n < 6; n++) e[n] !== void 0 && t++;
		return t === 6;
	}
	function l(e) {
		let n = e.target;
		n.removeEventListener("dispose", l);
		let r = t.get(n);
		r !== void 0 && (t.delete(n), r.dispose());
	}
	function u(e) {
		let t = e.target;
		t.removeEventListener("dispose", u);
		let r = n.get(t);
		r !== void 0 && (n.delete(t), r.dispose());
	}
	function d() {
		t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r !== null && (r.dispose(), r = null);
	}
	return {
		get: i,
		dispose: d
	};
}
function Ct(e) {
	let t = {};
	function n(n) {
		if (t[n] !== void 0) return t[n];
		let r = e.getExtension(n);
		return t[n] = r, r;
	}
	return {
		has: function(e) {
			return n(e) !== null;
		},
		init: function() {
			n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance"), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture"), n("WEBGL_render_shared_exponent");
		},
		get: function(e) {
			let t = n(e);
			return t === null && _e("WebGLRenderer: " + e + " extension not supported."), t;
		}
	};
}
function wt(e, t, n, r) {
	let i = {}, a = /* @__PURE__ */ new WeakMap();
	function o(e) {
		let s = e.target;
		s.index !== null && t.remove(s.index);
		for (let e in s.attributes) t.remove(s.attributes[e]);
		s.removeEventListener("dispose", o), delete i[s.id];
		let c = a.get(s);
		c && (t.remove(c), a.delete(s)), r.releaseStatesOfGeometry(s), s.isInstancedBufferGeometry === !0 && delete s._maxInstanceCount, n.memory.geometries--;
	}
	function s(e, t) {
		return i[t.id] === !0 ? t : (t.addEventListener("dispose", o), i[t.id] = !0, n.memory.geometries++, t);
	}
	function c(n) {
		let r = n.attributes;
		for (let n in r) t.update(r[n], e.ARRAY_BUFFER);
	}
	function l(e) {
		let n = [], r = e.index, i = e.attributes.position, o = 0;
		if (i === void 0) return;
		if (r !== null) {
			let e = r.array;
			o = r.version;
			for (let t = 0, r = e.length; t < r; t += 3) {
				let r = e[t + 0], i = e[t + 1], a = e[t + 2];
				n.push(r, i, i, a, a, r);
			}
		} else {
			let e = i.array;
			o = i.version;
			for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
				let e = t + 0, r = t + 1, i = t + 2;
				n.push(e, r, r, i, i, e);
			}
		}
		let s = new (i.count >= 65535 ? V : Ee)(n, 1);
		s.version = o;
		let c = a.get(e);
		c && t.remove(c), a.set(e, s);
	}
	function u(e) {
		let t = a.get(e);
		if (t) {
			let n = e.index;
			n !== null && t.version < n.version && l(e);
		} else l(e);
		return a.get(e);
	}
	return {
		get: s,
		update: c,
		getWireframeAttribute: u
	};
}
function Tt(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	let a, o;
	function s(e) {
		a = e.type, o = e.bytesPerElement;
	}
	function c(t, i) {
		e.drawElements(r, i, a, t * o), n.update(i, r, 1);
	}
	function l(t, i, s) {
		s !== 0 && (e.drawElementsInstanced(r, i, a, t * o, s), n.update(i, r, s));
	}
	function u(e, i, o) {
		if (o === 0) return;
		t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r, i, 0, a, e, 0, o);
		let s = 0;
		for (let e = 0; e < o; e++) s += i[e];
		n.update(s, r, 1);
	}
	this.setMode = i, this.setIndex = s, this.render = c, this.renderInstances = l, this.renderMultiDraw = u;
}
function Et(e) {
	let t = {
		geometries: 0,
		textures: 0
	}, n = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0
	};
	function r(t, r, i) {
		switch (n.calls++, r) {
			case e.TRIANGLES:
				n.triangles += t / 3 * i;
				break;
			case e.LINES:
				n.lines += t / 2 * i;
				break;
			case e.LINE_STRIP:
				n.lines += i * (t - 1);
				break;
			case e.LINE_LOOP:
				n.lines += i * t;
				break;
			case e.POINTS:
				n.points += i * t;
				break;
			default: E("WebGLInfo: Unknown draw mode:", r);
		}
	}
	function i() {
		n.calls = 0, n.triangles = 0, n.points = 0, n.lines = 0;
	}
	return {
		memory: t,
		render: n,
		programs: null,
		autoReset: !0,
		reset: i,
		update: r
	};
}
function Dt(e, t, n) {
	let r = /* @__PURE__ */ new WeakMap(), i = new xe();
	function a(a, o, s) {
		let c = a.morphTargetInfluences, l = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = l === void 0 ? 0 : l.length, d = r.get(o);
		if (d === void 0 || d.count !== u) {
			d !== void 0 && d.texture.dispose();
			let e = o.morphAttributes.position !== void 0, n = o.morphAttributes.normal !== void 0, a = o.morphAttributes.color !== void 0, s = o.morphAttributes.position || [], c = o.morphAttributes.normal || [], l = o.morphAttributes.color || [], f = 0;
			e === !0 && (f = 1), n === !0 && (f = 2), a === !0 && (f = 3);
			let p = o.attributes.position.count * f, m = 1;
			p > t.maxTextureSize && (m = Math.ceil(p / t.maxTextureSize), p = t.maxTextureSize);
			let h = new Float32Array(p * m * 4 * u), g = new W(h, p, m, u);
			g.type = Le, g.needsUpdate = !0;
			let _ = f * 4;
			for (let t = 0; t < u; t++) {
				let r = s[t], o = c[t], u = l[t], d = p * m * 4 * t;
				for (let t = 0; t < r.count; t++) {
					let s = t * _;
					e === !0 && (i.fromBufferAttribute(r, t), h[d + s + 0] = i.x, h[d + s + 1] = i.y, h[d + s + 2] = i.z, h[d + s + 3] = 0), n === !0 && (i.fromBufferAttribute(o, t), h[d + s + 4] = i.x, h[d + s + 5] = i.y, h[d + s + 6] = i.z, h[d + s + 7] = 0), a === !0 && (i.fromBufferAttribute(u, t), h[d + s + 8] = i.x, h[d + s + 9] = i.y, h[d + s + 10] = i.z, h[d + s + 11] = u.itemSize === 4 ? i.w : 1);
				}
			}
			d = {
				count: u,
				texture: g,
				size: new L(p, m)
			}, r.set(o, d);
			function v() {
				g.dispose(), r.delete(o), o.removeEventListener("dispose", v);
			}
			o.addEventListener("dispose", v);
		}
		if (a.isInstancedMesh === !0 && a.morphTexture !== null) s.getUniforms().setValue(e, "morphTexture", a.morphTexture, n);
		else {
			let t = 0;
			for (let e = 0; e < c.length; e++) t += c[e];
			let n = o.morphTargetsRelative ? 1 : 1 - t;
			s.getUniforms().setValue(e, "morphTargetBaseInfluence", n), s.getUniforms().setValue(e, "morphTargetInfluences", c);
		}
		s.getUniforms().setValue(e, "morphTargetsTexture", d.texture, n), s.getUniforms().setValue(e, "morphTargetsTextureSize", d.size);
	}
	return { update: a };
}
function Ot(e, t, n, r, i) {
	let a = /* @__PURE__ */ new WeakMap();
	function o(r) {
		let o = i.render.frame, s = r.geometry, l = t.get(r, s);
		if (a.get(l) !== o && (t.update(l), a.set(l, o)), r.isInstancedMesh && (r.hasEventListener("dispose", c) === !1 && r.addEventListener("dispose", c), a.get(r) !== o && (n.update(r.instanceMatrix, e.ARRAY_BUFFER), r.instanceColor !== null && n.update(r.instanceColor, e.ARRAY_BUFFER), a.set(r, o))), r.isSkinnedMesh) {
			let e = r.skeleton;
			a.get(e) !== o && (e.update(), a.set(e, o));
		}
		return l;
	}
	function s() {
		a = /* @__PURE__ */ new WeakMap();
	}
	function c(e) {
		let t = e.target;
		t.removeEventListener("dispose", c), r.releaseStatesOfObject(t), n.remove(t.instanceMatrix), t.instanceColor !== null && n.remove(t.instanceColor);
	}
	return {
		update: o,
		dispose: s
	};
}
var kt = {
	1: "LINEAR_TONE_MAPPING",
	2: "REINHARD_TONE_MAPPING",
	3: "CINEON_TONE_MAPPING",
	4: "ACES_FILMIC_TONE_MAPPING",
	6: "AGX_TONE_MAPPING",
	7: "NEUTRAL_TONE_MAPPING",
	5: "CUSTOM_TONE_MAPPING"
};
function At(e, t, n, r, i, a) {
	let o = new re(t, n, {
		type: e,
		depthBuffer: i,
		stencilBuffer: a,
		samples: r ? 4 : 0,
		storeMultisampledDepthBuffer: !1,
		storeMultisampledStencilBuffer: !1,
		resolveDepthBuffer: !1,
		resolveStencilBuffer: !1
	}), s = null, c = null, l = new ye();
	l.setAttribute("position", new T([
		-1,
		3,
		0,
		-1,
		-1,
		0,
		3,
		-1,
		0
	], 3)), l.setAttribute("uv", new T([
		0,
		2,
		0,
		0,
		2,
		0
	], 2));
	let u = new ge({
		uniforms: { tDiffuse: { value: null } },
		vertexShader: "\n			precision highp float;\n\n			uniform mat4 modelViewMatrix;\n			uniform mat4 projectionMatrix;\n\n			attribute vec3 position;\n			attribute vec2 uv;\n\n			varying vec2 vUv;\n\n			void main() {\n				vUv = uv;\n				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n			}",
		fragmentShader: "\n			precision highp float;\n\n			uniform sampler2D tDiffuse;\n\n			varying vec2 vUv;\n\n			#include <tonemapping_pars_fragment>\n			#include <colorspace_pars_fragment>\n\n			void main() {\n				gl_FragColor = texture2D( tDiffuse, vUv );\n\n				#ifdef LINEAR_TONE_MAPPING\n					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n				#elif defined( REINHARD_TONE_MAPPING )\n					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n				#elif defined( CINEON_TONE_MAPPING )\n					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n				#elif defined( ACES_FILMIC_TONE_MAPPING )\n					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n				#elif defined( AGX_TONE_MAPPING )\n					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n				#elif defined( NEUTRAL_TONE_MAPPING )\n					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n				#elif defined( CUSTOM_TONE_MAPPING )\n					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n				#endif\n\n				#ifdef SRGB_TRANSFER\n					gl_FragColor = sRGBTransferOETF( gl_FragColor );\n				#endif\n			}",
		depthTest: !1,
		depthWrite: !1
	}), d = new I(l, u), f = new w(-1, 1, 1, -1, 0, 1), p = null, m = null, h = !1, g, _ = null, v = [], y = !1;
	this.setSize = function(e, t) {
		o.setSize(e, t), s !== null && s.setSize(e, t), c !== null && c.setSize(e, t);
		for (let n = 0; n < v.length; n++) {
			let r = v[n];
			r.setSize && r.setSize(e, t);
		}
	}, this.setEffects = function(e) {
		v = e, y = v.length > 0 && v[0].isRenderPass === !0;
		let t = o.width, n = o.height;
		v.length > 0 && s === null && (s = new re(t, n, {
			type: N,
			depthBuffer: !1,
			stencilBuffer: !1
		}), c = new re(t, n, {
			type: N,
			depthBuffer: !1,
			stencilBuffer: !1
		}));
		for (let e = 0; e < v.length; e++) {
			let r = v[e];
			r.setSize && r.setSize(t, n);
		}
	}, this.begin = function(e, t) {
		if (h || e.toneMapping === 0 && v.length === 0) return !1;
		if (_ = t, t !== null) {
			let e = t.width, n = t.height;
			(o.width !== e || o.height !== n) && this.setSize(e, n);
		}
		return y === !1 && e.setRenderTarget(o), g = e.toneMapping, e.toneMapping = 0, !0;
	}, this.hasRenderPass = function() {
		return y;
	}, this.end = function(e, t) {
		e.toneMapping = g, h = !0;
		let n = o, r = s;
		for (let i = 0; i < v.length; i++) {
			let a = v[i];
			a.enabled !== !1 && (a.render(e, r, n, t), a.needsSwap !== !1 && (n = r, r = r === s ? c : s));
		}
		if (p !== e.outputColorSpace || m !== e.toneMapping) {
			p = e.outputColorSpace, m = e.toneMapping, u.defines = {}, F.getTransfer(p) === "srgb" && (u.defines.SRGB_TRANSFER = "");
			let t = kt[m];
			t && (u.defines[t] = ""), u.needsUpdate = !0;
		}
		u.uniforms.tDiffuse.value = n.texture, e.setRenderTarget(_), e.render(d, f), _ = null, h = !1;
	}, this.isCompositing = function() {
		return h;
	}, this.dispose = function() {
		o.dispose(), s !== null && s.dispose(), c !== null && c.dispose(), l.dispose(), u.dispose();
	};
}
var jt = /*@__PURE__*/ new P(), Mt = /*@__PURE__*/ new he(1, 1), Nt = /*@__PURE__*/ new W(), Pt = /*@__PURE__*/ new n(), Ft = /*@__PURE__*/ new je(), It = [], Lt = [], Rt = /* @__PURE__ */ new Float32Array(16), zt = /* @__PURE__ */ new Float32Array(9), Bt = /* @__PURE__ */ new Float32Array(4);
function Vt(e, t, n) {
	let r = e[0];
	if (r <= 0 || r > 0) return e;
	let i = t * n, a = It[i];
	if (a === void 0 && (a = new Float32Array(i), It[i] = a), t !== 0) {
		r.toArray(a, 0);
		for (let r = 1, i = 0; r !== t; ++r) i += n, e[r].toArray(a, i);
	}
	return a;
}
function $(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function Ht(e, t) {
	for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function Ut(e, t) {
	let n = Lt[t];
	n === void 0 && (n = new Int32Array(t), Lt[t] = n);
	for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
	return n;
}
function Wt(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1f(this.addr, t), n[0] = t);
}
function Gt(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2f(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if ($(n, t)) return;
		e.uniform2fv(this.addr, t), Ht(n, t);
	}
}
function Kt(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3f(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else if (t.r !== void 0) (n[0] !== t.r || n[1] !== t.g || n[2] !== t.b) && (e.uniform3f(this.addr, t.r, t.g, t.b), n[0] = t.r, n[1] = t.g, n[2] = t.b);
	else {
		if ($(n, t)) return;
		e.uniform3fv(this.addr, t), Ht(n, t);
	}
}
function qt(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4f(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if ($(n, t)) return;
		e.uniform4fv(this.addr, t), Ht(n, t);
	}
}
function Jt(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if ($(n, t)) return;
		e.uniformMatrix2fv(this.addr, !1, t), Ht(n, t);
	} else {
		if ($(n, r)) return;
		Bt.set(r), e.uniformMatrix2fv(this.addr, !1, Bt), Ht(n, r);
	}
}
function Yt(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if ($(n, t)) return;
		e.uniformMatrix3fv(this.addr, !1, t), Ht(n, t);
	} else {
		if ($(n, r)) return;
		zt.set(r), e.uniformMatrix3fv(this.addr, !1, zt), Ht(n, r);
	}
}
function Xt(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if ($(n, t)) return;
		e.uniformMatrix4fv(this.addr, !1, t), Ht(n, t);
	} else {
		if ($(n, r)) return;
		Rt.set(r), e.uniformMatrix4fv(this.addr, !1, Rt), Ht(n, r);
	}
}
function Zt(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1i(this.addr, t), n[0] = t);
}
function Qt(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2i(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if ($(n, t)) return;
		e.uniform2iv(this.addr, t), Ht(n, t);
	}
}
function $t(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3i(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if ($(n, t)) return;
		e.uniform3iv(this.addr, t), Ht(n, t);
	}
}
function en(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4i(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if ($(n, t)) return;
		e.uniform4iv(this.addr, t), Ht(n, t);
	}
}
function tn(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1ui(this.addr, t), n[0] = t);
}
function nn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2ui(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if ($(n, t)) return;
		e.uniform2uiv(this.addr, t), Ht(n, t);
	}
}
function rn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3ui(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if ($(n, t)) return;
		e.uniform3uiv(this.addr, t), Ht(n, t);
	}
}
function an(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if ($(n, t)) return;
		e.uniform4uiv(this.addr, t), Ht(n, t);
	}
}
function on(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i);
	let a;
	this.type === e.SAMPLER_2D_SHADOW ? (Mt.compareFunction = n.isReversedDepthBuffer() ? 518 : 515, a = Mt) : a = jt, n.setTexture2D(t || a, i);
}
function sn(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture3D(t || Pt, i);
}
function cn(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTextureCube(t || Ft, i);
}
function ln(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture2DArray(t || Nt, i);
}
function un(e) {
	switch (e) {
		case 5126: return Wt;
		case 35664: return Gt;
		case 35665: return Kt;
		case 35666: return qt;
		case 35674: return Jt;
		case 35675: return Yt;
		case 35676: return Xt;
		case 5124:
		case 35670: return Zt;
		case 35667:
		case 35671: return Qt;
		case 35668:
		case 35672: return $t;
		case 35669:
		case 35673: return en;
		case 5125: return tn;
		case 36294: return nn;
		case 36295: return rn;
		case 36296: return an;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return on;
		case 35679:
		case 36299:
		case 36307: return sn;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return cn;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return ln;
	}
}
function dn(e, t) {
	e.uniform1fv(this.addr, t);
}
function fn(e, t) {
	let n = Vt(t, this.size, 2);
	e.uniform2fv(this.addr, n);
}
function pn(e, t) {
	let n = Vt(t, this.size, 3);
	e.uniform3fv(this.addr, n);
}
function mn(e, t) {
	let n = Vt(t, this.size, 4);
	e.uniform4fv(this.addr, n);
}
function hn(e, t) {
	let n = Vt(t, this.size, 4);
	e.uniformMatrix2fv(this.addr, !1, n);
}
function gn(e, t) {
	let n = Vt(t, this.size, 9);
	e.uniformMatrix3fv(this.addr, !1, n);
}
function _n(e, t) {
	let n = Vt(t, this.size, 16);
	e.uniformMatrix4fv(this.addr, !1, n);
}
function vn(e, t) {
	e.uniform1iv(this.addr, t);
}
function yn(e, t) {
	e.uniform2iv(this.addr, t);
}
function bn(e, t) {
	e.uniform3iv(this.addr, t);
}
function xn(e, t) {
	e.uniform4iv(this.addr, t);
}
function Sn(e, t) {
	e.uniform1uiv(this.addr, t);
}
function Cn(e, t) {
	e.uniform2uiv(this.addr, t);
}
function wn(e, t) {
	e.uniform3uiv(this.addr, t);
}
function Tn(e, t) {
	e.uniform4uiv(this.addr, t);
}
function En(e, t, n) {
	let r = this.cache, i = t.length, a = Ut(n, i);
	$(r, a) || (e.uniform1iv(this.addr, a), Ht(r, a));
	let o;
	o = this.type === e.SAMPLER_2D_SHADOW ? Mt : jt;
	for (let e = 0; e !== i; ++e) n.setTexture2D(t[e] || o, a[e]);
}
function Dn(e, t, n) {
	let r = this.cache, i = t.length, a = Ut(n, i);
	$(r, a) || (e.uniform1iv(this.addr, a), Ht(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture3D(t[e] || Pt, a[e]);
}
function On(e, t, n) {
	let r = this.cache, i = t.length, a = Ut(n, i);
	$(r, a) || (e.uniform1iv(this.addr, a), Ht(r, a));
	for (let e = 0; e !== i; ++e) n.setTextureCube(t[e] || Ft, a[e]);
}
function kn(e, t, n) {
	let r = this.cache, i = t.length, a = Ut(n, i);
	$(r, a) || (e.uniform1iv(this.addr, a), Ht(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture2DArray(t[e] || Nt, a[e]);
}
function An(e) {
	switch (e) {
		case 5126: return dn;
		case 35664: return fn;
		case 35665: return pn;
		case 35666: return mn;
		case 35674: return hn;
		case 35675: return gn;
		case 35676: return _n;
		case 5124:
		case 35670: return vn;
		case 35667:
		case 35671: return yn;
		case 35668:
		case 35672: return bn;
		case 35669:
		case 35673: return xn;
		case 5125: return Sn;
		case 36294: return Cn;
		case 36295: return wn;
		case 36296: return Tn;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return En;
		case 35679:
		case 36299:
		case 36307: return Dn;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return On;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return kn;
	}
}
var jn = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = un(t.type);
	}
}, Mn = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = An(t.type);
	}
}, Nn = class {
	constructor(e) {
		this.id = e, this.seq = [], this.map = {};
	}
	setValue(e, t, n) {
		let r = this.seq;
		for (let i = 0, a = r.length; i !== a; ++i) {
			let a = r[i];
			a.setValue(e, t[a.id], n);
		}
	}
}, Pn = /(\w+)(\])?(\[|\.)?/g;
function Fn(e, t) {
	e.seq.push(t), e.map[t.id] = t;
}
function In(e, t, n) {
	let r = e.name, i = r.length;
	for (Pn.lastIndex = 0;;) {
		let a = Pn.exec(r), o = Pn.lastIndex, s = a[1], c = a[2] === "]", l = a[3];
		if (c && (s |= 0), l === void 0 || l === "[" && o + 2 === i) {
			Fn(n, l === void 0 ? new jn(s, e, t) : new Mn(s, e, t));
			break;
		}
		{
			let e = n.map[s];
			e === void 0 && (e = new Nn(s), Fn(n, e)), n = e;
		}
	}
}
var Ln = class {
	constructor(e, t) {
		this.seq = [], this.map = {};
		let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
		for (let r = 0; r < n; ++r) {
			let n = e.getActiveUniform(t, r);
			In(n, e.getUniformLocation(t, n.name), this);
		}
		let r = [], i = [];
		for (let t of this.seq) t.type === e.SAMPLER_2D_SHADOW || t.type === e.SAMPLER_CUBE_SHADOW || t.type === e.SAMPLER_2D_ARRAY_SHADOW ? r.push(t) : i.push(t);
		r.length > 0 && (this.seq = r.concat(i));
	}
	setValue(e, t, n, r) {
		let i = this.map[t];
		i !== void 0 && i.setValue(e, n, r);
	}
	setOptional(e, t, n) {
		let r = t[n];
		r !== void 0 && this.setValue(e, n, r);
	}
	static upload(e, t, n, r) {
		for (let i = 0, a = t.length; i !== a; ++i) {
			let a = t[i], o = n[a.id];
			o.needsUpdate !== !1 && a.setValue(e, o.value, r);
		}
	}
	static seqWithValue(e, t) {
		let n = [];
		for (let r = 0, i = e.length; r !== i; ++r) {
			let i = e[r];
			i.id in t && n.push(i);
		}
		return n;
	}
};
function Rn(e, t, n) {
	let r = e.createShader(t);
	return e.shaderSource(r, n), e.compileShader(r), r;
}
var zn = 37297, Bn = 0;
function Vn(e, t) {
	let n = e.split("\n"), r = [], i = Math.max(t - 6, 0), a = Math.min(t + 6, n.length);
	for (let e = i; e < a; e++) {
		let i = e + 1;
		r.push(`${i === t ? ">" : " "} ${i}: ${n[e]}`);
	}
	return r.join("\n");
}
var Hn = /*@__PURE__*/ new U();
function Un(e) {
	F._getMatrix(Hn, F.workingColorSpace, e);
	let t = `mat3( ${Hn.elements.map((e) => e.toFixed(4))} )`;
	switch (F.getTransfer(e)) {
		case Ce: return [t, "LinearTransferOETF"];
		case M: return [t, "sRGBTransferOETF"];
		default: return b("WebGLProgram: Unsupported color space: ", e), [t, "LinearTransferOETF"];
	}
}
function Wn(e, t, n) {
	let r = e.getShaderParameter(t, e.COMPILE_STATUS), i = (e.getShaderInfoLog(t) || "").trim();
	if (r && i === "") return "";
	let a = /ERROR: 0:(\d+)/.exec(i);
	if (a) {
		let r = parseInt(a[1]);
		return n.toUpperCase() + "\n\n" + i + "\n\n" + Vn(e.getShaderSource(t), r);
	}
	return i;
}
function Gn(e, t) {
	let n = Un(t);
	return [
		`vec4 ${e}( vec4 value ) {`,
		`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
		"}"
	].join("\n");
}
var Kn = {
	1: "Linear",
	2: "Reinhard",
	3: "Cineon",
	4: "ACESFilmic",
	6: "AgX",
	7: "Neutral",
	5: "Custom"
};
function qn(e, t) {
	let n = Kn[t];
	return n === void 0 ? (b("WebGLProgram: Unsupported toneMapping:", t), "vec3 " + e + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + e + "( vec3 color ) { return " + n + "ToneMapping( color ); }";
}
var Jn = /*@__PURE__*/ new H();
function Yn() {
	return F.getLuminanceCoefficients(Jn), [
		"float luminance( const in vec3 rgb ) {",
		`	const vec3 weights = vec3( ${Jn.x.toFixed(4)}, ${Jn.y.toFixed(4)}, ${Jn.z.toFixed(4)} );`,
		"	return dot( weights, rgb );",
		"}"
	].join("\n");
}
function Xn(e) {
	return [e.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", e.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter($n).join("\n");
}
function Zn(e) {
	let t = [];
	for (let n in e) {
		let r = e[n];
		r !== !1 && t.push("#define " + n + " " + r);
	}
	return t.join("\n");
}
function Qn(e, t) {
	let n = {}, r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveAttrib(t, i), a = r.name, o = 1;
		r.type === e.FLOAT_MAT2 && (o = 2), r.type === e.FLOAT_MAT3 && (o = 3), r.type === e.FLOAT_MAT4 && (o = 4), n[a] = {
			type: r.type,
			location: e.getAttribLocation(t, a),
			locationSize: o
		};
	}
	return n;
}
function $n(e) {
	return e !== "";
}
function er(e, t) {
	let n = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
	return e.replace(/NUM_SUN_LIGHTS/g, t.numSunLights).replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g, t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function tr(e, t) {
	return e.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
var nr = /^[ \t]*#include +<([\w\d./]+)>/gm;
function rr(e) {
	return e.replace(nr, ar);
}
var ir = /* @__PURE__ */ new Map();
function ar(e, t) {
	let n = X[t];
	if (n === void 0) {
		let e = ir.get(t);
		if (e !== void 0) n = X[e], b("WebGLRenderer: Shader chunk \"%s\" has been deprecated. Use \"%s\" instead.", t, e);
		else throw Error("THREE.WebGLProgram: Can not resolve #include <" + t + ">");
	}
	return rr(n);
}
var or = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function sr(e) {
	return e.replace(or, cr);
}
function cr(e, t, n, r) {
	let i = "";
	for (let e = parseInt(t); e < parseInt(n); e++) i += r.replace(/\[\s*i\s*\]/g, "[ " + e + " ]").replace(/UNROLLED_LOOP_INDEX/g, e);
	return i;
}
function lr(e) {
	let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
	return e.precision === "highp" ? t += "\n#define HIGH_PRECISION" : e.precision === "mediump" ? t += "\n#define MEDIUM_PRECISION" : e.precision === "lowp" && (t += "\n#define LOW_PRECISION"), t;
}
var ur = {
	1: "SHADOWMAP_TYPE_PCF",
	3: "SHADOWMAP_TYPE_VSM"
};
function dr(e) {
	return ur[e.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
var fr = {
	301: "ENVMAP_TYPE_CUBE",
	302: "ENVMAP_TYPE_CUBE",
	306: "ENVMAP_TYPE_CUBE_UV"
};
function pr(e) {
	return e.envMap === !1 ? "ENVMAP_TYPE_CUBE" : fr[e.envMapMode] || "ENVMAP_TYPE_CUBE";
}
var mr = { 302: "ENVMAP_MODE_REFRACTION" };
function hr(e) {
	return e.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : mr[e.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
var gr = {
	0: "ENVMAP_BLENDING_MULTIPLY",
	1: "ENVMAP_BLENDING_MIX",
	2: "ENVMAP_BLENDING_ADD"
};
function _r(e) {
	return e.envMap === !1 ? "ENVMAP_BLENDING_NONE" : gr[e.combine] || "ENVMAP_BLENDING_NONE";
}
function vr(e) {
	let t = e.envMapCubeUVHeight;
	if (t === null) return null;
	let n = Math.log2(t) - 2, r = 1 / t;
	return {
		texelWidth: 1 / (3 * Math.max(2 ** n, 112)),
		texelHeight: r,
		maxMip: n
	};
}
function yr(e, t, n, r) {
	let i = e.getContext(), a = n.defines, o = n.vertexShader, s = n.fragmentShader, c = dr(n), l = pr(n), u = hr(n), d = _r(n), f = vr(n), p = Xn(n), m = Zn(a), h = i.createProgram(), g, _, v = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
	n.isRawShaderMaterial ? (g = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter($n).join("\n"), g.length > 0 && (g += "\n"), _ = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter($n).join("\n"), _.length > 0 && (_ += "\n")) : (g = [
		lr(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
		n.batching ? "#define USE_BATCHING" : "",
		n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
		n.instancing ? "#define USE_INSTANCING" : "",
		n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
		n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.map ? "#define USE_MAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + u : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.mapUv ? "#define MAP_UV " + n.mapUv : "",
		n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
		n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
		n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
		n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
		n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
		n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
		n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "",
		n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
		n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
		n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "",
		n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
		n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "",
		n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "",
		n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "",
		n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "",
		n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "",
		n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "",
		n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
		n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "",
		n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "",
		n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "",
		n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexNormals ? "#define HAS_NORMAL" : "",
		n.vertexColors ? "#define USE_COLOR" : "",
		n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.skinning ? "#define USE_SKINNING" : "",
		n.morphTargets ? "#define USE_MORPHTARGETS" : "",
		n.morphNormals && n.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
		n.morphColors ? "#define USE_MORPHCOLORS" : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 modelMatrix;",
		"uniform mat4 modelViewMatrix;",
		"uniform mat4 projectionMatrix;",
		"uniform mat4 viewMatrix;",
		"uniform mat3 normalMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		"#ifdef USE_INSTANCING",
		"	attribute mat4 instanceMatrix;",
		"#endif",
		"#ifdef USE_INSTANCING_COLOR",
		"	attribute vec3 instanceColor;",
		"#endif",
		"#ifdef USE_INSTANCING_MORPH",
		"	uniform sampler2D morphTexture;",
		"#endif",
		"attribute vec3 position;",
		"attribute vec3 normal;",
		"attribute vec2 uv;",
		"#ifdef USE_UV1",
		"	attribute vec2 uv1;",
		"#endif",
		"#ifdef USE_UV2",
		"	attribute vec2 uv2;",
		"#endif",
		"#ifdef USE_UV3",
		"	attribute vec2 uv3;",
		"#endif",
		"#ifdef USE_TANGENT",
		"	attribute vec4 tangent;",
		"#endif",
		"#if defined( USE_COLOR_ALPHA )",
		"	attribute vec4 color;",
		"#elif defined( USE_COLOR )",
		"	attribute vec3 color;",
		"#endif",
		"#ifdef USE_SKINNING",
		"	attribute vec4 skinIndex;",
		"	attribute vec4 skinWeight;",
		"#endif",
		"\n"
	].filter($n).join("\n"), _ = [
		lr(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
		n.map ? "#define USE_MAP" : "",
		n.matcap ? "#define USE_MATCAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + l : "",
		n.envMap ? "#define " + u : "",
		n.envMap ? "#define " + d : "",
		f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
		f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
		f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoat ? "#define USE_CLEARCOAT" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.dispersion ? "#define USE_DISPERSION" : "",
		n.retroreflection ? "#define USE_RETROREFLECTION" : "",
		n.iridescence ? "#define USE_IRIDESCENCE" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaTest ? "#define USE_ALPHATEST" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.sheen ? "#define USE_SHEEN" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "",
		n.vertexAlphas || n.batchingColor ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.gradientMap ? "#define USE_GRADIENTMAP" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
		n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
		n.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 viewMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		n.toneMapping === 0 ? "" : "#define TONE_MAPPING",
		n.toneMapping === 0 ? "" : X.tonemapping_pars_fragment,
		n.toneMapping === 0 ? "" : qn("toneMapping", n.toneMapping),
		n.dithering ? "#define DITHERING" : "",
		n.opaque ? "#define OPAQUE" : "",
		X.colorspace_pars_fragment,
		Gn("linearToOutputTexel", n.outputColorSpace),
		Yn(),
		n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
		"\n"
	].filter($n).join("\n")), o = rr(o), o = er(o, n), o = tr(o, n), s = rr(s), s = er(s, n), s = tr(s, n), o = sr(o), s = sr(s), n.isRawShaderMaterial !== !0 && (v = "#version 300 es\n", g = [
		p,
		"#define attribute in",
		"#define varying out",
		"#define texture2D texture"
	].join("\n") + "\n" + g, _ = [
		"#define varying in",
		n.glslVersion === "300 es" ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
		n.glslVersion === "300 es" ? "" : "#define gl_FragColor pc_fragColor",
		"#define gl_FragDepthEXT gl_FragDepth",
		"#define texture2D texture",
		"#define textureCube texture",
		"#define texture2DProj textureProj",
		"#define texture2DLodEXT textureLod",
		"#define texture2DProjLodEXT textureProjLod",
		"#define textureCubeLodEXT textureLod",
		"#define texture2DGradEXT textureGrad",
		"#define texture2DProjGradEXT textureProjGrad",
		"#define textureCubeGradEXT textureGrad"
	].join("\n") + "\n" + _);
	let y = v + g + o, x = v + _ + s, S = Rn(i, i.VERTEX_SHADER, y), C = Rn(i, i.FRAGMENT_SHADER, x);
	i.attachShader(h, S), i.attachShader(h, C), n.index0AttributeName === void 0 ? n.hasPositionAttribute === !0 && i.bindAttribLocation(h, 0, "position") : i.bindAttribLocation(h, 0, n.index0AttributeName), i.linkProgram(h);
	function w(t) {
		if (e.debug.checkShaderErrors) {
			let n = i.getProgramInfoLog(h) || "", r = i.getShaderInfoLog(S) || "", a = i.getShaderInfoLog(C) || "", o = n.trim(), s = r.trim(), c = a.trim(), l = !0, u = !0;
			if (i.getProgramParameter(h, i.LINK_STATUS) === !1) {
				if (l = !1, typeof e.debug.onShaderError == "function") e.debug.onShaderError(i, h, S, C);
				else {
					let e = Wn(i, S, "vertex"), n = Wn(i, C, "fragment");
					E("WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(h, i.VALIDATE_STATUS) + "\n\nMaterial Name: " + t.name + "\nMaterial Type: " + t.type + "\n\nProgram Info Log: " + o + "\n" + e + "\n" + n);
				}
			} else o === "" ? (s === "" || c === "") && (u = !1) : b("WebGLProgram: Program Info Log:", o);
			u && (t.diagnostics = {
				runnable: l,
				programLog: o,
				vertexShader: {
					log: s,
					prefix: g
				},
				fragmentShader: {
					log: c,
					prefix: _
				}
			});
		}
		i.deleteShader(S), i.deleteShader(C), T = new Ln(i, h), D = Qn(i, h);
	}
	let T;
	this.getUniforms = function() {
		return T === void 0 && w(this), T;
	};
	let D;
	this.getAttributes = function() {
		return D === void 0 && w(this), D;
	};
	let O = n.rendererExtensionParallelShaderCompile === !1;
	return this.isReady = function() {
		return O === !1 && (O = i.getProgramParameter(h, zn)), O;
	}, this.destroy = function() {
		r.releaseStatesOfProgram(this), i.deleteProgram(h), this.program = void 0;
	}, this.type = n.shaderType, this.name = n.shaderName, this.id = Bn++, this.cacheKey = t, this.usedTimes = 1, this.program = h, this.vertexShader = S, this.fragmentShader = C, this;
}
var br = 0, xr = class {
	constructor() {
		this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
	}
	update(e, t, n) {
		let r = this._getShaderCacheForMaterial(e);
		return r.has(t) === !1 && (r.add(t), t.usedTimes++), r.has(n) === !1 && (r.add(n), n.usedTimes++), this;
	}
	remove(e) {
		let t = this.materialCache.get(e);
		for (let e of t) e.usedTimes--, e.usedTimes === 0 && this.shaderCache.delete(e.code);
		return this.materialCache.delete(e), this;
	}
	getVertexShaderStage(e) {
		return this._getShaderStage(e.vertexShader);
	}
	getFragmentShaderStage(e) {
		return this._getShaderStage(e.fragmentShader);
	}
	dispose() {
		this.shaderCache.clear(), this.materialCache.clear();
	}
	_getShaderCacheForMaterial(e) {
		let t = this.materialCache, n = t.get(e);
		return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
	}
	_getShaderStage(e) {
		let t = this.shaderCache, n = t.get(e);
		return n === void 0 && (n = new Sr(e), t.set(e, n)), n;
	}
}, Sr = class {
	constructor(e) {
		this.id = br++, this.code = e, this.usedTimes = 0;
	}
};
function Cr(e) {
	return e === 1030 || e === 37490 || e === 36285;
}
function wr(e, t, n, r, i, a) {
	let o = new me(), s = new xr(), c = /* @__PURE__ */ new Set(), l = [], u = /* @__PURE__ */ new Map(), d = r.logarithmicDepthBuffer, f = r.precision, p = {
		MeshDepthMaterial: "depth",
		MeshDistanceMaterial: "distance",
		MeshNormalMaterial: "normal",
		MeshBasicMaterial: "basic",
		MeshLambertMaterial: "lambert",
		MeshPhongMaterial: "phong",
		MeshToonMaterial: "toon",
		MeshStandardMaterial: "physical",
		MeshPhysicalMaterial: "physical",
		MeshMatcapMaterial: "matcap",
		LineBasicMaterial: "basic",
		LineDashedMaterial: "dashed",
		PointsMaterial: "points",
		ShadowMaterial: "shadow",
		SpriteMaterial: "sprite"
	};
	function m(e) {
		return c.add(e), e === 0 ? "uv" : `uv${e}`;
	}
	function h(i, o, l, u, h, g) {
		let _ = u.fog, v = h.geometry, y = i.isMeshStandardMaterial || i.isMeshLambertMaterial || i.isMeshPhongMaterial ? u.environment : null, x = i.isMeshStandardMaterial || i.isMeshLambertMaterial && !i.envMap || i.isMeshPhongMaterial && !i.envMap, S = t.get(i.envMap || y, x), C = S && S.mapping === 306 ? S.image.height : null, w = p[i.type];
		i.precision !== null && (f = r.getMaxPrecision(i.precision), f !== i.precision && b("WebGLProgram.getParameters:", i.precision, "not supported, using", f, "instead."));
		let T = v.morphAttributes.position || v.morphAttributes.normal || v.morphAttributes.color, E = T === void 0 ? 0 : T.length, D = 0;
		v.morphAttributes.position !== void 0 && (D = 1), v.morphAttributes.normal !== void 0 && (D = 2), v.morphAttributes.color !== void 0 && (D = 3);
		let O, ee, k, A;
		if (w) {
			let e = Ke[w];
			O = e.vertexShader, ee = e.fragmentShader;
		} else {
			O = i.vertexShader, ee = i.fragmentShader;
			let e = s.getVertexShaderStage(i), t = s.getFragmentShaderStage(i);
			s.update(i, e, t), k = e.id, A = t.id;
		}
		let j = e.getRenderTarget(), M = e.state.buffers.depth.getReversed(), N = h.isInstancedMesh === !0, te = h.isBatchedMesh === !0, P = !!i.map, ne = !!i.matcap, re = !!S, ie = !!i.aoMap, ae = !!i.lightMap, I = !!i.bumpMap && i.wireframe === !1, oe = !!i.normalMap, se = !!i.displacementMap, ce = !!i.emissiveMap, le = !!i.metalnessMap, L = !!i.roughnessMap, R = i.anisotropy > 0, z = i.clearcoat > 0, ue = i.dispersion > 0, de = i.retroreflectivity > 0, fe = i.iridescence > 0, pe = i.sheen > 0, me = i.transmission > 0, he = R && !!i.anisotropyMap, ge = z && !!i.clearcoatMap, _e = z && !!i.clearcoatNormalMap, ve = z && !!i.clearcoatRoughnessMap, ye = fe && !!i.iridescenceMap, be = fe && !!i.iridescenceThicknessMap, B = pe && !!i.sheenColorMap, xe = pe && !!i.sheenRoughnessMap, V = !!i.specularMap, Se = !!i.specularColorMap, H = !!i.specularIntensityMap, Ce = me && !!i.transmissionMap, we = me && !!i.thicknessMap, Te = !!i.gradientMap, Ee = !!i.alphaMap, De = i.alphaTest > 0, Oe = !!i.alphaHash, ke = !!i.extensions, U = 0;
		i.toneMapped && (j === null || j.isXRRenderTarget === !0) && (U = e.toneMapping);
		let W = {
			shaderID: w,
			shaderType: i.type,
			shaderName: i.name,
			vertexShader: O,
			fragmentShader: ee,
			defines: i.defines,
			customVertexShaderID: k,
			customFragmentShaderID: A,
			isRawShaderMaterial: i.isRawShaderMaterial === !0,
			glslVersion: i.glslVersion,
			precision: f,
			batching: te,
			batchingColor: te && h._colorsTexture !== null,
			instancing: N,
			instancingColor: N && h.instanceColor !== null,
			instancingMorph: N && h.morphTexture !== null,
			outputColorSpace: j === null ? e.outputColorSpace : j.isXRRenderTarget === !0 ? j.texture.colorSpace : F.workingColorSpace,
			alphaToCoverage: !!i.alphaToCoverage,
			map: P,
			matcap: ne,
			envMap: re,
			envMapMode: re && S.mapping,
			envMapCubeUVHeight: C,
			aoMap: ie,
			lightMap: ae,
			bumpMap: I,
			normalMap: oe,
			displacementMap: se,
			emissiveMap: ce,
			normalMapObjectSpace: oe && i.normalMapType === 1,
			normalMapTangentSpace: oe && i.normalMapType === 0,
			packedNormalMap: oe && i.normalMapType === 0 && Cr(i.normalMap.format),
			metalnessMap: le,
			roughnessMap: L,
			anisotropy: R,
			anisotropyMap: he,
			clearcoat: z,
			clearcoatMap: ge,
			clearcoatNormalMap: _e,
			clearcoatRoughnessMap: ve,
			dispersion: ue,
			retroreflection: de,
			iridescence: fe,
			iridescenceMap: ye,
			iridescenceThicknessMap: be,
			sheen: pe,
			sheenColorMap: B,
			sheenRoughnessMap: xe,
			specularMap: V,
			specularColorMap: Se,
			specularIntensityMap: H,
			transmission: me,
			transmissionMap: Ce,
			thicknessMap: we,
			gradientMap: Te,
			opaque: i.transparent === !1 && i.blending === 1 && i.alphaToCoverage === !1,
			alphaMap: Ee,
			alphaTest: De,
			alphaHash: Oe,
			combine: i.combine,
			mapUv: P && m(i.map.channel),
			aoMapUv: ie && m(i.aoMap.channel),
			lightMapUv: ae && m(i.lightMap.channel),
			bumpMapUv: I && m(i.bumpMap.channel),
			normalMapUv: oe && m(i.normalMap.channel),
			displacementMapUv: se && m(i.displacementMap.channel),
			emissiveMapUv: ce && m(i.emissiveMap.channel),
			metalnessMapUv: le && m(i.metalnessMap.channel),
			roughnessMapUv: L && m(i.roughnessMap.channel),
			anisotropyMapUv: he && m(i.anisotropyMap.channel),
			clearcoatMapUv: ge && m(i.clearcoatMap.channel),
			clearcoatNormalMapUv: _e && m(i.clearcoatNormalMap.channel),
			clearcoatRoughnessMapUv: ve && m(i.clearcoatRoughnessMap.channel),
			iridescenceMapUv: ye && m(i.iridescenceMap.channel),
			iridescenceThicknessMapUv: be && m(i.iridescenceThicknessMap.channel),
			sheenColorMapUv: B && m(i.sheenColorMap.channel),
			sheenRoughnessMapUv: xe && m(i.sheenRoughnessMap.channel),
			specularMapUv: V && m(i.specularMap.channel),
			specularColorMapUv: Se && m(i.specularColorMap.channel),
			specularIntensityMapUv: H && m(i.specularIntensityMap.channel),
			transmissionMapUv: Ce && m(i.transmissionMap.channel),
			thicknessMapUv: we && m(i.thicknessMap.channel),
			alphaMapUv: Ee && m(i.alphaMap.channel),
			vertexTangents: !!v.attributes.tangent && (oe || R),
			vertexNormals: !!v.attributes.normal,
			vertexColors: i.vertexColors,
			vertexAlphas: i.vertexColors === !0 && !!v.attributes.color && v.attributes.color.itemSize === 4,
			pointsUvs: h.isPoints === !0 && !!v.attributes.uv && (P || Ee),
			fog: !!_,
			useFog: i.fog === !0,
			fogExp2: !!_ && _.isFogExp2,
			flatShading: i.wireframe === !1 && (i.flatShading === !0 || v.attributes.normal === void 0 && oe === !1 && (i.isMeshLambertMaterial || i.isMeshPhongMaterial || i.isMeshStandardMaterial || i.isMeshPhysicalMaterial)),
			sizeAttenuation: i.sizeAttenuation === !0,
			logarithmicDepthBuffer: d,
			reversedDepthBuffer: M,
			skinning: h.isSkinnedMesh === !0,
			hasPositionAttribute: v.attributes.position !== void 0,
			morphTargets: v.morphAttributes.position !== void 0,
			morphNormals: v.morphAttributes.normal !== void 0,
			morphColors: v.morphAttributes.color !== void 0,
			morphTargetsCount: E,
			morphTextureStride: D,
			numSunLights: o.sun.length,
			numDirLights: o.directional.length,
			numPointLights: o.point.length,
			numSpotLights: o.spot.length,
			numSpotLightMaps: o.spotLightMap.length,
			numRectAreaLights: o.rectArea.length,
			numHemiLights: o.hemi.length,
			numSunLightShadows: o.sunShadowMap.length,
			numDirLightShadows: o.directionalShadowMap.length,
			numPointLightShadows: o.pointShadowMap.length,
			numSpotLightShadows: o.spotShadowMap.length,
			numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
			numLightProbes: o.numLightProbes,
			numLightProbeGrids: g.length,
			numClippingPlanes: a.numPlanes,
			numClipIntersection: a.numIntersection,
			dithering: i.dithering,
			shadowMapEnabled: e.shadowMap.enabled && l.length > 0,
			shadowMapType: e.shadowMap.type,
			toneMapping: U,
			decodeVideoTexture: P && i.map.isVideoTexture === !0 && F.getTransfer(i.map.colorSpace) === "srgb",
			decodeVideoTextureEmissive: ce && i.emissiveMap.isVideoTexture === !0 && F.getTransfer(i.emissiveMap.colorSpace) === "srgb",
			premultipliedAlpha: i.premultipliedAlpha,
			doubleSided: i.side === 2,
			flipSided: i.side === 1,
			useDepthPacking: i.depthPacking >= 0,
			depthPacking: i.depthPacking || 0,
			index0AttributeName: i.index0AttributeName,
			extensionClipCullDistance: ke && i.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
			extensionMultiDraw: (ke && i.extensions.multiDraw === !0 || te) && n.has("WEBGL_multi_draw"),
			rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
			customProgramCacheKey: i.customProgramCacheKey()
		};
		return W.vertexUv1s = c.has(1), W.vertexUv2s = c.has(2), W.vertexUv3s = c.has(3), c.clear(), W;
	}
	function g(t) {
		let n = [];
		if (t.shaderID ? n.push(t.shaderID) : (n.push(t.customVertexShaderID), n.push(t.customFragmentShaderID)), t.defines !== void 0) for (let e in t.defines) n.push(e), n.push(t.defines[e]);
		return t.isRawShaderMaterial === !1 && (_(n, t), v(n, t), n.push(e.outputColorSpace)), n.push(t.customProgramCacheKey), n.join();
	}
	function _(e, t) {
		e.push(t.precision), e.push(t.outputColorSpace), e.push(t.envMapMode), e.push(t.envMapCubeUVHeight), e.push(t.mapUv), e.push(t.alphaMapUv), e.push(t.lightMapUv), e.push(t.aoMapUv), e.push(t.bumpMapUv), e.push(t.normalMapUv), e.push(t.displacementMapUv), e.push(t.emissiveMapUv), e.push(t.metalnessMapUv), e.push(t.roughnessMapUv), e.push(t.anisotropyMapUv), e.push(t.clearcoatMapUv), e.push(t.clearcoatNormalMapUv), e.push(t.clearcoatRoughnessMapUv), e.push(t.iridescenceMapUv), e.push(t.iridescenceThicknessMapUv), e.push(t.sheenColorMapUv), e.push(t.sheenRoughnessMapUv), e.push(t.specularMapUv), e.push(t.specularColorMapUv), e.push(t.specularIntensityMapUv), e.push(t.transmissionMapUv), e.push(t.thicknessMapUv), e.push(t.combine), e.push(t.fogExp2), e.push(t.sizeAttenuation), e.push(t.morphTargetsCount), e.push(t.morphAttributeCount), e.push(t.numSunLights), e.push(t.numDirLights), e.push(t.numPointLights), e.push(t.numSpotLights), e.push(t.numSpotLightMaps), e.push(t.numHemiLights), e.push(t.numRectAreaLights), e.push(t.numSunLightShadows), e.push(t.numDirLightShadows), e.push(t.numPointLightShadows), e.push(t.numSpotLightShadows), e.push(t.numSpotLightShadowsWithMaps), e.push(t.numLightProbes), e.push(t.shadowMapType), e.push(t.toneMapping), e.push(t.numClippingPlanes), e.push(t.numClipIntersection), e.push(t.depthPacking);
	}
	function v(e, t) {
		o.disableAll(), t.instancing && o.enable(0), t.instancingColor && o.enable(1), t.instancingMorph && o.enable(2), t.matcap && o.enable(3), t.envMap && o.enable(4), t.normalMapObjectSpace && o.enable(5), t.normalMapTangentSpace && o.enable(6), t.clearcoat && o.enable(7), t.iridescence && o.enable(8), t.alphaTest && o.enable(9), t.vertexColors && o.enable(10), t.vertexAlphas && o.enable(11), t.vertexUv1s && o.enable(12), t.vertexUv2s && o.enable(13), t.vertexUv3s && o.enable(14), t.vertexTangents && o.enable(15), t.anisotropy && o.enable(16), t.alphaHash && o.enable(17), t.batching && o.enable(18), t.dispersion && o.enable(19), t.retroreflection && o.enable(24), t.batchingColor && o.enable(20), t.gradientMap && o.enable(21), t.packedNormalMap && o.enable(22), t.vertexNormals && o.enable(23), e.push(o.mask), o.disableAll(), t.fog && o.enable(0), t.useFog && o.enable(1), t.flatShading && o.enable(2), t.logarithmicDepthBuffer && o.enable(3), t.reversedDepthBuffer && o.enable(4), t.skinning && o.enable(5), t.morphTargets && o.enable(6), t.morphNormals && o.enable(7), t.morphColors && o.enable(8), t.premultipliedAlpha && o.enable(9), t.shadowMapEnabled && o.enable(10), t.doubleSided && o.enable(11), t.flipSided && o.enable(12), t.useDepthPacking && o.enable(13), t.dithering && o.enable(14), t.transmission && o.enable(15), t.sheen && o.enable(16), t.opaque && o.enable(17), t.pointsUvs && o.enable(18), t.decodeVideoTexture && o.enable(19), t.decodeVideoTextureEmissive && o.enable(20), t.alphaToCoverage && o.enable(21), t.numLightProbeGrids > 0 && o.enable(22), t.hasPositionAttribute && o.enable(23), e.push(o.mask);
	}
	function y(e) {
		let t = p[e.type], n;
		if (t) {
			let e = Ke[t];
			n = we.clone(e.uniforms);
		} else n = e.uniforms;
		return n;
	}
	function x(t, n) {
		let r = u.get(n);
		return r === void 0 ? (r = new yr(e, n, t, i), l.push(r), u.set(n, r)) : ++r.usedTimes, r;
	}
	function S(e) {
		if (--e.usedTimes === 0) {
			let t = l.indexOf(e);
			l[t] = l[l.length - 1], l.pop(), u.delete(e.cacheKey), e.destroy();
		}
	}
	function C(e) {
		s.remove(e);
	}
	function w() {
		s.dispose();
	}
	return {
		getParameters: h,
		getProgramCacheKey: g,
		getUniforms: y,
		acquireProgram: x,
		releaseProgram: S,
		releaseShaderCache: C,
		programs: l,
		dispose: w
	};
}
function Tr() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t) {
		return e.has(t);
	}
	function n(t) {
		let n = e.get(t);
		return n === void 0 && (n = {}, e.set(t, n)), n;
	}
	function r(t) {
		e.delete(t);
	}
	function i(t, n, r) {
		e.get(t)[n] = r;
	}
	function a() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		has: t,
		get: n,
		remove: r,
		update: i,
		dispose: a
	};
}
function Er(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.material.id === t.material.id ? e.materialVariant === t.materialVariant ? e.z === t.z ? e.id - t.id : e.z - t.z : e.materialVariant - t.materialVariant : e.material.id - t.material.id : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Dr(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.z === t.z ? e.id - t.id : t.z - e.z : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Or() {
	let e = [], t = 0, n = [], r = [], i = [];
	function a() {
		t = 0, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		let t = 0;
		return e.isInstancedMesh && (t += 2), e.isSkinnedMesh && (t += 1), t;
	}
	function s(n, r, i, a, s, c) {
		let l = e[t];
		return l === void 0 ? (l = {
			id: n.id,
			object: n,
			geometry: r,
			material: i,
			materialVariant: o(n),
			groupOrder: a,
			renderOrder: n.renderOrder,
			z: s,
			group: c
		}, e[t] = l) : (l.id = n.id, l.object = n, l.geometry = r, l.material = i, l.materialVariant = o(n), l.groupOrder = a, l.renderOrder = n.renderOrder, l.z = s, l.group = c), t++, l;
	}
	function c(e, t, a, o, c, l, u) {
		u.reversedDepth === !0 && (c = -c);
		let d = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.push(d) : a.transparent === !0 ? i.push(d) : n.push(d);
	}
	function l(e, t, a, o, c, l) {
		let u = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.unshift(u) : a.transparent === !0 ? i.unshift(u) : n.unshift(u);
	}
	function u(e, t) {
		n.length > 1 && n.sort(e || Er), r.length > 1 && r.sort(t || Dr), i.length > 1 && i.sort(t || Dr);
	}
	function d() {
		for (let n = t, r = e.length; n < r; n++) {
			let t = e[n];
			if (t.id === null) break;
			t.id = null, t.object = null, t.geometry = null, t.material = null, t.group = null;
		}
	}
	return {
		opaque: n,
		transmissive: r,
		transparent: i,
		init: a,
		push: c,
		unshift: l,
		finish: d,
		sort: u
	};
}
function kr() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n) {
		let r = e.get(t), i;
		return r === void 0 ? (i = new Or(), e.set(t, [i])) : n >= r.length ? (i = new Or(), r.push(i)) : i = r[n], i;
	}
	function n() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: t,
		dispose: n
	};
}
function Ar() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					direction: new H(),
					color: new z()
				};
				break;
			case "SpotLight":
				n = {
					position: new H(),
					direction: new H(),
					color: new z(),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0
				};
				break;
			case "PointLight":
				n = {
					position: new H(),
					color: new z(),
					distance: 0,
					decay: 0
				};
				break;
			case "HemisphereLight":
				n = {
					direction: new H(),
					skyColor: new z(),
					groundColor: new z()
				};
				break;
			case "RectAreaLight": n = {
				color: new z(),
				position: new H(),
				halfWidth: new H(),
				halfHeight: new H()
			};
		}
		return e[t.id] = n, n;
	} };
}
function jr() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new L()
				};
				break;
			case "SpotLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new L()
				};
				break;
			case "PointLight": n = {
				shadowIntensity: 1,
				shadowBias: 0,
				shadowNormalBias: 0,
				shadowRadius: 1,
				shadowMapSize: new L(),
				shadowCameraNear: 1,
				shadowCameraFar: 1e3
			};
		}
		return e[t.id] = n, n;
	} };
}
var Mr = 0;
function Nr(e, t) {
	return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + +!!t.map - !!e.map;
}
function Pr(e) {
	let t = new Ar(), n = jr(), r = {
		version: 0,
		hash: {
			sunLength: -1,
			directionalLength: -1,
			pointLength: -1,
			spotLength: -1,
			rectAreaLength: -1,
			hemiLength: -1,
			numSunShadows: -1,
			numDirectionalShadows: -1,
			numPointShadows: -1,
			numSpotShadows: -1,
			numSpotMaps: -1,
			numLightProbes: -1
		},
		ambient: [
			0,
			0,
			0
		],
		probe: [],
		sun: [],
		sunShadow: [],
		sunShadowMap: [],
		sunShadowMatrix: [],
		sunShadowCascade: [],
		directional: [],
		directionalShadow: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotLightMap: [],
		spotShadow: [],
		spotShadowMap: [],
		spotLightMatrix: [],
		rectArea: [],
		rectAreaLTC1: null,
		rectAreaLTC2: null,
		point: [],
		pointShadow: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: [],
		numSpotLightShadowsWithMaps: 0,
		numLightProbes: 0
	};
	for (let e = 0; e < 9; e++) r.probe.push(new H());
	let i = new H(), a = new Ie(), o = new Ie();
	function s(i) {
		let a = 0, o = 0, s = 0;
		for (let e = 0; e < 9; e++) r.probe[e].set(0, 0, 0);
		let c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y = 0, b = 0, x = 0;
		i.sort(Nr);
		for (let e = 0, S = i.length; e < S; e++) {
			let S = i[e], C = S.color, w = S.intensity, T = S.distance, E = null;
			if (S.shadow && S.shadow.map && (E = S.shadow.map.texture.format === 1030 ? S.shadow.map.texture : S.shadow.map.depthTexture || S.shadow.map.texture), S.isAmbientLight) a += C.r * w, o += C.g * w, s += C.b * w;
			else if (S.isLightProbe) {
				for (let e = 0; e < 9; e++) r.probe[e].addScaledVector(S.sh.coefficients[e], w);
				x++;
			} else if (S.isSunLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()), r.sunShadow[l] = t, r.sunShadowMap[l] = E;
					let i = e.getViewportCount();
					for (let t = 0; t < i; t++) r.sunShadowMatrix[u + t] = e.getMatrix(t), r.sunShadowCascade[u + t] = e._cascadeData[t];
					u += i, l++;
				}
				r.sun[c] = e, c++;
			} else if (S.isDirectionalLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, r.directionalShadow[d] = t, r.directionalShadowMap[d] = E, r.directionalShadowMatrix[d] = S.shadow.matrix, g++;
				}
				r.directional[d] = e, d++;
			} else if (S.isSpotLight) {
				let e = t.get(S);
				e.position.setFromMatrixPosition(S.matrixWorld), e.color.copy(C).multiplyScalar(w), e.distance = T, e.coneCos = Math.cos(S.angle), e.penumbraCos = Math.cos(S.angle * (1 - S.penumbra)), e.decay = S.decay, r.spot[p] = e;
				let i = S.shadow;
				if (S.map && (r.spotLightMap[y] = S.map, y++, i.updateMatrices(S), S.castShadow && b++), r.spotLightMatrix[p] = i.matrix, S.castShadow) {
					let e = n.get(S);
					e.shadowIntensity = i.intensity, e.shadowBias = i.bias, e.shadowNormalBias = i.normalBias, e.shadowRadius = i.radius, e.shadowMapSize = i.mapSize, r.spotShadow[p] = e, r.spotShadowMap[p] = E, v++;
				}
				p++;
			} else if (S.isRectAreaLight) {
				let e = t.get(S);
				e.color.copy(C).multiplyScalar(w), e.halfWidth.set(S.width * .5, 0, 0), e.halfHeight.set(0, S.height * .5, 0), r.rectArea[m] = e, m++;
			} else if (S.isPointLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), e.distance = S.distance, e.decay = S.decay, S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, t.shadowCameraNear = e.camera.near, t.shadowCameraFar = e.camera.far, r.pointShadow[f] = t, r.pointShadowMap[f] = E, r.pointShadowMatrix[f] = S.shadow.matrix, _++;
				}
				r.point[f] = e, f++;
			} else if (S.isHemisphereLight) {
				let e = t.get(S);
				e.skyColor.copy(S.color).multiplyScalar(w), e.groundColor.copy(S.groundColor).multiplyScalar(w), r.hemi[h] = e, h++;
			}
		}
		m > 0 && (e.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = Z.LTC_FLOAT_1, r.rectAreaLTC2 = Z.LTC_FLOAT_2) : (r.rectAreaLTC1 = Z.LTC_HALF_1, r.rectAreaLTC2 = Z.LTC_HALF_2)), r.ambient[0] = a, r.ambient[1] = o, r.ambient[2] = s;
		let S = r.hash;
		(S.sunLength !== c || S.directionalLength !== d || S.pointLength !== f || S.spotLength !== p || S.rectAreaLength !== m || S.hemiLength !== h || S.numSunShadows !== l || S.numDirectionalShadows !== g || S.numPointShadows !== _ || S.numSpotShadows !== v || S.numSpotMaps !== y || S.numLightProbes !== x) && (r.sun.length = c, r.directional.length = d, r.spot.length = p, r.rectArea.length = m, r.point.length = f, r.hemi.length = h, r.sunShadow.length = l, r.sunShadowMap.length = l, r.sunShadowMatrix.length = u, r.sunShadowCascade.length = u, r.directionalShadow.length = g, r.directionalShadowMap.length = g, r.directionalShadowMatrix.length = g, r.pointShadow.length = _, r.pointShadowMap.length = _, r.pointShadowMatrix.length = _, r.spotShadow.length = v, r.spotShadowMap.length = v, r.spotLightMatrix.length = v + y - b, r.spotLightMap.length = y, r.numSpotLightShadowsWithMaps = b, r.numLightProbes = x, S.sunLength = c, S.directionalLength = d, S.pointLength = f, S.spotLength = p, S.rectAreaLength = m, S.hemiLength = h, S.numSunShadows = l, S.numDirectionalShadows = g, S.numPointShadows = _, S.numSpotShadows = v, S.numSpotMaps = y, S.numLightProbes = x, r.version = Mr++);
	}
	function c(e, t) {
		let n = 0, s = 0, c = 0, l = 0, u = 0, d = 0, f = t.matrixWorldInverse;
		for (let t = 0, p = e.length; t < p; t++) {
			let p = e[t];
			if (p.isSunLight) {
				let e = r.sun[n];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), n++;
			} else if (p.isDirectionalLight) {
				let e = r.directional[s];
				e.direction.setFromMatrixPosition(p.matrixWorld), i.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(f), s++;
			} else if (p.isSpotLight) {
				let e = r.spot[l];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), e.direction.setFromMatrixPosition(p.matrixWorld), i.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(f), l++;
			} else if (p.isRectAreaLight) {
				let e = r.rectArea[u];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), o.identity(), a.copy(p.matrixWorld), a.premultiply(f), o.extractRotation(a), e.halfWidth.set(p.width * .5, 0, 0), e.halfHeight.set(0, p.height * .5, 0), e.halfWidth.applyMatrix4(o), e.halfHeight.applyMatrix4(o), u++;
			} else if (p.isPointLight) {
				let e = r.point[c];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), c++;
			} else if (p.isHemisphereLight) {
				let e = r.hemi[d];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), d++;
			}
		}
	}
	return {
		setup: s,
		setupView: c,
		state: r
	};
}
function Fr(e) {
	let t = new Pr(e), n = [], r = [], i = [];
	function a(e) {
		d.camera = e, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		n.push(e);
	}
	function s(e) {
		r.push(e);
	}
	function c(e) {
		i.push(e);
	}
	function l() {
		t.setup(n);
	}
	function u(e) {
		t.setupView(n, e);
	}
	let d = {
		lightsArray: n,
		shadowsArray: r,
		lightProbeGridArray: i,
		camera: null,
		lights: t,
		transmissionRenderTarget: {},
		textureUnits: 0
	};
	return {
		init: a,
		state: d,
		setupLights: l,
		setupLightsView: u,
		pushLight: o,
		pushShadow: s,
		pushLightProbeGrid: c
	};
}
function Ir(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(n, r = 0) {
		let i = t.get(n), a;
		return i === void 0 ? (a = new Fr(e), t.set(n, [a])) : r >= i.length ? (a = new Fr(e), i.push(a)) : a = i[r], a;
	}
	function r() {
		t = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: n,
		dispose: r
	};
}
var Lr = "void main() {\n	gl_Position = vec4( position, 1.0 );\n}", Rr = "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\nvoid main() {\n	const float samples = float( VSM_SAMPLES );\n	float mean = 0.0;\n	float squared_mean = 0.0;\n	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n	for ( float i = 0.0; i < samples; i ++ ) {\n		float uvOffset = uvStart + i * uvStride;\n		#ifdef HORIZONTAL_PASS\n			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;\n			mean += distribution.x;\n			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n		#else\n			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;\n			mean += depth;\n			squared_mean += depth * depth;\n		#endif\n	}\n	mean = mean / samples;\n	squared_mean = squared_mean / samples;\n	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );\n	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );\n}", zr = [
	/*@__PURE__*/ new H(1, 0, 0),
	/*@__PURE__*/ new H(-1, 0, 0),
	/*@__PURE__*/ new H(0, 1, 0),
	/*@__PURE__*/ new H(0, -1, 0),
	/*@__PURE__*/ new H(0, 0, 1),
	/*@__PURE__*/ new H(0, 0, -1)
], Br = [
	/*@__PURE__*/ new H(0, -1, 0),
	/*@__PURE__*/ new H(0, -1, 0),
	/*@__PURE__*/ new H(0, 0, 1),
	/*@__PURE__*/ new H(0, 0, -1),
	/*@__PURE__*/ new H(0, -1, 0),
	/*@__PURE__*/ new H(0, -1, 0)
], Vr = /*@__PURE__*/ new Ie(), Hr = /*@__PURE__*/ new H(), Ur = /*@__PURE__*/ new H();
function Wr(e, t, n) {
	let r = new j(), s = new L(), c = new L(), l = new xe(), u = new D(), d = new i(), f = {}, p = n.maxTextureSize, m = {
		0: 1,
		1: 0,
		2: 2
	}, h = new A({
		defines: { VSM_SAMPLES: 8 },
		uniforms: {
			shadow_pass: { value: null },
			resolution: { value: new L() },
			radius: { value: 4 }
		},
		vertexShader: Lr,
		fragmentShader: Rr
	}), g = h.clone();
	g.defines.HORIZONTAL_PASS = 1;
	let _ = new ye();
	_.setAttribute("position", new oe(new Float32Array([
		-1,
		-1,
		.5,
		3,
		-1,
		.5,
		-1,
		3,
		.5
	]), 3));
	let v = new I(_, h), y = this;
	this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
	let S = this.type;
	this.render = function(t, n, i) {
		if (y.enabled === !1 || y.autoUpdate === !1 && y.needsUpdate === !1 || t.length === 0) return;
		this.type === 2 && (b("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."), this.type = 1);
		let u = e.getRenderTarget(), d = e.getActiveCubeFace(), f = e.getActiveMipmapLevel(), m = e.state;
		m.setBlending(0), m.buffers.depth.getReversed() === !0 ? m.buffers.color.setClear(0, 0, 0, 0) : m.buffers.color.setClear(1, 1, 1, 1), m.buffers.depth.setTest(!0), m.setScissorTest(!1);
		let h = S !== this.type;
		h && n.traverse(function(e) {
			e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e.needsUpdate = !0) : e.material.needsUpdate = !0);
		});
		for (let u = 0, d = t.length; u < d; u++) {
			let d = t[u], f = d.shadow;
			if (f === void 0) {
				b("WebGLShadowMap:", d, "has no shadow.");
				continue;
			}
			if (f.autoUpdate === !1 && f.needsUpdate === !1) continue;
			s.copy(f.mapSize);
			let g = f.getFrameExtents();
			s.multiply(g), c.copy(f.mapSize), (s.x > p || s.y > p) && (s.x > p && (c.x = Math.floor(p / g.x), s.x = c.x * g.x, f.mapSize.x = c.x), s.y > p && (c.y = Math.floor(p / g.y), s.y = c.y * g.y, f.mapSize.y = c.y));
			let _ = e.state.buffers.depth.getReversed();
			if (f.camera._reversedDepth = _, f.map === null || h === !0) {
				if (f.map !== null && (f.map.depthTexture !== null && (f.map.depthTexture.dispose(), f.map.depthTexture = null), f.map.dispose()), this.type === 3) {
					if (d.isPointLight) {
						b("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
						continue;
					}
					f.map = new re(s.x, s.y, {
						format: o,
						type: N,
						minFilter: B,
						magFilter: B,
						generateMipmaps: !1
					}), f.map.texture.name = d.name + ".shadowMap", f.map.depthTexture = new he(s.x, s.y, Le), f.map.depthTexture.name = d.name + ".shadowMapDepth", f.map.depthTexture.format = a, f.map.depthTexture.compareFunction = null, f.map.depthTexture.minFilter = x, f.map.depthTexture.magFilter = x;
				} else d.isPointLight ? (f.map = new xt(s.x), f.map.depthTexture = new ie(s.x, se)) : (f.map = new re(s.x, s.y), f.map.depthTexture = new he(s.x, s.y, se)), f.map.depthTexture.name = d.name + ".shadowMap", f.map.depthTexture.format = a, this.type === 1 ? (f.map.depthTexture.compareFunction = _ ? 518 : 515, f.map.depthTexture.minFilter = B, f.map.depthTexture.magFilter = B) : (f.map.depthTexture.compareFunction = null, f.map.depthTexture.minFilter = x, f.map.depthTexture.magFilter = x);
				f.camera.updateProjectionMatrix();
			}
			f.map.isWebGLCubeRenderTarget !== !0 && (f.map.width !== s.x || f.map.height !== s.y) && f.map.setSize(s.x, s.y);
			let v = f.map.isWebGLCubeRenderTarget ? 6 : f.getViewportCount();
			d.isPointLight !== !0 && f.updateMatrices(d, i);
			for (let t = 0; t < v; t++) {
				let a = f.getCamera(t);
				if (d.isPointLight) {
					let e = f.camera, n = f.matrix, r = d.distance || e.far;
					r !== e.far && (e.far = r, e.updateProjectionMatrix()), Hr.setFromMatrixPosition(d.matrixWorld), e.position.copy(Hr), Ur.copy(e.position), Ur.add(zr[t]), e.up.copy(Br[t]), e.lookAt(Ur), e.updateMatrixWorld(), n.makeTranslation(-Hr.x, -Hr.y, -Hr.z), Vr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), f._frustum.setFromProjectionMatrix(Vr, e.coordinateSystem, e.reversedDepth);
				}
				if (f.map.isWebGLCubeRenderTarget) e.setRenderTarget(f.map, t), e.clear();
				else {
					t === 0 && (e.setRenderTarget(f.map), e.clear());
					let n = f.getViewport(t);
					l.set(c.x * n.x, c.y * n.y, c.x * n.z, c.y * n.w), m.viewport(l);
				}
				r = f.getFrustum(t), T(n, i, a, d, this.type);
			}
			f.isPointLightShadow !== !0 && this.type === 3 && C(f, i), f.needsUpdate = !1;
		}
		S = this.type, y.needsUpdate = !1, e.setRenderTarget(u, d, f);
	};
	function C(n, r) {
		let i = t.update(v);
		h.defines.VSM_SAMPLES !== n.blurSamples && (h.defines.VSM_SAMPLES = n.blurSamples, g.defines.VSM_SAMPLES = n.blurSamples, h.needsUpdate = !0, g.needsUpdate = !0), n.mapPass === null ? n.mapPass = new re(s.x, s.y, {
			format: o,
			type: N
		}) : (n.mapPass.width !== n.map.width || n.mapPass.height !== n.map.height) && n.mapPass.setSize(n.map.width, n.map.height), h.uniforms.shadow_pass.value = n.map.depthTexture, h.uniforms.resolution.value.set(n.map.width, n.map.height), h.uniforms.radius.value = n.radius, e.setRenderTarget(n.mapPass), e.clear(), e.renderBufferDirect(r, null, i, h, v, null), g.uniforms.shadow_pass.value = n.mapPass.texture, g.uniforms.resolution.value.set(n.map.width, n.map.height), g.uniforms.radius.value = n.radius, e.setRenderTarget(n.map), e.clear(), e.renderBufferDirect(r, null, i, g, v, null);
	}
	function w(t, n, r, i) {
		let a = null, o = r.isPointLight === !0 ? t.customDistanceMaterial : t.customDepthMaterial;
		if (o !== void 0) a = o;
		else if (a = r.isPointLight === !0 ? d : u, e.localClippingEnabled && n.clipShadows === !0 && Array.isArray(n.clippingPlanes) && n.clippingPlanes.length !== 0 || n.displacementMap && n.displacementScale !== 0 || n.alphaMap && n.alphaTest > 0 || n.map && n.alphaTest > 0 || n.alphaToCoverage === !0) {
			let e = a.uuid, t = n.uuid, r = f[e];
			r === void 0 && (r = {}, f[e] = r);
			let i = r[t];
			i === void 0 && (i = a.clone(), r[t] = i, n.addEventListener("dispose", E)), a = i;
		}
		if (a.visible = n.visible, a.wireframe = n.wireframe, i === 3 ? a.side = n.shadowSide === null ? n.side : n.shadowSide : a.side = n.shadowSide === null ? m[n.side] : n.shadowSide, a.alphaMap = n.alphaMap, a.alphaTest = n.alphaToCoverage === !0 ? .5 : n.alphaTest, a.map = n.map, a.clipShadows = n.clipShadows, a.clippingPlanes = n.clippingPlanes, a.clipIntersection = n.clipIntersection, a.displacementMap = n.displacementMap, a.displacementScale = n.displacementScale, a.displacementBias = n.displacementBias, a.wireframeLinewidth = n.wireframeLinewidth, a.linewidth = n.linewidth, r.isPointLight === !0 && a.isMeshDistanceMaterial === !0) {
			let t = e.properties.get(a);
			t.light = r;
		}
		return a;
	}
	function T(n, i, a, o, s) {
		if (n.visible === !1) return;
		if (n.layers.test(i.layers) && (n.isMesh || n.isLine || n.isPoints) && (n.castShadow || n.receiveShadow && s === 3) && (!n.frustumCulled || n.intersectsFrustum(r))) {
			n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse, n.matrixWorld);
			let r = t.update(n), c = n.material;
			if (Array.isArray(c)) {
				let t = r.groups;
				for (let l = 0, u = t.length; l < u; l++) {
					let u = t[l], d = c[u.materialIndex];
					if (d && d.visible) {
						let t = w(n, d, o, s);
						n.onBeforeShadow(e, n, i, a, r, t, u), e.renderBufferDirect(a, null, r, t, n, u), n.onAfterShadow(e, n, i, a, r, t, u);
					}
				}
			} else if (c.visible) {
				let t = w(n, c, o, s);
				n.onBeforeShadow(e, n, i, a, r, t, null), e.renderBufferDirect(a, null, r, t, n, null), n.onAfterShadow(e, n, i, a, r, t, null);
			}
		}
		let c = n.children;
		for (let e = 0, t = c.length; e < t; e++) T(c[e], i, a, o, s);
	}
	function E(e) {
		e.target.removeEventListener("dispose", E);
		for (let t in f) {
			let n = f[t], r = e.target.uuid;
			r in n && (n[r].dispose(), delete n[r]);
		}
	}
}
function Gr(e, t) {
	function n() {
		let t = !1, n = new xe(), r = null, i = new xe(0, 0, 0, 0);
		return {
			setMask: function(n) {
				r !== n && !t && (e.colorMask(n, n, n, n), r = n);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t, r, a, o, s) {
				s === !0 && (t *= o, r *= o, a *= o), n.set(t, r, a, o), i.equals(n) === !1 && (e.clearColor(t, r, a, o), i.copy(n));
			},
			reset: function() {
				t = !1, r = null, i.set(-1, 0, 0, 0);
			}
		};
	}
	function r() {
		let n = !1, r = !1, i = null, a = null, o = null;
		return {
			setReversed: function(e) {
				if (r !== e) {
					let n = t.get("EXT_clip_control");
					e ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT) : n.clipControlEXT(n.LOWER_LEFT_EXT, n.NEGATIVE_ONE_TO_ONE_EXT), r = e;
					let i = o;
					o = null, this.setClear(i);
				}
			},
			getReversed: function() {
				return r;
			},
			setTest: function(t) {
				t ? le(e.DEPTH_TEST) : L(e.DEPTH_TEST);
			},
			setMask: function(t) {
				i !== t && !n && (e.depthMask(t), i = t);
			},
			setFunc: function(t) {
				if (r && (t = C[t]), a !== t) {
					switch (t) {
						case 0:
							e.depthFunc(e.NEVER);
							break;
						case 1:
							e.depthFunc(e.ALWAYS);
							break;
						case 2:
							e.depthFunc(e.LESS);
							break;
						case 3:
							e.depthFunc(e.LEQUAL);
							break;
						case 4:
							e.depthFunc(e.EQUAL);
							break;
						case 5:
							e.depthFunc(e.GEQUAL);
							break;
						case 6:
							e.depthFunc(e.GREATER);
							break;
						case 7:
							e.depthFunc(e.NOTEQUAL);
							break;
						default: e.depthFunc(e.LEQUAL);
					}
					a = t;
				}
			},
			setLocked: function(e) {
				n = e;
			},
			setClear: function(t) {
				o !== t && (o = t, r && (t = 1 - t), e.clearDepth(t));
			},
			reset: function() {
				n = !1, i = null, a = null, o = null, r = !1;
			}
		};
	}
	function i() {
		let t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
		return {
			setTest: function(n) {
				t || (n ? le(e.STENCIL_TEST) : L(e.STENCIL_TEST));
			},
			setMask: function(r) {
				n !== r && !t && (e.stencilMask(r), n = r);
			},
			setFunc: function(t, n, o) {
				(r !== t || i !== n || a !== o) && (e.stencilFunc(t, n, o), r = t, i = n, a = o);
			},
			setOp: function(t, n, r) {
				(o !== t || s !== n || c !== r) && (e.stencilOp(t, n, r), o = t, s = n, c = r);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t) {
				l !== t && (e.clearStencil(t), l = t);
			},
			reset: function() {
				t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
			}
		};
	}
	let a = new n(), o = new r(), s = new i(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), u = {}, d = {}, f = {}, p = /* @__PURE__ */ new WeakMap(), m = [], h = null, g = !1, _ = null, v = null, y = null, b = null, x = null, S = null, w = null, T = new z(0, 0, 0), D = 0, O = !1, ee = null, k = null, A = null, j = null, M = null, N = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS), te = !1, P = 0, ne = e.getParameter(e.VERSION);
	ne.indexOf("WebGL") === -1 ? ne.indexOf("OpenGL ES") !== -1 && (P = parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]), te = P >= 2) : (P = parseFloat(/^WebGL (\d)/.exec(ne)[1]), te = P >= 1);
	let F = null, re = {}, ie = e.getParameter(e.SCISSOR_BOX), ae = e.getParameter(e.VIEWPORT), I = new xe().fromArray(ie), oe = new xe().fromArray(ae);
	function se(t, n, r, i) {
		let a = /* @__PURE__ */ new Uint8Array(4), o = e.createTexture();
		e.bindTexture(t, o), e.texParameteri(t, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(t, e.TEXTURE_MAG_FILTER, e.NEAREST);
		for (let o = 0; o < r; o++) t === e.TEXTURE_3D || t === e.TEXTURE_2D_ARRAY ? e.texImage3D(n, 0, e.RGBA, 1, 1, i, 0, e.RGBA, e.UNSIGNED_BYTE, a) : e.texImage2D(n + o, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, a);
		return o;
	}
	let ce = {};
	ce[e.TEXTURE_2D] = se(e.TEXTURE_2D, e.TEXTURE_2D, 1), ce[e.TEXTURE_CUBE_MAP] = se(e.TEXTURE_CUBE_MAP, e.TEXTURE_CUBE_MAP_POSITIVE_X, 6), ce[e.TEXTURE_2D_ARRAY] = se(e.TEXTURE_2D_ARRAY, e.TEXTURE_2D_ARRAY, 1, 1), ce[e.TEXTURE_3D] = se(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1), a.setClear(0, 0, 0, 1), o.setClear(1), s.setClear(0), le(e.DEPTH_TEST), o.setFunc(3), ge(!1), _e(1), le(e.CULL_FACE), me(0);
	function le(t) {
		u[t] !== !0 && (e.enable(t), u[t] = !0);
	}
	function L(t) {
		u[t] !== !1 && (e.disable(t), u[t] = !1);
	}
	function R(t, n) {
		return f[t] !== n && (e.bindFramebuffer(t, n), f[t] = n, t === e.DRAW_FRAMEBUFFER && (f[e.FRAMEBUFFER] = n), t === e.FRAMEBUFFER && (f[e.DRAW_FRAMEBUFFER] = n), !0);
	}
	function ue(t, n) {
		let r = m, i = !1;
		if (t) {
			r = p.get(n), r === void 0 && (r = [], p.set(n, r));
			let a = t.textures;
			if (r.length !== a.length || r[0] !== e.COLOR_ATTACHMENT0) {
				for (let t = 0, n = a.length; t < n; t++) r[t] = e.COLOR_ATTACHMENT0 + t;
				r.length = a.length, i = !0;
			}
		} else r[0] !== e.BACK && (r[0] = e.BACK, i = !0);
		i && e.drawBuffers(r);
	}
	function de(t) {
		return h !== t && (e.useProgram(t), h = t, !0);
	}
	let fe = {
		100: e.FUNC_ADD,
		101: e.FUNC_SUBTRACT,
		102: e.FUNC_REVERSE_SUBTRACT
	};
	fe[103] = e.MIN, fe[104] = e.MAX;
	let pe = {
		200: e.ZERO,
		201: e.ONE,
		202: e.SRC_COLOR,
		204: e.SRC_ALPHA,
		210: e.SRC_ALPHA_SATURATE,
		208: e.DST_COLOR,
		206: e.DST_ALPHA,
		203: e.ONE_MINUS_SRC_COLOR,
		205: e.ONE_MINUS_SRC_ALPHA,
		209: e.ONE_MINUS_DST_COLOR,
		207: e.ONE_MINUS_DST_ALPHA,
		211: e.CONSTANT_COLOR,
		212: e.ONE_MINUS_CONSTANT_COLOR,
		213: e.CONSTANT_ALPHA,
		214: e.ONE_MINUS_CONSTANT_ALPHA
	};
	function me(t, n, r, i, a, o, s, c, l, u) {
		if (t === 0) {
			g === !0 && (L(e.BLEND), g = !1);
			return;
		}
		if (g === !1 && (le(e.BLEND), g = !0), t !== 5) {
			if (t !== _ || u !== O) {
				if ((v !== 100 || x !== 100) && (e.blendEquation(e.FUNC_ADD), v = 100, x = 100), u) switch (t) {
					case 1:
						e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFunc(e.ONE, e.ONE);
						break;
					case 3:
						e.blendFuncSeparate(e.ZERO, e.ONE_MINUS_SRC_COLOR, e.ZERO, e.ONE);
						break;
					case 4:
						e.blendFuncSeparate(e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA, e.ZERO, e.ONE);
						break;
					default: E("WebGLState: Invalid blending: ", t);
				}
				else switch (t) {
					case 1:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE, e.ONE, e.ONE);
						break;
					case 3:
						E("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
						break;
					case 4:
						E("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
						break;
					default: E("WebGLState: Invalid blending: ", t);
				}
				y = null, b = null, S = null, w = null, T.set(0, 0, 0), D = 0, _ = t, O = u;
			}
			return;
		}
		a ||= n, o ||= r, s ||= i, (n !== v || a !== x) && (e.blendEquationSeparate(fe[n], fe[a]), v = n, x = a), (r !== y || i !== b || o !== S || s !== w) && (e.blendFuncSeparate(pe[r], pe[i], pe[o], pe[s]), y = r, b = i, S = o, w = s), (c.equals(T) === !1 || l !== D) && (e.blendColor(c.r, c.g, c.b, l), T.copy(c), D = l), _ = t, O = !1;
	}
	function he(t, n) {
		t.side === 2 ? L(e.CULL_FACE) : le(e.CULL_FACE);
		let r = t.side === 1;
		n && (r = !r), ge(r), t.blending === 1 && t.transparent === !1 ? me(0) : me(t.blending, t.blendEquation, t.blendSrc, t.blendDst, t.blendEquationAlpha, t.blendSrcAlpha, t.blendDstAlpha, t.blendColor, t.blendAlpha, t.premultipliedAlpha), o.setFunc(t.depthFunc), o.setTest(t.depthTest), o.setMask(t.depthWrite), a.setMask(t.colorWrite);
		let i = t.stencilWrite;
		s.setTest(i), i && (s.setMask(t.stencilWriteMask), s.setFunc(t.stencilFunc, t.stencilRef, t.stencilFuncMask), s.setOp(t.stencilFail, t.stencilZFail, t.stencilZPass)), ye(t.polygonOffset, t.polygonOffsetFactor, t.polygonOffsetUnits), t.alphaToCoverage === !0 ? le(e.SAMPLE_ALPHA_TO_COVERAGE) : L(e.SAMPLE_ALPHA_TO_COVERAGE);
	}
	function ge(t) {
		ee !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), ee = t);
	}
	function _e(t) {
		t === 0 ? L(e.CULL_FACE) : (le(e.CULL_FACE), t !== k && (t === 1 ? e.cullFace(e.BACK) : t === 2 ? e.cullFace(e.FRONT) : e.cullFace(e.FRONT_AND_BACK))), k = t;
	}
	function ve(t) {
		t !== A && (te && e.lineWidth(t), A = t);
	}
	function ye(t, n, r) {
		t ? (le(e.POLYGON_OFFSET_FILL), (j !== n || M !== r) && (j = n, M = r, o.getReversed() && (n = -n), e.polygonOffset(n, r))) : L(e.POLYGON_OFFSET_FILL);
	}
	function be(t) {
		t ? le(e.SCISSOR_TEST) : L(e.SCISSOR_TEST);
	}
	function B(t) {
		t === void 0 && (t = e.TEXTURE0 + N - 1), F !== t && (e.activeTexture(t), F = t);
	}
	function V(t, n, r) {
		r === void 0 && (r = F === null ? e.TEXTURE0 + N - 1 : F);
		let i = re[r];
		i === void 0 && (i = {
			type: void 0,
			texture: void 0
		}, re[r] = i), (i.type !== t || i.texture !== n) && (F !== r && (e.activeTexture(r), F = r), e.bindTexture(t, n || ce[t]), i.type = t, i.texture = n);
	}
	function Se() {
		let t = re[F];
		t !== void 0 && t.type !== void 0 && (e.bindTexture(t.type, null), t.type = void 0, t.texture = void 0);
	}
	function H() {
		try {
			e.compressedTexImage2D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function Ce() {
		try {
			e.compressedTexImage3D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function we() {
		try {
			e.texSubImage2D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function Te() {
		try {
			e.texSubImage3D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function Ee() {
		try {
			e.compressedTexSubImage2D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function De() {
		try {
			e.compressedTexSubImage3D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function Oe() {
		try {
			e.texStorage2D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function ke() {
		try {
			e.texStorage3D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function U() {
		try {
			e.texImage2D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function W() {
		try {
			e.texImage3D(...arguments);
		} catch (e) {
			E("WebGLState:", e);
		}
	}
	function Ae(t) {
		return d[t] === void 0 ? e.getParameter(t) : d[t];
	}
	function je(t, n) {
		d[t] !== n && (e.pixelStorei(t, n), d[t] = n);
	}
	function Me(t) {
		I.equals(t) === !1 && (e.scissor(t.x, t.y, t.z, t.w), I.copy(t));
	}
	function Ne(t) {
		oe.equals(t) === !1 && (e.viewport(t.x, t.y, t.z, t.w), oe.copy(t));
	}
	function Pe(t, n) {
		let r = l.get(n);
		r === void 0 && (r = /* @__PURE__ */ new WeakMap(), l.set(n, r));
		let i = r.get(t);
		i === void 0 && (i = e.getUniformBlockIndex(n, t.name), r.set(t, i));
	}
	function Fe(t, n) {
		let r = l.get(n).get(t);
		c.get(n) !== r && (e.uniformBlockBinding(n, r, t.__bindingPointIndex), c.set(n, r));
	}
	function Ie() {
		e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.disable(e.SAMPLE_ALPHA_TO_COVERAGE), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO), e.blendColor(0, 0, 0, 0), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.depthMask(!0), e.depthFunc(e.LESS), o.setReversed(!1), e.clearDepth(1), e.stencilMask(4294967295), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.clearStencil(0), e.cullFace(e.BACK), e.frontFace(e.CCW), e.polygonOffset(0, 0), e.activeTexture(e.TEXTURE0), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), e.bindFramebuffer(e.READ_FRAMEBUFFER, null), e.useProgram(null), e.lineWidth(1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.pixelStorei(e.PACK_ROW_LENGTH, 0), e.pixelStorei(e.PACK_SKIP_PIXELS, 0), e.pixelStorei(e.PACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_ROW_LENGTH, 0), e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0), e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0), e.pixelStorei(e.UNPACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0), u = {}, d = {}, F = null, re = {}, f = {}, p = /* @__PURE__ */ new WeakMap(), m = [], h = null, g = !1, _ = null, v = null, y = null, b = null, x = null, S = null, w = null, T = new z(0, 0, 0), D = 0, O = !1, ee = null, k = null, A = null, j = null, M = null, I.set(0, 0, e.canvas.width, e.canvas.height), oe.set(0, 0, e.canvas.width, e.canvas.height), a.reset(), o.reset(), s.reset();
	}
	return {
		buffers: {
			color: a,
			depth: o,
			stencil: s
		},
		enable: le,
		disable: L,
		bindFramebuffer: R,
		drawBuffers: ue,
		useProgram: de,
		setBlending: me,
		setMaterial: he,
		setFlipSided: ge,
		setCullFace: _e,
		setLineWidth: ve,
		setPolygonOffset: ye,
		setScissorTest: be,
		activeTexture: B,
		bindTexture: V,
		unbindTexture: Se,
		compressedTexImage2D: H,
		compressedTexImage3D: Ce,
		texImage2D: U,
		texImage3D: W,
		pixelStorei: je,
		getParameter: Ae,
		updateUBOMapping: Pe,
		uniformBlockBinding: Fe,
		texStorage2D: Oe,
		texStorage3D: ke,
		texSubImage2D: we,
		texSubImage3D: Te,
		compressedTexSubImage2D: Ee,
		compressedTexSubImage3D: De,
		scissor: Me,
		viewport: Ne,
		reset: Ie
	};
}
function Kr(t, n, i, a, o, s, l) {
	let u = n.has("WEBGL_multisampled_render_to_texture") ? n.get("WEBGL_multisampled_render_to_texture") : null, d = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), f = new L(), p = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new Set(), h, g = /* @__PURE__ */ new WeakMap(), y = !1;
	try {
		y = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
	} catch {}
	function S(e, t) {
		return y ? new OffscreenCanvas(e, t) : Me("canvas");
	}
	function C(e, t, n) {
		let r = 1, i = Ne(e);
		if ((i.width > n || i.height > n) && (r = n / Math.max(i.width, i.height)), r < 1) {
			if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof VideoFrame < "u" && e instanceof VideoFrame) {
				let n = Math.floor(r * i.width), a = Math.floor(r * i.height);
				h === void 0 && (h = S(n, a));
				let o = t ? S(n, a) : h;
				return o.width = n, o.height = a, o.getContext("2d").drawImage(e, 0, 0, n, a), b("WebGLRenderer: Texture has been resized from (" + i.width + "x" + i.height + ") to (" + n + "x" + a + ")."), o;
			}
			return "data" in e && b("WebGLRenderer: Image in DataTexture is too big (" + i.width + "x" + i.height + ")."), e;
		}
		return e;
	}
	function w(e) {
		return e.generateMipmaps;
	}
	function T(e) {
		t.generateMipmap(e);
	}
	function D(e) {
		return e.isWebGLCubeRenderTarget ? t.TEXTURE_CUBE_MAP : e.isWebGL3DRenderTarget ? t.TEXTURE_3D : e.isWebGLArrayRenderTarget || e.isCompressedArrayTexture ? t.TEXTURE_2D_ARRAY : t.TEXTURE_2D;
	}
	function O(e, r, i, a, o, s = !1) {
		if (e !== null) {
			if (t[e] !== void 0) return t[e];
			b("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + e + "'");
		}
		let c;
		a && (c = n.get("EXT_texture_norm16"), c || b("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
		let l = r;
		if (r === t.RED && (i === t.FLOAT && (l = t.R32F), i === t.HALF_FLOAT && (l = t.R16F), i === t.UNSIGNED_BYTE && (l = t.R8), i === t.UNSIGNED_SHORT && c && (l = c.R16_EXT), i === t.SHORT && c && (l = c.R16_SNORM_EXT)), r === t.RED_INTEGER && (i === t.UNSIGNED_BYTE && (l = t.R8UI), i === t.UNSIGNED_SHORT && (l = t.R16UI), i === t.UNSIGNED_INT && (l = t.R32UI), i === t.BYTE && (l = t.R8I), i === t.SHORT && (l = t.R16I), i === t.INT && (l = t.R32I)), r === t.RG && (i === t.FLOAT && (l = t.RG32F), i === t.HALF_FLOAT && (l = t.RG16F), i === t.UNSIGNED_BYTE && (l = t.RG8), i === t.UNSIGNED_SHORT && c && (l = c.RG16_EXT), i === t.SHORT && c && (l = c.RG16_SNORM_EXT)), r === t.RG_INTEGER && (i === t.UNSIGNED_BYTE && (l = t.RG8UI), i === t.UNSIGNED_SHORT && (l = t.RG16UI), i === t.UNSIGNED_INT && (l = t.RG32UI), i === t.BYTE && (l = t.RG8I), i === t.SHORT && (l = t.RG16I), i === t.INT && (l = t.RG32I)), r === t.RGB_INTEGER && (i === t.UNSIGNED_BYTE && (l = t.RGB8UI), i === t.UNSIGNED_SHORT && (l = t.RGB16UI), i === t.UNSIGNED_INT && (l = t.RGB32UI), i === t.BYTE && (l = t.RGB8I), i === t.SHORT && (l = t.RGB16I), i === t.INT && (l = t.RGB32I)), r === t.RGBA_INTEGER && (i === t.UNSIGNED_BYTE && (l = t.RGBA8UI), i === t.UNSIGNED_SHORT && (l = t.RGBA16UI), i === t.UNSIGNED_INT && (l = t.RGBA32UI), i === t.BYTE && (l = t.RGBA8I), i === t.SHORT && (l = t.RGBA16I), i === t.INT && (l = t.RGBA32I)), r === t.RGB && (i === t.UNSIGNED_SHORT && c && (l = c.RGB16_EXT), i === t.SHORT && c && (l = c.RGB16_SNORM_EXT), i === t.UNSIGNED_INT_5_9_9_9_REV && (l = t.RGB9_E5), i === t.UNSIGNED_INT_10F_11F_11F_REV && (l = t.R11F_G11F_B10F)), r === t.RGBA) {
			let e = s ? Ce : F.getTransfer(o);
			i === t.FLOAT && (l = t.RGBA32F), i === t.HALF_FLOAT && (l = t.RGBA16F), i === t.UNSIGNED_BYTE && (l = e === "srgb" ? t.SRGB8_ALPHA8 : t.RGBA8), i === t.UNSIGNED_SHORT && c && (l = c.RGBA16_EXT), i === t.SHORT && c && (l = c.RGBA16_SNORM_EXT), i === t.UNSIGNED_SHORT_4_4_4_4 && (l = t.RGBA4), i === t.UNSIGNED_SHORT_5_5_5_1 && (l = t.RGB5_A1);
		}
		return (l === t.R16F || l === t.R32F || l === t.RG16F || l === t.RG32F || l === t.RGBA16F || l === t.RGBA32F) && n.get("EXT_color_buffer_float"), l;
	}
	function ee(e, n) {
		let r;
		return e ? n === null || n === 1014 || n === 1020 ? r = t.DEPTH24_STENCIL8 : n === 1015 ? r = t.DEPTH32F_STENCIL8 : n === 1012 && (r = t.DEPTH24_STENCIL8, b("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : n === null || n === 1014 || n === 1020 ? r = t.DEPTH_COMPONENT24 : n === 1015 ? r = t.DEPTH_COMPONENT32F : n === 1012 && (r = t.DEPTH_COMPONENT16), r;
	}
	function k(e, t) {
		return w(e) === !0 || e.isFramebufferTexture && e.minFilter !== 1003 && e.minFilter !== 1006 ? Math.log2(Math.max(t.width, t.height)) + 1 : e.mipmaps !== void 0 && e.mipmaps.length > 0 ? e.mipmaps.length : e.isCompressedTexture && Array.isArray(e.image) ? t.mipmaps.length : 1;
	}
	function A(e) {
		let t = e.target;
		t.removeEventListener("dispose", A), M(t), t.isVideoTexture && p.delete(t), t.isHTMLTexture && m.delete(t);
	}
	function j(e) {
		let t = e.target;
		t.removeEventListener("dispose", j), te(t);
	}
	function M(e) {
		let t = a.get(e);
		if (t.__webglInit === void 0) return;
		let n = e.source, r = g.get(n);
		if (r) {
			let i = r[t.__cacheKey];
			i.usedTimes--, i.usedTimes === 0 && N(e), Object.keys(r).length === 0 && g.delete(n);
		}
		a.remove(e);
	}
	function N(e) {
		let n = a.get(e);
		t.deleteTexture(n.__webglTexture);
		let r = e.source, i = g.get(r);
		delete i[n.__cacheKey], l.memory.textures--;
	}
	function te(e) {
		let n = a.get(e);
		if (e.depthTexture && (e.depthTexture.dispose(), a.remove(e.depthTexture)), e.isWebGLCubeRenderTarget) for (let e = 0; e < 6; e++) {
			if (Array.isArray(n.__webglFramebuffer[e])) for (let r = 0; r < n.__webglFramebuffer[e].length; r++) t.deleteFramebuffer(n.__webglFramebuffer[e][r]);
			else t.deleteFramebuffer(n.__webglFramebuffer[e]);
			n.__webglDepthbuffer && t.deleteRenderbuffer(n.__webglDepthbuffer[e]);
		}
		else {
			if (Array.isArray(n.__webglFramebuffer)) for (let e = 0; e < n.__webglFramebuffer.length; e++) t.deleteFramebuffer(n.__webglFramebuffer[e]);
			else t.deleteFramebuffer(n.__webglFramebuffer);
			if (n.__webglDepthbuffer && t.deleteRenderbuffer(n.__webglDepthbuffer), n.__webglMultisampledFramebuffer && t.deleteFramebuffer(n.__webglMultisampledFramebuffer), n.__webglColorRenderbuffer) for (let e = 0; e < n.__webglColorRenderbuffer.length; e++) n.__webglColorRenderbuffer[e] && t.deleteRenderbuffer(n.__webglColorRenderbuffer[e]);
			n.__webglDepthRenderbuffer && t.deleteRenderbuffer(n.__webglDepthRenderbuffer);
		}
		let r = e.textures;
		for (let e = 0, n = r.length; e < n; e++) {
			let n = a.get(r[e]);
			n.__webglTexture && (t.deleteTexture(n.__webglTexture), l.memory.textures--), a.remove(r[e]);
		}
		a.remove(e);
	}
	let P = 0;
	function ne() {
		P = 0;
	}
	function re() {
		return P;
	}
	function ie(e) {
		P = e;
	}
	function ae() {
		let e = P;
		return e >= o.maxTextures && b("WebGLTextures: Trying to use " + (e + 1) + " texture units while this GPU supports only " + o.maxTextures), P += 1, e;
	}
	function I(e) {
		let t = [];
		return t.push(e.wrapS), t.push(e.wrapT), t.push(e.wrapR || 0), t.push(e.magFilter), t.push(e.minFilter), t.push(e.anisotropy), t.push(e.internalFormat), t.push(e.format), t.push(e.type), t.push(e.generateMipmaps), t.push(e.premultiplyAlpha), t.push(e.flipY), t.push(e.unpackAlignment), t.push(e.colorSpace), t.join();
	}
	function oe(e, n) {
		let r = a.get(e);
		if (e.isVideoTexture && Ae(e), e.isRenderTargetTexture === !1 && e.isExternalTexture !== !0 && e.version > 0 && r.__version !== e.version) {
			let t = e.image;
			if (t === null) b("WebGLRenderer: Texture marked for update but no image data found.");
			else if (t.complete === !1) b("WebGLRenderer: Texture marked for update but image is incomplete");
			else {
				_e(r, e, n);
				return;
			}
		} else e.isExternalTexture && (r.__webglTexture = e.sourceTexture ? e.sourceTexture : null);
		i.bindTexture(t.TEXTURE_2D, r.__webglTexture, t.TEXTURE0 + n);
	}
	function se(e, n) {
		let r = a.get(e);
		if (e.isRenderTargetTexture === !1 && e.version > 0 && r.__version !== e.version) {
			_e(r, e, n);
			return;
		}
		e.isExternalTexture && (r.__webglTexture = e.sourceTexture ? e.sourceTexture : null), i.bindTexture(t.TEXTURE_2D_ARRAY, r.__webglTexture, t.TEXTURE0 + n);
	}
	function ce(e, n) {
		let r = a.get(e);
		if (e.isRenderTargetTexture === !1 && e.version > 0 && r.__version !== e.version) {
			_e(r, e, n);
			return;
		}
		i.bindTexture(t.TEXTURE_3D, r.__webglTexture, t.TEXTURE0 + n);
	}
	function R(e, n) {
		let r = a.get(e);
		if (e.isCubeDepthTexture !== !0 && e.version > 0 && r.__version !== e.version) {
			ye(r, e, n);
			return;
		}
		i.bindTexture(t.TEXTURE_CUBE_MAP, r.__webglTexture, t.TEXTURE0 + n);
	}
	let z = {
		[_]: t.REPEAT,
		[de]: t.CLAMP_TO_EDGE,
		[c]: t.MIRRORED_REPEAT
	}, ue = {
		[x]: t.NEAREST,
		[e]: t.NEAREST_MIPMAP_NEAREST,
		[ve]: t.NEAREST_MIPMAP_LINEAR,
		[B]: t.LINEAR,
		[le]: t.LINEAR_MIPMAP_NEAREST,
		[Oe]: t.LINEAR_MIPMAP_LINEAR
	}, fe = {
		512: t.NEVER,
		519: t.ALWAYS,
		513: t.LESS,
		515: t.LEQUAL,
		514: t.EQUAL,
		518: t.GEQUAL,
		516: t.GREATER,
		517: t.NOTEQUAL
	};
	function pe(e, r) {
		if (r.type === 1015 && n.has("OES_texture_float_linear") === !1 && (r.magFilter === 1006 || r.magFilter === 1007 || r.magFilter === 1005 || r.magFilter === 1008 || r.minFilter === 1006 || r.minFilter === 1007 || r.minFilter === 1005 || r.minFilter === 1008) && b("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), t.texParameteri(e, t.TEXTURE_WRAP_S, z[r.wrapS]), t.texParameteri(e, t.TEXTURE_WRAP_T, z[r.wrapT]), (e === t.TEXTURE_3D || e === t.TEXTURE_2D_ARRAY) && t.texParameteri(e, t.TEXTURE_WRAP_R, z[r.wrapR]), t.texParameteri(e, t.TEXTURE_MAG_FILTER, ue[r.magFilter]), t.texParameteri(e, t.TEXTURE_MIN_FILTER, ue[r.minFilter]), r.compareFunction && (t.texParameteri(e, t.TEXTURE_COMPARE_MODE, t.COMPARE_REF_TO_TEXTURE), t.texParameteri(e, t.TEXTURE_COMPARE_FUNC, fe[r.compareFunction])), n.has("EXT_texture_filter_anisotropic") === !0) {
			if (r.magFilter === 1003 || r.minFilter !== 1005 && r.minFilter !== 1008 || r.type === 1015 && n.has("OES_texture_float_linear") === !1) return;
			if (r.anisotropy > 1 || a.get(r).__currentAnisotropy) {
				let i = n.get("EXT_texture_filter_anisotropic");
				t.texParameterf(e, i.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(r.anisotropy, o.getMaxAnisotropy())), a.get(r).__currentAnisotropy = r.anisotropy;
			}
		}
	}
	function me(e, n) {
		let r = !1;
		e.__webglInit === void 0 && (e.__webglInit = !0, n.addEventListener("dispose", A));
		let i = n.source, a = g.get(i);
		a === void 0 && (a = {}, g.set(i, a));
		let o = I(n);
		if (o !== e.__cacheKey) {
			a[o] === void 0 && (a[o] = {
				texture: t.createTexture(),
				usedTimes: 0
			}, l.memory.textures++, r = !0), a[o].usedTimes++;
			let i = a[e.__cacheKey];
			i !== void 0 && (a[e.__cacheKey].usedTimes--, i.usedTimes === 0 && N(n)), e.__cacheKey = o, e.__webglTexture = a[o].texture;
		}
		return r;
	}
	function he(e, t, n) {
		return Math.floor(Math.floor(e / n) / t);
	}
	function ge(e, n, r, a) {
		let o = e.updateRanges;
		if (o.length === 0) i.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, n.width, n.height, r, a, n.data);
		else {
			o.sort((e, t) => e.start - t.start);
			let s = 0;
			for (let e = 1; e < o.length; e++) {
				let t = o[s], r = o[e], i = t.start + t.count, a = he(r.start, n.width, 4), c = he(t.start, n.width, 4);
				r.start <= i + 1 && a === c && he(r.start + r.count - 1, n.width, 4) === a ? t.count = Math.max(t.count, r.start + r.count - t.start) : (++s, o[s] = r);
			}
			o.length = s + 1;
			let c = i.getParameter(t.UNPACK_ROW_LENGTH), l = i.getParameter(t.UNPACK_SKIP_PIXELS), u = i.getParameter(t.UNPACK_SKIP_ROWS);
			i.pixelStorei(t.UNPACK_ROW_LENGTH, n.width);
			for (let e = 0, s = o.length; e < s; e++) {
				let s = o[e], c = Math.floor(s.start / 4), l = Math.ceil(s.count / 4), u = c % n.width, d = Math.floor(c / n.width), f = l;
				i.pixelStorei(t.UNPACK_SKIP_PIXELS, u), i.pixelStorei(t.UNPACK_SKIP_ROWS, d), i.texSubImage2D(t.TEXTURE_2D, 0, u, d, f, 1, r, a, n.data);
			}
			e.clearUpdateRanges(), i.pixelStorei(t.UNPACK_ROW_LENGTH, c), i.pixelStorei(t.UNPACK_SKIP_PIXELS, l), i.pixelStorei(t.UNPACK_SKIP_ROWS, u);
		}
	}
	function _e(e, n, c) {
		let l = t.TEXTURE_2D;
		(n.isDataArrayTexture || n.isCompressedArrayTexture) && (l = t.TEXTURE_2D_ARRAY), n.isData3DTexture && (l = t.TEXTURE_3D);
		let u = me(e, n), d = n.source;
		i.bindTexture(l, e.__webglTexture, t.TEXTURE0 + c);
		let f = a.get(d);
		if (d.version !== f.__version || u === !0) {
			if (i.activeTexture(t.TEXTURE0 + c), !(typeof ImageBitmap < "u" && n.image instanceof ImageBitmap)) {
				let e = F.getPrimaries(F.workingColorSpace), r = n.colorSpace === "" ? null : F.getPrimaries(n.colorSpace), a = n.colorSpace === "" || e === r ? t.NONE : t.BROWSER_DEFAULT_WEBGL;
				i.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, n.flipY), i.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, n.premultiplyAlpha), i.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, a);
			}
			i.pixelStorei(t.UNPACK_ALIGNMENT, n.unpackAlignment);
			let e = C(n.image, !1, o.maxTextureSize);
			e = je(n, e);
			let a = s.convert(n.format, n.colorSpace), p = s.convert(n.type), h = O(n.internalFormat, a, p, n.normalized, n.colorSpace, n.isVideoTexture);
			pe(l, n);
			let g, _ = n.mipmaps, y = n.isVideoTexture !== !0, x = f.__version === void 0 || u === !0, S = d.dataReady, E = k(n, e);
			if (n.isDepthTexture) h = ee(n.format === v, n.type), x && (y ? i.texStorage2D(t.TEXTURE_2D, 1, h, e.width, e.height) : i.texImage2D(t.TEXTURE_2D, 0, h, e.width, e.height, 0, a, p, null));
			else if (n.isDataTexture) {
				if (_.length > 0) {
					y && x && i.texStorage2D(t.TEXTURE_2D, E, h, _[0].width, _[0].height);
					for (let e = 0, n = _.length; e < n; e++) g = _[e], y ? S && i.texSubImage2D(t.TEXTURE_2D, e, 0, 0, g.width, g.height, a, p, g.data) : i.texImage2D(t.TEXTURE_2D, e, h, g.width, g.height, 0, a, p, g.data);
					n.generateMipmaps = !1;
				} else y ? (x && i.texStorage2D(t.TEXTURE_2D, E, h, e.width, e.height), S && ge(n, e, a, p)) : i.texImage2D(t.TEXTURE_2D, 0, h, e.width, e.height, 0, a, p, e.data);
			} else if (n.isCompressedTexture) {
				if (n.isCompressedArrayTexture) {
					y && x && i.texStorage3D(t.TEXTURE_2D_ARRAY, E, h, _[0].width, _[0].height, e.depth);
					for (let o = 0, s = _.length; o < s; o++) if (g = _[o], n.format !== 1023) {
						if (a !== null) {
							if (y) {
								if (S) {
									if (n.layerUpdates.size > 0) {
										let e = r(g.width, g.height, n.format, n.type);
										for (let r of n.layerUpdates) {
											let n = g.data.subarray(r * e / g.data.BYTES_PER_ELEMENT, (r + 1) * e / g.data.BYTES_PER_ELEMENT);
											i.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY, o, 0, 0, r, g.width, g.height, 1, a, n);
										}
									} else i.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY, o, 0, 0, 0, g.width, g.height, e.depth, a, g.data);
								}
							} else i.compressedTexImage3D(t.TEXTURE_2D_ARRAY, o, h, g.width, g.height, e.depth, 0, g.data, 0, 0);
						} else b("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
					} else y ? S && i.texSubImage3D(t.TEXTURE_2D_ARRAY, o, 0, 0, 0, g.width, g.height, e.depth, a, p, g.data) : i.texImage3D(t.TEXTURE_2D_ARRAY, o, h, g.width, g.height, e.depth, 0, a, p, g.data);
					n.layerUpdates.size > 0 && n.clearLayerUpdates();
				} else {
					y && x && i.texStorage2D(t.TEXTURE_2D, E, h, _[0].width, _[0].height);
					for (let e = 0, r = _.length; e < r; e++) g = _[e], n.format === 1023 ? y ? S && i.texSubImage2D(t.TEXTURE_2D, e, 0, 0, g.width, g.height, a, p, g.data) : i.texImage2D(t.TEXTURE_2D, e, h, g.width, g.height, 0, a, p, g.data) : a === null ? b("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : y ? S && i.compressedTexSubImage2D(t.TEXTURE_2D, e, 0, 0, g.width, g.height, a, g.data) : i.compressedTexImage2D(t.TEXTURE_2D, e, h, g.width, g.height, 0, g.data);
				}
			} else if (n.isDataArrayTexture) {
				if (y) {
					if (x && i.texStorage3D(t.TEXTURE_2D_ARRAY, E, h, e.width, e.height, e.depth), S) {
						if (n.layerUpdates.size > 0) {
							let o = r(e.width, e.height, n.format, n.type);
							for (let r of n.layerUpdates) {
								let n = e.data.subarray(r * o / e.data.BYTES_PER_ELEMENT, (r + 1) * o / e.data.BYTES_PER_ELEMENT);
								i.texSubImage3D(t.TEXTURE_2D_ARRAY, 0, 0, 0, r, e.width, e.height, 1, a, p, n);
							}
							n.clearLayerUpdates();
						} else i.texSubImage3D(t.TEXTURE_2D_ARRAY, 0, 0, 0, 0, e.width, e.height, e.depth, a, p, e.data);
					}
				} else i.texImage3D(t.TEXTURE_2D_ARRAY, 0, h, e.width, e.height, e.depth, 0, a, p, e.data);
			} else if (n.isData3DTexture) y ? (x && i.texStorage3D(t.TEXTURE_3D, E, h, e.width, e.height, e.depth), S && i.texSubImage3D(t.TEXTURE_3D, 0, 0, 0, 0, e.width, e.height, e.depth, a, p, e.data)) : i.texImage3D(t.TEXTURE_3D, 0, h, e.width, e.height, e.depth, 0, a, p, e.data);
			else if (n.isFramebufferTexture) {
				if (x) {
					if (y) i.texStorage2D(t.TEXTURE_2D, E, h, e.width, e.height);
					else {
						let n = e.width, r = e.height;
						for (let e = 0; e < E; e++) i.texImage2D(t.TEXTURE_2D, e, h, n, r, 0, a, p, null), n >>= 1, r >>= 1;
					}
				}
			} else if (n.isHTMLTexture) {
				if ("texElementImage2D" in t) {
					let r = t.canvas;
					if (r.hasAttribute("layoutsubtree") || r.setAttribute("layoutsubtree", "true"), e.parentNode !== r) {
						r.appendChild(e), m.add(n), r.onpaint = (e) => {
							let t = e.changedElements;
							for (let e of m) t.includes(e.image) && (e.needsUpdate = !0);
						}, r.requestPaint();
						return;
					}
					if (t.texElementImage2D.length === 3) t.texElementImage2D(t.TEXTURE_2D, t.RGBA8, e);
					else {
						let n = t.RGBA, r = t.RGBA, i = t.UNSIGNED_BYTE;
						t.texElementImage2D(t.TEXTURE_2D, 0, n, r, i, e);
					}
					t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
				}
			} else if (_.length > 0) {
				if (y && x) {
					let e = Ne(_[0]);
					i.texStorage2D(t.TEXTURE_2D, E, h, e.width, e.height);
				}
				for (let e = 0, n = _.length; e < n; e++) g = _[e], y ? S && i.texSubImage2D(t.TEXTURE_2D, e, 0, 0, a, p, g) : i.texImage2D(t.TEXTURE_2D, e, h, a, p, g);
				n.generateMipmaps = !1;
			} else if (y) {
				if (x) {
					let n = Ne(e);
					i.texStorage2D(t.TEXTURE_2D, E, h, n.width, n.height);
				}
				S && i.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, a, p, e);
			} else i.texImage2D(t.TEXTURE_2D, 0, h, a, p, e);
			w(n) && T(l), f.__version = d.version, n.onUpdate && n.onUpdate(n);
		}
		e.__version = n.version;
	}
	function ye(e, n, r) {
		if (n.image.length !== 6) return;
		let c = me(e, n), l = n.source;
		i.bindTexture(t.TEXTURE_CUBE_MAP, e.__webglTexture, t.TEXTURE0 + r);
		let u = a.get(l);
		if (l.version !== u.__version || c === !0) {
			i.activeTexture(t.TEXTURE0 + r);
			let e = F.getPrimaries(F.workingColorSpace), a = n.colorSpace === "" ? null : F.getPrimaries(n.colorSpace), d = n.colorSpace === "" || e === a ? t.NONE : t.BROWSER_DEFAULT_WEBGL;
			i.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, n.flipY), i.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, n.premultiplyAlpha), i.pixelStorei(t.UNPACK_ALIGNMENT, n.unpackAlignment), i.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, d);
			let f = n.isCompressedTexture || n.image[0].isCompressedTexture, p = n.image[0] && n.image[0].isDataTexture, m = [];
			for (let e = 0; e < 6; e++) !f && !p ? m[e] = C(n.image[e], !0, o.maxCubemapSize) : m[e] = p ? n.image[e].image : n.image[e], m[e] = je(n, m[e]);
			let h = m[0], g = s.convert(n.format, n.colorSpace), _ = s.convert(n.type), v = O(n.internalFormat, g, _, n.normalized, n.colorSpace), y = n.isVideoTexture !== !0, x = u.__version === void 0 || c === !0, S = l.dataReady, E = k(n, h);
			pe(t.TEXTURE_CUBE_MAP, n);
			let D;
			if (f) {
				y && x && i.texStorage2D(t.TEXTURE_CUBE_MAP, E, v, h.width, h.height);
				for (let e = 0; e < 6; e++) {
					D = m[e].mipmaps;
					for (let r = 0; r < D.length; r++) {
						let a = D[r];
						n.format === 1023 ? y ? S && i.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, r, 0, 0, a.width, a.height, g, _, a.data) : i.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, r, v, a.width, a.height, 0, g, _, a.data) : g === null ? b("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : y ? S && i.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, r, 0, 0, a.width, a.height, g, a.data) : i.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, r, v, a.width, a.height, 0, a.data);
					}
				}
			} else {
				if (D = n.mipmaps, y && x) {
					D.length > 0 && E++;
					let e = Ne(m[0]);
					i.texStorage2D(t.TEXTURE_CUBE_MAP, E, v, e.width, e.height);
				}
				for (let e = 0; e < 6; e++) if (p) {
					y ? S && i.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, 0, 0, m[e].width, m[e].height, g, _, m[e].data) : i.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, v, m[e].width, m[e].height, 0, g, _, m[e].data);
					for (let n = 0; n < D.length; n++) {
						let r = D[n].image[e].image;
						y ? S && i.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, n + 1, 0, 0, r.width, r.height, g, _, r.data) : i.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, n + 1, v, r.width, r.height, 0, g, _, r.data);
					}
				} else {
					y ? S && i.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, 0, 0, g, _, m[e]) : i.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, v, g, _, m[e]);
					for (let n = 0; n < D.length; n++) {
						let r = D[n];
						y ? S && i.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, n + 1, 0, 0, g, _, r.image[e]) : i.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, n + 1, v, g, _, r.image[e]);
					}
				}
			}
			w(n) && T(t.TEXTURE_CUBE_MAP), u.__version = l.version, n.onUpdate && n.onUpdate(n);
		}
		e.__version = n.version;
	}
	function be(e, n, r, o, c, l) {
		let d = s.convert(r.format, r.colorSpace), f = s.convert(r.type), p = O(r.internalFormat, d, f, r.normalized, r.colorSpace), m = a.get(n), h = a.get(r);
		if (h.__renderTarget = n, !m.__hasExternalTextures) {
			let e = Math.max(1, n.width >> l), r = Math.max(1, n.height >> l);
			c === t.TEXTURE_3D || c === t.TEXTURE_2D_ARRAY ? i.texImage3D(c, l, p, e, r, n.depth, 0, d, f, null) : i.texImage2D(c, l, p, e, r, 0, d, f, null);
		}
		i.bindFramebuffer(t.FRAMEBUFFER, e), W(n) ? u.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, o, c, h.__webglTexture, 0, U(n)) : (c === t.TEXTURE_2D || c >= t.TEXTURE_CUBE_MAP_POSITIVE_X && c <= t.TEXTURE_CUBE_MAP_NEGATIVE_Z) && t.framebufferTexture2D(t.FRAMEBUFFER, o, c, h.__webglTexture, l), i.bindFramebuffer(t.FRAMEBUFFER, null);
	}
	function xe(e, n, r) {
		if (t.bindRenderbuffer(t.RENDERBUFFER, e), n.depthBuffer) {
			let i = n.depthTexture, a = i && i.isDepthTexture ? i.type : null, o = ee(n.stencilBuffer, a), s = n.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT;
			W(n) ? u.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, U(n), o, n.width, n.height) : r ? t.renderbufferStorageMultisample(t.RENDERBUFFER, U(n), o, n.width, n.height) : t.renderbufferStorage(t.RENDERBUFFER, o, n.width, n.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, s, t.RENDERBUFFER, e);
		} else {
			let e = n.textures;
			for (let i = 0; i < e.length; i++) {
				let a = e[i], o = s.convert(a.format, a.colorSpace), c = s.convert(a.type), l = O(a.internalFormat, o, c, a.normalized, a.colorSpace);
				W(n) ? u.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, U(n), l, n.width, n.height) : r ? t.renderbufferStorageMultisample(t.RENDERBUFFER, U(n), l, n.width, n.height) : t.renderbufferStorage(t.RENDERBUFFER, l, n.width, n.height);
			}
		}
		t.bindRenderbuffer(t.RENDERBUFFER, null);
	}
	function V(e, n, r) {
		let o = n.isWebGLCubeRenderTarget === !0;
		if (i.bindFramebuffer(t.FRAMEBUFFER, e), !(n.depthTexture && n.depthTexture.isDepthTexture)) throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");
		let c = a.get(n.depthTexture);
		if (c.__renderTarget = n, (!c.__webglTexture || n.depthTexture.image.width !== n.width || n.depthTexture.image.height !== n.height) && (n.depthTexture.image.width = n.width, n.depthTexture.image.height = n.height, n.depthTexture.needsUpdate = !0), o) {
			if (c.__webglInit === void 0 && (c.__webglInit = !0, n.depthTexture.addEventListener("dispose", A)), c.__webglTexture === void 0) {
				c.__webglTexture = t.createTexture(), i.bindTexture(t.TEXTURE_CUBE_MAP, c.__webglTexture), pe(t.TEXTURE_CUBE_MAP, n.depthTexture);
				let e = s.convert(n.depthTexture.format), r = s.convert(n.depthTexture.type), a;
				n.depthTexture.format === 1026 ? a = t.DEPTH_COMPONENT24 : n.depthTexture.format === 1027 && (a = t.DEPTH24_STENCIL8);
				for (let i = 0; i < 6; i++) t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, a, n.width, n.height, 0, e, r, null);
			}
		} else oe(n.depthTexture, 0);
		let l = c.__webglTexture, d = U(n), f = o ? t.TEXTURE_CUBE_MAP_POSITIVE_X + r : t.TEXTURE_2D, p = n.depthTexture.format === 1027 ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT;
		if (n.depthTexture.format === 1026) W(n) ? u.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, p, f, l, 0, d) : t.framebufferTexture2D(t.FRAMEBUFFER, p, f, l, 0);
		else if (n.depthTexture.format === 1027) W(n) ? u.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, p, f, l, 0, d) : t.framebufferTexture2D(t.FRAMEBUFFER, p, f, l, 0);
		else throw Error("THREE.WebGLTextures: Unknown depthTexture format.");
	}
	function Se(e) {
		let n = a.get(e), r = e.isWebGLCubeRenderTarget === !0;
		if (n.__boundDepthTexture !== e.depthTexture) {
			let t = e.depthTexture;
			if (n.__depthDisposeCallback && n.__depthDisposeCallback(), t) {
				let e = () => {
					delete n.__boundDepthTexture, delete n.__depthDisposeCallback, t.removeEventListener("dispose", e);
				};
				t.addEventListener("dispose", e), n.__depthDisposeCallback = e;
			}
			n.__boundDepthTexture = t;
		}
		if (e.depthTexture && !n.__autoAllocateDepthBuffer) {
			if (r) for (let t = 0; t < 6; t++) V(n.__webglFramebuffer[t], e, t);
			else {
				let t = e.texture.mipmaps;
				t && t.length > 0 ? V(n.__webglFramebuffer[0], e, 0) : V(n.__webglFramebuffer, e, 0);
			}
		} else if (r) {
			n.__webglDepthbuffer = [];
			for (let r = 0; r < 6; r++) if (i.bindFramebuffer(t.FRAMEBUFFER, n.__webglFramebuffer[r]), n.__webglDepthbuffer[r] === void 0) n.__webglDepthbuffer[r] = t.createRenderbuffer(), xe(n.__webglDepthbuffer[r], e, !1);
			else {
				let i = e.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, a = n.__webglDepthbuffer[r];
				t.bindRenderbuffer(t.RENDERBUFFER, a), t.framebufferRenderbuffer(t.FRAMEBUFFER, i, t.RENDERBUFFER, a);
			}
		} else {
			let r = e.texture.mipmaps;
			if (r && r.length > 0 ? i.bindFramebuffer(t.FRAMEBUFFER, n.__webglFramebuffer[0]) : i.bindFramebuffer(t.FRAMEBUFFER, n.__webglFramebuffer), n.__webglDepthbuffer === void 0) n.__webglDepthbuffer = t.createRenderbuffer(), xe(n.__webglDepthbuffer, e, !1);
			else {
				let r = e.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, i = n.__webglDepthbuffer;
				t.bindRenderbuffer(t.RENDERBUFFER, i), t.framebufferRenderbuffer(t.FRAMEBUFFER, r, t.RENDERBUFFER, i);
			}
		}
		i.bindFramebuffer(t.FRAMEBUFFER, null);
	}
	function H(e, n, r) {
		let i = a.get(e);
		n !== void 0 && be(i.__webglFramebuffer, e, e.texture, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, 0), r !== void 0 && Se(e);
	}
	function we(e) {
		let n = e.texture, r = a.get(e), o = a.get(n);
		e.addEventListener("dispose", j);
		let c = e.textures, u = e.isWebGLCubeRenderTarget === !0, d = c.length > 1;
		if (d || (o.__webglTexture === void 0 && (o.__webglTexture = t.createTexture()), o.__version = n.version, l.memory.textures++), u) {
			r.__webglFramebuffer = [];
			for (let e = 0; e < 6; e++) if (n.mipmaps && n.mipmaps.length > 0) {
				r.__webglFramebuffer[e] = [];
				for (let i = 0; i < n.mipmaps.length; i++) r.__webglFramebuffer[e][i] = t.createFramebuffer();
			} else r.__webglFramebuffer[e] = t.createFramebuffer();
		} else {
			if (n.mipmaps && n.mipmaps.length > 0) {
				r.__webglFramebuffer = [];
				for (let e = 0; e < n.mipmaps.length; e++) r.__webglFramebuffer[e] = t.createFramebuffer();
			} else r.__webglFramebuffer = t.createFramebuffer();
			if (d) for (let e = 0, n = c.length; e < n; e++) {
				let n = a.get(c[e]);
				n.__webglTexture === void 0 && (n.__webglTexture = t.createTexture(), l.memory.textures++);
			}
			if (e.samples > 0 && W(e) === !1) {
				r.__webglMultisampledFramebuffer = t.createFramebuffer(), r.__webglColorRenderbuffer = [], i.bindFramebuffer(t.FRAMEBUFFER, r.__webglMultisampledFramebuffer);
				for (let n = 0; n < c.length; n++) {
					let i = c[n];
					r.__webglColorRenderbuffer[n] = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, r.__webglColorRenderbuffer[n]);
					let a = s.convert(i.format, i.colorSpace), o = s.convert(i.type), l = O(i.internalFormat, a, o, i.normalized, i.colorSpace, e.isXRRenderTarget === !0), u = U(e);
					t.renderbufferStorageMultisample(t.RENDERBUFFER, u, l, e.width, e.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + n, t.RENDERBUFFER, r.__webglColorRenderbuffer[n]);
				}
				t.bindRenderbuffer(t.RENDERBUFFER, null), e.depthBuffer && (r.__webglDepthRenderbuffer = t.createRenderbuffer(), xe(r.__webglDepthRenderbuffer, e, !0)), i.bindFramebuffer(t.FRAMEBUFFER, null);
			}
		}
		if (u) {
			i.bindTexture(t.TEXTURE_CUBE_MAP, o.__webglTexture), pe(t.TEXTURE_CUBE_MAP, n);
			for (let i = 0; i < 6; i++) if (n.mipmaps && n.mipmaps.length > 0) for (let a = 0; a < n.mipmaps.length; a++) be(r.__webglFramebuffer[i][a], e, n, t.COLOR_ATTACHMENT0, t.TEXTURE_CUBE_MAP_POSITIVE_X + i, a);
			else be(r.__webglFramebuffer[i], e, n, t.COLOR_ATTACHMENT0, t.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0);
			w(n) && T(t.TEXTURE_CUBE_MAP), i.unbindTexture();
		} else if (d) {
			for (let n = 0, o = c.length; n < o; n++) {
				let o = c[n], s = a.get(o), l = t.TEXTURE_2D;
				(e.isWebGL3DRenderTarget || e.isWebGLArrayRenderTarget) && (l = e.isWebGL3DRenderTarget ? t.TEXTURE_3D : t.TEXTURE_2D_ARRAY), i.bindTexture(l, s.__webglTexture), pe(l, o), be(r.__webglFramebuffer, e, o, t.COLOR_ATTACHMENT0 + n, l, 0), w(o) && T(l);
			}
			i.unbindTexture();
		} else {
			let a = t.TEXTURE_2D;
			if ((e.isWebGL3DRenderTarget || e.isWebGLArrayRenderTarget) && (a = e.isWebGL3DRenderTarget ? t.TEXTURE_3D : t.TEXTURE_2D_ARRAY), i.bindTexture(a, o.__webglTexture), pe(a, n), n.mipmaps && n.mipmaps.length > 0) for (let i = 0; i < n.mipmaps.length; i++) be(r.__webglFramebuffer[i], e, n, t.COLOR_ATTACHMENT0, a, i);
			else be(r.__webglFramebuffer, e, n, t.COLOR_ATTACHMENT0, a, 0);
			w(n) && T(a), i.unbindTexture();
		}
		e.depthBuffer && Se(e);
	}
	function Te(e) {
		let t = e.textures;
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			if (w(r)) {
				let t = D(e), n = a.get(r).__webglTexture;
				i.bindTexture(t, n), T(t), i.unbindTexture();
			}
		}
	}
	let Ee = [], De = [];
	function ke(e) {
		if (e.samples > 0) {
			if (W(e) === !1) {
				let n = e.textures, r = e.width, o = e.height, s = t.COLOR_BUFFER_BIT, c = e.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, l = a.get(e), u = n.length > 1;
				if (u) for (let e = 0; e < n.length; e++) i.bindFramebuffer(t.FRAMEBUFFER, l.__webglMultisampledFramebuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.RENDERBUFFER, null), i.bindFramebuffer(t.FRAMEBUFFER, l.__webglFramebuffer), t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.TEXTURE_2D, null, 0);
				i.bindFramebuffer(t.READ_FRAMEBUFFER, l.__webglMultisampledFramebuffer);
				let f = e.texture.mipmaps;
				f && f.length > 0 ? i.bindFramebuffer(t.DRAW_FRAMEBUFFER, l.__webglFramebuffer[0]) : i.bindFramebuffer(t.DRAW_FRAMEBUFFER, l.__webglFramebuffer);
				for (let i = 0; i < n.length; i++) {
					if (e.resolveDepthBuffer && (e.depthBuffer && (s |= t.DEPTH_BUFFER_BIT), e.stencilBuffer && e.resolveStencilBuffer && (s |= t.STENCIL_BUFFER_BIT)), u) {
						t.framebufferRenderbuffer(t.READ_FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.RENDERBUFFER, l.__webglColorRenderbuffer[i]);
						let e = a.get(n[i]).__webglTexture;
						t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, e, 0);
					}
					t.blitFramebuffer(0, 0, r, o, 0, 0, r, o, s, t.NEAREST), d === !0 && (Ee.length = 0, De.length = 0, Ee.push(t.COLOR_ATTACHMENT0 + i), e.depthBuffer && e.storeMultisampledDepthBuffer === !1 && (Ee.push(c), De.push(c), t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, De)), t.invalidateFramebuffer(t.READ_FRAMEBUFFER, Ee));
				}
				if (i.bindFramebuffer(t.READ_FRAMEBUFFER, null), i.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), u) for (let e = 0; e < n.length; e++) {
					i.bindFramebuffer(t.FRAMEBUFFER, l.__webglMultisampledFramebuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.RENDERBUFFER, l.__webglColorRenderbuffer[e]);
					let r = a.get(n[e]).__webglTexture;
					i.bindFramebuffer(t.FRAMEBUFFER, l.__webglFramebuffer), t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.TEXTURE_2D, r, 0);
				}
				i.bindFramebuffer(t.DRAW_FRAMEBUFFER, l.__webglMultisampledFramebuffer);
			} else if (e.depthBuffer && e.storeMultisampledDepthBuffer === !1 && d) {
				let n = e.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT;
				t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, [n]);
			}
		}
	}
	function U(e) {
		return Math.min(o.maxSamples, e.samples);
	}
	function W(e) {
		let t = a.get(e);
		return e.samples > 0 && n.has("WEBGL_multisampled_render_to_texture") === !0 && t.__useRenderToTexture !== !1;
	}
	function Ae(e) {
		let t = l.render.frame;
		p.get(e) !== t && (p.set(e, t), e.update());
	}
	function je(e, t) {
		let n = e.colorSpace, r = e.format, i = e.type;
		return e.isCompressedTexture === !0 || e.isVideoTexture === !0 || n !== "srgb-linear" && n !== "" && (F.getTransfer(n) === "srgb" ? (r !== 1023 || i !== 1009) && b("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : E("WebGLTextures: Unsupported texture color space:", n)), t;
	}
	function Ne(e) {
		return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement ? (f.width = e.naturalWidth || e.width, f.height = e.naturalHeight || e.height) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (f.width = e.displayWidth, f.height = e.displayHeight) : (f.width = e.width, f.height = e.height), f;
	}
	this.allocateTextureUnit = ae, this.resetTextureUnits = ne, this.getTextureUnits = re, this.setTextureUnits = ie, this.setTexture2D = oe, this.setTexture2DArray = se, this.setTexture3D = ce, this.setTextureCube = R, this.rebindTextures = H, this.setupRenderTarget = we, this.updateRenderTargetMipmap = Te, this.updateMultisampleRenderTarget = ke, this.setupDepthRenderbuffer = Se, this.setupFrameBufferTexture = be, this.useMultisampledRTT = W, this.isReversedDepthBuffer = function() {
		return i.buffers.depth.getReversed();
	};
}
function qr(e, t) {
	function n(n, r = "") {
		let i, a = F.getTransfer(r);
		if (n === 1009) return e.UNSIGNED_BYTE;
		if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
		if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
		if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
		if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
		if (n === 1010) return e.BYTE;
		if (n === 1011) return e.SHORT;
		if (n === 1012) return e.UNSIGNED_SHORT;
		if (n === 1013) return e.INT;
		if (n === 1014) return e.UNSIGNED_INT;
		if (n === 1015) return e.FLOAT;
		if (n === 1016) return e.HALF_FLOAT;
		if (n === 1021) return e.ALPHA;
		if (n === 1022) return e.RGB;
		if (n === 1023) return e.RGBA;
		if (n === 1026) return e.DEPTH_COMPONENT;
		if (n === 1027) return e.DEPTH_STENCIL;
		if (n === 1028) return e.RED;
		if (n === 1029) return e.RED_INTEGER;
		if (n === 1030) return e.RG;
		if (n === 1031) return e.RG_INTEGER;
		if (n === 1033) return e.RGBA_INTEGER;
		if (n === 33776 || n === 33777 || n === 33778 || n === 33779) {
			if (a === "srgb") {
				if (i = t.get("WEBGL_compressed_texture_s3tc_srgb"), i !== null) {
					if (n === 33776) return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;
					if (n === 33777) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
					if (n === 33778) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
					if (n === 33779) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
				} else return null;
			} else if (i = t.get("WEBGL_compressed_texture_s3tc"), i !== null) {
				if (n === 33776) return i.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if (n === 33777) return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if (n === 33778) return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if (n === 33779) return i.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			} else return null;
		}
		if (n === 35840 || n === 35841 || n === 35842 || n === 35843) {
			if (i = t.get("WEBGL_compressed_texture_pvrtc"), i !== null) {
				if (n === 35840) return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if (n === 35841) return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if (n === 35842) return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if (n === 35843) return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
			} else return null;
		}
		if (n === 36196 || n === 37492 || n === 37496 || n === 37488 || n === 37489 || n === 37490 || n === 37491) {
			if (i = t.get("WEBGL_compressed_texture_etc"), i !== null) {
				if (n === 36196 || n === 37492) return a === "srgb" ? i.COMPRESSED_SRGB8_ETC2 : i.COMPRESSED_RGB8_ETC2;
				if (n === 37496) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i.COMPRESSED_RGBA8_ETC2_EAC;
				if (n === 37488) return i.COMPRESSED_R11_EAC;
				if (n === 37489) return i.COMPRESSED_SIGNED_R11_EAC;
				if (n === 37490) return i.COMPRESSED_RG11_EAC;
				if (n === 37491) return i.COMPRESSED_SIGNED_RG11_EAC;
			} else return null;
		}
		if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821) {
			if (i = t.get("WEBGL_compressed_texture_astc"), i !== null) {
				if (n === 37808) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i.COMPRESSED_RGBA_ASTC_4x4_KHR;
				if (n === 37809) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i.COMPRESSED_RGBA_ASTC_5x4_KHR;
				if (n === 37810) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i.COMPRESSED_RGBA_ASTC_5x5_KHR;
				if (n === 37811) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i.COMPRESSED_RGBA_ASTC_6x5_KHR;
				if (n === 37812) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i.COMPRESSED_RGBA_ASTC_6x6_KHR;
				if (n === 37813) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i.COMPRESSED_RGBA_ASTC_8x5_KHR;
				if (n === 37814) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i.COMPRESSED_RGBA_ASTC_8x6_KHR;
				if (n === 37815) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i.COMPRESSED_RGBA_ASTC_8x8_KHR;
				if (n === 37816) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i.COMPRESSED_RGBA_ASTC_10x5_KHR;
				if (n === 37817) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i.COMPRESSED_RGBA_ASTC_10x6_KHR;
				if (n === 37818) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i.COMPRESSED_RGBA_ASTC_10x8_KHR;
				if (n === 37819) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i.COMPRESSED_RGBA_ASTC_10x10_KHR;
				if (n === 37820) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i.COMPRESSED_RGBA_ASTC_12x10_KHR;
				if (n === 37821) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i.COMPRESSED_RGBA_ASTC_12x12_KHR;
			} else return null;
		}
		if (n === 36492 || n === 36494 || n === 36495) {
			if (i = t.get("EXT_texture_compression_bptc"), i !== null) {
				if (n === 36492) return a === "srgb" ? i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i.COMPRESSED_RGBA_BPTC_UNORM_EXT;
				if (n === 36494) return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
				if (n === 36495) return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
			} else return null;
		}
		if (n === 36283 || n === 36284 || n === 36285 || n === 36286) {
			if (i = t.get("EXT_texture_compression_rgtc"), i !== null) {
				if (n === 36283) return i.COMPRESSED_RED_RGTC1_EXT;
				if (n === 36284) return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;
				if (n === 36285) return i.COMPRESSED_RED_GREEN_RGTC2_EXT;
				if (n === 36286) return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
			} else return null;
		}
		return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] === void 0 ? null : e[n];
	}
	return { convert: n };
}
var Jr = "\nvoid main() {\n\n	gl_Position = vec4( position, 1.0 );\n\n}", Yr = "\nuniform sampler2DArray depthColor;\nuniform float depthWidth;\nuniform float depthHeight;\n\nvoid main() {\n\n	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );\n\n	if ( coord.x >= 1.0 ) {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;\n\n	} else {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;\n\n	}\n\n}", Xr = class {
	constructor() {
		this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
	}
	init(e, t) {
		if (this.texture === null) {
			let n = new u(e.texture);
			(e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
		}
	}
	getMesh(e) {
		if (this.texture !== null && this.mesh === null) {
			let t = e.cameras[0].viewport, n = new A({
				vertexShader: Jr,
				fragmentShader: Yr,
				uniforms: {
					depthColor: { value: this.texture },
					depthWidth: { value: t.z },
					depthHeight: { value: t.w }
				}
			});
			this.mesh = new I(new h(20, 20), n);
		}
		return this.mesh;
	}
	reset() {
		this.texture = null, this.mesh = null;
	}
	getDepthTexture() {
		return this.texture;
	}
}, Zr = class extends S {
	constructor(e, t) {
		super();
		let n = this, r = null, i = 1, o = null, s = "local-floor", c = 1, l = null, p = null, m = null, h = null, g = null, _ = null, y = typeof XRWebGLBinding < "u", x = new Xr(), S = {}, C = t.getContextAttributes(), w = null, T = null, E = [], D = [], O = new L(), ee = null, k = null, A = new d();
		A.viewport = new xe();
		let j = new d();
		j.viewport = new xe();
		let M = [A, j], N = new fe(), P = null, ne = null;
		this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(e) {
			let t = E[e];
			return t === void 0 && (t = new ke(), E[e] = t), t.getTargetRaySpace();
		}, this.getControllerGrip = function(e) {
			let t = E[e];
			return t === void 0 && (t = new ke(), E[e] = t), t.getGripSpace();
		}, this.getHand = function(e) {
			let t = E[e];
			return t === void 0 && (t = new ke(), E[e] = t), t.getHandSpace();
		};
		function F(e) {
			let t = D.indexOf(e.inputSource);
			if (t === -1) return;
			let n = E[t];
			n !== void 0 && (n.update(e.inputSource, e.frame, l || o), n.dispatchEvent({
				type: e.type,
				data: e.inputSource
			}));
		}
		function ie() {
			r.removeEventListener("select", F), r.removeEventListener("selectstart", F), r.removeEventListener("selectend", F), r.removeEventListener("squeeze", F), r.removeEventListener("squeezestart", F), r.removeEventListener("squeezeend", F), r.removeEventListener("end", ie), r.removeEventListener("inputsourceschange", ae);
			for (let e = 0; e < E.length; e++) {
				let t = D[e];
				t !== null && (D[e] = null, E[e].disconnect(t));
			}
			P = null, ne = null, x.reset();
			for (let e in S) delete S[e];
			if (e.setRenderTarget(w), g = null, h = null, m = null, r = null, T = null, de.stop(), n.isPresenting = !1, e.setPixelRatio(ee), e.setSize(O.width, O.height, !1), k !== null) {
				let e = k.camera;
				e.fov = k.fov, e.zoom = k.zoom, e.updateProjectionMatrix(), k = null;
			}
			n.dispatchEvent({ type: "sessionend" });
		}
		this.setFramebufferScaleFactor = function(e) {
			i = e, n.isPresenting === !0 && b("WebXRManager: Cannot change framebuffer scale while presenting.");
		}, this.setReferenceSpaceType = function(e) {
			s = e, n.isPresenting === !0 && b("WebXRManager: Cannot change reference space type while presenting.");
		}, this.getReferenceSpace = function() {
			return l || o;
		}, this.setReferenceSpace = function(e) {
			l = e;
		}, this.getBaseLayer = function() {
			return h === null ? g : h;
		}, this.getBinding = function() {
			return m === null && y && (m = new XRWebGLBinding(r, t)), m;
		}, this.getFrame = function() {
			return _;
		}, this.getSession = function() {
			return r;
		}, this.setSession = async function(u) {
			if (r = u, r !== null) {
				if (w = e.getRenderTarget(), r.addEventListener("select", F), r.addEventListener("selectstart", F), r.addEventListener("selectend", F), r.addEventListener("squeeze", F), r.addEventListener("squeezestart", F), r.addEventListener("squeezeend", F), r.addEventListener("end", ie), r.addEventListener("inputsourceschange", ae), C.xrCompatible !== !0 && await t.makeXRCompatible(), ee = e.getPixelRatio(), e.getSize(O), y && "createProjectionLayer" in XRWebGLBinding.prototype) {
					let n = null, o = null, s = null;
					C.depth && (s = C.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, n = C.stencil ? v : a, o = C.stencil ? Se : se);
					let c = {
						colorFormat: t.RGBA8,
						depthFormat: s,
						scaleFactor: i
					};
					m = this.getBinding(), h = m.createProjectionLayer(c), r.updateRenderState({ layers: [h] }), e.setPixelRatio(1), e.setSize(h.textureWidth, h.textureHeight, !1), T = new re(h.textureWidth, h.textureHeight, {
						format: te,
						type: pe,
						depthTexture: new he(h.textureWidth, h.textureHeight, o, void 0, void 0, void 0, void 0, void 0, void 0, n),
						stencilBuffer: C.stencil,
						colorSpace: e.outputColorSpace,
						samples: C.antialias ? 4 : 0,
						resolveDepthBuffer: h.ignoreDepthValues === !1,
						resolveStencilBuffer: h.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: h.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: h.ignoreDepthValues === !1
					});
				} else {
					let n = {
						antialias: C.antialias,
						alpha: !0,
						depth: C.depth,
						stencil: C.stencil,
						framebufferScaleFactor: i
					};
					g = new XRWebGLLayer(r, t, n), r.updateRenderState({ baseLayer: g }), e.setPixelRatio(1), e.setSize(g.framebufferWidth, g.framebufferHeight, !1), T = new re(g.framebufferWidth, g.framebufferHeight, {
						format: te,
						type: pe,
						colorSpace: e.outputColorSpace,
						stencilBuffer: C.stencil,
						resolveDepthBuffer: g.ignoreDepthValues === !1,
						resolveStencilBuffer: g.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: g.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: g.ignoreDepthValues === !1
					});
				}
				T.isXRRenderTarget = !0, this.setFoveation(c), l = null, o = await r.requestReferenceSpace(s), de.setContext(r), de.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
			}
		}, this.getEnvironmentBlendMode = function() {
			if (r !== null) return r.environmentBlendMode;
		}, this.getDepthTexture = function() {
			return x.getDepthTexture();
		};
		function ae(e) {
			for (let t = 0; t < e.removed.length; t++) {
				let n = e.removed[t], r = D.indexOf(n);
				r >= 0 && (D[r] = null, E[r].disconnect(n));
			}
			for (let t = 0; t < e.added.length; t++) {
				let n = e.added[t], r = D.indexOf(n);
				if (r === -1) {
					for (let e = 0; e < E.length; e++) if (e >= D.length) {
						D.push(n), r = e;
						break;
					} else if (D[e] === null) {
						D[e] = n, r = e;
						break;
					}
					if (r === -1) break;
				}
				let i = E[r];
				i && i.connect(n);
			}
		}
		let I = new H(), oe = new H();
		function ce(e, t, n) {
			I.setFromMatrixPosition(t.matrixWorld), oe.setFromMatrixPosition(n.matrixWorld);
			let r = I.distanceTo(oe), i = t.projectionMatrix.elements, a = n.projectionMatrix.elements, o = i[14] / (i[10] - 1), s = i[14] / (i[10] + 1), c = (i[9] + 1) / i[5], l = (i[9] - 1) / i[5], u = (i[8] - 1) / i[0], d = (a[8] + 1) / a[0], f = o * u, p = o * d, m = r / (-u + d), h = m * -u;
			if (t.matrixWorld.decompose(e.position, e.quaternion, e.scale), e.translateX(h), e.translateZ(m), e.matrixWorld.compose(e.position, e.quaternion, e.scale), e.matrixWorldInverse.copy(e.matrixWorld).invert(), i[10] === -1) e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse);
			else {
				let t = o + m, n = s + m, i = f - h, a = p + (r - h), u = c * s / n * t, d = l * s / n * t;
				e.projectionMatrix.makePerspective(i, a, u, d, t, n), e.projectionMatrixInverse.copy(e.projectionMatrix).invert();
			}
		}
		function le(e, t) {
			t === null ? e.matrixWorld.copy(e.matrix) : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix), e.matrixWorldInverse.copy(e.matrixWorld).invert();
		}
		this.updateCamera = function(e) {
			if (r === null) return;
			let t = e.near, n = e.far;
			x.texture !== null && (x.depthNear > 0 && (t = x.depthNear), x.depthFar > 0 && (n = x.depthFar)), N.near = j.near = A.near = t, N.far = j.far = A.far = n, (P !== N.near || ne !== N.far) && (r.updateRenderState({
				depthNear: N.near,
				depthFar: N.far
			}), P = N.near, ne = N.far), N.layers.mask = e.layers.mask | 6, A.layers.mask = N.layers.mask & -5, j.layers.mask = N.layers.mask & -3;
			let i = e.parent, a = N.cameras;
			le(N, i);
			for (let e = 0; e < a.length; e++) le(a[e], i);
			a.length === 2 ? ce(N, A, j) : N.projectionMatrix.copy(A.projectionMatrix), k === null && e.isPerspectiveCamera && (k = {
				camera: e,
				fov: e.fov,
				zoom: e.zoom
			}), R(e, N, i);
		};
		function R(e, t, n) {
			n === null ? e.matrix.copy(t.matrixWorld) : (e.matrix.copy(n.matrixWorld), e.matrix.invert(), e.matrix.multiply(t.matrixWorld)), e.matrix.decompose(e.position, e.quaternion, e.scale), e.updateMatrixWorld(!0), e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse), e.isPerspectiveCamera && (e.fov = f * 2 * Math.atan(1 / e.projectionMatrix.elements[5]), e.zoom = 1);
		}
		this.getCamera = function() {
			return N;
		}, this.getFoveation = function() {
			if (h !== null || g !== null) return c;
		}, this.setFoveation = function(e) {
			c = e, h !== null && (h.fixedFoveation = e), g !== null && g.fixedFoveation !== void 0 && (g.fixedFoveation = e);
		}, this.hasDepthSensing = function() {
			return x.texture !== null;
		}, this.getDepthSensingMesh = function() {
			return x.getMesh(N);
		}, this.getCameraTexture = function(e) {
			return S[e];
		};
		let z = null;
		function ue(t, i) {
			if (p = i.getViewerPose(l || o), _ = i, p !== null) {
				let t = p.views;
				g !== null && (e.setRenderTargetFramebuffer(T, g.framebuffer), e.setRenderTarget(T));
				let i = !1;
				t.length !== N.cameras.length && (N.cameras.length = 0, i = !0);
				for (let n = 0; n < t.length; n++) {
					let r = t[n], a = null;
					if (g !== null) a = g.getViewport(r);
					else {
						let t = m.getViewSubImage(h, r);
						a = t.viewport, n === 0 && (e.setRenderTargetTextures(T, t.colorTexture, t.depthStencilTexture), e.setRenderTarget(T));
					}
					let o = M[n];
					o === void 0 && (o = new d(), o.layers.enable(n), o.viewport = new xe(), M[n] = o), o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.quaternion, o.scale), o.projectionMatrix.fromArray(r.projectionMatrix), o.projectionMatrixInverse.copy(o.projectionMatrix).invert(), o.viewport.set(a.x, a.y, a.width, a.height), n === 0 && (N.matrix.copy(o.matrix), N.matrix.decompose(N.position, N.quaternion, N.scale)), i === !0 && N.cameras.push(o);
				}
				let a = r.enabledFeatures;
				if (a && a.includes("depth-sensing") && r.depthUsage == "gpu-optimized" && y) {
					m = n.getBinding();
					let e = m.getDepthInformation(t[0]);
					e && e.isValid && e.texture && x.init(e, r.renderState);
				}
				if (a && a.includes("camera-access") && y) {
					e.state.unbindTexture(), m = n.getBinding();
					for (let e = 0; e < t.length; e++) {
						let n = t[e].camera;
						if (n) {
							let e = S[n];
							e || (e = new u(), S[n] = e);
							let t = m.getCameraImage(n);
							e.sourceTexture = t;
						}
					}
				}
			}
			for (let e = 0; e < E.length; e++) {
				let t = D[e], n = E[e];
				t !== null && n !== void 0 && n.update(t, i, l || o);
			}
			z && z(t, i), i.detectedPlanes && n.dispatchEvent({
				type: "planesdetected",
				data: i
			}), _ = null;
		}
		let de = new We();
		de.setAnimationLoop(ue), this.setAnimationLoop = function(e) {
			z = e;
		}, this.dispose = function() {};
	}
}, Qr = /*@__PURE__*/ new Ie(), $r = /*@__PURE__*/ new U();
$r.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function ei(e, t) {
	function n(e, t) {
		e.matrixAutoUpdate === !0 && e.updateMatrix(), t.value.copy(e.matrix);
	}
	function r(t, n) {
		n.color.getRGB(t.fogColor.value, Ae(e)), n.isFog ? (t.fogNear.value = n.near, t.fogFar.value = n.far) : n.isFogExp2 && (t.fogDensity.value = n.density);
	}
	function i(e, t, n, r, i) {
		t.isNodeMaterial ? t.uniformsNeedUpdate = !1 : t.isMeshBasicMaterial ? a(e, t) : t.isMeshLambertMaterial ? (a(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshToonMaterial ? (a(e, t), d(e, t)) : t.isMeshPhongMaterial ? (a(e, t), u(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshStandardMaterial ? (a(e, t), f(e, t), t.isMeshPhysicalMaterial && p(e, t, i)) : t.isMeshMatcapMaterial ? (a(e, t), m(e, t)) : t.isMeshDepthMaterial ? a(e, t) : t.isMeshDistanceMaterial ? (a(e, t), h(e, t)) : t.isMeshNormalMaterial ? a(e, t) : t.isLineBasicMaterial ? (o(e, t), t.isLineDashedMaterial && s(e, t)) : t.isPointsMaterial ? c(e, t, n, r) : t.isSpriteMaterial ? l(e, t) : t.isShadowMaterial ? (e.color.value.copy(t.color), e.opacity.value = t.opacity) : t.isShaderMaterial && (t.uniformsNeedUpdate = !1);
	}
	function a(e, r) {
		e.opacity.value = r.opacity, r.color && e.diffuse.value.copy(r.color), r.emissive && e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity), r.map && (e.map.value = r.map, n(r.map, e.mapTransform)), r.alphaMap && (e.alphaMap.value = r.alphaMap, n(r.alphaMap, e.alphaMapTransform)), r.bumpMap && (e.bumpMap.value = r.bumpMap, n(r.bumpMap, e.bumpMapTransform), e.bumpScale.value = r.bumpScale, r.side === 1 && (e.bumpScale.value *= -1)), r.normalMap && (e.normalMap.value = r.normalMap, n(r.normalMap, e.normalMapTransform), e.normalScale.value.copy(r.normalScale), r.side === 1 && e.normalScale.value.negate()), r.displacementMap && (e.displacementMap.value = r.displacementMap, n(r.displacementMap, e.displacementMapTransform), e.displacementScale.value = r.displacementScale, e.displacementBias.value = r.displacementBias), r.emissiveMap && (e.emissiveMap.value = r.emissiveMap, n(r.emissiveMap, e.emissiveMapTransform)), r.specularMap && (e.specularMap.value = r.specularMap, n(r.specularMap, e.specularMapTransform)), r.alphaTest > 0 && (e.alphaTest.value = r.alphaTest);
		let i = t.get(r), a = i.envMap, o = i.envMapRotation;
		a && (e.envMap.value = a, e.envMapRotation.value.setFromMatrix4(Qr.makeRotationFromEuler(o)).transpose(), a.isCubeTexture && a.isRenderTargetTexture === !1 && e.envMapRotation.value.premultiply($r), e.reflectivity.value = r.reflectivity, e.ior.value = r.ior, e.refractionRatio.value = r.refractionRatio), r.lightMap && (e.lightMap.value = r.lightMap, e.lightMapIntensity.value = r.lightMapIntensity, n(r.lightMap, e.lightMapTransform)), r.aoMap && (e.aoMap.value = r.aoMap, e.aoMapIntensity.value = r.aoMapIntensity, n(r.aoMap, e.aoMapTransform));
	}
	function o(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, t.map && (e.map.value = t.map, n(t.map, e.mapTransform));
	}
	function s(e, t) {
		e.dashSize.value = t.dashSize, e.totalSize.value = t.dashSize + t.gapSize, e.scale.value = t.scale;
	}
	function c(e, t, r, i) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.size.value = t.size * r, e.scale.value = i * .5, t.map && (e.map.value = t.map, n(t.map, e.uvTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function l(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.rotation.value = t.rotation, t.map && (e.map.value = t.map, n(t.map, e.mapTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function u(e, t) {
		e.specular.value.copy(t.specular), e.shininess.value = Math.max(t.shininess, 1e-4);
	}
	function d(e, t) {
		t.gradientMap && (e.gradientMap.value = t.gradientMap);
	}
	function f(e, t) {
		e.metalness.value = t.metalness, t.metalnessMap && (e.metalnessMap.value = t.metalnessMap, n(t.metalnessMap, e.metalnessMapTransform)), e.roughness.value = t.roughness, t.roughnessMap && (e.roughnessMap.value = t.roughnessMap, n(t.roughnessMap, e.roughnessMapTransform)), t.envMap && (e.envMapIntensity.value = t.envMapIntensity);
	}
	function p(e, t, r) {
		e.ior.value = t.ior, t.sheen > 0 && (e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen), e.sheenRoughness.value = t.sheenRoughness, t.sheenColorMap && (e.sheenColorMap.value = t.sheenColorMap, n(t.sheenColorMap, e.sheenColorMapTransform)), t.sheenRoughnessMap && (e.sheenRoughnessMap.value = t.sheenRoughnessMap, n(t.sheenRoughnessMap, e.sheenRoughnessMapTransform))), t.clearcoat > 0 && (e.clearcoat.value = t.clearcoat, e.clearcoatRoughness.value = t.clearcoatRoughness, t.clearcoatMap && (e.clearcoatMap.value = t.clearcoatMap, n(t.clearcoatMap, e.clearcoatMapTransform)), t.clearcoatRoughnessMap && (e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap, n(t.clearcoatRoughnessMap, e.clearcoatRoughnessMapTransform)), t.clearcoatNormalMap && (e.clearcoatNormalMap.value = t.clearcoatNormalMap, n(t.clearcoatNormalMap, e.clearcoatNormalMapTransform), e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale), t.side === 1 && e.clearcoatNormalScale.value.negate())), t.dispersion > 0 && (e.dispersion.value = t.dispersion), t.retroreflectivity > 0 && (e.retroreflectivity.value = t.retroreflectivity), t.iridescence > 0 && (e.iridescence.value = t.iridescence, e.iridescenceIOR.value = t.iridescenceIOR, e.iridescenceThicknessMinimum.value = t.iridescenceThicknessRange[0], e.iridescenceThicknessMaximum.value = t.iridescenceThicknessRange[1], t.iridescenceMap && (e.iridescenceMap.value = t.iridescenceMap, n(t.iridescenceMap, e.iridescenceMapTransform)), t.iridescenceThicknessMap && (e.iridescenceThicknessMap.value = t.iridescenceThicknessMap, n(t.iridescenceThicknessMap, e.iridescenceThicknessMapTransform))), t.transmission > 0 && (e.transmission.value = t.transmission, e.transmissionSamplerMap.value = r.texture, e.transmissionSamplerSize.value.set(r.width, r.height), t.transmissionMap && (e.transmissionMap.value = t.transmissionMap, n(t.transmissionMap, e.transmissionMapTransform)), e.thickness.value = t.thickness, t.thicknessMap && (e.thicknessMap.value = t.thicknessMap, n(t.thicknessMap, e.thicknessMapTransform)), e.attenuationDistance.value = t.attenuationDistance, e.attenuationColor.value.copy(t.attenuationColor)), t.anisotropy > 0 && (e.anisotropyVector.value.set(t.anisotropy * Math.cos(t.anisotropyRotation), t.anisotropy * Math.sin(t.anisotropyRotation)), t.anisotropyMap && (e.anisotropyMap.value = t.anisotropyMap, n(t.anisotropyMap, e.anisotropyMapTransform))), e.specularIntensity.value = t.specularIntensity, e.specularColor.value.copy(t.specularColor), t.specularColorMap && (e.specularColorMap.value = t.specularColorMap, n(t.specularColorMap, e.specularColorMapTransform)), t.specularIntensityMap && (e.specularIntensityMap.value = t.specularIntensityMap, n(t.specularIntensityMap, e.specularIntensityMapTransform));
	}
	function m(e, t) {
		t.matcap && (e.matcap.value = t.matcap);
	}
	function h(e, n) {
		let r = t.get(n).light;
		e.referencePosition.value.setFromMatrixPosition(r.matrixWorld), e.nearDistance.value = r.shadow.camera.near, e.farDistance.value = r.shadow.camera.far;
	}
	return {
		refreshFogUniforms: r,
		refreshMaterialUniforms: i
	};
}
function ti(e, t, n, r) {
	let i = {}, a = {}, o = [], s = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
	function c(e, t) {
		let n = t.program;
		r.uniformBlockBinding(e, n);
	}
	function l(e, n) {
		let o = i[e.id];
		o === void 0 && (g(e), o = u(e), i[e.id] = o, e.addEventListener("dispose", v));
		let s = n.program;
		r.updateUBOMapping(e, s);
		let c = t.render.frame;
		a[e.id] !== c && (f(e), a[e.id] = c);
	}
	function u(t) {
		let n = d();
		t.__bindingPointIndex = n;
		let r = e.createBuffer(), i = t.__size, a = t.usage;
		return e.bindBuffer(e.UNIFORM_BUFFER, r), e.bufferData(e.UNIFORM_BUFFER, i, a), e.bindBuffer(e.UNIFORM_BUFFER, null), e.bindBufferBase(e.UNIFORM_BUFFER, n, r), r;
	}
	function d() {
		for (let e = 0; e < s; e++) if (o.indexOf(e) === -1) return o.push(e), e;
		return E("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
	}
	function f(t) {
		let n = i[t.id], r = t.uniforms, a = t.__cache;
		e.bindBuffer(e.UNIFORM_BUFFER, n);
		for (let e = 0, t = r.length; e < t; e++) {
			let t = r[e];
			if (Array.isArray(t)) for (let n = 0, r = t.length; n < r; n++) p(t[n], e, n, a);
			else p(t, e, 0, a);
		}
		e.bindBuffer(e.UNIFORM_BUFFER, null);
	}
	function p(t, n, r, i) {
		if (h(t, n, r, i) === !0) {
			let n = t.__offset, r = t.value;
			if (Array.isArray(r)) {
				let e = 0;
				for (let n = 0; n < r.length; n++) {
					let i = r[n], a = _(i);
					m(i, t.__data, e), typeof i != "number" && typeof i != "boolean" && !i.isMatrix3 && !ArrayBuffer.isView(i) && (e += a.storage / Float32Array.BYTES_PER_ELEMENT);
				}
			} else m(r, t.__data, 0);
			e.bufferSubData(e.UNIFORM_BUFFER, n, t.__data);
		}
	}
	function m(e, t, n) {
		typeof e == "number" || typeof e == "boolean" ? t[0] = e : e.isMatrix3 ? (t[0] = e.elements[0], t[1] = e.elements[1], t[2] = e.elements[2], t[3] = 0, t[4] = e.elements[3], t[5] = e.elements[4], t[6] = e.elements[5], t[7] = 0, t[8] = e.elements[6], t[9] = e.elements[7], t[10] = e.elements[8], t[11] = 0) : ArrayBuffer.isView(e) ? t.set(new e.constructor(e.buffer, e.byteOffset, t.length)) : e.toArray(t, n);
	}
	function h(e, t, n, r) {
		let i = e.value, a = t + "_" + n;
		if (r[a] === void 0) return r[a] = typeof i == "number" || typeof i == "boolean" ? i : ArrayBuffer.isView(i) ? i.slice() : i.clone(), !0;
		{
			let e = r[a];
			if (typeof i == "number" || typeof i == "boolean") {
				if (e !== i) return r[a] = i, !0;
			} else if (ArrayBuffer.isView(i)) return !0;
			else if (e.equals(i) === !1) return e.copy(i), !0;
		}
		return !1;
	}
	function g(e) {
		let t = e.uniforms, n = 0;
		for (let e = 0, r = t.length; e < r; e++) {
			let r = Array.isArray(t[e]) ? t[e] : [t[e]];
			for (let e = 0, t = r.length; e < t; e++) {
				let t = r[e], i = Array.isArray(t.value) ? t.value : [t.value];
				for (let e = 0, r = i.length; e < r; e++) {
					let r = i[e], a = _(r), o = n % 16, s = o % a.boundary, c = o + s;
					n += s, c !== 0 && 16 - c < a.storage && (n += 16 - c), t.__data = new Float32Array(a.storage / Float32Array.BYTES_PER_ELEMENT), t.__offset = n, n += a.storage;
				}
			}
		}
		let r = n % 16;
		return r > 0 && (n += 16 - r), e.__size = n, e.__cache = {}, this;
	}
	function _(e) {
		let t = {
			boundary: 0,
			storage: 0
		};
		return typeof e == "number" || typeof e == "boolean" ? (t.boundary = 4, t.storage = 4) : e.isVector2 ? (t.boundary = 8, t.storage = 8) : e.isVector3 || e.isColor ? (t.boundary = 16, t.storage = 12) : e.isVector4 ? (t.boundary = 16, t.storage = 16) : e.isMatrix3 ? (t.boundary = 48, t.storage = 48) : e.isMatrix4 ? (t.boundary = 64, t.storage = 64) : e.isTexture ? b("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(e) ? (t.boundary = 16, t.storage = e.byteLength) : b("WebGLRenderer: Unsupported uniform value type.", e), t;
	}
	function v(t) {
		let n = t.target;
		n.removeEventListener("dispose", v);
		let r = o.indexOf(n.__bindingPointIndex);
		o.splice(r, 1), e.deleteBuffer(i[n.id]), delete i[n.id], delete a[n.id];
	}
	function y() {
		for (let t in i) e.deleteBuffer(i[t]);
		o = [], i = {}, a = {};
	}
	return {
		bind: c,
		update: l,
		dispose: y
	};
}
var ni = new Uint16Array([
	12469,
	15057,
	12620,
	14925,
	13266,
	14620,
	13807,
	14376,
	14323,
	13990,
	14545,
	13625,
	14713,
	13328,
	14840,
	12882,
	14931,
	12528,
	14996,
	12233,
	15039,
	11829,
	15066,
	11525,
	15080,
	11295,
	15085,
	10976,
	15082,
	10705,
	15073,
	10495,
	13880,
	14564,
	13898,
	14542,
	13977,
	14430,
	14158,
	14124,
	14393,
	13732,
	14556,
	13410,
	14702,
	12996,
	14814,
	12596,
	14891,
	12291,
	14937,
	11834,
	14957,
	11489,
	14958,
	11194,
	14943,
	10803,
	14921,
	10506,
	14893,
	10278,
	14858,
	9960,
	14484,
	14039,
	14487,
	14025,
	14499,
	13941,
	14524,
	13740,
	14574,
	13468,
	14654,
	13106,
	14743,
	12678,
	14818,
	12344,
	14867,
	11893,
	14889,
	11509,
	14893,
	11180,
	14881,
	10751,
	14852,
	10428,
	14812,
	10128,
	14765,
	9754,
	14712,
	9466,
	14764,
	13480,
	14764,
	13475,
	14766,
	13440,
	14766,
	13347,
	14769,
	13070,
	14786,
	12713,
	14816,
	12387,
	14844,
	11957,
	14860,
	11549,
	14868,
	11215,
	14855,
	10751,
	14825,
	10403,
	14782,
	10044,
	14729,
	9651,
	14666,
	9352,
	14599,
	9029,
	14967,
	12835,
	14966,
	12831,
	14963,
	12804,
	14954,
	12723,
	14936,
	12564,
	14917,
	12347,
	14900,
	11958,
	14886,
	11569,
	14878,
	11247,
	14859,
	10765,
	14828,
	10401,
	14784,
	10011,
	14727,
	9600,
	14660,
	9289,
	14586,
	8893,
	14508,
	8533,
	15111,
	12234,
	15110,
	12234,
	15104,
	12216,
	15092,
	12156,
	15067,
	12010,
	15028,
	11776,
	14981,
	11500,
	14942,
	11205,
	14902,
	10752,
	14861,
	10393,
	14812,
	9991,
	14752,
	9570,
	14682,
	9252,
	14603,
	8808,
	14519,
	8445,
	14431,
	8145,
	15209,
	11449,
	15208,
	11451,
	15202,
	11451,
	15190,
	11438,
	15163,
	11384,
	15117,
	11274,
	15055,
	10979,
	14994,
	10648,
	14932,
	10343,
	14871,
	9936,
	14803,
	9532,
	14729,
	9218,
	14645,
	8742,
	14556,
	8381,
	14461,
	8020,
	14365,
	7603,
	15273,
	10603,
	15272,
	10607,
	15267,
	10619,
	15256,
	10631,
	15231,
	10614,
	15182,
	10535,
	15118,
	10389,
	15042,
	10167,
	14963,
	9787,
	14883,
	9447,
	14800,
	9115,
	14710,
	8665,
	14615,
	8318,
	14514,
	7911,
	14411,
	7507,
	14279,
	7198,
	15314,
	9675,
	15313,
	9683,
	15309,
	9712,
	15298,
	9759,
	15277,
	9797,
	15229,
	9773,
	15166,
	9668,
	15084,
	9487,
	14995,
	9274,
	14898,
	8910,
	14800,
	8539,
	14697,
	8234,
	14590,
	7790,
	14479,
	7409,
	14367,
	7067,
	14178,
	6621,
	15337,
	8619,
	15337,
	8631,
	15333,
	8677,
	15325,
	8769,
	15305,
	8871,
	15264,
	8940,
	15202,
	8909,
	15119,
	8775,
	15022,
	8565,
	14916,
	8328,
	14804,
	8009,
	14688,
	7614,
	14569,
	7287,
	14448,
	6888,
	14321,
	6483,
	14088,
	6171,
	15350,
	7402,
	15350,
	7419,
	15347,
	7480,
	15340,
	7613,
	15322,
	7804,
	15287,
	7973,
	15229,
	8057,
	15148,
	8012,
	15046,
	7846,
	14933,
	7611,
	14810,
	7357,
	14682,
	7069,
	14552,
	6656,
	14421,
	6316,
	14251,
	5948,
	14007,
	5528,
	15356,
	5942,
	15356,
	5977,
	15353,
	6119,
	15348,
	6294,
	15332,
	6551,
	15302,
	6824,
	15249,
	7044,
	15171,
	7122,
	15070,
	7050,
	14949,
	6861,
	14818,
	6611,
	14679,
	6349,
	14538,
	6067,
	14398,
	5651,
	14189,
	5311,
	13935,
	4958,
	15359,
	4123,
	15359,
	4153,
	15356,
	4296,
	15353,
	4646,
	15338,
	5160,
	15311,
	5508,
	15263,
	5829,
	15188,
	6042,
	15088,
	6094,
	14966,
	6001,
	14826,
	5796,
	14678,
	5543,
	14527,
	5287,
	14377,
	4985,
	14133,
	4586,
	13869,
	4257,
	15360,
	1563,
	15360,
	1642,
	15358,
	2076,
	15354,
	2636,
	15341,
	3350,
	15317,
	4019,
	15273,
	4429,
	15203,
	4732,
	15105,
	4911,
	14981,
	4932,
	14836,
	4818,
	14679,
	4621,
	14517,
	4386,
	14359,
	4156,
	14083,
	3795,
	13808,
	3437,
	15360,
	122,
	15360,
	137,
	15358,
	285,
	15355,
	636,
	15344,
	1274,
	15322,
	2177,
	15281,
	2765,
	15215,
	3223,
	15120,
	3451,
	14995,
	3569,
	14846,
	3567,
	14681,
	3466,
	14511,
	3305,
	14344,
	3121,
	14037,
	2800,
	13753,
	2467,
	15360,
	0,
	15360,
	1,
	15359,
	21,
	15355,
	89,
	15346,
	253,
	15325,
	479,
	15287,
	796,
	15225,
	1148,
	15133,
	1492,
	15008,
	1749,
	14856,
	1882,
	14685,
	1886,
	14506,
	1783,
	14324,
	1608,
	13996,
	1398,
	13702,
	1183
]), ri = null;
function ii() {
	return ri === null && (ri = new O(ni, 16, 16, o, N), ri.name = "DFG_LUT", ri.minFilter = B, ri.magFilter = B, ri.wrapS = de, ri.wrapT = de, ri.generateMipmaps = !1, ri.needsUpdate = !0), ri;
}
var ai = class {
	constructor(e = {}) {
		let { canvas: n = ae(), context: r = null, depth: i = !0, stencil: a = !1, alpha: o = !1, antialias: c = !1, premultipliedAlpha: l = !0, preserveDrawingBuffer: u = !1, powerPreference: d = "default", failIfMajorPerformanceCaveat: f = !1, reversedDepthBuffer: p = !1, outputBufferType: m = pe } = e;
		this.isWebGLRenderer = !0;
		let h;
		if (r !== null) {
			if (typeof WebGLRenderingContext < "u" && r instanceof WebGLRenderingContext) throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
			h = r.getContextAttributes().alpha;
		} else h = o;
		let _ = m, v = /* @__PURE__ */ new Set([
			ne,
			y,
			g
		]), x = /* @__PURE__ */ new Set([
			pe,
			se,
			ce,
			Se,
			be,
			De
		]), S = /* @__PURE__ */ new Uint32Array(4), C = /* @__PURE__ */ new Int32Array(4), w = new H(), T = null, D = null, O = [], k = [], A = null;
		this.domElement = n, this.debug = {
			checkShaderErrors: !0,
			diagnostics: { keywords: !1 },
			onShaderError: null
		}, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
		let M = this, te = !1, P = null, ie = null, I = null, oe = null;
		this._outputColorSpace = t;
		let le = 0, L = 0, R = null, de = -1, fe = null, me = new xe(), he = new xe(), ge = null, _e = new z(0), ve = 0, ye = n.width, B = n.height, V = 1, Ce = null, we = null, Te = new xe(0, 0, ye, B), Ee = new xe(0, 0, ye, B), ke = !1, U = new j(), W = !1, Ae = !1, je = new Ie(), Me = new H(), Ne = new xe(), Pe = {
			background: null,
			fog: null,
			environment: null,
			overrideMaterial: null,
			isScene: !0
		}, Fe = !1;
		function Le() {
			return R === null ? V : 1;
		}
		let G = r;
		function Re(e, t) {
			return n.getContext(e, t);
		}
		let K, ze, q, Be, J, Y, Ve, He, Ue, X, Z, Ke, qe, Je, Ye, tt, nt, rt, it, at, ot, st, ct;
		try {
			let e = {
				alpha: !0,
				depth: i,
				stencil: a,
				antialias: c,
				premultipliedAlpha: l,
				preserveDrawingBuffer: u,
				powerPreference: d,
				failIfMajorPerformanceCaveat: f
			};
			if ("setAttribute" in n && n.setAttribute("data-engine", "three.js r186"), n.addEventListener("webglcontextlost", ut, !1), n.addEventListener("webglcontextrestored", dt, !1), n.addEventListener("webglcontextcreationerror", ft, !1), G === null) {
				let t = "webgl2";
				if (G = Re(t, e), G === null) throw Re(t) ? Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.") : Error("THREE.WebGLRenderer: Error creating WebGL context.");
			}
			lt();
		} catch (e) {
			throw n.removeEventListener("webglcontextlost", ut, !1), n.removeEventListener("webglcontextrestored", dt, !1), n.removeEventListener("webglcontextcreationerror", ft, !1), E("WebGLRenderer: " + e.message), e;
		}
		function lt() {
			K = new Ct(G), K.init(), ot = new qr(G, K), ze = new $e(G, K, e, ot), q = new Gr(G, K), ze.reversedDepthBuffer && p && q.buffers.depth.setReversed(!0), ie = G.createFramebuffer(), I = G.createFramebuffer(), oe = G.createFramebuffer(), Be = new Et(G), J = new Tr(), Y = new Kr(G, K, q, J, ze, ot, Be), Ve = new St(M), He = new Ge(G), st = new Ze(G, He), Ue = new wt(G, He, Be, st), X = new Ot(G, Ue, He, st, Be), rt = new Dt(G, ze, Y), Ye = new et(J), Z = new wr(M, Ve, K, ze, st, Ye), Ke = new ei(M, J), qe = new kr(), Je = new Ir(K), nt = new Xe(M, Ve, q, X, h, l), tt = new Wr(M, X, ze), ct = new ti(G, Be, ze, q), it = new Qe(G, K, Be), at = new Tt(G, K, Be), Be.programs = Z.programs, M.capabilities = ze, M.extensions = K, M.properties = J, M.renderLists = qe, M.shadowMap = tt, M.state = q, M.info = Be;
		}
		_ !== 1009 && (A = new At(_, n.width, n.height, c, i, a));
		let Q = new Zr(M, G);
		this.xr = Q, this.getContext = function() {
			return G;
		}, this.getContextAttributes = function() {
			return G.getContextAttributes();
		}, this.forceContextLoss = function() {
			let e = K.get("WEBGL_lose_context");
			e && e.loseContext();
		}, this.forceContextRestore = function() {
			let e = K.get("WEBGL_lose_context");
			e && e.restoreContext();
		}, this.getPixelRatio = function() {
			return V;
		}, this.setPixelRatio = function(e) {
			e !== void 0 && (V = e, this.setSize(ye, B, !1));
		}, this.getSize = function(e) {
			return e.set(ye, B);
		}, this.setSize = function(e, t, r = !0) {
			if (Q.isPresenting) {
				b("WebGLRenderer: Can't change size while VR device is presenting.");
				return;
			}
			ye = e, B = t, n.width = Math.floor(e * V), n.height = Math.floor(t * V), r === !0 && (n.style.width = e + "px", n.style.height = t + "px"), A !== null && A.setSize(n.width, n.height), this.setViewport(0, 0, e, t);
		}, this.getDrawingBufferSize = function(e) {
			return e.set(ye * V, B * V).floor();
		}, this.setDrawingBufferSize = function(e, t, r) {
			ye = e, B = t, V = r, n.width = Math.floor(e * r), n.height = Math.floor(t * r), this.setViewport(0, 0, e, t);
		}, this.setEffects = function(e) {
			if (_ === 1009) {
				E("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
				return;
			}
			if (e) {
				for (let t = 0; t < e.length; t++) if (e[t].isOutputPass === !0) {
					b("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
					break;
				}
			}
			A.setEffects(e || []);
		}, this.getCurrentViewport = function(e) {
			return e.copy(me);
		}, this.getViewport = function(e) {
			return e.copy(Te);
		}, this.setViewport = function(e, t, n, r) {
			e.isVector4 ? Te.set(e.x, e.y, e.z, e.w) : Te.set(e, t, n, r), q.viewport(me.copy(Te).multiplyScalar(V).round());
		}, this.getScissor = function(e) {
			return e.copy(Ee);
		}, this.setScissor = function(e, t, n, r) {
			e.isVector4 ? Ee.set(e.x, e.y, e.z, e.w) : Ee.set(e, t, n, r), q.scissor(he.copy(Ee).multiplyScalar(V).round());
		}, this.getScissorTest = function() {
			return ke;
		}, this.setScissorTest = function(e) {
			q.setScissorTest(ke = e);
		}, this.setOpaqueSort = function(e) {
			Ce = e;
		}, this.setTransparentSort = function(e) {
			we = e;
		}, this.getClearColor = function(e) {
			return e.copy(nt.getClearColor());
		}, this.setClearColor = function() {
			nt.setClearColor(...arguments);
		}, this.getClearAlpha = function() {
			return nt.getClearAlpha();
		}, this.setClearAlpha = function() {
			nt.setClearAlpha(...arguments);
		}, this.clear = function(e = !0, t = !0, n = !0) {
			let r = 0;
			if (e) {
				let e = !1;
				if (R !== null) {
					let t = R.texture.format;
					e = v.has(t);
				}
				if (e) {
					let e = R.texture.type, t = x.has(e), n = nt.getClearColor(), r = nt.getClearAlpha(), i = n.r, a = n.g, o = n.b;
					t ? (S[0] = i, S[1] = a, S[2] = o, S[3] = r, G.clearBufferuiv(G.COLOR, 0, S)) : (C[0] = i, C[1] = a, C[2] = o, C[3] = r, G.clearBufferiv(G.COLOR, 0, C));
				} else r |= G.COLOR_BUFFER_BIT;
			}
			t && (r |= G.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), n && (r |= G.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), r !== 0 && G.clear(r);
		}, this.clearColor = function() {
			this.clear(!0, !1, !1);
		}, this.clearDepth = function() {
			this.clear(!1, !0, !1);
		}, this.clearStencil = function() {
			this.clear(!1, !1, !0);
		}, this.setNodesHandler = function(e) {
			e.setRenderer(this), P = e;
		}, this.dispose = function() {
			n.removeEventListener("webglcontextlost", ut, !1), n.removeEventListener("webglcontextrestored", dt, !1), n.removeEventListener("webglcontextcreationerror", ft, !1), nt.dispose(), qe.dispose(), Je.dispose(), J.dispose(), Ve.dispose(), X.dispose(), st.dispose(), ct.dispose(), Z.dispose(), Q.dispose(), Q.removeEventListener("sessionstart", yt), Q.removeEventListener("sessionend", bt), xt.stop();
		};
		function ut(e) {
			e.preventDefault(), ee("WebGLRenderer: Context Lost."), te = !0;
		}
		function dt() {
			ee("WebGLRenderer: Context Restored."), te = !1;
			let e = Be.autoReset, t = tt.enabled, n = tt.autoUpdate, r = tt.needsUpdate, i = tt.type;
			lt(), Be.autoReset = e, tt.enabled = t, tt.autoUpdate = n, tt.needsUpdate = r, tt.type = i;
		}
		function ft(e) {
			E("WebGLRenderer: A WebGL context could not be created. Reason: ", e.statusMessage);
		}
		function pt(e) {
			let t = e.target;
			t.removeEventListener("dispose", pt), mt(t);
		}
		function mt(e) {
			ht(e), J.remove(e);
		}
		function ht(e) {
			let t = J.get(e).programs;
			t !== void 0 && (t.forEach(function(e) {
				Z.releaseProgram(e);
			}), e.isShaderMaterial && Z.releaseShaderCache(e));
		}
		this.renderBufferDirect = function(e, t, n, r, i, a) {
			t === null && (t = Pe);
			let o = i.isMesh && i.matrixWorld.determinantAffine() < 0, s = zt(e, t, n, r, i);
			q.setMaterial(r, o);
			let c = n.index, l = 1;
			if (r.wireframe === !0) {
				if (c = Ue.getWireframeAttribute(n), c === void 0) return;
				l = 2;
			}
			let u = n.drawRange, d = n.attributes.position, f = u.start * l, p = (u.start + u.count) * l;
			a !== null && (f = Math.max(f, a.start * l), p = Math.min(p, (a.start + a.count) * l)), c === null ? d != null && (f = Math.max(f, 0), p = Math.min(p, d.count)) : (f = Math.max(f, 0), p = Math.min(p, c.count));
			let m = p - f;
			if (m < 0 || m === Infinity) return;
			st.setup(i, r, s, n, c);
			let h, g = it;
			if (c !== null && (h = He.get(c), g = at, g.setIndex(h)), i.isMesh) r.wireframe === !0 ? (q.setLineWidth(r.wireframeLinewidth * Le()), g.setMode(G.LINES)) : g.setMode(G.TRIANGLES);
			else if (i.isLine) {
				let e = r.linewidth;
				e === void 0 && (e = 1), q.setLineWidth(e * Le()), i.isLineSegments ? g.setMode(G.LINES) : i.isLineLoop ? g.setMode(G.LINE_LOOP) : g.setMode(G.LINE_STRIP);
			} else i.isPoints ? g.setMode(G.POINTS) : i.isSprite && g.setMode(G.TRIANGLES);
			if (i.isBatchedMesh) {
				if (K.get("WEBGL_multi_draw")) g.renderMultiDraw(i._multiDrawStarts, i._multiDrawCounts, i._multiDrawCount);
				else {
					let e = i._multiDrawStarts, t = i._multiDrawCounts, n = i._multiDrawCount, a = c ? He.get(c).bytesPerElement : 1, o = J.get(r).currentProgram.getUniforms();
					for (let r = 0; r < n; r++) o.setValue(G, "_gl_DrawID", r), g.render(e[r] / a, t[r]);
				}
			} else if (i.isInstancedMesh) g.renderInstances(f, m, i.count);
			else if (n.isInstancedBufferGeometry) {
				let e = n._maxInstanceCount === void 0 ? Infinity : n._maxInstanceCount, t = Math.min(n.instanceCount, e);
				g.renderInstances(f, m, t);
			} else g.render(f, m);
		};
		function gt(e, t, n, r) {
			P !== null && e.isNodeMaterial && P.setObject(r, e), W === !0 && Ye.setState(e, n, !1), e.transparent === !0 && e.side === 2 && e.forceSinglePass === !1 ? (e.side = 1, e.needsUpdate = !0, Ft(e, t, r), e.side = 0, e.needsUpdate = !0, Ft(e, t, r), e.side = 2) : Ft(e, t, r);
		}
		this.compile = function(e, t, n = null) {
			n === null && (n = e), P !== null && P.renderStart(e, t, n), D = Je.get(n), D.init(t), k.push(D), n.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (D.pushLight(e), e.castShadow && D.pushShadow(e));
			}), e !== n && e.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (D.pushLight(e), e.castShadow && D.pushShadow(e));
			}), D.setupLights(), P !== null && P.updateLights(D.state.lightsArray), Ae = this.localClippingEnabled, W = Ye.init(this.clippingPlanes, Ae), W === !0 && Ye.setGlobalState(this.clippingPlanes, t), P !== null && tt.render(D.state.shadowsArray, n, t);
			let r = /* @__PURE__ */ new Set();
			return e.traverse(function(e) {
				if (!(e.isMesh || e.isPoints || e.isLine || e.isSprite)) return;
				let i = e.material;
				if (i) {
					if (Array.isArray(i)) for (let a = 0; a < i.length; a++) {
						let o = i[a];
						gt(o, n, t, e), r.add(o);
					}
					else gt(i, n, t, e), r.add(i);
				}
			}), D = k.pop(), P !== null && P.renderEnd(), r;
		}, this.compileAsync = function(e, t, n = null) {
			let r = this.compile(e, t, n);
			return new Promise((t) => {
				function n() {
					if (r.forEach(function(e) {
						let t = J.get(e).currentProgram;
						(t === void 0 || t.isReady()) && r.delete(e);
					}), r.size === 0) {
						t(e);
						return;
					}
					setTimeout(n, 10);
				}
				K.get("KHR_parallel_shader_compile") === null ? setTimeout(n, 10) : n();
			});
		};
		let _t = null;
		function vt(e) {
			_t && _t(e);
		}
		function yt() {
			xt.stop();
		}
		function bt() {
			xt.start();
		}
		let xt = new We();
		xt.setAnimationLoop(vt), typeof self < "u" && xt.setContext(self), this.setAnimationLoop = function(e) {
			_t = e, Q.setAnimationLoop(e), e === null ? xt.stop() : xt.start();
		}, Q.addEventListener("sessionstart", yt), Q.addEventListener("sessionend", bt), this.render = function(e, t) {
			if (t !== void 0 && t.isCamera !== !0) {
				E("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
				return;
			}
			if (te === !0) return;
			P !== null && P.renderStart(e, t);
			let n = Q.enabled === !0 && Q.isPresenting === !0, r = A !== null && (R === null || n) && A.begin(M, R);
			if (e.matrixWorldAutoUpdate === !0 && e.updateMatrixWorld(), t.parent === null && t.matrixWorldAutoUpdate === !0 && t.updateMatrixWorld(), Q.enabled === !0 && Q.isPresenting === !0 && (A === null || A.isCompositing() === !1) && (Q.cameraAutoUpdate === !0 && Q.updateCamera(t), t = Q.getCamera()), e.isScene === !0 && e.onBeforeRender(M, e, t, R), D = Je.get(e, k.length), D.init(t), D.state.textureUnits = Y.getTextureUnits(), k.push(D), je.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), U.setFromProjectionMatrix(je, ue, t.reversedDepth), Ae = this.localClippingEnabled, W = Ye.init(this.clippingPlanes, Ae), T = qe.get(e, O.length), T.init(), O.push(T), Q.enabled === !0 && Q.isPresenting === !0) {
				let e = M.xr.getDepthSensingMesh();
				e !== null && kt(e, t, -Infinity, M.sortObjects);
			}
			kt(e, t, 0, M.sortObjects), T.finish(), P !== null && P.updateLights(D.state.lightsArray), M.sortObjects === !0 && T.sort(Ce, we), Fe = Q.enabled === !1 || Q.isPresenting === !1 || Q.hasDepthSensing() === !1, Fe && nt.addToRenderList(T, e), this.info.render.frame++, this.info.autoReset === !0 && this.info.reset(), W === !0 && Ye.beginShadows();
			let i = D.state.shadowsArray;
			if (tt.render(i, e, t), W === !0 && Ye.endShadows(), (r && A.hasRenderPass()) === !1) {
				let n = T.opaque, r = T.transmissive;
				if (D.setupLights(), t.isArrayCamera) {
					let i = t.cameras;
					if (r.length > 0) for (let t = 0, a = i.length; t < a; t++) {
						let a = i[t];
						Mt(n, r, e, a);
					}
					Fe && nt.render(e);
					for (let t = 0, n = i.length; t < n; t++) {
						let n = i[t];
						jt(T, e, n, n.viewport);
					}
				} else r.length > 0 && Mt(n, r, e, t), Fe && nt.render(e), jt(T, e, t);
			}
			R !== null && L === 0 && (Y.updateMultisampleRenderTarget(R), Y.updateRenderTargetMipmap(R)), r && A.end(M), e.isScene === !0 && e.onAfterRender(M, e, t), st.resetDefaultState(), de = -1, fe = null, k.pop(), k.length > 0 ? (D = k[k.length - 1], Y.setTextureUnits(D.state.textureUnits), W === !0 && Ye.setGlobalState(M.clippingPlanes, D.state.camera)) : D = null, O.pop(), T = O.length > 0 ? O[O.length - 1] : null, P !== null && P.renderEnd();
		};
		function kt(e, t, n, r) {
			if (e.visible === !1) return;
			if (e.layers.test(t.layers)) {
				if (e.isGroup) n = e.renderOrder;
				else if (e.isLOD) e.autoUpdate === !0 && e.update(t);
				else if (e.isLightProbeGrid) D.pushLightProbeGrid(e);
				else if (e.isLight) D.pushLight(e), e.castShadow && D.pushShadow(e);
				else if (e.isSprite) {
					if (!e.frustumCulled || e.intersectsFrustum(U)) {
						r && Ne.setFromMatrixPosition(e.matrixWorld).applyMatrix4(je);
						let i = X.update(e), a = e.material;
						a.visible && T.push(e, i, a, n, Ne.z, null, t);
					}
				} else if ((e.isMesh || e.isLine || e.isPoints) && (!e.frustumCulled || e.intersectsFrustum(U))) {
					let i = X.update(e), a = e.material;
					if (r && (e.boundingSphere === void 0 ? (i.boundingSphere === null && i.computeBoundingSphere(), Ne.copy(i.boundingSphere.center)) : (e.boundingSphere === null && e.computeBoundingSphere(), Ne.copy(e.boundingSphere.center)), Ne.applyMatrix4(e.matrixWorld).applyMatrix4(je)), Array.isArray(a)) {
						let r = i.groups;
						for (let o = 0, s = r.length; o < s; o++) {
							let s = r[o], c = a[s.materialIndex];
							c && c.visible && T.push(e, i, c, n, Ne.z, s, t);
						}
					} else a.visible && T.push(e, i, a, n, Ne.z, null, t);
				}
			}
			let i = e.children;
			for (let e = 0, a = i.length; e < a; e++) kt(i[e], t, n, r);
		}
		function jt(e, t, n, r) {
			let { opaque: i, transmissive: a, transparent: o } = e;
			D.setupLightsView(n), W === !0 && Ye.setGlobalState(M.clippingPlanes, n), r && q.viewport(me.copy(r)), i.length > 0 && Nt(i, t, n), a.length > 0 && Nt(a, t, n), o.length > 0 && Nt(o, t, n), q.buffers.depth.setTest(!0), q.buffers.depth.setMask(!0), q.buffers.color.setMask(!0), q.setPolygonOffset(!1);
		}
		function Mt(e, t, n, r) {
			if ((n.isScene === !0 ? n.overrideMaterial : null) !== null) return;
			if (D.state.transmissionRenderTarget[r.id] === void 0) {
				let e = K.has("EXT_color_buffer_half_float") || K.has("EXT_color_buffer_float");
				D.state.transmissionRenderTarget[r.id] = new re(1, 1, {
					generateMipmaps: !0,
					type: e ? N : pe,
					minFilter: Oe,
					samples: Math.max(4, ze.samples),
					stencilBuffer: a,
					resolveDepthBuffer: !1,
					resolveStencilBuffer: !1,
					storeMultisampledDepthBuffer: !1,
					storeMultisampledStencilBuffer: !1,
					colorSpace: F.workingColorSpace
				});
			}
			let i = D.state.transmissionRenderTarget[r.id], o = r.viewport || me;
			i.setSize(o.z * M.transmissionResolutionScale, o.w * M.transmissionResolutionScale);
			let s = M.getRenderTarget(), c = M.getActiveCubeFace(), l = M.getActiveMipmapLevel();
			M.setRenderTarget(i), M.getClearColor(_e), ve = M.getClearAlpha(), ve < 1 && M.setClearColor(16777215, .5), M.clear(), Fe && nt.render(n);
			let u = M.toneMapping;
			M.toneMapping = 0;
			let d = r.viewport;
			if (r.viewport !== void 0 && (r.viewport = void 0), D.setupLightsView(r), W === !0 && Ye.setGlobalState(M.clippingPlanes, r), Nt(e, n, r), Y.updateMultisampleRenderTarget(i), Y.updateRenderTargetMipmap(i), K.has("WEBGL_multisampled_render_to_texture") === !1) {
				let e = !1;
				for (let i = 0, a = t.length; i < a; i++) {
					let { object: a, geometry: o, material: s, group: c } = t[i];
					if (s.side === 2 && a.layers.test(r.layers)) {
						let t = s.side;
						s.side = 1, s.needsUpdate = !0, Pt(a, n, r, o, s, c), s.side = t, s.needsUpdate = !0, e = !0;
					}
				}
				e === !0 && (Y.updateMultisampleRenderTarget(i), Y.updateRenderTargetMipmap(i));
			}
			M.setRenderTarget(s, c, l), M.setClearColor(_e, ve), d !== void 0 && (r.viewport = d), M.toneMapping = u;
		}
		function Nt(e, t, n) {
			let r = t.isScene === !0 ? t.overrideMaterial : null;
			for (let i = 0, a = e.length; i < a; i++) {
				let a = e[i], { object: o, geometry: s, group: c } = a, l = a.material;
				l.allowOverride === !0 && r !== null && (l = r), o.layers.test(n.layers) && Pt(o, t, n, s, l, c);
			}
		}
		function Pt(e, t, n, r, i, a) {
			P !== null && i.isNodeMaterial && P.setObject(e, i), e.onBeforeRender(M, t, n, r, i, a), e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, e.matrixWorld), e.normalMatrix.getNormalMatrix(e.modelViewMatrix), i.onBeforeRender(M, t, n, r, e, a), i.transparent === !0 && i.side === 2 && i.forceSinglePass === !1 ? (i.side = 1, i.needsUpdate = !0, M.renderBufferDirect(n, t, r, i, e, a), i.side = 0, i.needsUpdate = !0, M.renderBufferDirect(n, t, r, i, e, a), i.side = 2) : M.renderBufferDirect(n, t, r, i, e, a), e.onAfterRender(M, t, n, r, i, a);
		}
		function Ft(e, t, n) {
			t.isScene !== !0 && (t = Pe);
			let r = J.get(e), i = D.state.lights, a = D.state.shadowsArray, o = i.state.version, s = Z.getParameters(e, i.state, a, t, n, D.state.lightProbeGridArray), c = Z.getProgramCacheKey(s), l = r.programs;
			r.environment = e.isMeshStandardMaterial || e.isMeshLambertMaterial || e.isMeshPhongMaterial ? t.environment : null, r.fog = t.fog;
			let u = e.isMeshStandardMaterial || e.isMeshLambertMaterial && !e.envMap || e.isMeshPhongMaterial && !e.envMap;
			r.envMap = Ve.get(e.envMap || r.environment, u), r.envMapRotation = r.environment !== null && e.envMap === null ? t.environmentRotation : e.envMapRotation, l === void 0 && (e.addEventListener("dispose", pt), l = /* @__PURE__ */ new Map(), r.programs = l);
			let d = l.get(c);
			if (d !== void 0) {
				if (r.currentProgram === d && r.lightsStateVersion === o) return Lt(e, s), d;
			} else s.uniforms = Z.getUniforms(e), P !== null && e.isNodeMaterial && P.build(e, n, s), e.onBeforeCompile(s, M), d = Z.acquireProgram(s, c), l.set(c, d), r.uniforms = s.uniforms;
			let f = r.uniforms;
			return (!e.isShaderMaterial && !e.isRawShaderMaterial || e.clipping === !0) && (f.clippingPlanes = Ye.uniform), Lt(e, s), r.needsLights = Vt(e), r.lightsStateVersion = o, r.needsLights && (f.ambientLightColor.value = i.state.ambient, f.lightProbe.value = i.state.probe, f.sunLights.value = i.state.sun, f.sunLightShadows.value = i.state.sunShadow, f.directionalLights.value = i.state.directional, f.directionalLightShadows.value = i.state.directionalShadow, f.spotLights.value = i.state.spot, f.spotLightShadows.value = i.state.spotShadow, f.rectAreaLights.value = i.state.rectArea, f.ltc_1.value = i.state.rectAreaLTC1, f.ltc_2.value = i.state.rectAreaLTC2, f.pointLights.value = i.state.point, f.pointLightShadows.value = i.state.pointShadow, f.hemisphereLights.value = i.state.hemi, f.sunShadowMatrix.value = i.state.sunShadowMatrix, f.sunShadowCascade.value = i.state.sunShadowCascade, f.directionalShadowMatrix.value = i.state.directionalShadowMatrix, f.spotLightMatrix.value = i.state.spotLightMatrix, f.spotLightMap.value = i.state.spotLightMap, f.pointShadowMatrix.value = i.state.pointShadowMatrix), r.lightProbeGrid = D.state.lightProbeGridArray.length > 0, r.currentProgram = d, r.uniformsList = null, d;
		}
		function It(e) {
			if (e.uniformsList === null) {
				let t = e.currentProgram.getUniforms();
				e.uniformsList = Ln.seqWithValue(t.seq, e.uniforms);
			}
			return e.uniformsList;
		}
		function Lt(e, t) {
			let n = J.get(e);
			n.outputColorSpace = t.outputColorSpace, n.batching = t.batching, n.batchingColor = t.batchingColor, n.instancing = t.instancing, n.instancingColor = t.instancingColor, n.instancingMorph = t.instancingMorph, n.skinning = t.skinning, n.morphTargets = t.morphTargets, n.morphNormals = t.morphNormals, n.morphColors = t.morphColors, n.morphTargetsCount = t.morphTargetsCount, n.numClippingPlanes = t.numClippingPlanes, n.numIntersection = t.numClipIntersection, n.vertexAlphas = t.vertexAlphas, n.vertexTangents = t.vertexTangents, n.toneMapping = t.toneMapping;
		}
		function Rt(e, t) {
			if (e.length === 0) return null;
			if (e.length === 1) return e[0].texture === null ? null : e[0];
			w.setFromMatrixPosition(t.matrixWorld);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n.texture !== null && n.boundingBox.containsPoint(w)) return n;
			}
			return null;
		}
		function zt(e, t, n, r, i) {
			t.isScene !== !0 && (t = Pe), Y.resetTextureUnits();
			let a = t.fog, o = r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial ? t.environment : null, s = R === null ? M.outputColorSpace : R.isXRRenderTarget === !0 ? R.texture.colorSpace : F.workingColorSpace, c = r.isMeshStandardMaterial || r.isMeshLambertMaterial && !r.envMap || r.isMeshPhongMaterial && !r.envMap, l = Ve.get(r.envMap || o, c), u = r.vertexColors === !0 && !!n.attributes.color && n.attributes.color.itemSize === 4, d = !!n.attributes.tangent && (!!r.normalMap || r.anisotropy > 0), f = !!n.morphAttributes.position, p = !!n.morphAttributes.normal, m = !!n.morphAttributes.color, h = 0;
			r.toneMapped && (R === null || R.isXRRenderTarget === !0) && (h = M.toneMapping);
			let g = n.morphAttributes.position || n.morphAttributes.normal || n.morphAttributes.color, _ = g === void 0 ? 0 : g.length, v = J.get(r), y = D.state.lights;
			if (W === !0 && (Ae === !0 || e !== fe)) {
				let t = e === fe && r.id === de;
				Ye.setState(r, e, t);
			}
			let b = !1;
			r.version === v.__version ? v.needsLights && v.lightsStateVersion !== y.state.version ? b = !0 : v.outputColorSpace === s ? i.isBatchedMesh && v.batching === !1 || !i.isBatchedMesh && v.batching === !0 || i.isBatchedMesh && v.batchingColor === !0 && i._colorsTexture === null || i.isBatchedMesh && v.batchingColor === !1 && i._colorsTexture !== null || i.isInstancedMesh && v.instancing === !1 || !i.isInstancedMesh && v.instancing === !0 || i.isSkinnedMesh && v.skinning === !1 || !i.isSkinnedMesh && v.skinning === !0 || i.isInstancedMesh && v.instancingColor === !0 && i.instanceColor === null || i.isInstancedMesh && v.instancingColor === !1 && i.instanceColor !== null || i.isInstancedMesh && v.instancingMorph === !0 && i.morphTexture === null || i.isInstancedMesh && v.instancingMorph === !1 && i.morphTexture !== null ? b = !0 : v.envMap === l ? r.fog === !0 && v.fog !== a || v.numClippingPlanes !== void 0 && (v.numClippingPlanes !== Ye.numPlanes || v.numIntersection !== Ye.numIntersection) ? b = !0 : v.vertexAlphas === u && v.vertexTangents === d && v.morphTargets === f && v.morphNormals === p && v.morphColors === m && v.toneMapping === h && v.morphTargetsCount === _ ? !!v.lightProbeGrid != D.state.lightProbeGridArray.length > 0 && (b = !0) : b = !0 : b = !0 : b = !0 : (b = !0, v.__version = r.version);
			let x = v.currentProgram;
			b === !0 && (x = Ft(r, t, i), P && r.isNodeMaterial && P.onUpdateProgram(r, x, v));
			let S = !1, C = !1, w = !1, T = x.getUniforms(), E = v.uniforms;
			if (q.useProgram(x.program) && (S = !0, C = !0, w = !0), r.id !== de && (de = r.id, C = !0), v.needsLights) {
				let e = Rt(D.state.lightProbeGridArray, i);
				v.lightProbeGrid !== e && (v.lightProbeGrid = e, C = !0);
			}
			if (S || fe !== e) {
				q.buffers.depth.getReversed() && e.reversedDepth !== !0 && (e._reversedDepth = !0, e.updateProjectionMatrix()), T.setValue(G, "projectionMatrix", e.projectionMatrix), T.setValue(G, "viewMatrix", e.matrixWorldInverse);
				let t = T.map.cameraPosition;
				t !== void 0 && t.setValue(G, Me.setFromMatrixPosition(e.matrixWorld)), ze.logarithmicDepthBuffer && T.setValue(G, "logDepthBufFC", 2 / (Math.log(e.far + 1) / Math.LN2)), (r.isMeshPhongMaterial || r.isMeshToonMaterial || r.isMeshLambertMaterial || r.isMeshBasicMaterial || r.isMeshStandardMaterial || r.isShaderMaterial) && T.setValue(G, "isOrthographic", e.isOrthographicCamera === !0), fe !== e && (fe = e, C = !0, w = !0);
			}
			if (v.needsLights && (y.state.sunShadowMap.length > 0 && T.setValue(G, "sunShadowMap", y.state.sunShadowMap, Y), y.state.directionalShadowMap.length > 0 && T.setValue(G, "directionalShadowMap", y.state.directionalShadowMap, Y), y.state.spotShadowMap.length > 0 && T.setValue(G, "spotShadowMap", y.state.spotShadowMap, Y), y.state.pointShadowMap.length > 0 && T.setValue(G, "pointShadowMap", y.state.pointShadowMap, Y)), i.isSkinnedMesh) {
				T.setOptional(G, i, "bindMatrix"), T.setOptional(G, i, "bindMatrixInverse");
				let e = i.skeleton;
				e && (e.boneTexture === null && e.computeBoneTexture(), T.setValue(G, "boneTexture", e.boneTexture, Y));
			}
			i.isBatchedMesh && (T.setOptional(G, i, "batchingTexture"), T.setValue(G, "batchingTexture", i._matricesTexture, Y), T.setOptional(G, i, "batchingIdTexture"), T.setValue(G, "batchingIdTexture", i._indirectTexture, Y), T.setOptional(G, i, "batchingColorTexture"), i._colorsTexture !== null && T.setValue(G, "batchingColorTexture", i._colorsTexture, Y));
			let O = n.morphAttributes;
			if ((O.position !== void 0 || O.normal !== void 0 || O.color !== void 0) && rt.update(i, n, x), (C || v.receiveShadow !== i.receiveShadow) && (v.receiveShadow = i.receiveShadow, T.setValue(G, "receiveShadow", i.receiveShadow)), (r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial) && r.envMap === null && t.environment !== null && (E.envMapIntensity.value = t.environmentIntensity), E.dfgLUT !== void 0 && (E.dfgLUT.value = ii()), C) {
				if (T.setValue(G, "toneMappingExposure", M.toneMappingExposure), v.needsLights && Bt(E, w), a && r.fog === !0 && Ke.refreshFogUniforms(E, a), Ke.refreshMaterialUniforms(E, r, V, B, D.state.transmissionRenderTarget[e.id]), v.needsLights && v.lightProbeGrid) {
					let e = v.lightProbeGrid;
					E.probesSH.value = e.texture, E.probesMin.value.copy(e.boundingBox.min), E.probesMax.value.copy(e.boundingBox.max), E.probesResolution.value.copy(e.resolution);
				}
				Ln.upload(G, It(v), E, Y);
			}
			if (r.isShaderMaterial && r.uniformsNeedUpdate === !0 && (Ln.upload(G, It(v), E, Y), r.uniformsNeedUpdate = !1), r.isSpriteMaterial && T.setValue(G, "center", i.center), T.setValue(G, "modelViewMatrix", i.modelViewMatrix), T.setValue(G, "normalMatrix", i.normalMatrix), T.setValue(G, "modelMatrix", i.matrixWorld), r.uniformsGroups !== void 0) {
				let e = r.uniformsGroups;
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					ct.update(n, x), ct.bind(n, x);
				}
			}
			return x;
		}
		function Bt(e, t) {
			e.ambientLightColor.needsUpdate = t, e.lightProbe.needsUpdate = t, e.sunLights.needsUpdate = t, e.sunLightShadows.needsUpdate = t, e.directionalLights.needsUpdate = t, e.directionalLightShadows.needsUpdate = t, e.pointLights.needsUpdate = t, e.pointLightShadows.needsUpdate = t, e.spotLights.needsUpdate = t, e.spotLightShadows.needsUpdate = t, e.rectAreaLights.needsUpdate = t, e.hemisphereLights.needsUpdate = t;
		}
		function Vt(e) {
			return e.isMeshLambertMaterial || e.isMeshToonMaterial || e.isMeshPhongMaterial || e.isMeshStandardMaterial || e.isShadowMaterial || e.isShaderMaterial && e.lights === !0;
		}
		this.getActiveCubeFace = function() {
			return le;
		}, this.getActiveMipmapLevel = function() {
			return L;
		}, this.getRenderTarget = function() {
			return R;
		}, this.setRenderTargetTextures = function(e, t, n) {
			let r = J.get(e);
			r.__autoAllocateDepthBuffer = e.resolveDepthBuffer === !1, r.__autoAllocateDepthBuffer === !1 && (r.__useRenderToTexture = !1), J.get(e.texture).__webglTexture = t, J.get(e.depthTexture).__webglTexture = r.__autoAllocateDepthBuffer ? void 0 : n, r.__hasExternalTextures = !0;
		}, this.setRenderTargetFramebuffer = function(e, t) {
			let n = J.get(e);
			n.__webglFramebuffer = t, n.__useDefaultFramebuffer = t === void 0;
		}, this.setRenderTarget = function(e, t = 0, n = 0) {
			R = e, le = t, L = n;
			let r = null, i = !1, a = !1;
			if (e) {
				let o = J.get(e);
				if (o.__useDefaultFramebuffer !== void 0) {
					q.bindFramebuffer(G.FRAMEBUFFER, o.__webglFramebuffer), me.copy(e.viewport), he.copy(e.scissor), ge = e.scissorTest, q.viewport(me), q.scissor(he), q.setScissorTest(ge), de = -1;
					return;
				}
				if (o.__webglFramebuffer === void 0) Y.setupRenderTarget(e);
				else if (o.__hasExternalTextures) Y.rebindTextures(e, J.get(e.texture).__webglTexture, J.get(e.depthTexture).__webglTexture);
				else if (e.depthBuffer) {
					let t = e.depthTexture;
					if (o.__boundDepthTexture !== t) {
						if (t !== null && J.has(t) && (e.width !== t.image.width || e.height !== t.image.height)) throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");
						Y.setupDepthRenderbuffer(e);
					}
				}
				let s = e.texture;
				(s.isData3DTexture || s.isDataArrayTexture || s.isCompressedArrayTexture) && (a = !0);
				let c = J.get(e).__webglFramebuffer;
				e.isWebGLCubeRenderTarget ? (r = Array.isArray(c[t]) ? c[t][n] : c[t], i = !0) : r = e.samples > 0 && Y.useMultisampledRTT(e) === !1 ? J.get(e).__webglMultisampledFramebuffer : Array.isArray(c) ? c[n] : c, me.copy(e.viewport), he.copy(e.scissor), ge = e.scissorTest;
			} else me.copy(Te).multiplyScalar(V).floor(), he.copy(Ee).multiplyScalar(V).floor(), ge = ke;
			if (n !== 0 && (r = ie), q.bindFramebuffer(G.FRAMEBUFFER, r) && q.drawBuffers(e, r), q.viewport(me), q.scissor(he), q.setScissorTest(ge), i) {
				let r = J.get(e.texture);
				G.framebufferTexture2D(G.FRAMEBUFFER, G.COLOR_ATTACHMENT0, G.TEXTURE_CUBE_MAP_POSITIVE_X + t, r.__webglTexture, n);
			} else if (a) {
				let r = t;
				for (let t = 0; t < e.textures.length; t++) {
					let i = J.get(e.textures[t]);
					G.framebufferTextureLayer(G.FRAMEBUFFER, G.COLOR_ATTACHMENT0 + t, i.__webglTexture, n, r);
				}
			} else if (e !== null && n !== 0) {
				let t = J.get(e.texture);
				G.framebufferTexture2D(G.FRAMEBUFFER, G.COLOR_ATTACHMENT0, G.TEXTURE_2D, t.__webglTexture, n);
			}
			de = -1;
		};
		function $(e) {
			let t = J.get(e);
			return (t.__readFormat !== e.format || t.__readType !== e.type) && (t.__readFormat = e.format, t.__readType = e.type, t.__formatReadable = ze.textureFormatReadable(e.format), t.__typeReadable = ze.textureTypeReadable(e.type)), t;
		}
		this.readRenderTargetPixels = function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) {
				E("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
				return;
			}
			let c = J.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				q.bindFramebuffer(G.FRAMEBUFFER, c);
				try {
					let o = e.textures[s], c = o.format, l = o.type;
					e.textures.length > 1 && G.readBuffer(G.COLOR_ATTACHMENT0 + s);
					let u = $(o);
					if (u.__formatReadable === !1) {
						E("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
						return;
					}
					if (u.__typeReadable === !1) {
						E("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
						return;
					}
					t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i && G.readPixels(t, n, r, i, ot.convert(c), ot.convert(l), a);
				} finally {
					let e = R === null ? null : J.get(R).__webglFramebuffer;
					q.bindFramebuffer(G.FRAMEBUFFER, e);
				}
			}
		}, this.readRenderTargetPixelsAsync = async function(e, t, n, r, i, a, o, c = 0) {
			if (!(e && e.isWebGLRenderTarget)) throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
			let l = J.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (l = l[o]), l) {
				if (t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i) {
					q.bindFramebuffer(G.FRAMEBUFFER, l);
					let o = e.textures[c], u = o.format, d = o.type;
					e.textures.length > 1 && G.readBuffer(G.COLOR_ATTACHMENT0 + c);
					let f = $(o);
					if (f.__formatReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
					if (f.__typeReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
					let p = G.createBuffer();
					G.bindBuffer(G.PIXEL_PACK_BUFFER, p), G.bufferData(G.PIXEL_PACK_BUFFER, a.byteLength, G.STREAM_READ), G.readPixels(t, n, r, i, ot.convert(u), ot.convert(d), 0), G.bindBuffer(G.PIXEL_PACK_BUFFER, null);
					let m = R === null ? null : J.get(R).__webglFramebuffer;
					q.bindFramebuffer(G.FRAMEBUFFER, m);
					let h = G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE, 0);
					return G.flush(), await s(G, h, 4), G.bindBuffer(G.PIXEL_PACK_BUFFER, p), G.getBufferSubData(G.PIXEL_PACK_BUFFER, 0, a), G.bindBuffer(G.PIXEL_PACK_BUFFER, null), G.deleteBuffer(p), G.deleteSync(h), a;
				}
				throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
			}
		}, this.copyFramebufferToTexture = function(e, t = null, n = 0) {
			let r = 2 ** -n, i = Math.floor(e.image.width * r), a = Math.floor(e.image.height * r), o = t === null ? 0 : t.x, s = t === null ? 0 : t.y;
			Y.setTexture2D(e, 0), G.copyTexSubImage2D(G.TEXTURE_2D, n, 0, 0, o, s, i, a), q.unbindTexture();
		}, this.copyTextureToTexture = function(e, t, n = null, r = null, i = 0, a = 0) {
			let o, s, c, l, u, d, f, p, m, h = e.isCompressedTexture ? e.mipmaps[a] : e.image;
			if (n !== null) o = n.max.x - n.min.x, s = n.max.y - n.min.y, c = n.isBox3 ? n.max.z - n.min.z : 1, l = n.min.x, u = n.min.y, d = n.isBox3 ? n.min.z : 0;
			else {
				let t = 2 ** -i;
				o = Math.floor(h.width * t), s = Math.floor(h.height * t), c = e.isDataArrayTexture ? h.depth : e.isData3DTexture ? Math.floor(h.depth * t) : 1, l = 0, u = 0, d = 0;
			}
			r === null ? (f = 0, p = 0, m = 0) : (f = r.x, p = r.y, m = r.z);
			let g = ot.convert(t.format), _ = ot.convert(t.type), v;
			t.isData3DTexture ? (Y.setTexture3D(t, 0), v = G.TEXTURE_3D) : t.isDataArrayTexture || t.isCompressedArrayTexture ? (Y.setTexture2DArray(t, 0), v = G.TEXTURE_2D_ARRAY) : (Y.setTexture2D(t, 0), v = G.TEXTURE_2D), q.activeTexture(G.TEXTURE0), q.pixelStorei(G.UNPACK_FLIP_Y_WEBGL, t.flipY), q.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), q.pixelStorei(G.UNPACK_ALIGNMENT, t.unpackAlignment);
			let y = q.getParameter(G.UNPACK_ROW_LENGTH), b = q.getParameter(G.UNPACK_IMAGE_HEIGHT), x = q.getParameter(G.UNPACK_SKIP_PIXELS), S = q.getParameter(G.UNPACK_SKIP_ROWS), C = q.getParameter(G.UNPACK_SKIP_IMAGES);
			q.pixelStorei(G.UNPACK_ROW_LENGTH, h.width), q.pixelStorei(G.UNPACK_IMAGE_HEIGHT, h.height), q.pixelStorei(G.UNPACK_SKIP_PIXELS, l), q.pixelStorei(G.UNPACK_SKIP_ROWS, u), q.pixelStorei(G.UNPACK_SKIP_IMAGES, d);
			let w = e.isDataArrayTexture || e.isData3DTexture, T = t.isDataArrayTexture || t.isData3DTexture;
			if (e.isDepthTexture) {
				let n = J.get(e), r = J.get(t), h = J.get(n.__renderTarget), g = J.get(r.__renderTarget);
				q.bindFramebuffer(G.READ_FRAMEBUFFER, h.__webglFramebuffer), q.bindFramebuffer(G.DRAW_FRAMEBUFFER, g.__webglFramebuffer);
				for (let n = 0; n < c; n++) w && (G.framebufferTextureLayer(G.READ_FRAMEBUFFER, G.COLOR_ATTACHMENT0, J.get(e).__webglTexture, i, d + n), G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER, G.COLOR_ATTACHMENT0, J.get(t).__webglTexture, a, m + n)), G.blitFramebuffer(l, u, o, s, f, p, o, s, G.DEPTH_BUFFER_BIT, G.NEAREST);
				q.bindFramebuffer(G.READ_FRAMEBUFFER, null), q.bindFramebuffer(G.DRAW_FRAMEBUFFER, null);
			} else if (i !== 0 || e.isRenderTargetTexture || J.has(e)) {
				let n = J.get(e), r = J.get(t);
				q.bindFramebuffer(G.READ_FRAMEBUFFER, I), q.bindFramebuffer(G.DRAW_FRAMEBUFFER, oe);
				for (let e = 0; e < c; e++) w ? G.framebufferTextureLayer(G.READ_FRAMEBUFFER, G.COLOR_ATTACHMENT0, n.__webglTexture, i, d + e) : G.framebufferTexture2D(G.READ_FRAMEBUFFER, G.COLOR_ATTACHMENT0, G.TEXTURE_2D, n.__webglTexture, i), T ? G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER, G.COLOR_ATTACHMENT0, r.__webglTexture, a, m + e) : G.framebufferTexture2D(G.DRAW_FRAMEBUFFER, G.COLOR_ATTACHMENT0, G.TEXTURE_2D, r.__webglTexture, a), i === 0 ? T ? G.copyTexSubImage3D(v, a, f, p, m + e, l, u, o, s) : G.copyTexSubImage2D(v, a, f, p, l, u, o, s) : G.blitFramebuffer(l, u, o, s, f, p, o, s, G.COLOR_BUFFER_BIT, G.NEAREST);
				q.bindFramebuffer(G.READ_FRAMEBUFFER, null), q.bindFramebuffer(G.DRAW_FRAMEBUFFER, null);
			} else T ? e.isDataTexture || e.isData3DTexture ? G.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h.data) : t.isCompressedArrayTexture ? G.compressedTexSubImage3D(v, a, f, p, m, o, s, c, g, h.data) : G.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h) : e.isDataTexture ? G.texSubImage2D(G.TEXTURE_2D, a, f, p, o, s, g, _, h.data) : e.isCompressedTexture ? G.compressedTexSubImage2D(G.TEXTURE_2D, a, f, p, h.width, h.height, g, h.data) : G.texSubImage2D(G.TEXTURE_2D, a, f, p, o, s, g, _, h);
			q.pixelStorei(G.UNPACK_ROW_LENGTH, y), q.pixelStorei(G.UNPACK_IMAGE_HEIGHT, b), q.pixelStorei(G.UNPACK_SKIP_PIXELS, x), q.pixelStorei(G.UNPACK_SKIP_ROWS, S), q.pixelStorei(G.UNPACK_SKIP_IMAGES, C), a === 0 && t.generateMipmaps && G.generateMipmap(v), q.unbindTexture();
		}, this.initRenderTarget = function(e) {
			J.get(e).__webglFramebuffer === void 0 && Y.setupRenderTarget(e);
		}, this.initTexture = function(e) {
			e.isCubeTexture ? Y.setTextureCube(e, 0) : e.isData3DTexture ? Y.setTexture3D(e, 0) : e.isDataArrayTexture || e.isCompressedArrayTexture ? Y.setTexture2DArray(e, 0) : Y.setTexture2D(e, 0), q.unbindTexture();
		}, this.resetState = function() {
			le = 0, L = 0, R = null, q.reset(), st.reset();
		}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	get coordinateSystem() {
		return ue;
	}
	get outputColorSpace() {
		return this._outputColorSpace;
	}
	set outputColorSpace(e) {
		this._outputColorSpace = e;
		let t = this.getContext();
		t.drawingBufferColorSpace = F._getDrawingBufferColorSpace(e), t.unpackColorSpace = F._getUnpackColorSpace();
	}
}, oi = [
	.55,
	.62,
	.75,
	.9,
	1,
	2.4
];
function si() {
	return Re.fire.map((e, t) => Ve(e).multiplyScalar(oi[t]));
}
var ci = "\nuniform float uCameraYaw;\nuniform float uLift;\nvarying vec2 vUv;\n#include <common>\n#include <fog_pars_vertex>\nvoid main() {\n  vUv = uv;\n  vec3 wCenter = ( modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;\n  float sx = length( modelMatrix[ 0 ].xyz );\n  float sy = length( modelMatrix[ 1 ].xyz );\n  vec3 right = vec3( cos( uCameraYaw ), 0.0, - sin( uCameraYaw ) );\n  vec3 toCam = vec3( sin( uCameraYaw ), 0.0, cos( uCameraYaw ) );\n  vec3 wPos = wCenter + right * position.x * sx + vec3( 0.0, 1.0, 0.0 ) * position.y * sy + toCam * uLift;\n  vec4 mvPosition = viewMatrix * vec4( wPos, 1.0 );\n  gl_Position = projectionMatrix * mvPosition;\n  #include <fog_vertex>\n}\n", li = "\nfloat fh21( vec2 p ) {\n  p = fract( p * vec2( 123.34, 456.21 ) );\n  p += dot( p, p + 45.32 );\n  return fract( p.x * p.y );\n}\nfloat fnoise( vec2 p ) {\n  vec2 i = floor( p );\n  vec2 f = fract( p );\n  f = f * f * ( 3.0 - 2.0 * f );\n  return mix( mix( fh21( i ), fh21( i + vec2( 1.0, 0.0 ) ), f.x ),\n              mix( fh21( i + vec2( 0.0, 1.0 ) ), fh21( i + vec2( 1.0, 1.0 ) ), f.x ), f.y );\n}\n", ui = "\nuniform float uTime;\nuniform float uSeed;\nuniform float uIntensity;\nuniform float uSpeed;\nuniform vec2 uPx;\nuniform vec3 uFire[ 6 ];\nvarying vec2 vUv;\n", di = `#include <common>
#include <fog_pars_fragment>
${li}
void main() {
  vec2 px = floor( vUv * uPx );
  vec2 uv = ( px + 0.5 ) / uPx;
  // stepped time → hand-animated feel (12 fps). Every noise input is kept small (time wrapped
  // every 50 s, seed folded to [0, 20)) — the fract()-hash loses float32 precision past ~10^3,
  // which would quantise the tongues after a long session or for large seeds.
  float sOff = fract( uSeed * 0.1731 ) * 20.0;
  float t = mod( floor( uTime * 12.0 * uSpeed ), 600.0 ) / 12.0 + sOff;
  float y = uv.y;
  float x = uv.x * 2.0 - 1.0;
  // tongues: horizontal displacement growing with height, scrolling upward
  float wob = fnoise( vec2( y * 3.2 - t * 2.3, t * 0.7 + sOff ) ) - 0.5;
  x += wob * 0.35 * y;
  // teardrop profile: broad rounded base, full belly, pointed tip
  float w = 0.98 * pow( max( 1.0 - y, 0.0 ), 0.42 ) * ( 0.9 + 0.1 * smoothstep( 0.0, 0.3, y ) );
  // rounded bottom (no flat rectangular cut at the base of the quad)
  float rb = 1.0 - clamp( y / 0.16, 0.0, 1.0 );
  w *= mix( 0.45, 1.0, sqrt( max( 1.0 - rb * rb, 0.0 ) ) );
  float heat = ( 1.0 - abs( x ) / max( w, 1e-3 ) ) * 1.3;
  // split the upper half into 2–3 licking lobes
  float lob = sin( x * 6.9 + t * 1.7 + sOff ) * 0.5 + 0.5;
  heat -= ( 1.0 - lob ) * 0.6 * smoothstep( 0.5, 1.0, y );
  // turbulence in pixel space (chunky), stronger toward the tip → broken tongues
  vec2 q = vec2( px.x * 0.42, px.y * 0.36 - t * 5.5 );
  float n = fnoise( q + sOff * 3.0 ) * 0.6 + fnoise( q * 2.1 + 3.7 ) * 0.4;
  heat += ( n - 0.5 ) * ( 0.3 + 0.5 * y );
  heat -= y * 0.15;
  if ( heat < 0.08 ) discard;
  // bands: small white-hot core low in the flame, yellow heart, orange body, red rim; the dark
  // red only on the lower rim so broken-off tongue pixels near the tip stay fiery orange-red
  vec3 col;
  if ( heat > 1.05 && y < 0.38 ) col = uFire[ 5 ];
  else if ( heat > 0.9 ) col = uFire[ 4 ];
  else if ( heat > 0.55 ) col = uFire[ 3 ];
  else if ( heat > 0.24 || y < 0.25 || y > 0.55 ) col = uFire[ 2 ];
  else col = uFire[ 1 ];
  gl_FragColor = vec4( col * uIntensity, 1.0 );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`, fi = ui + di, pi = "\nuniform float uTime;\nuniform float uSeed;\nuniform float uIntensity;\nuniform float uNight;\nuniform float uDay;\nuniform float uBaseV;\nuniform vec3 uColor;\nvarying vec2 vUv;\n", mi = `#include <common>
#include <fog_pars_fragment>
${li}
void main() {
  float r = length( vUv - 0.5 ) * 2.0;
  float g = pow( max( 1.0 - r, 0.0 ), 1.7 );
  // fade out toward / below the flame base: the vertical card would otherwise cut a hard
  // horizontal edge where it intersects the ground (campfire) or a wall
  g *= smoothstep( uBaseV - 0.04, uBaseV + 0.2, vUv.y );
  float flick = 0.82 + 0.18 * fnoise( vec2( mod( uTime, 60.0 ) * 7.0, fract( uSeed * 0.1731 ) * 40.0 ) );
  float k = g * flick * uIntensity * mix( uDay, 1.0, uNight );
  if ( k < 0.002 ) discard;
  gl_FragColor = vec4( uColor * k, 1.0 );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #ifdef USE_FOG
    // additive: fade the contribution out with fog instead of tinting toward the fog colour
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
    #else
      float fogF = smoothstep( fogNear, fogFar, vFogDepth );
    #endif
    gl_FragColor.rgb *= 1.0 - fogF;
  #endif
}
`, hi = pi + mi;
function gi({ width: e, height: t, seed: n = 0, intensity: r = 1, speed: i = 1 }) {
	let a = we.merge([Z.fog, {
		uSeed: { value: n },
		uIntensity: { value: r },
		uSpeed: { value: i },
		uLift: { value: .02 },
		uPx: { value: new L(Math.max(4, Math.round(e * 16)), Math.max(4, Math.round(t * 16))) },
		uFire: { value: si() }
	}]);
	return a.uTime = J.uTime, a.uCameraYaw = J.uCameraYaw, a.uFogStart = J.uFogStart, new A({
		name: "luminati:flame",
		uniforms: a,
		vertexShader: ci,
		fragmentShader: fi,
		fog: !0,
		side: 2
	});
}
function _i({ color: e = 16747066, intensity: t = .6, seed: n = 0, day: r = .25, baseV: i = -1 } = {}) {
	let a = we.merge([Z.fog, {
		uSeed: { value: n },
		uIntensity: { value: t },
		uDay: { value: r },
		uLift: { value: -.05 },
		uBaseV: { value: i },
		uColor: { value: new z(e) }
	}]);
	return a.uTime = J.uTime, a.uCameraYaw = J.uCameraYaw, a.uNight = J.uNight, a.uFogStart = J.uFogStart, new A({
		name: "luminati:glow",
		uniforms: a,
		vertexShader: ci,
		fragmentShader: hi,
		fog: !0,
		transparent: !0,
		depthWrite: !1,
		blending: 2,
		side: 2
	});
}
function vi({ width: e = .5, height: t = .75, seed: n = 0, intensity: r = 1, speed: i = 1, glow: a = !0, glowSize: o = 2.6, glowIntensity: s = .55, glowColor: c = 16747066 } = {}) {
	let l = new k();
	l.name = "flame";
	let u = new h(e, t);
	u.translate(0, t / 2, 0);
	let d = gi({
		width: e,
		height: t,
		seed: n,
		intensity: r,
		speed: i
	}), f = new I(u, d);
	f.name = "flame:body", f.castShadow = !1, f.receiveShadow = !1, l.add(f);
	let p = [d], m = [u], g = null;
	if (a) {
		let r = Math.max(e, t) * o, i = new h(r, r);
		i.translate(0, t * .4, 0);
		let a = _i({
			color: c,
			intensity: s,
			seed: n,
			baseV: .5 - t * .4 / r
		});
		g = new I(i, a), g.name = "flame:glow", g.renderOrder = G.PARTICLES + 5, g.castShadow = !1, g.receiveShadow = !1, l.add(g), p.push(a), m.push(i);
	}
	return {
		object: l,
		flame: f,
		glow: g,
		materials: p,
		geometries: m
	};
}
//#endregion
//#region src/engine/world/props/Details.js
var yi = "wood_planks_dark";
function bi(e, t) {
	let n = e / 2 / t;
	return Math.abs(n - Math.round(n)) <= Math.abs(n - .5 - Math.round(n - .5)) + 1e-6 ? -e / 2 : -e / 2 + t / 2;
}
function xi(e, t, n, r = {}) {
	return {
		pz: {
			off: [bi(e, n), r.vOff || 0],
			...r
		},
		nz: {
			off: [bi(e, n), r.vOff || 0],
			...r
		},
		px: {
			off: [bi(t, n), r.vOff || 0],
			...r
		},
		nx: {
			off: [bi(t, n), r.vOff || 0],
			...r
		}
	};
}
function Si(e, t, n, r, i, { w: a = .24, h: o = .32, metal: s = "metal" } = {}) {
	e.box(t, [
		a,
		o,
		a
	], {
		at: [
			n,
			r,
			i
		],
		faces: {
			py: !1,
			ny: !1
		},
		uv: "fit"
	});
	let c = a / 2 + .012;
	for (let t of [-1, 1]) for (let a of [-1, 1]) e.box(s, [
		.045,
		o + .03,
		.045
	], { at: [
		n + t * c,
		r,
		i + a * c
	] });
	let l = a + .08;
	e.box(s, [
		l,
		.05,
		l
	], { at: [
		n,
		r - o / 2 - .02,
		i
	] }), e.box(s, [
		l * .55,
		.05,
		l * .55
	], { at: [
		n,
		r - o / 2 - .065,
		i
	] });
	let u = r + o / 2, d = l / 2 + .02, f = u + .17, p = [
		n,
		f,
		i
	], m = [
		[
			n - d,
			u,
			i + d
		],
		[
			n + d,
			u,
			i + d
		],
		[
			n + d,
			u,
			i - d
		],
		[
			n - d,
			u,
			i - d
		]
	];
	for (let t = 0; t < 4; t++) {
		let n = m[t], r = m[(t + 1) % 4];
		e.tri(s, n, r, p, [0, 0], [.5, 0], [.25, .3]);
	}
	e.box(s, [
		l,
		.04,
		l
	], { at: [
		n,
		u + .01,
		i
	] }), e.box(s, [
		.06,
		.1,
		.06
	], { at: [
		n,
		f + .03,
		i
	] }), e.box(s, [
		.1,
		.03,
		.1
	], { at: [
		n,
		f + .09,
		i
	] });
}
function Ci(e, t, n, r, i = 1, a = .28, o = 0) {
	let s = t - i / 2, c = t + i / 2, l = 7 / 16, u = "flowerbox";
	e.quad(u, [
		[
			s,
			n,
			r
		],
		[
			c,
			n,
			r
		],
		[
			c,
			n + 1,
			r
		],
		[
			s,
			n + 1,
			r
		]
	], [
		[o, 0],
		[o + i, 0],
		[o + i, 1],
		[o, 1]
	]);
	let d = r - a;
	e.quad(u, [
		[
			c,
			n,
			d
		],
		[
			s,
			n,
			d
		],
		[
			s,
			n + 1,
			d
		],
		[
			c,
			n + 1,
			d
		]
	], [
		[o + .43, 0],
		[o + .43 + i, 0],
		[o + .43 + i, 1],
		[o + .43, 1]
	]);
	let f = r - a * .5;
	e.quad(u, [
		[
			s,
			n + l - .05,
			f
		],
		[
			c,
			n + l - .05,
			f
		],
		[
			c,
			n + 1,
			f
		],
		[
			s,
			n + 1,
			f
		]
	], [
		[o + .21, .3875],
		[o + .21 + i, .3875],
		[o + .21 + i, 1],
		[o + .21, 1]
	]), e.quad(u, [
		[
			c,
			n,
			r
		],
		[
			c,
			n,
			d
		],
		[
			c,
			n + l,
			d
		],
		[
			c,
			n + l,
			r
		]
	], [
		[0, 0],
		[a, 0],
		[a, l],
		[0, l]
	]), e.quad(u, [
		[
			s,
			n,
			d
		],
		[
			s,
			n,
			r
		],
		[
			s,
			n + l,
			r
		],
		[
			s,
			n + l,
			d
		]
	], [
		[0, 0],
		[a, 0],
		[a, l],
		[0, l]
	]), e.box(yi, [
		i - .02,
		.04,
		a - .02
	], {
		at: [
			t,
			n + l - .06,
			r - a / 2
		],
		faces: { ny: !1 },
		color: [
			.42,
			.34,
			.3
		]
	}), e.box(yi, [
		i,
		.03,
		a
	], {
		at: [
			t,
			n + .015,
			r - a / 2
		],
		faces: { py: !1 }
	});
}
//#endregion
//#region src/engine/pixel/textures/names.js
var wi = Object.freeze([
	"arid_dirt",
	"cracked_earth",
	"dry_grass",
	"red_sand",
	"sandstone",
	"redrock",
	"scree",
	"flagstone",
	"scorched",
	"basalt",
	"ash",
	"sandstone_cliff",
	"redrock_cliff",
	"basalt_cliff",
	"dry_grass_side",
	"arid_dirt_side"
]), Ti = Object.freeze([
	"adobe",
	"whitewash",
	"sandstone_brick",
	"charred_wall",
	"roof_terracotta",
	"roof_charred"
]), Ei = Object.freeze([
	"spring_grass",
	"blossom_grass",
	"spring_grass_side",
	"autumn_grass",
	"autumn_grass_side",
	"stubble",
	"fallen_leaves",
	"limestone",
	"limestone_cliff",
	"cove_sand",
	"slate_cobble",
	"frost_cobble",
	"snow_top",
	"snow_path",
	"snow_side",
	"ice_top",
	"ice_cliff"
]), Di = Object.freeze({ evermere: Object.freeze({
	types: [
		"belfry",
		"ship",
		"monument",
		"smithy"
	],
	kinds: [
		"hushguard",
		"frostwolf",
		"rimecrow",
		"cantor",
		"rimehart",
		"mawkin",
		"gullet",
		"hushedking"
	],
	effects: [
		"toll",
		"thaw",
		"petals",
		"leaves",
		"memory",
		"crows"
	],
	weathers: ["frost"],
	stones: ["ice", "snow"],
	treeKinds: [
		"blossom",
		"maple",
		"goldbirch",
		"snowpine",
		"bare"
	],
	behaviours: ["still"]
}) });
function Oi(e, t) {
	for (let n of Object.keys(Di)) {
		let r = Di[n][e];
		if (r && r.includes(t)) return n;
	}
	return null;
}
//#endregion
//#region src/engine/world/SetPieceKit.js
var ki = Object.freeze([
	"juniper",
	"deadwood",
	"palm",
	"cypress"
]), Ai = null, ji = null, Mi = /* @__PURE__ */ new Set([
	...wi,
	...Ti,
	...ki
]);
function Ni(e, t = 0) {
	if (typeof e == "string") return Mi.has(e);
	if (!e || typeof e != "object" || t > 4) return !1;
	if (Array.isArray(e)) return e.some((e) => Ni(e, t + 1));
	for (let n of Object.keys(e)) if (Ni(e[n], t + 1)) return !0;
	return !1;
}
function Pi(e) {
	return !e || typeof e != "object" ? !1 : e.flatRoof === !0 || Number.isFinite(e.ruin) && Math.round(e.ruin) > 0 ? !0 : Number.isFinite(e.burning) && e.burning > 0;
}
function Fi(e) {
	if (!e || typeof e != "object") return !1;
	let t = e.environment;
	if (t && typeof t == "object" && t.climate != null || Ni(e.legend)) return !0;
	let n = Array.isArray(e.objects) ? e.objects : [];
	for (let e of n) {
		if (!e || typeof e != "object") continue;
		let t = e.type;
		if (!(t === "crag" && e.opts && typeof e.opts == "object" && typeof e.opts.stone == "string" && Oi("stones", e.opts.stone)) && Ue(t) && Y(He, t) && He[t].kind === "prop" || t === "house" && Pi(e.opts) || Ni(e)) return !0;
	}
	return !1;
}
function Ii() {
	return Ai ? Promise.resolve(Ai) : (ji ??= import("./SetPieceKitParts-4ettMC6O.js").then((e) => (Li(e.SET_PIECE_PARTS), e.SET_PIECE_PARTS), (e) => {
		throw ji = null, e;
	}), ji);
}
function Li(e) {
	Ai = e;
}
function Ri() {
	return Ai;
}
function zi(e) {
	if (!Ai) throw Error(`${e} needs the set-piece kit (src/engine/world/SetPieceKitParts.js), which is not loaded: load it first (loadSetPieceKit — World.buildSteps does for a level that needs it, levelNeedsSetPieceKit)`);
	return Ai;
}
//#endregion
//#region src/engine/world/SeasonKit.js
var Bi = Object.freeze([...Di.evermere.treeKinds]), Vi = null, Hi = null, Ui = new Set(Ei), Wi = [
	"top",
	"side",
	"lip",
	"riser"
];
function Gi(e) {
	if (!e || typeof e != "object") return !1;
	let t = e.environment;
	if (t && typeof t == "object" && (t.season != null || t.frost != null)) return !0;
	let n = t && typeof t == "object" && t.foliage && typeof t.foliage == "object" ? t.foliage.cropAreas : null;
	if (Array.isArray(n) && n.length) return !0;
	let r = t && typeof t == "object" && t.forest && typeof t.forest == "object" ? t.forest.areas : null;
	if (Array.isArray(r) && r.some((e) => e && typeof e.kinds == "object" && e.kinds && Object.keys(e.kinds).some((e) => Oi("treeKinds", e)))) return !0;
	let i = e.legend;
	if (i && typeof i == "object") {
		for (let e of Object.values(i)) if (e && typeof e == "object") {
			for (let t of Wi) if (Ui.has(e[t])) return !0;
		}
	}
	let a = Array.isArray(e.objects) ? e.objects : [];
	for (let e of a) {
		if (!e || typeof e != "object") continue;
		if (typeof e.type == "string" && Oi("types", e.type)) return !0;
		let t = e.opts && typeof e.opts == "object" ? e.opts : null;
		if (t && (e.type === "tree" && typeof t.kind == "string" && Oi("treeKinds", t.kind) || (e.type === "rock" || e.type === "crag") && typeof t.stone == "string" && Oi("stones", t.stone) || e.type === "house" && t.icicles === !0)) return !0;
	}
	return !1;
}
function Ki() {
	return Vi ? Promise.resolve(Vi) : (Hi ??= import("./SeasonKitParts-BySP9WUi.js").then((e) => (qi(e.SEASON_KIT_PARTS), e.SEASON_KIT_PARTS), (e) => {
		throw Hi = null, e;
	}), Hi);
}
function qi(e) {
	Vi = e;
}
function Ji() {
	return Vi;
}
function Yi(e) {
	if (!Vi) throw Error(`${e} needs the season kit (src/engine/world/SeasonKitParts.js), which is not loaded: load it first (loadSeasonKit — World.buildSteps does for a level that needs it, levelNeedsSeasonKit)`);
	return Vi;
}
//#endregion
//#region src/engine/world/props/Trees.js
var Xi = Math.PI * (3 - Math.sqrt(5)), Zi = {
	oak: {
		leaves: "leaves",
		tint: [
			1,
			1,
			1
		],
		clusters: [9, 12],
		crown: .44,
		flat: .8,
		trunk: .075,
		card: 2
	},
	autumn: {
		leaves: "leaves_autumn",
		tint: [
			1,
			1,
			1
		],
		clusters: [9, 11],
		crown: .43,
		flat: .78,
		trunk: .072,
		card: 2,
		litter: !0
	},
	birch: {
		leaves: "leaves",
		tint: [
			1.1,
			1.15,
			.72
		],
		clusters: [6, 8],
		crown: .3,
		flat: 1.25,
		trunk: .036,
		card: 2,
		birch: !0
	}
};
function Qi(e, t, n, r, i = {}) {
	let a = i.kind ?? "oak", o = e.rng(`tree:${a}`, t, r, i.seed), s = (i.height ?? 4.5) * o.range(.94, 1.06), c = i.rotation ?? o.range(0, Math.PI * 2), l = i.charred === !0, u, d;
	return a === "pine" ? {group: d, trunkR: u} = ta(e, o, s, t, n, r, c) : ki.includes(a) ? {group: d, trunkR: u} = zi(`a "${a}" tree`).ARID_TREES[a](e, o, s, t, n, r, c, l) : {group: d, trunkR: u} = ea(e, o, Y(Zi, a) ? a : "oak", s, t, n, r, c, i), e.result(d, { colliders: [{
		type: "circle",
		x: t,
		z: r,
		r: u + .12
	}] });
}
function $i(e, t) {
	return (n, r, i) => {
		let a = K((r - t) / Math.max(.1, e - t), 0, 1), o = Math.min(1, Math.hypot(n, i) / (e * .45));
		return a ** 1.35 * (.75 + .35 * o);
	};
}
function ea(e, t, n, r, i, a, o, s, c, l = Zi[n]) {
	let u = l.birch === !0, d = e.builder(), f = e.windMaterial(l.bark ?? (u ? "birch" : "bark")), p = e.foliageMaterial(l.leaves, { billboard: !0 }), m = r * l.crown, h = u ? [
		m * .78,
		m * 1.05,
		m * .78
	] : [
		m,
		m * l.flat,
		m
	], g = [
		t.range(-.12, .12),
		r - h[1] * .78 - (u ? .35 : .2),
		t.range(-.12, .12)
	], _ = g[1] - h[1] * (u ? .1 : .25), v = Math.max(.12, r * l.trunk);
	d.sway = $i(r, r * .28);
	let y = t.range(-.25, .25) * (u ? 1.5 : 1), b = t.range(-.25, .25) * (u ? 1.5 : 1), x = Array.from({ length: 7 }, () => t.range(-.06, .38)), S = u ? [
		{
			y: -.1,
			r: v * 1.45
		},
		{
			y: .14,
			r: v * 1.12
		},
		{
			y: _ * .35,
			r: v,
			cx: y * .2,
			cz: b * .2
		},
		{
			y: _ * .7,
			r: v * .82,
			cx: y * .6,
			cz: b * .6
		},
		{
			y: _ + .4,
			r: v * .55,
			cx: y + g[0],
			cz: b + g[2]
		}
	] : [
		{
			y: -.12,
			r: v * 1.75
		},
		{
			y: .12,
			r: v * 1.28
		},
		{
			y: .45,
			r: v * 1.04
		},
		{
			y: _ * .55,
			r: v * .86,
			cx: y * .4,
			cz: b * .4
		},
		{
			y: _,
			r: v * .66,
			cx: y + g[0] * .5,
			cz: b + g[2] * .5
		},
		{
			y: _ + .5,
			r: v * .4,
			cx: y * .8 + g[0],
			cz: b * .8 + g[2]
		}
	];
	d.lathe(f, S, {
		segments: 7,
		phase: t.range(0, Math.PI),
		radiusFn: (e, t) => e === 0 ? 1 + x[t] : e === 1 ? 1 + x[t] * .45 : 1,
		colorFn: (e) => {
			let t = e === 0 ? .6 : e === 1 ? .8 : 1;
			return [
				t,
				t,
				t
			];
		},
		vOff: t.range(0, 2)
	});
	let [C, w] = l.clusters, T = t.int(C, w), E = [], D = t.range(0, 1);
	for (let e = 0; e < T; e++) {
		let n = 1 - (e + D) / T * 1.8, r = Math.sqrt(Math.max(0, 1 - n * n)), i = e * Xi + t.range(-.3, .3), a = t.range(.48, .72);
		E.push({
			p: [
				g[0] + Math.cos(i) * r * h[0] * a,
				g[1] + n * h[1] * a,
				g[2] + Math.sin(i) * r * h[2] * a
			],
			inner: !1
		});
	}
	E.push({
		p: [
			g[0] + t.range(-.2, .2),
			g[1] + h[1] * .55,
			g[2] + t.range(-.2, .2)
		],
		inner: !1
	});
	let O = u ? 2 : 4;
	for (let e = 0; e < O; e++) {
		let n = e / O * Math.PI * 2 + t.range(-.4, .4);
		E.push({
			p: [
				g[0] + Math.cos(n) * h[0] * .3,
				g[1] + t.range(-.25, .15) * h[1],
				g[2] + Math.sin(n) * h[2] * .3
			],
			inner: !0
		});
	}
	let ee = t.int(2, 3), k = E.filter((e) => !e.inner).sort((e, t) => e.p[1] - t.p[1]);
	for (let e = 0; e < ee && e < k.length; e++) {
		let n = k[e * 2 % k.length].p, r = _ * t.range(.72, .95), i = [
			r / _ * y,
			r,
			r / _ * b
		], a = [
			Be(g[0], n[0], .8),
			Be(r, n[1], .7),
			Be(g[2], n[2], .8)
		];
		d.tube(f, i, a, v * .46, v * .16, {
			segments: 5,
			rings: 3,
			uRepeat: 1
		});
	}
	let A = l.tint, j = [];
	for (let e of E) {
		if (j.push({
			p: e.p,
			inner: e.inner,
			shade: 1
		}), e.inner) continue;
		let n = t.range(0, Math.PI * 2), r = t.range(.4, .6);
		j.push({
			p: [
				e.p[0] + Math.cos(n) * r,
				e.p[1] - t.range(.2, .38),
				e.p[2] + Math.sin(n) * r
			],
			inner: !1,
			shade: .9
		});
	}
	for (let e = 0; e < j.length; e++) {
		let n = j[e], r = l.card * t.range(.94, 1.08), i = r / 2, a = t.range(-.07, .07), o = t.range(-.05, .05), s = n.p, c = (s[0] - g[0]) / h[0], u = (s[1] - g[1]) / h[1], f = (s[2] - g[2]) / h[2], m = Math.hypot(c, u, f), _ = n.inner ? l.inner ?? .5 : n.shade * K(.66 + .5 * m, .6, 1.05) * (.8 + .2 * q(-.8, .6, u)), v = [
			A[0] * (1 + a + o) * _,
			A[1] * (1 + a) * _,
			A[2] * (1 + a - o) * _
		];
		d.phase = t.range(0, 6.283), d.center = s;
		let y = t.range(-.22, .22), b = Math.cos(y), x = Math.sin(y), S = [
			[-i, -i],
			[i, -i],
			[i, i],
			[-i, i]
		], C = [], w = [], T = [];
		for (let [e, t] of S) {
			let n = e * b - t * x, i = e * x + t * b;
			C.push([
				s[0] + n,
				s[1] + i,
				s[2]
			]);
			let a = c + n / r * .5, o = u + i / r * .6 + .45, l = f + .25, d = Math.hypot(a, o, l) || 1;
			w.push([
				a / d,
				o / d,
				l / d
			]);
			let p = t < 0 ? .8 : 1.06;
			T.push([
				v[0] * p,
				v[1] * p,
				v[2] * p
			]);
		}
		d.quad(p, C, [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1]
		], {
			normals: w,
			colors: T
		});
	}
	if (d.center = [
		0,
		0,
		0
	], l.litter && c.fallenLeaves !== !1) {
		let n = e.decalMaterial("leaf_litter");
		d.sway = 0;
		for (let e = 0; e < 2; e++) {
			let r = t.range(0, Math.PI * 2), i = g[0] + Math.cos(r) * t.range(.4, 1.1), a = g[2] + Math.sin(r) * t.range(.4, 1.1), o = t.range(0, Math.PI), s = [Math.cos(o), -Math.sin(o)], c = [Math.sin(o), Math.cos(o)], l = .025 + e * .004, u = [
				[-1, 1],
				[1, 1],
				[1, -1],
				[-1, -1]
			].map(([e, t]) => [
				i + s[0] * e + c[0] * t,
				l,
				a + s[1] * e + c[1] * t
			]);
			d.quad(n, u, [
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1]
			], { normals: [
				[
					0,
					1,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					1,
					0
				]
			] });
		}
	}
	return {
		group: e.finish(d, `tree:${n}`, i, a, o, s),
		trunkR: v * 1.1
	};
}
function ta(e, t, n, r, i, a, o, s = "pine", c = "pine") {
	let l = e.builder(), u = e.windMaterial("bark"), d = e.foliageMaterial(s);
	l.sway = $i(n, n * .25);
	let f = Math.max(.14, n * .042);
	l.lathe(u, [
		{
			y: -.1,
			r: f * 1.5
		},
		{
			y: .15,
			r: f * 1.1
		},
		{
			y: n * .55,
			r: f * .7
		},
		{
			y: n * .8,
			r: f * .3
		}
	], {
		segments: 6,
		colorFn: (e) => e === 0 ? [
			.6,
			.6,
			.6
		] : [
			.9,
			.9,
			.9
		]
	});
	let p = K(Math.round(n / .95), 4, 7), m = n * .34, h = n * .19, g = [], _ = [];
	for (let e = 0; e < p; e++) {
		let n = e / (p - 1);
		g.push(m * (1 - .78 * n) * t.range(.95, 1.05)), _.push(g[e] * 1.12 + .3);
	}
	let v = n - h - _[p - 1];
	for (let e = 0; e < p; e++) {
		let n = e / (p - 1), r = g[e], i = _[e], a = h + v * n, o = .2 + .14 * (1 - n), s = Array.from({ length: 12 }, (e, n) => +(n % 2 == 0) + t.range(-.25, .25)), c = Be(.74, 1, n), u = t.range(-.05, .05), f = t.range(-.05, .05);
		l.phase = t.range(0, 6.283), l.lathe(d, [
			{
				y: a,
				r,
				cx: u,
				cz: f
			},
			{
				y: a + i * .3,
				r: r * .66,
				cx: u,
				cz: f
			},
			{
				y: a + i,
				r: .03,
				cx: u * .5,
				cz: f * .5
			}
		], {
			segments: 12,
			phase: t.range(0, 1),
			uRepeat: Math.max(3, Math.round(Math.PI * 2 * r / 2)),
			vOff: t.range(0, .5),
			normalUp: .9,
			radiusFn: (e, t) => e === 0 ? 1 + .1 * s[t] : e === 1 ? 1 + .05 * s[(t + 1) % 12] : 1,
			yFn: (e, t) => e === 0 ? -o * (.35 + .65 * s[t]) : 0,
			colorFn: (e) => {
				let t = c * (e === 0 ? .52 : e === 1 ? 1 : 1.12);
				return [
					t,
					t,
					t
				];
			}
		});
	}
	return {
		group: e.finish(l, `tree:${c}`, r, i, a, o),
		trunkR: f * 1.2
	};
}
//#endregion
//#region src/engine/world/props/SmallProps.js
var na = (e = .5, t = .62) => (n, r) => t + (1 - t) * q(-.05, e, r);
function ra(e, t, n, r, i, a, o = {}) {
	let s = e.rng("fence", (t + r) / 2, (n + i) / 2, o.seed), c = r - t, l = i - n, u = Math.hypot(c, l), d = Math.atan2(l, c) * -1, f = o.height ?? .95, p = Math.max(1, Math.round(u / (o.spacing ?? 1))), m = u / p, h = e.builder(na(.45)), g = [];
	for (let e = 0; e <= p; e++) {
		let t = -u / 2 + e * m, n = f + s.range(-.05, .04), r = [
			s.range(-.04, .04),
			0,
			s.range(-.04, .04)
		];
		g.push({
			px: t,
			h: n
		}), h.push([
			t,
			0,
			0
		], r), h.box(yi, [
			.15,
			n,
			.15
		], {
			at: [
				0,
				n / 2 - .05,
				0
			],
			rotUV: !0,
			faces: {
				ny: !1,
				py: !1
			},
			off: [s.range(0, 2), s.range(0, 2)]
		});
		let i = n - .05, a = .075, o = [
			0,
			i + .12,
			0
		], c = [
			[
				-.075,
				i,
				a
			],
			[
				a,
				i,
				a
			],
			[
				a,
				i,
				-.075
			],
			[
				-.075,
				i,
				-.075
			]
		];
		for (let e = 0; e < 4; e++) h.tri(yi, c[e], c[(e + 1) % 4], o, [0, 0], [.15, 0], [.075, .12]);
		h.pop();
	}
	let _ = (o.rails ?? 2) === 1 ? [.62] : [.34, .7];
	for (let e = 0; e < p; e++) {
		let t = g[e], n = g[e + 1];
		for (let e of _) {
			let r = e * (t.h / f) + s.range(-.02, .02), i = e * (n.h / f) + s.range(-.02, .02), a = Math.hypot(m, i - r) + .12;
			h.box("wood_planks", [
				a,
				.1,
				.06
			], {
				at: [
					(t.px + n.px) / 2,
					(r + i) / 2,
					.09
				],
				rot: [
					0,
					0,
					Math.atan2(i - r, m)
				],
				off: [s.range(0, 2), s.range(0, 2)]
			});
		}
	}
	let v = e.finish(h, "fence", (t + r) / 2, a, (n + i) / 2, d), y = [], b = Math.abs(Math.sin(2 * d)) > .05 ? Math.max(1, Math.ceil(m / .3)) : 1;
	for (let t = 0; t < p; t++) for (let n = 0; n < b; n++) {
		let r = g[t].px + m * n / b;
		y.push(e.boxCollider(v, r, r + m / b, -.1, .1));
	}
	return e.result(v, { colliders: y });
}
function ia(e, t, n, r, { h: i = 1, r: a = .4, yaw: o = 0, lid: s = !0, bottom: c = !1 } = {}) {
	let l = [
		{
			y: 0,
			r: a * .86
		},
		{
			y: i * .15,
			r: a * .95
		},
		{
			y: i * .5,
			r: a
		},
		{
			y: i * .85,
			r: a * .95
		},
		{
			y: i,
			r: a * .86
		}
	];
	e.lathe("barrel", l, {
		segments: 10,
		uRepeat: 3,
		vScale: i,
		at: [
			t,
			n,
			r
		],
		rot: o,
		smooth: !0
	});
	let u = (s) => {
		e.push([
			t,
			n + i / 2,
			r
		], s ? [
			Math.PI,
			o,
			0
		] : [
			0,
			o,
			0
		]), e.lathe("barrel", [{
			y: i / 2,
			r: a * .86
		}, {
			y: i / 2 - .04,
			r: a * .78
		}], {
			segments: 10,
			uRepeat: 3,
			vScale: 1,
			vOff: .9,
			capTop: "wood_planks",
			color: [
				.8,
				.8,
				.8
			]
		}), e.pop();
	};
	s && u(!1), c && u(!0);
}
function aa(e, t, n, r, i = {}) {
	let a = e.rng("barrel", t, r, i.seed), o = e.builder(na(.5)), s = i.height ?? 1, c = i.radius ?? .4;
	i.lying ? (o.push([
		0,
		c * .95,
		-s / 2
	], [
		Math.PI / 2,
		0,
		0
	]), ia(o, 0, 0, 0, {
		h: s,
		r: c,
		yaw: a.range(0, 6),
		bottom: !0
	}), o.pop()) : ia(o, 0, 0, 0, {
		h: s,
		r: c,
		yaw: a.range(0, 6)
	});
	let l = e.finish(o, "barrel", t, n, r, i.rotation ?? a.range(0, Math.PI * 2));
	return e.result(l, { colliders: [{
		type: "circle",
		x: t,
		z: r,
		r: c + .04
	}] });
}
function oa(e, t, n, r, i = {}) {
	let a = e.rng("crate", t, r, i.seed), o = i.size ?? .9, s = e.builder(na(.5));
	s.box("crate", [
		o,
		o,
		o
	], {
		at: [
			0,
			o / 2,
			0
		],
		uv: "fit",
		faces: { ny: !1 }
	});
	let c = i.rotation ?? a.range(-.3, .3), l = e.finish(s, "crate", t, n, r, c), u = o * .5 * (Math.abs(Math.cos(c)) + Math.abs(Math.sin(c)));
	return e.result(l, { colliders: [{
		type: "box",
		minX: t - u,
		maxX: t + u,
		minZ: r - u,
		maxZ: r + u
	}] });
}
function sa(e, t, n, r, i = {}) {
	let a = e.rng("crateStack", t, r, i.seed), o = e.builder(na(.6)), s = i.size ?? .85, c = i.count ?? a.int(2, 3), l = [];
	for (let e = 0; e < c; e++) {
		let t = (e - (c - 1) / 2) * (s + .04) + a.range(-.05, .05), n = a.range(-.08, .08), r = a.range(-.12, .12);
		l.push([t, n]), o.box("crate", [
			s,
			s,
			s
		], {
			at: [
				t,
				s / 2,
				n
			],
			rot: r,
			uv: "fit",
			faces: { ny: !1 }
		});
	}
	let u = c >= 3 ? a.int(1, 2) : 1;
	for (let e = 0; e < u; e++) {
		let t = u === 1 ? a.range(-.25, .25) : (e - .5) * (s + .02);
		o.box("crate", [
			s * .92,
			s * .92,
			s * .92
		], {
			at: [
				t,
				s + s * .92 / 2,
				a.range(-.06, .06)
			],
			rot: a.range(-.35, .35),
			uv: "fit",
			faces: { ny: !1 }
		});
	}
	let d = c / 2 * (s + .04) + .06, f = -d, p = d;
	if (i.barrel ?? a.chance(.6)) {
		let e = a.chance(.5) ? 1 : -1, t = e * (c / 2 * (s + .04) + .3);
		ia(o, t, 0, a.range(.1, .4), { yaw: a.range(0, 6) }), e > 0 ? p = t + .42 : f = t - .42;
	}
	let m = i.rotation ?? a.range(-.4, .4), h = e.finish(o, "crateStack", t, n, r, m);
	return e.result(h, { colliders: [e.boxCollider(h, f, p, -s * .6, s * .6)] });
}
function ca(e, t, n, r, i = {}) {
	let a = e.rng("signpost", t, r, i.seed), o = e.builder(na(.5)), s = 2.3;
	o.box(yi, [
		.16,
		s,
		.16
	], {
		at: [
			0,
			s / 2 - .05,
			0
		],
		rotUV: !0,
		faces: { ny: !1 }
	}), o.box(yi, [
		.24,
		.08,
		.24
	], { at: [
		0,
		2.28,
		0
	] }), o.box(yi, [
		.1,
		.1,
		.1
	], {
		at: [
			0,
			2.36,
			0
		],
		rot: [
			0,
			Math.PI / 4,
			0
		]
	});
	let c = i.boards ?? 2;
	for (let e = 0; e < c; e++) {
		let t = 1.8499999999999999 - e * .55, n = e % 2 == 0 ? 1 : -1, r = a.range(-.35, .35) + (e === 1 ? a.range(-.5, .5) : 0);
		o.push([
			0,
			t,
			0
		], r);
		let i = 1.15, s = .42, c = n * .595;
		o.box("sign_board", [
			i,
			s,
			.07
		], {
			at: [
				c,
				0,
				.09
			],
			faces: {
				pz: { off: [.8500000000000001 / 2, .5800000000000001 / 2 - .02] },
				nz: { off: [.8500000000000001 / 2, .5800000000000001 / 2 - .02] },
				py: yi,
				ny: yi,
				px: yi,
				nx: yi
			}
		});
		let l = c + n * i / 2, u = .09 - .035, d = .125, f = [
			l + n * .24,
			0,
			0
		], p = [
			l,
			s / 2,
			0
		], m = [
			l,
			-.42 / 2,
			0
		];
		n > 0 ? (o.tri("sign_board", [
			p[0],
			p[1],
			d
		], [
			m[0],
			m[1],
			d
		], [
			f[0],
			0,
			d
		], [.9, .7], [.9, .3], [1, .5]), o.tri("sign_board", [
			m[0],
			m[1],
			u
		], [
			p[0],
			p[1],
			u
		], [
			f[0],
			0,
			u
		], [.9, .3], [.9, .7], [1, .5])) : (o.tri("sign_board", [
			m[0],
			m[1],
			d
		], [
			p[0],
			p[1],
			d
		], [
			f[0],
			0,
			d
		], [.1, .3], [.1, .7], [0, .5]), o.tri("sign_board", [
			p[0],
			p[1],
			u
		], [
			m[0],
			m[1],
			u
		], [
			f[0],
			0,
			u
		], [.1, .7], [.1, .3], [0, .5]));
		let h = n > 0 ? [
			[
				p[0],
				p[1],
				d
			],
			[
				f[0],
				0,
				d
			],
			[
				f[0],
				0,
				u
			],
			[
				p[0],
				p[1],
				u
			]
		] : [
			[
				f[0],
				0,
				d
			],
			[
				p[0],
				p[1],
				d
			],
			[
				p[0],
				p[1],
				u
			],
			[
				f[0],
				0,
				u
			]
		], g = n > 0 ? [
			[
				f[0],
				0,
				d
			],
			[
				m[0],
				m[1],
				d
			],
			[
				m[0],
				m[1],
				u
			],
			[
				f[0],
				0,
				u
			]
		] : [
			[
				m[0],
				m[1],
				d
			],
			[
				f[0],
				0,
				d
			],
			[
				f[0],
				0,
				u
			],
			[
				m[0],
				m[1],
				u
			]
		];
		o.quad(yi, h, [
			[0, 0],
			[.3, 0],
			[.3, .1],
			[0, .1]
		]), o.quad(yi, g, [
			[0, 0],
			[.3, 0],
			[.3, .1],
			[0, .1]
		]), o.box("metal", [
			.05,
			.05,
			.06
		], { at: [
			n * .1,
			.1,
			.14
		] }), o.box("metal", [
			.05,
			.05,
			.06
		], { at: [
			n * .1,
			-.1,
			.14
		] }), o.pop();
	}
	for (let t = 0; t < 3; t++) {
		let t = a.range(0, Math.PI * 2);
		da(o, Math.cos(t) * .22, 0, Math.sin(t) * .22, [
			.2,
			.14,
			.18
		], a, {
			detail: 0,
			top: e.extra.material("boulder_moss"),
			side: e.extra.material("boulder")
		});
	}
	let l = e.finish(o, "signpost", t, n, r, i.rotation ?? 0);
	return e.result(l, {
		colliders: [{
			type: "circle",
			x: t,
			z: r,
			r: .22
		}],
		interact: {
			position: new H(t, n, r),
			radius: 1.2,
			id: i.id ?? "signpost"
		}
	});
}
var la = /* @__PURE__ */ new Map();
function ua(e) {
	let t = la.get(e);
	if (!t) {
		let n = new m(1, e);
		t = n.getAttribute("position").array.slice(), n.dispose(), la.set(e, t);
	}
	return t;
}
function da(e, t, n, r, i, a, { top: o = "moss_stone", side: s = "cliff", detail: c = 1, yaw: l = 0, sink: u = .22, flatTop: d = 0, tint: f = [
	1,
	1,
	1
], rough: p = .3 } = {}) {
	let m = ua(c), h = a.int(0, 1e6), g = (e, t, n) => {
		let r = Math.round(e * 1e3), i = Math.round(t * 1e3), a = Math.round(n * 1e3), o = ze(r * 7 + a, i * 13 - r, h);
		return 1 - p / 2 + o * p;
	}, _ = Math.cos(l), v = Math.sin(l), y = [];
	for (let e = 0; e < m.length; e += 3) {
		let a = m[e], o = m[e + 1], s = m[e + 2], c = g(a, o, s);
		a *= c * i[0], o *= c * i[1], s *= c * i[2], d && o > i[1] * (1 - d) && (o = i[1] * (1 - d) + (o - i[1] * (1 - d)) * .3), o = Math.max(o, -i[1] * u) + i[1] * u;
		let l = a * _ + s * v, f = -a * v + s * _;
		y.push([
			t + l,
			n + o,
			r + f
		]);
	}
	let b = new H(), x = new H(), S = new H();
	for (let t = 0; t < y.length; t += 3) {
		let r = y[t], a = y[t + 1], c = y[t + 2];
		if (b.fromArray(r), x.fromArray(a).sub(b), S.fromArray(c).sub(b), x.cross(S), x.lengthSq() < 1e-10) continue;
		x.normalize();
		let l = x.y > .62 ? o : s, u = e.mat(l), d = e.units(u), p;
		p = x.y > .62 || x.y < -.62 ? (e) => [e[0] / d[0], -e[2] / d[1]] : Math.abs(x.x) > Math.abs(x.z) ? (e) => [-Math.sign(x.x) * e[2] / d[0], e[1] / d[1]] : (e) => [Math.sign(x.z) * e[0] / d[0], e[1] / d[1]];
		let m = Math.min(r[1], a[1], c[1]) - n, h = (.9 + .25 * K(x.y, 0, 1)) * (.78 + .22 * K(m / Math.max(.01, i[1]), 0, 1)), g = x.y > .62 ? [
			h,
			h,
			h
		] : [
			h * f[0],
			h * f[1],
			h * f[2]
		];
		e.tri(u, r, a, c, p(r), p(a), p(c), {
			normal: [
				x.x,
				x.y,
				x.z
			],
			color: g
		});
	}
}
var fa = {
	sandstone: {
		top: "sandstone",
		side: "sandstone_cliff",
		rough: .26,
		flat: .28
	},
	redrock: {
		top: "redrock",
		side: "redrock_cliff",
		rough: .28,
		flat: .22
	},
	basalt: {
		top: "basalt",
		side: "basalt_cliff",
		rough: .36,
		flat: .1
	}
};
function pa(e, t, n, r, i = {}) {
	let a = e.rng("rock", t, r, i.seed), o = i.size ?? 1, s = e.builder(na(.4 * o, .7)), c = .7 * o * a.range(.85, 1.15), l = .62 * o * a.range(.85, 1.1), u = .62 * o * a.range(.85, 1.15), d = typeof i.stone == "string" && Object.hasOwn(fa, i.stone) ? fa[i.stone] : null, f = d ? {
		top: d.top,
		side: d.side,
		rough: d.rough
	} : {
		top: e.extra.material("boulder_moss"),
		side: e.extra.material("boulder")
	}, p = i.flat ? .3 : d ? d.flat : .12;
	da(s, 0, 0, 0, [
		c,
		l,
		u
	], a, {
		...f,
		detail: +(o > .55),
		flatTop: p
	});
	let m = o >= 1 ? [
		c * .75,
		u * .55,
		Math.max(c, u) * .45
	] : null;
	if (m && da(s, m[0], 0, m[1], [
		c * .5,
		l * .55,
		u * .5
	], a, {
		...f,
		detail: 1,
		yaw: a.range(0, 6)
	}), o >= .8) for (let e = 0; e < 2; e++) {
		let e = a.range(0, Math.PI * 2);
		da(s, Math.cos(e) * (c + .2), 0, Math.sin(e) * (u + .2), [
			.18 * o,
			.12 * o,
			.16 * o
		], a, {
			...f,
			detail: 0
		});
	}
	let h = e.finish(s, "rock", t, n, r, i.rotation ?? a.range(0, Math.PI * 2)), g = [{
		type: "circle",
		x: t,
		z: r,
		r: Math.max(c, u) * .95
	}];
	if (m) {
		let t = e.world(h, new H(m[0], 0, m[1]));
		g.push({
			type: "circle",
			x: t.x,
			z: t.z,
			r: m[2]
		});
	}
	return e.result(h, { colliders: g });
}
function ma(e, t, n, r, i = {}) {
	let a = e.rng("bench", t, r, i.seed), o = e.builder(na(.4)), s = i.length ?? 1.8;
	for (let e of [-1, 1]) o.box("stone_brick", [
		.2,
		.42,
		.44
	], {
		at: [
			e * (s / 2 - .25),
			.21,
			0
		],
		faces: { ny: !1 },
		off: [a.range(0, 2), .3]
	});
	if (o.box("wood_planks", [
		s,
		.1,
		.24
	], {
		at: [
			0,
			.47,
			.1
		],
		faces: { ny: yi }
	}), o.box("wood_planks", [
		s,
		.1,
		.24
	], {
		at: [
			0,
			.47,
			-.15
		],
		faces: { ny: yi },
		off: [.6, .4]
	}), i.back !== !1) {
		for (let e of [-1, 1]) o.box(yi, [
			.1,
			.7,
			.1
		], {
			at: [
				e * (s / 2 - .25),
				.8,
				-.26
			],
			rot: [
				-.12,
				0,
				0
			],
			rotUV: !0
		});
		o.box("wood_planks", [
			s - .1,
			.22,
			.07
		], {
			at: [
				0,
				1,
				-.3
			],
			rot: [
				-.12,
				0,
				0
			],
			off: [.3, .2]
		});
	}
	let c = i.rotation ?? 0, l = e.finish(o, "bench", t, n, r, c);
	return e.result(l, {
		colliders: [e.boxCollider(l, -s / 2, s / 2, -.35, .25)],
		interact: {
			position: e.world(l, new H(0, 0, .6)),
			radius: .9,
			id: i.id ?? "bench"
		}
	});
}
function ha(e, t, n, r, i = {}) {
	let a = e.rng("haystack", t, r, i.seed), o = i.size ?? 1, s = e.builder(na(.7 * o, .6)), c = 1 * o, l = 1.9 * o, u = Array.from({ length: 12 }, () => a.range(.9, 1.08));
	s.lathe("hay", [
		{
			y: -.05,
			r: c * 1.08
		},
		{
			y: l * .18,
			r: c * 1.02
		},
		{
			y: l * .45,
			r: c * .9
		},
		{
			y: l * .7,
			r: c * .64
		},
		{
			y: l * .9,
			r: c * .3
		},
		{
			y: l,
			r: .05
		}
	], {
		segments: 12,
		phase: a.range(0, 1),
		smooth: !0,
		normalUp: .15,
		radiusFn: (e, t) => e === 0 ? u[t] * 1.04 : e < 5 ? 1 + (u[(t + e) % 12] - 1) * .6 : 1,
		colorFn: (e) => {
			let t = [
				.8,
				.9,
				1,
				1.05,
				1.08,
				1.1
			][e];
			return [
				t,
				t,
				t
			];
		}
	}), s.box(yi, [
		.09,
		.9 * o,
		.09
	], {
		at: [
			.03,
			l + .3 * o,
			.02
		],
		rot: [
			.08,
			0,
			.05
		],
		rotUV: !0
	});
	for (let e = 0; e < 4; e++) {
		let e = a.range(0, Math.PI * 2), t = c * a.range(1.05, 1.25);
		s.lathe("hay", [{
			y: -.02,
			r: .28 * o
		}, {
			y: .14 * o,
			r: .02
		}], {
			segments: 6,
			at: [
				Math.cos(e) * t,
				0,
				Math.sin(e) * t
			],
			smooth: !0,
			normalUp: .5
		});
	}
	let d = e.finish(s, "haystack", t, n, r, i.rotation ?? a.range(0, Math.PI * 2));
	return e.result(d, { colliders: [{
		type: "circle",
		x: t,
		z: r,
		r: c * 1.05
	}] });
}
function ga(e, t, n, r, i = {}) {
	let a = e.rng("flowerbox", t, r, i.seed), o = e.builder(i.wall ? null : na(.4)), s = i.length ?? 1.2, c = .34, l = i.wall ? 0 : .22;
	if (!i.wall) for (let e of [-1, 1]) for (let t of [-1, 1]) o.box(yi, [
		.07,
		l + .05,
		.07
	], {
		at: [
			e * (s / 2 - .06),
			(l + .05) / 2,
			t * (c / 2 - .05)
		],
		rotUV: !0
	});
	Ci(o, 0, l, c / 2, s, c, a.range(0, 1));
	let u = e.finish(o, "flowerbox", t, n, r, i.rotation ?? 0);
	return e.result(u, { colliders: i.wall ? [] : [e.boxCollider(u, -s / 2, s / 2, -.34 / 2, c / 2)] });
}
//#endregion
export { wi as A, vi as B, Ji as C, zi as D, Ii as E, xi as F, Z as G, si as H, Ci as I, ai as K, Si as L, Ei as M, yi as N, Ri as O, bi as P, di as R, Yi as S, Fi as T, X as U, _i as V, Ke as W, $i as _, oa as a, Gi as b, ga as c, ca as d, da as f, Qi as g, ta as h, ma as i, Ti as j, Oi as k, ha as l, ea as m, ia as n, sa as o, Xi as p, aa as r, ra as s, fa as t, pa as u, Bi as v, Li as w, Ki as x, qi as y, mi as z };
